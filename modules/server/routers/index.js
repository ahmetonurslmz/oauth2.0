const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { generateServerKeys } = require('../controllers/serverController');

router.post('/keys', [check('server_key').exists()], generateServerKeys);

module.exports = router;
