const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProfileFreelancerSchema = new Schema({
  userName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  skills: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  province: { type: String, required: true },
  country: { type: String, required: true },
  contactNo: { type: String, required: true },
  languages: { type: String, required: true },
  profilePhotoPath: { type: String },
  profilePhotoName: { type: String },
  createdDate: { type: Date, required: true },
  lastModifiedDate: { type: Date, required: true },
  isAvailable: { type: Boolean, required: true },
  availableDate: { type: Date },
  rating: { type: Number },
});

module.exports = mongoose.model('profileFreelancer', ProfileFreelancerSchema, 'profileFreelancer');
