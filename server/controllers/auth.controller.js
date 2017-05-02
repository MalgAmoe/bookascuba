const bcrypt = require('bcrypt')
var Event = require('../models/Event.js')

const authController = {}

authController.signIn = function *(next) {
  console.log('in authController, user: ', this.user);
  if(!this.user) this.status = 401
  this.body = yield this.user
}

authController.signInFB = function * (next) {
  console.log('--------------------next: ', next, '-----------------------');
  this.body = yield Event.findAll()
}
module.exports = authController;
