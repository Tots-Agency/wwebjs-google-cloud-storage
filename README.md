# wwebjs-google-cloud-storage
A Google Cloud Storage plugin for whatsapp-web.js! 

Use WwebjsCloudStorage to save your WhatsApp MultiDevice session on a Google Cloud Storage.

## Quick Links

* [Guide / Getting Started](https://wwebjs.dev/guide/authentication.html) _(work in progress)_
* [GitHub](https://github.com/Tots-Agency/wwebjs-google-cloud-storage)
* [npm](https://www.npmjs.com/package/wwebjs-google-cloud-storage)

## Installation

The module is now available on npm! `npm i wwebjs-google-cloud-storage`


## Example usage

```js
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { WwebjsCloudStorage } = require('wwebjs-google-cloud-storage');

const store = new WwebjsCloudStorage('./key.json', 'bucket-name');
const client = new Client({
    authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000
    })
});

client.initialize();
```

## Delete Remote Session

How to force delete a specific remote session on the Database:

```js
await store.delete({session: 'yourSessionName'});
```