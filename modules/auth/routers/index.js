const express = require('express');
const router = express.Router();


const { getAccessToken } = require('../controller/authController');


router.post('/', (req, res, next) => next(), getAccessToken)

module.exports = router;

