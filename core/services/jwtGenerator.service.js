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
        this.createHashedSignature();

        this.optionalPayload = {};
        this.optionalHeader = {};
    }

    createRandomBytes() {
        const random = crypto.randomBytes(15);
        return random.toString('hex');
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

    createHashedSignature() {
        const signatureFunction = crypto.createSign('RSA-SHA256')

        const PREV_KEY = fs.readFileSync(path.dirname(require.main.filename) + '/id_rsa_priv.pem', 'utf8');
        const signatureBase64 = signatureFunction.sign(PREV_KEY, 'base64');
        this.hashedSignature = base64.fromBase64(signatureBase64);
    }


    get sign() {
        return `${this.hash('header')}.${this.hash('payload')}.${this.hashedSignature}`;
    }
}


module.exports = JwtGeneratorService;
