const express = require('express');
const router = express.Router();


const { getAccessToken, getAuthorizationCode, createClient } = require('../controllers/authController');


router.post('/', (req, res, next) => next(), getAccessToken);
router.post('/authorization_code', getAuthorizationCode);
router.post('/client', createClient);

module.exports = router;

