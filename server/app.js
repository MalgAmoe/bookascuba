'use strict'

const hostname = 'localhost';
const port = 3001;

const app = require('koa')();
const fs = require('fs');
const serve = require('koa-static');
const passport = require('koa-passport');
const bcrypt = require('bcrypt')
const cors = require('koa-cors');
const convert = require('koa-convert')
const session = require('koa-session')
app.keys = ['secret']
// app.use(session(app))

const db = require('./config/db.js');
const router = require('./router.js');
const User = require('./models/user.js')
const facebook = require('./private')

app.use(serve('../client'))
app.use(cors());


// body parser
const bodyParser = require('koa-body');
app.use(bodyParser())

// Sessions
// var session = require('koa-session')

app.use(passport.initialize())
app.use(passport.session())

const FacebookStrategy = require('passport-facebook')
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

router.get('/auth/facebook',
  passport.authenticate('facebook'))

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/events',
    failureRedirect: '/about'
  }))

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function *(id, done) {
  try {
    const user = yield User.findOne({
      where: {id: id}
    })
    done(null, user)
  } catch (err) {
    console.log('deserialize error:', err);
    done(err)
  }
})

passport.use(new FacebookStrategy({
  clientID: facebook.APP_ID,
  clientSecret: facebook.APP_SECRET,
  callbackURL: facebook.CALLBACK_URL
},
function(token, refreshToken, profile, cb) {
  // console.log('in the strategy', profile);
  User.findOne({
    where: { facebookId: profile.id }
  })
    .then(function(user) {
      if (user) {
        console.log('Existing user: ', user);
        return cb(null, user)
      } else {
        User.create({
          username: profile.displayName,
          facebookId: profile.id,
          auth: 0
        }).then(function(user) {
          console.log('Created user: ', user);
          return cb(null, user)
        })
      }
    })
}))

passport.use(new BasicStrategy(
  function(username, password, done) {
    // console.log('username: ', username);
    // console.log('User: ', User);
    var user
    User.findOne({ where: {username} })
      .then(function (result) {
        if(!result) return done(null, false);
        user = result.dataValues
        return bcrypt.compare(password, user.password)
      })
      .then(function (res) {
        if (res) {
          done(null, user)
        } else {
          done(null, false)
        }
      });
  }
));

passport.use(new BearerStrategy(
  function(token, done) {
    User.findOne({ where: {token} })
      .then(function (result) {
        if(!result) return done(null, false);
        return done(null, result.dataValues)
      })
  })
);

app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  }
});

app.use(router.routes())

app.use(function* (next) {
   if (this.status === 404) this.body = 'ooopsss';
 });

app.listen(port, hostname, () => {
  console.log(`Server BAS running at http://${hostname}:${port}/`);
});
