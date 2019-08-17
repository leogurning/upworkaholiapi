/* const MilestoneSchema = new Schema({
    jobId: { type: String, required: true },
    milestoneTitle: { type: String, required: true },
    milestoneDescription: { type: String, required: true },
    expectedCompletedDate: { type: Date, required: true },
    actualCompletedDate: { type: Date },
    milestoneAmount: { type: Number, required: true },
    statusFromClient: { type: String, required: true },
    statusFromWorker: { type: String, required: true },
    workerUpdate: { type: String },
    clientFeedback: { type: String },
    createdDate: { type: Date, required: true },
    lastModifiedDate: { type: Date, required: true },
    remarks: { type: String },
}); */

// const _ = require('lodash');
const moment = require('moment');
const MilestoneModel = require('../_models/milestone');
const constant = require('../_globals/constants');

class MilestonesService {
  static async saveMilestone({
    jobId,
    milestoneTitle,
    milestoneDescription,
    expectedCompletedDate,
    milestoneAmount,
    milestoneId,
  }) {
    // Check input params
    if (!jobId
        || !milestoneTitle
        || !milestoneDescription
        || !expectedCompletedDate
        || !milestoneAmount
    ) {
      // Return false if input params not correct or incompleted
      return false;
    }

    try {
      let milestoneObject = {
        jobId,
        milestoneTitle,
        milestoneDescription,
        expectedCompletedDate: moment(expectedCompletedDate).utc(false).toDate(),
        milestoneAmount,
      };
      const currentDate = moment().utc(false).toDate();

      if (milestoneId) {
        // Edit the profile
        milestoneObject = Object.assign(milestoneObject, { lastModifiedDate: currentDate });

        const resultUpdate = await MilestoneModel.findByIdAndUpdate(milestoneId, milestoneObject);

        if (resultUpdate) {
          return resultUpdate;
        }
        return null;
      }
      // Add new profile
      const preInfoObject = {
        statusFromClient: constant.milestoneStatusClient.OPEN,
        statusFromWorker: constant.milestoneStatusWorker.NOTSTARTED,
        createdDate: currentDate,
        lastModifiedDate: currentDate,
      };

      milestoneObject = Object.assign(milestoneObject, preInfoObject);
      const milestoneToSave = new MilestoneModel(milestoneObject);
      // Save milestone data
      const resultInsert = await milestoneToSave.save();
      // Check result insert
      if (resultInsert) {
        return resultInsert;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getMilestones(jobId, status) {
    // Check input param
    if (!jobId) {
      return false;
    }
    try {
      // returns songs records based on query
      let query = { jobId };

      if (status) {
        query = Object.assign(query, {
          $or: [
            { statusFromClient: new RegExp(status, 'i') },
            { statusFromWorker: new RegExp(status, 'i') },
          ],
        });
      }

      const resultQuery = await MilestoneModel.find(query).limit(1000).lean().exec();
      if (resultQuery) {
        return resultQuery;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      return null;
    }
  }

  static async workerUpdates({ milestoneId, workerUpdates, statusFromWorker }) {
    // Check input params
    if (!milestoneId
      || !workerUpdates
      || !statusFromWorker
    ) {
    // Return false if input params not correct or incompleted
      return false;
    }
    const currentDate = moment().utc(false).toDate();

    try {
      const milestoneObject = {
        workerUpdates,
        statusFromWorker,
        lastModifiedDate: currentDate,
      };

      const resultUpdate = await MilestoneModel.findByIdAndUpdate(milestoneId, milestoneObject);

      if (resultUpdate) {
        return resultUpdate;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async clientFeedback({ milestoneId, clientFeedback, statusFromClient }) {
    // Check input params
    if (!milestoneId
      || !clientFeedback
      || !statusFromClient
    ) {
    // Return false if input params not correct or incompleted
      return false;
    }
    const currentDate = moment().utc(false).toDate();

    try {
      let milestoneObject = {
        clientFeedback,
        statusFromClient,
        lastModifiedDate: currentDate,
      };

      if (statusFromClient === constant.milestoneStatusClient.APPROVED) {
        milestoneObject = Object.assign(milestoneObject, { actualCompletedDate: currentDate });
      }

      const resultUpdate = await MilestoneModel.findByIdAndUpdate(milestoneId, milestoneObject);

      if (resultUpdate) {
        return resultUpdate;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async requestForTransfer({ milestoneId }) {
    // Check input params
    if (!milestoneId) {
    // Return false if input params not correct or incompleted
      return false;
    }
    const currentDate = moment().utc(false).toDate();

    try {
      const milestoneObject = {
        transferRequest: true,
        lastModifiedDate: currentDate,
      };

      const resultUpdate = await MilestoneModel.findByIdAndUpdate(milestoneId, milestoneObject);

      if (resultUpdate) {
        return resultUpdate;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }
}

module.exports = MilestonesService;
