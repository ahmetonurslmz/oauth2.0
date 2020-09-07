const express = require('express');
const router = express.Router();
const { check } = require('express-validator');


const { getAccessToken, getAuthorizationCode, createClient, generateServerKeys } = require('../controllers/authController');

router.post('/access_token', [
    check('client_id').exists(),
    check('code').exists(),
    check('grant_type').exists()
], getAccessToken);
router.post('/authorization_code', [
    check('client_id').exists(),
    check('response_type').exists()
], getAuthorizationCode);
router.post('/client', [
    check('client_url').exists()
], createClient);
router.post('/server_keys', generateServerKeys)

module.exports = router;

