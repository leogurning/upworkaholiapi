const mongoose = require('mongoose');

const { Schema } = mongoose;

const MilestoneSchema = new Schema({
  jobId: { type: String, required: true },
  milestoneTitle: { type: String, required: true },
  milestoneDescription: { type: String, required: true },
  expectedCompletedDate: { type: Date, required: true },
  actualCompletedDate: { type: Date },
  milestoneAmount: { type: Number, required: true },
  statusFromClient: { type: String, required: true },
  statusFromWorker: { type: String, required: true },
  workerUpdates: { type: String },
  clientFeedback: { type: String },
  createdDate: { type: Date, required: true },
  lastModifiedDate: { type: Date, required: true },
  remarks: { type: String },
  transferRequest: { type: Boolean },
});

module.exports = mongoose.model('milestones', MilestoneSchema, 'milestones');
