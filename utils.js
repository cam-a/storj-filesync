const program = require('commander');
const { Environment } = require('storj');
const fs = require('fs');
const path = require('path');
const defaultEncryptKey = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

var storj;

// returns bucket ID from storj
// creates bucket if not found

var getBucketId = function(dir, callback) {
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

// begins file sync from directory

var sync_dir = function(dir) {
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

/********************************/

module.exports = {
  sync_dir
};
