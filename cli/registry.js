/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose: Provide CLI command password to control Registry in database.


/**
 * @param {*} Registry (optional)
 * @param {*} mongoose (optional)
 * @param {*} modelName (optional)
 * @param {*} env (optional)
 */
 module.exports = ({ Registry, mongoose, modelName, env }) => {
  Registry = Registry || require('../models/registry')({ mongoose, modelName, env }).Registry

  const { program } = require('commander')

  const done = () => {
    Registry.base.connection.close()
  }

  program.command('registry')
         .description('control Registry model in database')
         .option('--drop', 'Drop Registry model collection in database')
         .action((options) => {
           if (options.drop) {
             Registry.collection.drop(done)
           }
         })

}
