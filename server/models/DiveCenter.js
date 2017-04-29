"use strict";

const Sequelize = require('sequelize')
const sequelize = require('../config/db.js')

var DiveCenter = sequelize.define('diveCenter', {
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  location: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  }
})

module.exports = DiveCenter
