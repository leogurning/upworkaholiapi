const express = require('express');

const router = express.Router();
const UserController = require('../_controllers/user');

// routes
router.post('/register', UserController.register); // public route to register user
router.get('/emailverification', UserController.emailVerification); // public route to verify user email
router.post('/authenticate', UserController.authenticate); // public route
router.post('/sendresetpwd', UserController.sendEmailResetPassword); // public route
router.get('/pageverification', UserController.pageVerification); // public route to verify page for user
router.post('/resetpassword', UserController.resetPassword); // public route

module.exports = router;
