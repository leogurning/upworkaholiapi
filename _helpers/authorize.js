const expressJwt = require('express-jwt');
const jwtSecret = require('../config').jwt_secret;
const UserType = require('./userType');

function authorize(paramUserTypes = []) {
  let usersToAuthAgainst = paramUserTypes;
  // user type param can be a single type string (e.g. UserType.ADMIN or 'ADMIN')
  // or an array of user type (e.g. [UserType.ADMIN, UserType.SYSTEM] or ['ADMIN', 'SYSTEM'])
  if (typeof paramUserTypes === 'string') {
    usersToAuthAgainst = [paramUserTypes];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({ secret: jwtSecret }),
    // authorize based on user role and username (if any)
    (req, res, next) => {
      // authorize based on user role
      if (usersToAuthAgainst.length
              && !usersToAuthAgainst.includes(req.currentUser.userType)) {
        // user's type is not authorized
        return res.status(401).json({ message: 'Unauthorized user type !' });
      }
      // if current user role is not system or admin
      // authorize based on username (if any userName params)
      if (![UserType.ADMIN, UserType.SYSTEM].includes(req.currentUser.userType)) {
        if (req.params.userName
              && req.params.userName !== req.currentUser.userName) {
          return res.status(401).json({ message: 'Unauthorized user!' });
        }
      }

      // authentication and authorization successful
      return next();
    },
  ];
}

module.exports = authorize;
