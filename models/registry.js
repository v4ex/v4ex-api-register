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

  if (mongoose === undefined) mongoose = require('../mongoose')({ env })
  if (modelName === undefined) modelName = 'Registry'

  let Registry, RegistrySchema

  if (mongoose.modelNames().includes(modelName)) {
    Registry = mongoose.model(modelName)
    RegistrySchema = Registry.schema
  } else {
    const Schema = mongoose.Schema
    RegistrySchema = new Schema({
      identity: { type: mongoose.ObjectId, ref: Identity, unique: true },
      password: { type: mongoose.ObjectId, ref: Password }
    })
    Registry = mongoose.model(modelName, RegistrySchema)
  }


  return {
    Registry,
    RegistrySchema
  }
}
