const freelancersService = require('../_services/freelancers');

class freelancersController {
  // Get freelancers
  static getFreelancers(req, res, next) {
    const { searchText } = req.query;
    // Call get freelancers
    freelancersService.getFreelancers(searchText)
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

  // Get freelancers
  static getFreelancerProfile(req, res, next) {
    const { id } = req.params;
    // Call get freelancers
    freelancersService.getFreelancerProfile(id)
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

  // Get freelancers list
  static getFreelancerList(req, res, next) {
    const { searchText } = req.query;
    const { userNameList } = req.body;
    // Call get freelancers
    freelancersService.getFreelancerList(searchText, userNameList)
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

module.exports = freelancersController;
