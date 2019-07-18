/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_FACTOR = 5;

const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  emailVerification: { type: Boolean, required: true },
  status: { type: String, required: true },
  creationDate: { type: Date },
  lastUpdatedDate: { type: Date },
  lastLoginDate: { type: Date },
  userType: { type: String },
  vhash: { type: String },
});

// Before save, encrypt the password
UserSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(SALT_FACTOR);
  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

// Compare password to user password
UserSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  let isMatch = false;
  isMatch = bcrypt.compareSync(candidatePassword, user.password);
  return isMatch;
};

module.exports = mongoose.model('users', UserSchema, 'users');
