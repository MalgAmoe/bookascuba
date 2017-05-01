const passport = require('koa-passport')
const bcrypt = require('bcrypt')

const User = require('../models/user.js')
const facebook = require('../private')

const FacebookStrategy = require('passport-facebook')
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

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


module.exports = passport
