/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

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
    Registry.findOneAndUpdate({
      identity
    }, {
      password
    }, {
      new: true
    }, (err, registry) => {
      if (err) {
        console.error(err)
        callback(err)
      } else {
        callback(null, registry)
      }
    })
  }

  return {
    replacePassword
  }
}
