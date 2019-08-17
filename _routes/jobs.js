const express = require('express');

const router = express.Router();
const authorize = require('../_helpers/authorize');
const jobsController = require('../_controllers/jobs');
const UserType = require('../_helpers/userType');

// routes
router.post('/', authorize(UserType.EMPLOYER), jobsController.saveJob); // auth route to save Job
router.get('/list/:userName', authorize([UserType.FREELANCER, UserType.EMPLOYER]), jobsController.getJobs); // auth route to get Joblist
router.get('/search', authorize(), jobsController.getJobsAggregate); // auth route to get Joblist Aggregate with employer
router.put('/apply', authorize(UserType.FREELANCER), jobsController.freelancerApplyJob); // auth route to apply Job by freelancer
router.put('/offer', authorize(UserType.EMPLOYER), jobsController.clientOfferJob); // auth route to offer Job by employer
router.put('/canceloffer', authorize(UserType.EMPLOYER), jobsController.cancelJobOffer); // auth route to cancel offer Job by employer
router.get('/offer', authorize(UserType.FREELANCER), jobsController.getJobOffer); // auth route to get Job Offer list
router.put('/confirmoffer', authorize(UserType.FREELANCER), jobsController.confirmJobOffer); // auth route to CONFIRM Job offer by employer
router.put('/start', authorize(UserType.EMPLOYER), jobsController.startJob); // auth route to START Job by employer
router.get('/searchafterstart', authorize(), jobsController.getAfterStartJobsAggregate); // auth route to get After start Joblist Aggregate with employer
router.put('/setclientrating', authorize(UserType.FREELANCER), jobsController.setClientRating); // auth route to SET Client Rating
router.put('/complete', authorize(UserType.EMPLOYER), jobsController.completeJob); // auth route to complete the job
router.put('/cancel', authorize(UserType.EMPLOYER), jobsController.clientCancelJob); // auth route to cancel the job

module.exports = router;
