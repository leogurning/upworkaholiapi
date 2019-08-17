const milestonesService = require('../_services/milestones');

class milestonesController {
  // Save milestone data
  static saveMilestone(req, res, next) {
    // Call save milestone service
    milestonesService.saveMilestone(req.body)
      .then((milestone) => {
        if (milestone && milestone != null) {
          res.json(milestone);
        } else if (milestone == null) {
          res.status(404).json({ message: 'Error: Milestone can not be saved.' });
        } else if (milestone === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving milestone.' });
        }
      })
      .catch(err => next(err));
  }

  // Get Milestones list of the client user
  static getMilestones(req, res, next) {
    const { jobId, status } = req.query;
    // Call get jobs list
    milestonesService.getMilestones(jobId, status)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(404).json({ message: 'No Data found.' });
        } else if (result === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when getting milestone.' });
        }
      })
      .catch(err => next(err));
  }

  // worker update action
  static workerUpdates(req, res, next) {
    // Call save milestone service
    milestonesService.workerUpdates(req.body)
      .then((milestone) => {
        if (milestone && milestone != null) {
          res.json(milestone);
        } else if (milestone == null) {
          res.status(404).json({ message: 'Error: Milestone can not be saved.' });
        } else if (milestone === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving milestone.' });
        }
      })
      .catch(err => next(err));
  }

  // client feedback action
  static clientFeedback(req, res, next) {
    // Call save milestone service
    milestonesService.clientFeedback(req.body)
      .then((milestone) => {
        if (milestone && milestone != null) {
          res.json(milestone);
        } else if (milestone == null) {
          res.status(404).json({ message: 'Error: Milestone can not be saved.' });
        } else if (milestone === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving milestone.' });
        }
      })
      .catch(err => next(err));
  }

  // client feedback action
  static requestForTransfer(req, res, next) {
    // Call save milestone service
    milestonesService.requestForTransfer(req.body)
      .then((milestone) => {
        if (milestone && milestone != null) {
          res.json(milestone);
        } else if (milestone == null) {
          res.status(404).json({ message: 'Error: Milestone can not be saved.' });
        } else if (milestone === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving milestone.' });
        }
      })
      .catch(err => next(err));
  }
}

module.exports = milestonesController;
