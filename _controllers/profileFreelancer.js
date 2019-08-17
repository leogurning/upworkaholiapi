const profileFreelancerService = require('../_services/profileFreelancer');

class profileFreelancerController {
  // Save user profile
  static saveProfile(req, res, next) {
    // Call save profile service
    profileFreelancerService.saveProfile(req.body)
      .then((profile) => {
        if (profile && profile != null) {
          res.json(profile);
        } else if (profile == null) {
          res.status(404).json({ message: 'Error: Profile can not be saved.' });
        } else if (profile === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving user profile.' });
        }
      })
      .catch(err => next(err));
  }

  // Get user profile
  static getProfile(req, res, next) {
    const { userName } = req.params;
    // Call get profile service
    profileFreelancerService.getProfile(userName)
      .then((profile) => {
        if (profile && profile != null) {
          res.json(profile);
        } else if (profile == null) {
          res.status(404).json({ message: 'No profile found.' });
        } else if (profile === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when getting user profile.' });
        }
      })
      .catch(err => next(err));
  }

  static changeProfilePhoto(req, res, next) {
    // Update user profile photo
    // Update user
    profileFreelancerService.changeProfilePhoto(req.body, req.files.fileinputsrc)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(404).json({ message: 'User Profile Not found' });
        } else if (result == null) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        }
      })
      .catch(err => next(err));
  }

  // Get user dashboard
  static getDataDashboard(req, res, next) {
    const { userName } = req.params;
    // Call get profile service
    profileFreelancerService.getDataDashboard(userName)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(404).json({ message: 'No profile found.' });
        } else if (result === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when getting user profile.' });
        }
      })
      .catch(err => next(err));
  }
}

module.exports = profileFreelancerController;
