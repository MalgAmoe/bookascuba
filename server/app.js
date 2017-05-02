'use strict'

const hostname = 'localhost';
const port = 3001;

const app = require('koa')();
const fs = require('fs');
const serve = require('koa-static');
const cors = require('koa-cors');
const session = require('koa-session')
app.keys = ['secret']


const passport = require('./config/passport');
const db = require('./config/db.js');
const router = require('./router.js');
const User = require('./models/user.js')
const facebook = require('./private')

app.use(serve('../client'))
app.use(cors());


// body parser
const bodyParser = require('koa-body');
app.use(bodyParser())
app.use(passport.initialize())
app.use(passport.session())

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
   if (this.status === 404) this.body = 'Message from the server: Not found. - app.js 46';
 });

app.listen(port, hostname, () => {
  console.log(`Server BAS running at http://${hostname}:${port}/`);
});
