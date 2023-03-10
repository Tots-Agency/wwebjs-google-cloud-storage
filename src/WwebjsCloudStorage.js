const fs = require('fs');
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

class WwebjsCloudStorage {

    storageKey = '';
    bucketName = '';
    clientId = '';
    storage;

    constructor(clientId, keyFile, bucketName) {
        this.clientId = clientId;
        this.storageKey = keyFile;
        this.bucketName = bucketName;
        this.storage = new Storage({keyFilename: this.storageKey});
    }

    async sessionExists(options) {
        return await this.internalExistFile(options);
    }

    async save(options) {
        await this.#deletePrevious(options);

        await new Promise((resolve, reject) => {
            fs.createReadStream(`${options.session}.zip`)
                .pipe(this.storage.bucket(this.bucketName).file(`${options.session}.zip`).createWriteStream())
                .on('error', err => reject(err))
                .on('close', () => resolve());
        });
    }

    async extract(options) {
        return new Promise((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${options.session}.zip`).createReadStream()
                .pipe(fs.createWriteStream(options.path))
                .on('error', err => reject(err))
                .on('close', () => resolve());
        });
    }

    async delete(options) {
        if(await this.internalExistFile(options)){
            await this.storage.bucket(this.bucketName).file(`${options.session}.zip`).delete();
        } 
    }

    async #deletePrevious(options) {
        if(await this.internalExistFile(options)){
            await this.storage.bucket(this.bucketName).file(`${options.session}.zip`).delete();
        }
    }

    async internalExistFile(options) {
        try {
            let response = await this.storage.bucket(this.bucketName).file(`${options.session}.zip`).get();
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = WwebjsCloudStorage;