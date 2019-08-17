const express = require('express');

const router = express.Router();
const authorize = require('../_helpers/authorize');
const FreelancersController = require('../_controllers/freelancers');
const UserType = require('../_helpers/userType');

// routes
router.get('/', authorize([UserType.EMPLOYER, UserType.ADMIN, UserType.SYSTEM]), FreelancersController.getFreelancers); // auth route to get freelancers data
router.get('/detail/:id', authorize([UserType.EMPLOYER, UserType.ADMIN, UserType.SYSTEM]), FreelancersController.getFreelancerProfile); // auth route to get freelancer profile data
router.post('/list', authorize([UserType.EMPLOYER, UserType.ADMIN, UserType.SYSTEM]), FreelancersController.getFreelancerList); // auth route to get freelancers list data

module.exports = router;
