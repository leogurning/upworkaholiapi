const express = require('express');

const router = express.Router();
const authorize = require('../_helpers/authorize');
const profileFreelancerController = require('../_controllers/profileFreelancer');
const profileEmployerController = require('../_controllers/profileEmployer');
const UserType = require('../_helpers/userType');

// routes
router.post('/freelancer', authorize(UserType.FREELANCER), profileFreelancerController.saveProfile); // auth route to save user freelancer profile
router.put('/freelancer', authorize(UserType.FREELANCER), profileFreelancerController.changeProfilePhoto); // auth route to change profile photo
router.get('/freelancer/:userName', authorize(UserType.FREELANCER), profileFreelancerController.getProfile); // auth route to get user freelancer profile
router.get('/freelancerdashboard/:userName', authorize(UserType.FREELANCER), profileFreelancerController.getDataDashboard); // auth route to get freelancer dashboard data

router.post('/employer', authorize(UserType.EMPLOYER), profileEmployerController.saveProfile); // auth route to save user employer profile
router.put('/employer', authorize(UserType.EMPLOYER), profileEmployerController.changeProfilePhoto); // auth route to change profile photo
router.get('/employer/:userName', authorize(UserType.EMPLOYER), profileEmployerController.getProfile); // auth route to get user employer profile
router.get('/employerdashboard/:userName', authorize(UserType.EMPLOYER), profileEmployerController.getDataDashboard); // auth route to get employer dashboard data

module.exports = router;
