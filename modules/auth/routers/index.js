const express = require('express');
const router = express.Router();
const { check } = require('express-validator');


const { getAccessToken, getAuthorizationCode, createClient } = require('../controllers/authController');

router.post('/', (req, res, next) => next(), getAccessToken);
router.post('/authorization_code', getAuthorizationCode);
router.post('/client', [
    check('client_url').exists()
], createClient);

module.exports = router;

