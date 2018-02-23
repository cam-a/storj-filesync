#!/usr/bin/env node

const program = require('commander');
const utils = require('./utils');

program
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')
  .option('-e, --encrypt <encryptionKey>', 'Sets encryption key')
  .command('sync <dir>')
  .description('Sync\'s a dir with the network')
  .action(utils.sync_dir);

program.parse(process.argv);
