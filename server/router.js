const router = require('koa-router')();
const passport = require('koa-passport');
const controller = require('./controllers/auth.controller.js')
const eventsController = require('./controllers/eventsController.js')
const apptController = require('./controllers/apptController.js')



const authenticate = (strategy) => function *(next) {
  const cb = function * (err, user, info, status) {
    delete user.password
    console.log('user in authenticate: ', user);
    this.user = user
  }

  yield passport.authenticate(strategy, { session: true }, cb.bind(this)).call(this, next)
  yield next
}

router
  // .get('/loginFB', controller.signInFB)
  .post('/login', authenticate('basic'), controller.signIn)
  .post('/user', authenticate('bearer'), controller.signIn)
  .get('/events', eventsController.getEvents)
  .post('/events', eventsController.postEvent)
  .delete('/deleteAll', eventsController.dropDb)
  .delete('/events/:id', eventsController.deleteEvent)
  .put('/events', eventsController.updateEvent)
  .get('/appointments', apptController.getAppts)
  .post('/appointments', apptController.postAppt)
  .delete('/appointments/:id', apptController.deleteAppt)
  .delete('/appointments/deleteAll', apptController.dropDb)
  .get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email']}))
  .get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/loginFB',
      failureRedirect: '/loginFB',
      session: true
    }))

module.exports = router;
