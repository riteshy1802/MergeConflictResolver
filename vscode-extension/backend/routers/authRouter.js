const express = require('express');
const router = express.Router();
const { login, handleCallback } = require('../controllers/authController');

router.get('/login', login );
router.get('/callback', handleCallback);

module.exports=router;