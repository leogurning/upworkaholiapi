const express = require('express');

const router = express.Router();
const authorize = require('../_helpers/authorize');
const UserController = require('../_controllers/user');
const UserType = require('../_helpers/userType');

// routes
router.get('/:userName', authorize(), UserController.getUserById); // auth route to get user account data
router.put('/editemail', authorize(), UserController.changeEmail); // auth route to change user email
router.put('/changepassword/:userName', authorize(), UserController.updatePassword); // auth route to update password user

module.exports = router;
