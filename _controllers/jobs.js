const jobsService = require('../_services/jobs');

class jobsController {
  // Save user profile
  static saveJob(req, res, next) {
    // Call save profile service
    jobsService.saveJob(req.body)
      .then((job) => {
        if (job && job != null) {
          res.json(job);
        } else if (job == null) {
          res.status(404).json({ message: 'Error: Job can not be saved.' });
        } else if (job === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving user job.' });
        }
      })
      .catch(err => next(err));
  }

  // Get Jobs list of the client user
  static getJobs(req, res, next) {
    const { userName } = req.params;
    const { searchText, status } = req.query;
    // Call get jobs list
    jobsService.getJobs(userName, searchText, status)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(404).json({ message: 'No Data found.' });
        } else if (result === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when getting job.' });
        }
      })
      .catch(err => next(err));
  }

  // Get Jobs aggregate for freelancer
  static getJobsAggregate(req, res, next) {
    const { jobId, searchText, sortBy } = req.query;
    // Call get jobs aggregate
    jobsService.getJobsAggregate(jobId, searchText, sortBy)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(404).json({ message: 'No Data found.' });
        } else {
          res.status(404).json({ message: 'Unknown error when getting job.' });
        }
      })
      .catch(err => next(err));
  }

  // Get Jobs aggregate for freelancer
  static getAfterStartJobsAggregate(req, res, next) {
    const {
      userName, jobId, searchText, status, sortBy,
    } = req.query;
    // Call get jobs aggregate
    jobsService.getAfterStartJobsAggregate(userName, jobId, searchText, status, sortBy)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(404).json({ message: 'No Data found.' });
        } else {
          res.status(404).json({ message: 'Unknown error when getting job.' });
        }
      })
      .catch(err => next(err));
  }

  // Update job applicants
  static freelancerApplyJob(req, res, next) {
    // Call apply job service
    jobsService.freelancerApplyJob(req.body)
      .then((job) => {
        if (job && job != null) {
          res.json(job);
        } else if (job == null) {
          res.status(404).json({ message: 'Error: Job can not be saved.' });
        } else if (job === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving user job.' });
        }
      })
      .catch(err => next(err));
  }

  // Update job offered
  static clientOfferJob(req, res, next) {
    // Call apply job service
    jobsService.clientOfferJob(req.body)
      .then((job) => {
        if (job && job != null) {
          res.json(job);
        } else if (job == null) {
          res.status(404).json({ message: 'Error: Job can not be offered. There may be active offering data.' });
        } else if (job === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving user job.' });
        }
      })
      .catch(err => next(err));
  }

  // Update job offered
  static cancelJobOffer(req, res, next) {
    // Call apply job service
    jobsService.cancelJobOffer(req.body)
      .then((job) => {
        if (job && job != null) {
          res.json(job);
        } else if (job == null) {
          res.status(404).json({ message: 'Error: Job can not be cancelled. There may be no pending data.' });
        } else if (job === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving user job.' });
        }
      })
      .catch(err => next(err));
  }

  // Get Jobs list of the client user
  static getJobOffer(req, res, next) {
    const { userName, searchText, sortBy } = req.query;
    // Call get jobs list
    jobsService.getJobOfferAggregate(userName, searchText, sortBy)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(404).json({ message: 'No Data found.' });
        } else if (result === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when getting job data.' });
        }
      })
      .catch(err => next(err));
  }

  // Update job offered
  static confirmJobOffer(req, res, next) {
    // Call apply job service
    jobsService.confirmJobOffer(req.body)
      .then((job) => {
        if (job && job != null) {
          res.json(job);
        } else if (job == null) {
          res.status(404).json({ message: 'Error: Job can not be confirmed. There may be no longer offering data. Please refresh.' });
        } else if (job === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving user job.' });
        }
      })
      .catch(err => next(err));
  }

  // Starting job controller
  static startJob(req, res, next) {
    // Call apply job service
    jobsService.startJob(req.body)
      .then((job) => {
        if (job && job != null) {
          res.json(job);
        } else if (job == null) {
          res.status(404).json({ message: 'Error: Job can not be started. There may be no longer offering data. Please refresh.' });
        } else if (job === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving user job.' });
        }
      })
      .catch(err => next(err));
  }

  // Set Client rating
  static setClientRating(req, res, next) {
    // Call apply job service
    jobsService.setClientRating(req.body)
      .then((job) => {
        if (job && job != null) {
          res.json(job);
        } else if (job == null) {
          res.status(404).json({ message: 'Error: Client rating failed.' });
        } else if (job === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving job.' });
        }
      })
      .catch(err => next(err));
  }

  // Complete the job
  static completeJob(req, res, next) {
    // Call apply job service
    jobsService.completeJob(req.body)
      .then((job) => {
        if (job && job != null) {
          res.json(job);
        } else if (job == null) {
          res.status(404).json({ message: 'Error: Complete job failed.' });
        } else if (job === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving job.' });
        }
      })
      .catch(err => next(err));
  }

  // Cancel the job
  static clientCancelJob(req, res, next) {
    // Call cancel job service
    jobsService.clientCancelJob(req.body)
      .then((job) => {
        if (job && job != null) {
          res.json(job);
        } else if (job == null) {
          res.status(404).json({ message: 'Error: Cancel job failed.' });
        } else if (job === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving job.' });
        }
      })
      .catch(err => next(err));
  }
}

module.exports = jobsController;
