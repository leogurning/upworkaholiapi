const mongoose = require('mongoose');

const { Schema } = mongoose;

const JobSchema = new Schema({
  userName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobCategory: { type: String, required: true },
  jobType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  jobAmount: { type: Number, required: true },
  skills: { type: String, required: true },
  status: { type: String, required: true },
  paymentTerm: { type: String, required: true },
  paymentDescription: { type: String },
  createdDate: { type: Date, required: true },
  lastModifiedDate: { type: Date, required: true },
  applicants: { type: Array },
  shortlists: { type: Array },
  offered: { type: Array },
  worker: { type: String },
  workerRating: { type: Number },
  clientRating: { type: Number },
});

module.exports = mongoose.model('jobs', JobSchema, 'jobs');
