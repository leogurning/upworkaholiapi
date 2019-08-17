const express = require('express');

const router = express.Router();
const authorize = require('../_helpers/authorize');
const milestonesController = require('../_controllers/milestones');
const UserType = require('../_helpers/userType');

router.post('/', authorize(UserType.EMPLOYER), milestonesController.saveMilestone); // auth route to save Milestone
router.get('/list', authorize(), milestonesController.getMilestones); // auth route to get Milestone list
router.put('/workerupdates', authorize(UserType.FREELANCER), milestonesController.workerUpdates); // auth route to worker updates
router.put('/clientfeedback', authorize(UserType.EMPLOYER), milestonesController.clientFeedback); // auth route to client feedback
router.put('/requestfortransfer', authorize(UserType.FREELANCER), milestonesController.requestForTransfer); // auth route to transfer request

module.exports = router;
