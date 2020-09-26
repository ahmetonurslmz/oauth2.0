const fs = require('fs');
const path = require('path');
const base64 = require('base64url');
const crypto = require('crypto');

class JwtVerificationService {
    constructor(accessToken) {
        this.fetchPublicKey();
        this.parseAccessToken(accessToken);
    }

    fetchPublicKey() {
        this.PUB_KEY = fs.readFileSync(
            `${path.dirname(require.main.filename)}/id_rsa_pub.pem`,
            'utf8'
        );
    }

    parseAccessToken(accessToken) {
        const parsedAccessToken = accessToken.split('.');

        this.header = parsedAccessToken[0];
        this.payload = parsedAccessToken[1];
        this.signature = parsedAccessToken[2];
    }

    decrypt(type = 'payload') {
        return JSON.parse(base64.decode(this[type]));
    }

    verify() {
        const verifyFunction = crypto.createVerify('RSA-SHA256');

        verifyFunction.write(`${this.header}.${this.payload}`);
        verifyFunction.end();

        const jwtSignatureBase64 = base64.toBase64(this.signature);
        return verifyFunction.verify(
            this.PUB_KEY,
            jwtSignatureBase64,
            'base64'
        );
    }
}

module.exports = JwtVerificationService;
