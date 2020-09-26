const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { login, register } = require('../controllers/accountController');

router.post(
    '/login',
    [check('email').exists(), check('password').exists()],
    login
);

router.post(
    '/register',
    [check('email').exists(), check('password').exists()],
    register
);

module.exports = router;
