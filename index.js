#!/usr/bin/env node

const program = require('commander');
const { Environment } = require('storj');
const fs = require('fs');

const defaultEncryptKey = 'water prosper person property hill another unhappy lava earth mail assault shell effort need loan write weather giraffe century destroy park tower negative armed';
var storj;

program.option('-u, --username <username>', 'The user to authenticate as')
program.option('-p, --password <password>', 'The user\'s password');
program.option('-e, --encrypt <encryptionKey>', 'Sets encryption key');

/*************************************************************/

function getBucketId(dir, mnemonic, callback) {
  var bucketId;

  storj.getBuckets(function(err, result) {
    if (err) {
      return callback(err);
    }
    else {
      for (var i = 0; i < result.length; i++) {
        if (result[i].name === dir) {
          return callback(null, result[i].id);
        }
      }
      return callback(new Error('Bucket doesn\'t exist'));
      //create bucket with name === dir
    }
  });
}

/**********************************************************/

function sync_dir(dir) {
  var encryptionKey = (program.encryptionKey ? program.encryptionKey : defaultEncryptKey);
  console.log('syncing directory:' + dir);
  storj = new Environment({
    bridgeUrl: 'https://api.storj.io',
    bridgeUser: program.username,
    bridgePass: program.password,
    encryptionKey: encryptionKey,
    logLevel: 0
  });
  getBucketId(dir, encryptionKey, function(err, bucketId) {
    if (err) {
      return console.error(err.message);
    }
    fs.readdir(dir, function(err, files) {
      if (err) {
        return console.error(err);
      }
      files.forEach(function(file) {
        storj.storeFile(bucketId, (dir + '/' + file), {
          filename: file,
          progressCallback: function(progress, downloadedBytes, totalBytes) {
            console.log('progress:', progress);
          },
          finishedCallback: function(err, fileId) {
            if (err) {
              return console.error(err);
            }
            console.log('File complete:', fileId);
          }
        });
      });
    });
  });
}

/************************************************************/

program
  .command('sync <dir>')
  .description('Sync\'s a dir with the network')
  .action(sync_dir);

program.parse(process.argv);
