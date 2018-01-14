#!/usr/bin/env node
const program = require('commander');

program.option('-u, --username <username>', 'The user to authenticate as');
program.option('-p, --password <password>', 'The user\'s password');

function print_shit(dir) {
  console.log('user: %s pass: %s folder: %s', program.username, program.password, dir);
}

program
  .command('sync <dir>')
  .description('Sync\'s a dir with the network')
  .action(print_shit);

program.parse(process.argv);
