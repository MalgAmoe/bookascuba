var eventsController = {}

var Event = require('../models/Event.js')

eventsController.getEvents = function * (req, res, next) {
  console.log('--------------------this: ', this, '-----------------------', this.req, this.res);
  this.body = yield Event.findAll()
}

eventsController.postEvent = function * (next) {
  var eventData = this.request.body
  console.log('Date.parse: ', Date.parse(eventData.date));
  this.body = yield Event.create({
    title: eventData.title,
    details: eventData.details,
    date: Date.parse(eventData.date),
    time: eventData.time,
    image: eventData.image
  })
  this.status = 201
}

eventsController.dropDb = function * (next) {
  this.body = yield Event.destroy({where:{}});
  this.status = 200
}

eventsController.deleteEvent = function * (next) {
  var eventData = this.request.body;
  console.log(eventData);
  this.body = yield Event.destroy({
    where:{
      id: this.params.id
    }
  });
  this.status = 200
}

eventsController.updateEvent = function * (next) {
  var eventData = this.request.body;
  this.body = yield Event.update(
    {
      title: eventData.title,
      details: eventData.details,
      date: eventData.date,
      time: eventData.time,
      image: eventData.image
    },
    {
      id: eventData.id
    }
  ).then(function(){
    console.log('Update Success');
  }).catch(function(e) {
    console.log('Update Failure');
  })
}

module.exports = eventsController;
