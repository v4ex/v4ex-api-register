/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose: Command Line Interface entry.


const { program } = require('commander')
require('./cli/register')({})


program.parse()
