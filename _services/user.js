const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const config = require('../config');
const constant = require('../_globals/constants');

const UserModel = require('../_models/user');
const EmailNotificationService = require('./emailNotification');

class UserService {
  static async register({
    userName,
    password: paramPassword,
    email,
    userType,
  }, reqProtocol, reqHost) {
    // Check input params
    if (!userName
      || !paramPassword
      || !email
      || !userType) {
      // Return false if input params not correct or incompleted
      return false;
    }
    try {
      // Check if the username or email already exists
      const query = { $or: [{ userName }, { email }] };
      const resultQuery = await UserModel.findOne(query).lean().exec();
      if (resultQuery) {
        // If user name or email already exists throw error
        throw new Error('User Name OR Email already exists');
      }
      // If user name or email not exists, insert new user
      const session = await mongoose.startSession();
      session.startTransaction();
      // Insert new user
      try {
        const opts = { session, new: true };
        const code = uuidv4();
        const userToInsert = new UserModel({
          userName,
          password: paramPassword,
          email,
          emailVerification: false,
          status: constant.userStatus.PEND,
          creationDate: moment.utc().toDate(),
          lastUpdatedDate: moment.utc().toDate(),
          lastLoginDate: null,
          userType,
          vhash: code,
        });
        // Save new user data
        const resultInsert = await userToInsert.save(opts);
        // Check result insert
        if (resultInsert) {
        // If OK, send email verification
          try {
          // Construct verification link to the email verification
            const link = `${reqProtocol}://${reqHost}/verify?id=${code}`;
            const resultSent = await EmailNotificationService.sendVerification(email, link);
            // Check result send email
            if (resultSent) {
            // If OK, commit transaction
              await session.commitTransaction();
              session.endSession();
              return resultInsert;
            }
            // If sending result null, undefined then rollback
            await session.abortTransaction();
            session.endSession();
            return null;
          } catch (error) {
          // If sending email error then rollback
            await session.abortTransaction();
            session.endSession();
            throw error;
          }
        }
        // If save result null, undefined then rollback
        await session.abortTransaction();
        session.endSession();
        return null;
      } catch (error) {
      // If save error then rollback
        console.error(error.message);
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (error) {
      // If findOne method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async emailVerification(hash) {
    const userStatus = [constant.userStatus.PEND, constant.userStatus.APPV];

    if (!hash) {
      return false;
    }
    // Check if the username or email already exists
    const query = {
      vhash: hash,
      status: { $in: userStatus },
    };
    try {
      const userDocumentUpdate = {
        emailVerification: true,
        status: constant.userStatus.APPV,
        vhash: null,
        lastUpdatedDate: moment.utc().toDate(),
      };
      const resultQuery = await UserModel.findOneAndUpdate(query, userDocumentUpdate).lean().exec();
      if (resultQuery) {
        // If user exists and updated
        return resultQuery;
      }
      return null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  static async authenticate({ userName, password: paramPassword }) {
    const query = {
      userName,
      status: constant.userStatus.APPV,
    };
    try {
      // get user according to username input and status approved
      const user = await UserModel.findOne(query).lean().exec();
      if (user) {
        // Check if the user password ismatch
        const match = await bcrypt.compare(paramPassword, user.password);

        if (!match) {
          return null;
        }
        const token = jwt.sign({ name: user.userName, type: user.userType }, config.jwt_secret);
        // eslint-disable-next-line no-shadow
        const { password, ...userWithoutPassword } = user;

        /* eslint no-underscore-dangle: 0 */
        // update lastLoginDate (AFT-151)
        await UserModel.updateOne({ _id: user._id }, {
          $set: {
            lastLoginDate: moment().utc().toDate(),
          },
        });
        return {
          ...userWithoutPassword,
          token,
        };
      }
      return null;
    } catch (error) {
      console.log('UserService.authenticate database error', error);
      throw error;
    }
  }

  static async sendEmailResetPassword({ emailto }, reqProtocol, reqHost) {
    if (!emailto || !reqProtocol || !reqHost) {
      return false;
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const opts = { session, new: true };
      const code = uuidv4();
      const query = {
        email: emailto,
        status: constant.userStatus.APPV,
      };
      const updateUserDoc = {
        vhash: code,
        lastUpdatedDate: moment().utc(true).toDate(),
      };
      const resultUpdate = await UserModel.findOneAndUpdate(query, updateUserDoc, opts);
      if (resultUpdate) {
        const link = `${reqProtocol}://${reqHost}/resetpwd?id=${code}`;
        const resultSent = await EmailNotificationService.sendResetPassword(emailto, link);
        // Check result send email
        if (resultSent) {
          // If OK, commit transaction
          await session.commitTransaction();
          session.endSession();
          return resultUpdate;
        }
        // If sending result null, undefined then rollback
        await session.abortTransaction();
        session.endSession();
        return null;
      }
      // If sending result null, undefined then rollback
      await session.abortTransaction();
      session.endSession();
      return null;
    } catch (error) {
      // If save error then rollback
      console.error(error.message);
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // Method to verify the page with hash
  static async pageVerification(hash) {
    // Check input hash
    if (!hash) {
      return false;
    }
    // find the user
    const query = {
      vhash: hash,
      status: constant.userStatus.APPV,
    };
    try {
      const resultQuery = await UserModel.findOne(query).lean().exec();
      if (resultQuery) {
        return resultQuery.vhash;
      }
      return null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  static async resetPassword({ vhash, password: paramPassword }) {
    // Check input parameters
    if (!vhash || !paramPassword) {
      // ThrowError('Error processing request. Invalid URL verification !');
      return false;
    }
    // update passwd /remove hash value
    const query = {
      vhash,
      status: constant.userStatus.APPV,
    };
    const SALT_FACTOR = 5;
    const salt = bcrypt.genSaltSync(SALT_FACTOR);
    const hash = bcrypt.hashSync(paramPassword, salt);
    const userUpdateDoc = {
      password: hash,
      vhash: null,
      lastUpdatedDate: moment().utc(true).toDate(),
    };
    try {
      const resultQuery = await UserModel.findOneAndUpdate(query, userUpdateDoc).lean().exec();
      if (resultQuery) {
        return resultQuery;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const user = await UserModel.findOne({ userName: id }).lean().exec();
      if (user) {
        // eslint-disable-next-line no-shadow
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
        };
      }
      return null;
    } catch (error) {
      console.log('UserService.authenticate database error', error);
      throw error;
    }
  }

  static async changeEmail({ userName, email }, reqProtocol, reqHost) {
    // Check the input
    if (!userName || !email) {
      return '400';
    }

    try {
      const query = { email };
      const userEmail = await UserModel.findOne(query).lean().exec();
      if (userEmail) {
        return '401';
      }
      const user = await UserModel.findOne({ userName }).lean().exec();
      if (user && user.email !== email) {
        // Process update email
        const session = await mongoose.startSession();
        session.startTransaction();
        const opts = { session, new: true };
        const code = uuidv4();
        const docToUpdate = {
          email,
          emailVerification: false,
          vhash: code,
          lastUpdatedDate: moment().utc(true).toDate(),
        };
        const resultUpdate = await UserModel.updateOne({ userName }, docToUpdate, opts);
        if (resultUpdate) {
          // If OK, send email verification
          try {
            // Construct verification link to the email verification
            const link = `${reqProtocol}://${reqHost}/verify?id=${code}`;
            const resultSent = await EmailNotificationService.sendVerification(email, link);
            // Check result send email
            if (resultSent) {
            // If OK, commit transaction
              await session.commitTransaction();
              session.endSession();
              return resultUpdate;
            }
            // If sending result null, undefined then rollback
            await session.abortTransaction();
            session.endSession();
            return null;
          } catch (error) {
          // If sending email error then rollback
            await session.abortTransaction();
            session.endSession();
            throw error;
          }
        }
        // If save result null, undefined then rollback
        await session.abortTransaction();
        session.endSession();
        return null;
      }
      return '402';
    } catch (error) {
      console.log('UserService.change email database error', error);
      throw error;
    }
  }

  static async updatePassword(
    userName,
    { oldpassword, password: inputPassword },
  ) {
    // Check the input
    if (!userName || !oldpassword || !inputPassword) {
      return '400';
    }
    try {
      const userResult = await UserModel.findOne({ userName });
      if (userResult) {
        const isMatched = userResult.comparePassword(oldpassword);
        if (isMatched) {
          userResult.password = inputPassword;
          userResult.lastUpdatedDate = moment().utc(true).toDate();
          const saveResult = await userResult.save();
          if (saveResult) {
            return saveResult;
          }
          return null;
        }
        return '402';
      }
      return '401';
    } catch (error) {
      console.log('UserService.update password database error', error);
      throw error;
    }
  }
}

module.exports = UserService;
