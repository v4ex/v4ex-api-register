/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose: 
//  - Provide register() to add new Registry to database.


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
  const register = (Registry, identity, password, callback) => {
    Registry.create({
      identity,
      password
    }, (err, registry) => {
      if (err) {
        console.error(err)
      } else {
        callback(null, registry)
      }
    })
  }

  return {
    register
  }
}
