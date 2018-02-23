#!/usr/bin/env node

const program = require('commander');
const { Environment } = require('storj');
const fs = require('fs');
const path = require('path');

const defaultEncryptKey = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon';
var storj;

program.option('-u, --username <username>', 'The user to authenticate as')
program.option('-p, --password <password>', 'The user\'s password');
program.option('-e, --encrypt <encryptionKey>', 'Sets encryption key');

/*************************************************************/

function getBucketId(dir, callback) {
  storj.getBucketId(dir, function(err, result) {
    if (err) {
      console.log(err);
      return storj.createBucket(dir, function(err, result) {
        if (err) {
          return callback(err);
        }
        console.log('Bucket created: ', result.name);
        return callback(null, result.id);
      });
    }
    console.log('Bucket found: ', result.name);
    return callback(null, result.id);
  });
}

/**********************************************************/

function sync_dir(dir) {
  var encryptionKey = (program.encryptionKey ? program.encryptionKey : defaultEncryptKey);
  console.log('syncing directory: ' + dir);
  storj = new Environment({
    bridgeUrl: 'https://api.storj.io',
    bridgeUser: program.username,
    bridgePass: program.password,
    encryptionKey: encryptionKey,
    logLevel: 0
  });
  getBucketId(dir, function(err, bucketId) {
    if (err) {
      return console.error(err.message);
    }
    fs.readdir(dir, function(err, files) {
      if (err) {
        return console.error(err);
      }
      files.forEach(function(file) {
        storj.storeFile(bucketId, (dir + path.sep + file), {
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
