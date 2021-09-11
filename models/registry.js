/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose: Provide Registry, RegistrySchema instances.


/**
 * @param {*} mongoose (optional)
 * @param {*} modelName (optional)
 * @param {*} env (optional)
 * @param {*} IdentitySettings (optional)
 * @param {*} PasswordSettings (optional)
 */
 module.exports = ({ mongoose, modelName, env }, IdentitySettings, PasswordSettings) => {
  const { Identity } = require('v4ex-api-identity/models/all-identity')(IdentitySettings || {})
  const { Password } = require('v4ex-api-password/models/password')(PasswordSettings || {})

  mongoose = mongoose || require('../mongoose')({ env })
  modelName = modelName || 'Registry'

  let Registry, RegistrySchema

  if (mongoose.modelNames().includes(modelName)) {
    Registry = mongoose.model(modelName)
    RegistrySchema = Registry.schema
  } else {
    const Schema = mongoose.Schema
    RegistrySchema = new Schema({
      identity: { type: mongoose.ObjectId, ref: Identity, unique: true, immutable: true },
      password: {
        type: mongoose.ObjectId,
        ref: Password,
        // #1 Log previous password
        set: function(password) {
          this._previousPassword = this.password;
          return password
        }
      }
    })
    // #2 Handle password replacement
    RegistrySchema.pre('save', function(next) {
      if (this.isModified('password')) {
        this.increment()
      }
      next()
    })
    RegistrySchema.post('save', function(registry) {
      if (this._previousPassword) {
        Password.findByIdAndDelete(this._previousPassword, (err, deletedPassword) => {
          if (err) {
            console.error(err)
          }
        })
      }
    })
    Registry = mongoose.model(modelName, RegistrySchema)
  }


  return {
    Registry,
    RegistrySchema
  }
}
