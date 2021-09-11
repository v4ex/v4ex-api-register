/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose: Provide CLI command register.


module.exports = ({ Registry, mongoose, modelName, env, IdentitySettings, PasswordSettings }) => {
  Registry = Registry || require('../models/registry')({ mongoose, modelName, env }).Registry
  const { register } = require('../lib/register')({ env })
  const { replacePassword } = require('../lib/replace-password')({ env })

  const { Identity } = require('v4ex-api-identity/models/all-identity')(IdentitySettings || {})
  const { Password } = require('v4ex-api-password/models/password')(PasswordSettings || {})
  const { bcryptPassword } = require('v4ex-api-password/lib/bcrypt-password')({ env })

  const { program } = require('commander')

  const done = () => {
    Registry.base.connection.close()
  }

  const handleError = (err) => {
    console.error(err)
    done()
  }

  program.command('register')
         .description('add new Registry to database')
         .argument('<password>', 'plain password text')
         .option('--username <username>', 'username for identity')
         .option('--email <email>', 'email for identity')
         .option('--replace', 'indicate to replace existent')
         .action(function(plainTextPassword, options) {
           if (options.username && !options.email) {
             // TODO Transaction
             Identity.findOneAndUpdate({
               username: options.username
             }, { username: options.username }, {
               upsert: true,
               new: true
             }, (err, identity) => {
               if (err) {
                 handleError(err)
               } else {
                 bcryptPassword(Password, plainTextPassword, (err, password) => {
                    if (err) {
                      handleError(err)
                    } else {
                      if (options.replace) {
                        // TODO Throw error if identity is new
                        replacePassword(Registry, identity, password, (err, registry) => {
                          if (err) {
                            handleError(err)
                          } else {
                            console.log(registry)
                            done()
                          }
                        })
                      } else {
                        register(Registry, identity, password, (err, registry) => {
                          if (err) {
                            handleError(err)
                          } else {
                            console.log(registry)
                            done()
                          }
                        })
                      }
                    }
                 })
               }
             })
           } else if (options.email && ! options.username) {
            Identity.findOneAndUpdate({
              email: options.email
            }, { email: options.email }, {
              upsert: true,
              new: true
            }, (err, identity) => {
              if (err) {
                handleError(err)
              } else {
                bcryptPassword(Password, plainTextPassword, (err, password) => {
                   if (err) {
                     handleError(err)
                   } else {
                    if (options.replace) {
                      replacePassword(Registry, identity, password, (err, registry) => {
                        if (err) {
                          handleError(err)
                        } else {
                          console.log(registry)
                          done()
                        }
                      })
                    } else {
                      register(Registry, identity, password, (err, registry) => {
                        if (err) {
                          handleError(err)
                        } else {
                          console.log(registry)
                          done()
                        }
                      })
                    }
                   }
                })
              }
            })
           } else {
             console.log('Nothing changed.')
           }
         })

}
