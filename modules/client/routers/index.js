const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { createClient } = require('../controllers/clientController');

router.post('/', [check('client_url').exists()], createClient);

module.exports = router;
