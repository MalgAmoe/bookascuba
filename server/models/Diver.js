"use strict";

const Sequelize = require('sequelize')
const sequelize = require('../config/db.js')
const user = require('./User')
const event = require('./Event')

var DivingCenter = sequelize.define('divingCenter', {
  equipment: {
    type: Sequelize.BOOLEAN
  },
  level: {
    type: Sequelize.STRING
  }
})

DivingCenter.belongsTo(user)
DivingCenter.hasMany(event)

module.exports = DivingCenter
