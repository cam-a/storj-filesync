# storj-filesync

Sync a local directory to a Storj bucket of the same name

If this bucket does not exist, it will be created

How to run:
```
./index.js -u <username> -p <password> -e <encryptionKey> sync <directory>
```

A default encryption key will be used if encryptionKey option is not entered
