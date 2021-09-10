/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

const registry = require('../models/registry')

// Purpose: Provide CLI command register.


module.exports = ({ Registry, mongoose, modelName, env, IdentitySettings, PasswordSettings }) => {
  Registry = Registry || require('../models/registry')({ mongoose, modelName, env }).Registry
  const { register } = require('../lib/register')({ env })

  const { Identity } = require('v4ex-api-identity/models/all-identity')(IdentitySettings || {})
  const { acknowledge, acknowledgeByUsername, acknowledgeByEmail, acknowledgeByUsernameAndEmail } = require('v4ex-api-identity/lib/acknowledge')({ env })
  const { Password } = require('v4ex-api-password/models/password')(PasswordSettings || {})
  const { bcryptPassword } = require('v4ex-api-password/lib/bcrypt-password')({ env })

  const { program } = require('commander')

  const done = () => {
    Registry.base.connection.close()
  }

  program.command('register')
         .description('add new Registry to database')
         .argument('<password>', 'plain password text')
         .option('--username <username>', 'username for identity')
         .option('--email <email>', 'email for identity')
         .action((plainTextPassword, options) => {
           
           if (options.username && !options.email) {
             Identity.findOneAndUpdate({
               username: options.username
             }, { username: options.username }, {
               upsert: true,
               new: true
             }, (err, identity) => {
               if (err) {
                 console.error(err)
               } else {
                 bcryptPassword(Password, plainTextPassword, (err, password) => {
                    if (err) {
                      console.error(err)
                    } else {
                      register(Registry, identity, password, (err, registry) => {
                        if (err) {
                          console.error(err)
                        } else {
                          console.log(registry)
                          done()
                        }
                      })
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
                console.error(err)
              } else {
                bcryptPassword(Password, plainTextPassword, (err, password) => {
                   if (err) {
                     console.error(err)
                   } else {
                     register(Registry, identity, password, (err, registry) => {
                       if (err) {
                         console.error(err)
                       } else {
                         console.log(registry)
                         done()
                       }
                     })
                   }
                })
              }
            })
           } else {
             console.log('Nothing changed.')
           }
         })

}
