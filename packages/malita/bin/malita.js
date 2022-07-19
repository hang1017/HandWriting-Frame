#!/usr/bin/env node

const { program } = require('commander');


program.command('help').alias('-h').description('cli 介绍').action((name, other) => {
    console.log('cli help');
})

program.version(require('../package.json').version, '-v, -V');


program.parse();