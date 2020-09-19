const crypto = require('crypto');
const base64 = require('base64url');
const fs = require('fs');
const path = require('path');


/**
 * When instance initialized, function that createHashedSignature works.
 * Default header or payload values cannot be changed.
 * Optional payload or header can be enabled by assigning data to their properties.
 * To sign token, run sign method only
 */
class JwtGeneratorService {
    constructor() {
        this.fetchPrivateKey();

        this.optionalPayload = {};
        this.optionalHeader = {};
    }

    createRandomBytes() {
        const random = crypto.randomBytes(15);
        return random.toString('hex');
    }

    fetchPrivateKey() {
        this.PREV_KEY = fs.readFileSync(`${path.dirname(require.main.filename)}/id_rsa_priv.pem`, 'utf8');
    }


    /**
     * creates iat and exp date.
     * @param isLongPeriod {Boolean}: If it is false, period is 60 minutes otherwise it is 60 days.
     * @returns {{exp: number, iat: number}}
     */
    getDateInformation(isLongPeriod = false) {
        const date = new Date();

        const period = isLongPeriod ? (24 * 60 * 60) : 60;

        return {
            iat: date.getTime(),
            exp: new Date(date.setMinutes(date.getMinutes() + period)).getTime()
        }
    }

    get header() {
        return {
            ...this.optionalHeader,
            alg: 'RS256',
            typ: 'JWT',
        };
    }

    set header(data) {
        this.optionalHeader = data;
    }

    get payload() {
        return {
            ...this.getDateInformation(),
            jti: this.createRandomBytes(),
            ...this.optionalPayload,
        };
    }

    set payload(data) {
        this.optionalPayload = data;
    }

    hash(type) {
        return base64(JSON.stringify(this[type]));
    }

    sign() {
        const signatureFunction = crypto.createSign('RSA-SHA256');

        const header = this.hash('header');
        const payload = this.hash('payload');

        signatureFunction.write(`${header}.${payload}`);
        signatureFunction.end();

        const signatureBase64 = signatureFunction.sign(this.PREV_KEY, 'base64');
        const signature = base64.fromBase64(signatureBase64);
        return `${header}.${payload}.${signature}`;
    }
}


module.exports = JwtGeneratorService;
