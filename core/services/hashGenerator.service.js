const crypto = require('crypto');


class HashGeneratorService {
    constructor() {
        this.SECRET = 'password';
        this.ALGORITHM = 'sha256';
        this.ENCODING = 'base64';
    }

    generateRandomString() {
        return Math.random().toString(36);
    }

    generate() {
        return crypto.createHmac(this.ALGORITHM, this.SECRET).update(this.generateRandomString()).digest(this.ENCODING);
    }
}


module.exports = HashGeneratorService;
