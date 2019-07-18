const userService = require('../_services/user');
const globalFunctions = require('../_globals/functions');
const config = require('../config');

class userController {
  // Register user controller
  static register(req, res, next) {
    const requestProtocol = globalFunctions.getProtocol(req);
    const requestHost = config.mainUrl;
    userService.register(req.body, requestProtocol, requestHost)
      .then((user) => {
        if (user && user != null) {
          res.json(user);
        } else if (user == null) {
          res.status(404).json({ message: 'User can not be saved.' });
        } else if (user === false) {
          res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving new user.' });
        }
      })
      .catch(err => next(err));
  }

  // User email verification controller
  static emailVerification(req, res, next) {
    const paramHash = req.query.id;
    // Call email verification service
    userService.emailVerification(paramHash)
      .then((user) => {
        if (user && user != null) {
          res.json(user);
        } else if (user == null) {
          res.status(404).json({ message: 'Invalid/Expired hash value!' });
        } else if (user === false) {
          res.status(400).json({ message: 'No input hash' });
        } else {
          res.status(404).json({ message: 'Unknown error user email verification.' });
        }
      })
      .catch(err => next(err));
  }

  // User send email reset password controller
  static sendEmailResetPassword(req, res, next) {
    const requestProtocol = globalFunctions.getProtocol(req);
    const requestHost = config.mainUrl;
    // Call email verification service
    userService.sendEmailResetPassword(req.body, requestProtocol, requestHost)
      .then((user) => {
        if (user && user != null) {
          res.json(user);
        } else if (user == null) {
          res.status(404).json({ message: 'Error send email Reset Password. User Not Found' });
        } else if (user === false) {
          res.status(400).json({ message: 'Input parameter is incorrect or incomplete' });
        } else {
          res.status(404).json({ message: 'Unknown error user email verification.' });
        }
      })
      .catch(err => next(err));
  }

  // User page verification controller
  static pageVerification(req, res, next) {
    const paramHash = req.query.id;
    // Call page verification service
    userService.pageVerification(paramHash)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(404).json({ message: 'Invalid/Expired hash value!' });
        } else if (result === false) {
          res.status(400).json({ message: 'No input hash' });
        } else {
          res.status(404).json({ message: 'Unknown error user email verification.' });
        }
      })
      .catch(err => next(err));
  }

  // authenticate user when login
  static authenticate(req, res, next) {
    userService.authenticate(req.body)
      .then((user) => {
        if (user && user != null) {
          res.json(user);
        } else {
          res.status(400).json({ message: 'Username or password is incorrect' });
        }
      })
      .catch(err => next(err));
  }

  // User reset password controller
  static resetPassword(req, res, next) {
    // Call reset password service
    userService.resetPassword(req.body)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(404).json({ message: 'Error update password.' });
        } else if (result === false) {
          res.status(400).json({ message: 'Input parameters are incorrect/incomplete' });
        } else {
          res.status(404).json({ message: 'Unknown error user email verification.' });
        }
      })
      .catch(err => next(err));
  }

  // Get User account controller
  static getUserById(req, res, next) {
    const { userName } = req.params;

    if (!userName) {
      res.status(400).json({ message: 'Incorrect/Incomplete input' });
    }
    // Call reset password service
    userService.getById(userName)
      .then((result) => {
        if (result && result != null) {
          res.json(result);
        } else if (result == null) {
          res.status(400).json({ message: 'User Not found.' });
        } else {
          res.status(404).json({ message: 'Unknown error get user data.' });
        }
      })
      .catch(err => next(err));
  }

  // Change user email controller
  static changeEmail(req, res, next) {
    const requestProtocol = globalFunctions.getProtocol(req);
    const requestHost = config.mainUrl;
    userService.changeEmail(req.body, requestProtocol, requestHost)
      .then((result) => {
        if (result && result != null) {
          switch (result) {
            case '400':
              res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
              break;
            case '401':
              res.status(400).json({ message: 'Email has been linked to existing user' });
              break;
            case '402':
              res.status(400).json({ message: 'Email has been linked to current user' });
              break;
            default:
              res.json(result);
          }
        } else if (result == null) {
          res.status(404).json({ message: 'Email can not be updated.' });
        } else {
          res.status(404).json({ message: 'Unknown error when saving new user.' });
        }
      })
      .catch(err => next(err));
  }

  static updatePassword(req, res, next) {
    const { userName } = req.params;
    // Call update password service
    userService.updatePassword(userName, req.body)
      .then((result) => {
        if (result && result != null) {
          switch (result) {
            case '400':
              res.status(400).json({ message: 'Input parameters is incorrect OR incomplete.' });
              break;
            case '401':
              res.status(400).json({ message: 'User not found.' });
              break;
            case '402':
              res.status(400).json({ message: 'Old password is not matched.' });
              break;
            default:
              res.json(result);
          }
        } else if (result == null) {
          res.status(404).json({ message: 'Error updating password to database.' });
        } else {
          res.status(404).json({ message: 'Unknown error when updating password.' });
        }
      })
      .catch(err => next(err));
  }
}

module.exports = userController;
