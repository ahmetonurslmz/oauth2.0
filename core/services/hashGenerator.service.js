const crypto = require('crypto');

class HashGeneratorService {
    get secret() {
        return 'password';
    }

    get algorithm() {
        return 'sha256';
    }

    get encodingType() {
        return 'hex';
    }

    generateRandomString() {
        return Math.random().toString(36);
    }

    generate() {
        return crypto.createHmac(this.algorithm, this.secret).update(this.generateRandomString()).digest(this.encodingType);
    }
}


module.exports = HashGeneratorService;
