const router = require('koa-router')();
const passport = require('koa-passport');
const controller = require('./controllers/auth.controller.js')
const eventsController = require('./controllers/eventsController.js')
const apptController = require('./controllers/apptController.js')



const authenticate = (strategy) => function *(next) {
  const cb = function * (err, user, info, status) {
    delete user.password
    this.user = user
  }

  yield passport.authenticate(strategy, { session: false }, cb.bind(this)).call(this, next)
  yield next
}

router
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
    passport.authenticate('facebook'))
  .get('/auth/facebook/callback',
    passport.authenticate('facebook', {

      failureRedirect: '/about'
    }),
    function* () {
      var res = {
        id: this.req.user.id,
        username: this.req.user.username,
        type: this.req.user.type
      }
      this.header.data = res
      console.log(this.header);
      // this.body = res
      this.redirect('http://localhost:3000/events')

      this.status = 200;
    })

module.exports = router;
