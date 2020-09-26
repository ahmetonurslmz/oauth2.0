const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
    getAccessToken,
    getAuthorizationCode,
    generateServerKeys,
    verifyAccessToken,
    chooseAccount,
} = require('../controllers/authController');

router.post(
    '/access_token/generation',
    [check('client_id').exists(), check('grant_type').exists()],
    getAccessToken
);
router.post(
    '/authorization_code',
    [
        check('client_id').exists(),
        check('response_type').exists(),
        check('redirect_url').exists(),
    ],
    getAuthorizationCode
);
router.post('/server_keys', generateServerKeys);
router.post(
    '/access_token/verification',
    [check('access_token').exists()],
    verifyAccessToken
);
router.get(
    '/account',
    [
        check('client_id').exists(),
        check('response_type').exists(),
        check('state').exists(),
        check('redirect_url').exists(),
    ],
    chooseAccount
);

module.exports = router;
