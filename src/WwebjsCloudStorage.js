const fs = require('fs');
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

class WwebjsCloudStorage {

    storageKey = '';
    bucketName = '';
    clientId = '';
    storage;
    onSaved;
    isDebug = false;

    constructor(clientId, keyFile, bucketName, saved = undefined, isDebug = false) {
        this.clientId = clientId;
        this.storageKey = keyFile;
        this.bucketName = bucketName;
        this.storage = new Storage({keyFilename: this.storageKey});
        this.onSaved = saved;
        this.isDebug = isDebug;
        this.printConsole('wwebjs-google-cloud-storage Init');
    }

    async sessionExists(options) {
        this.printConsole(options.session + ' wwebjs-google-cloud-storage Session exists');
        return await this.internalExistFile(options);
    }

    async save(options) {
        await this.#deletePrevious(options);

        this.printConsole(options.session + ' wwebjs-google-cloud-storage Session save');
        await new Promise((resolve, reject) => {
            fs.createReadStream(`${options.session}.zip`)
                .pipe(this.storage.bucket(this.bucketName).file(`${options.session}.zip`).createWriteStream())
                .on('error', err => {
                    this.printConsole(options.session + ' wwebjs-google-cloud-storage Session save err');
                    this.printConsole(err);
                    return reject(err);
                })
                .on('close', () => {
                    if(this.onSaved !== undefined){
                        this.onSaved(options);
                    }
                    this.printConsole(options.session + ' wwebjs-google-cloud-storage Session save close');
                    return resolve();
                });
        });
    }

    async extract(options) {
        this.printConsole(options.session + ' wwebjs-google-cloud-storage Session extract');

        return new Promise((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${options.session}.zip`).createReadStream()
                .pipe(fs.createWriteStream(options.path))
                .on('error', err => {
                    this.printConsole(options.session + ' wwebjs-google-cloud-storage Session err');
                    this.printConsole(err);
                    return reject(err);
                })
                .on('close', () => resolve());
        });
    }

    async delete(options) {
        this.printConsole(options.session + ' wwebjs-google-cloud-storage Session delete');
        if(await this.internalExistFile(options)){
            await this.storage.bucket(this.bucketName).file(`${options.session}.zip`).delete();
        } 
    }

    async #deletePrevious(options) {
        this.printConsole(options.session + ' wwebjs-google-cloud-storage Session delete previous');
        if(await this.internalExistFile(options)){
            await this.storage.bucket(this.bucketName).file(`${options.session}.zip`).delete();
        }
    }

    async internalExistFile(options) {
        this.printConsole(options.session + ' wwebjs-google-cloud-storage Session internal exists');
        try {
            let response = await this.storage.bucket(this.bucketName).file(`${options.session}.zip`).get();
            return true;
        } catch (error) {
            return false;
        }
    }

    printConsole(text) {
        if(!this.isDebug){
            return;
        }

        console.log(text);
    }
}

module.exports = WwebjsCloudStorage;