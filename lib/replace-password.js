/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

const registry = require('../models/registry')

// Purpose: 
//  - Provide replacePassword() to update Registry in database.


/**
 * @param {*} env (optional)
 */
 module.exports = ({ env }) => {
  if (env === undefined) {
    require('dotenv').config()
    env = process.env
  }

  /**
   * @param {mongoose.Model()} Registry
   * @param {mongoose.Document()} identity 
   * @param {mongoose.Document()} password 
   * @param {function} callback 
   */
  const replacePassword = (Registry, identity, password, callback) => {
    Registry.findOne({
      identity
    }, (err, registry) => {
      if (err) {
        console.error(err)
        callback(err)
      } else {
        // SEE '../models/registry.js #1, #2'
        registry.set('password', password)
        // Run callback after post('save')
        registry.save()
                .then(updatedRegistry => {
                  callback(null, updatedRegistry)
                })
                .catch(err => {
                  console.error(err)
                  callback(err)
                })
      }
    })
  }

  return {
    replacePassword
  }
}
