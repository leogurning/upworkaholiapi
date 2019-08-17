const _ = require('lodash');
const mongoose = require('mongoose');
const moment = require('moment');
// const config = require('../config');
const JobModel = require('../_models/job');
const constant = require('../_globals/constants');
const ProfileEmployerModel = require('../_models/profileEmployer');
const ProfileFreelancerModel = require('../_models/profileFreelancer');

/*
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
    lastModifiedBy: { type: String, required: true },
    applicants: { type: Array },
    shortlists: { type: Array },
    offered: { type: Array },
  });
*/

class JobsService {
  static async saveJob({
    userName,
    jobTitle,
    jobDescription,
    jobCategory,
    jobType,
    startDate,
    endDate,
    jobAmount,
    skills,
    status,
    paymentTerm,
    paymentDescription,
    jobId,
  }) {
    // Check input params
    if (!userName
            || !jobTitle
            || !jobDescription
            || !jobCategory
            || !jobType
            || !skills
            || !startDate
            || !endDate
            || !jobAmount
            || !paymentTerm
            || !paymentDescription) {
      // Return false if input params not correct or incompleted
      return false;
    }

    try {
      let jobObject = {
        userName,
        jobTitle,
        jobDescription,
        jobCategory,
        jobType,
        skills,
        startDate: moment(startDate).utc(false).toDate(),
        endDate: moment(endDate).utc(false).toDate(),
        jobAmount,
        paymentTerm,
        paymentDescription,
      };
      const currentDate = moment().utc(false).toDate();
      if (status) {
        jobObject = Object.assign(jobObject, { status });
      }

      if (jobId) {
        // Edit the profile
        jobObject = Object.assign(jobObject, { lastModifiedDate: currentDate });

        const resultUpdate = await JobModel.findByIdAndUpdate(jobId, jobObject);

        if (resultUpdate) {
          return resultUpdate;
        }
        return null;
      }
      // Add new profile
      const preInfoObject = {
        status: constant.jobStatus.OPEN,
        createdDate: currentDate,
        lastModifiedDate: currentDate,
      };

      jobObject = Object.assign(jobObject, preInfoObject);
      const jobToSave = new JobModel(jobObject);
      // Save new job data
      const resultInsert = await jobToSave.save();
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

  static async getJobs(userName, inputText, status) {
    // Check input param
    if (!userName) {
      return false;
    }
    try {
      // returns songs records based on query
      let query = {};

      if (inputText) {
        query = Object.assign(query, {
          $and: [
            {
              $or: [
                { userName },
                { worker: userName },
              ],
            },
            {
              $or: [
                { jobTitle: new RegExp(inputText, 'i') },
                { jobCategory: new RegExp(inputText, 'i') },
                { skills: new RegExp(inputText, 'i') },
              ],
            },
          ],
        });
      } else {
        query = Object.assign(query, {
          $or: [
            { userName },
            { worker: userName },
          ],
        });
      }

      if (status) {
        query = Object.assign(query, { status });
      }

      const resultQuery = await JobModel.find(query).limit(1000).lean().exec();
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

  static async getJobsAggregate(jobId = '',
    inputText = '',
    sortBy = '') {
    // Initialise required vars
    let query = {};

    if (jobId) {
      query = { _id: mongoose.Types.ObjectId(jobId) };
    } else {
      query = {
        status: constant.jobStatus.OPEN,
        $or: [
          { jobTitle: new RegExp(inputText, 'i') },
          { jobCategory: new RegExp(inputText, 'i') },
          { skills: new RegExp(inputText, 'i') },
        ],
      };
    }

    const options = {
      maxTimeMS: 180000,
    };
    try {
      const aggregate = JobModel.aggregate();
      const olookup = {
        from: 'profileEmployer',
        localField: 'userName',
        foreignField: 'userName',
        as: 'employerdetails',
      };

      let osort = {};

      if (sortBy) {
        osort[sortBy] = -1;
      } else {
        osort = { createdDate: -1 };
      }
      const limit = 1000;

      aggregate.lookup(olookup).match(query);
      aggregate.limit(limit);
      aggregate.sort(osort);
      aggregate.option(options);
      const result = await aggregate.exec();
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getAfterStartJobsAggregate(userName, jobId = '',
    inputText = '',
    status,
    sortBy = '') {
    // Initialise required vars
    let query = {};

    if (jobId) {
      query = { _id: mongoose.Types.ObjectId(jobId) };
    } else {
      query = Object.assign(query, {
        status,
        $and: [
          {
            $or: [
              { userName },
              { worker: userName },
            ],
          },
          {
            $or: [
              { jobTitle: new RegExp(inputText, 'i') },
              { jobCategory: new RegExp(inputText, 'i') },
              { skills: new RegExp(inputText, 'i') },
              { 'employerdetails.companyName': new RegExp(inputText, 'i') },
              { 'freelancerdetails.firstName': new RegExp(inputText, 'i') },
              { 'freelancerdetails.lastName': new RegExp(inputText, 'i') },
            ],
          },
        ],
      });
    }

    const options = {
      maxTimeMS: 180000,
    };
    try {
      const aggregate = JobModel.aggregate();
      const olookup = {
        from: 'profileEmployer',
        localField: 'userName',
        foreignField: 'userName',
        as: 'employerdetails',
      };

      const olookupWorker = {
        from: 'profileFreelancer',
        localField: 'worker',
        foreignField: 'userName',
        as: 'freelancerdetails',
      };

      let osort = {};

      if (sortBy) {
        osort[sortBy] = -1;
      } else {
        osort = { createdDate: -1 };
      }
      const limit = 1000;

      aggregate.lookup(olookup);
      aggregate.lookup(olookupWorker);
      aggregate.match(query);
      aggregate.limit(limit);
      aggregate.sort(osort);
      aggregate.option(options);
      const result = await aggregate.exec();
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async freelancerApplyJob({
    jobId, userName,
  }) {
    // Check input params
    if (!userName
    || !jobId) {
      // Return false if input params not correct or incompleted
      return false;
    }

    try {
      const jobResult = await JobModel.findById(jobId);
      if (jobResult) {
        const applicantsArray = jobResult.applicants;
        applicantsArray.push(userName);
        jobResult.applicants = applicantsArray;
        const resultSave = await jobResult.save();
        if (resultSave) {
          return resultSave;
        }
        return null;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async clientOfferJob({
    jobId, userName,
  }) {
    // Check input params
    if (!userName || !jobId) {
      // Return false if input params not correct or incompleted
      return false;
    }

    try {
      const jobResult = await JobModel.findById(jobId);
      if (jobResult) {
        const offeredArray = jobResult.offered;
        const jobOfferObject = {
          userName,
          offerStatus: 'PENDING',
          remarks: '',
        };
        const currentOfferedData = offeredArray.filter(element => (element.offerStatus === 'PENDING'
                                || element.offerStatus === 'ACCEPTED'));

        if (currentOfferedData.length > 0) {
          return null;
        }
        offeredArray.push(jobOfferObject);
        jobResult.offered = offeredArray;
        const resultSave = await jobResult.save();
        if (resultSave) {
          return resultSave;
        }
        return null;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async cancelJobOffer({ jobId, userName }) {
    // Check input params
    if (!userName || !jobId) {
      // Return false if input params not correct or incompleted
      return false;
    }
    try {
      const jobResult = await JobModel.findById(jobId);
      const currentDate = moment().utc(false).toDate();

      if (jobResult) {
        const offeredArray = jobResult.offered;
        const jobOfferObject = _.find(offeredArray, jobOffer => jobOffer.userName === userName);
        if (jobOfferObject.offerStatus === 'PENDING' || jobOfferObject.offerStatus === 'ACCEPTED') {
          _.remove(offeredArray, jobOffer => jobOffer.userName === userName);
          jobResult.offered = offeredArray;
          // This markModified must be used to change/update array value
          // Otherwise the array value wont be changed
          jobResult.markModified('offered');
          jobResult.lastModifiedDate = currentDate;

          const resultSave = await jobResult.save();
          if (resultSave) {
            return resultSave;
          }
        }
        return null;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getJobOfferAggregate(userName,
    inputText = '',
    sortBy = '') {
    // Initialise required vars
    let query = {};

    query = {
      'offered.userName': userName,
      'offered.offerStatus': 'PENDING',
      $or: [
        { jobTitle: new RegExp(inputText, 'i') },
        { jobCategory: new RegExp(inputText, 'i') },
        { skills: new RegExp(inputText, 'i') },
      ],
    };

    const options = {
      maxTimeMS: 180000,
    };
    try {
      const aggregate = JobModel.aggregate();
      const olookup = {
        from: 'profileEmployer',
        localField: 'userName',
        foreignField: 'userName',
        as: 'employerdetails',
      };

      let osort = {};

      if (sortBy) {
        osort[sortBy] = -1;
      } else {
        osort = { createdDate: -1 };
      }
      const limit = 1000;

      aggregate.lookup(olookup).match(query);
      aggregate.limit(limit);
      aggregate.sort(osort);
      aggregate.option(options);
      const result = await aggregate.exec();
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async confirmJobOffer({
    jobId, userName, type, remarks,
  }) {
    // Check input params
    if (!userName || !jobId || !type) {
      // Return false if input params not correct or incompleted
      return false;
    }
    try {
      const jobResult = await JobModel.findById(jobId);
      const currentDate = moment().utc(false).toDate();

      if (jobResult) {
        const offeredArray = jobResult.offered;
        const jobOfferObject = _.find(offeredArray, jobOffer => (jobOffer.userName === userName && jobOffer.offerStatus === 'PENDING'));
        if (jobOfferObject) {
          const offerStatusResult = type === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED';
          let newJobOfferObject = {
            ...jobOfferObject,
            offerStatus: offerStatusResult,
          };
          if (remarks) {
            newJobOfferObject = {
              ...newJobOfferObject,
              remarks,
            };
          }
          _.remove(offeredArray, jobOffer => (jobOffer.userName === userName && jobOffer.offerStatus === 'PENDING'));
          offeredArray.push(newJobOfferObject);
          jobResult.offered = offeredArray;
          // This markModified must be used to change/update array value
          // Otherwise the array value wont be changed
          jobResult.markModified('offered');
          jobResult.lastModifiedDate = currentDate;

          const resultSave = await jobResult.save();
          if (resultSave) {
            return resultSave;
          }
        }
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async startJob({ jobId, applicantName }) {
    // Check input params
    if (!applicantName || !jobId) {
      // Return false if input params not correct or incompleted
      return false;
    }
    try {
      const currentDate = moment().utc(false).toDate();
      const docToUpdate = {
        worker: applicantName,
        startDate: currentDate,
        status: constant.jobStatus.ONGO,
        lastModifiedDate: currentDate,
      };
      const resultUpdate = await JobModel.findByIdAndUpdate(jobId, docToUpdate);
      if (resultUpdate) return resultUpdate;
      return null;
    } catch (error) {
    // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async completeJob({ jobId, workerRating, workerId }) {
    // Check input params
    if (!jobId || !workerRating || !workerId) {
      // Return false if input params not correct or incompleted
      return false;
    }
    try {
      const currentDate = moment().utc(false).toDate();
      const docToUpdate = {
        endDate: currentDate,
        status: constant.jobStatus.CMPL,
        lastModifiedDate: currentDate,
        workerRating,
      };
      const resultUpdate = await JobModel.findByIdAndUpdate(jobId, docToUpdate);
      if (resultUpdate) {
        const query = {
          worker: workerId,
          workerRating: { $exists: true },
        };

        const group = {
          _id: '$worker',
          total: { $sum: '$workerRating' },
          count: { $sum: 1 },
        };

        const totalJob = await JobModel.countDocuments(query);

        const aggregate = JobModel.aggregate();
        aggregate.match(query);
        aggregate.group(group);
        const result = await aggregate.exec();

        const totalRating = result[0].total;
        const ratingAv = totalRating / totalJob;

        const queryUpdateWorker = {
          userName: workerId,
        };
        const ratingToUpdate = {
          lastModifiedDate: currentDate,
          rating: ratingAv.toFixed(1),
        };
        const workerUpdate = await ProfileFreelancerModel.findOneAndUpdate(queryUpdateWorker, ratingToUpdate);

        if (workerUpdate) return resultUpdate;
      }

      return null;
    } catch (error) {
    // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async setClientRating({ jobId, clientRating, clientId }) {
    // Check input params
    if (!jobId || !clientRating || !clientId) {
      // Return false if input params not correct or incompleted
      return false;
    }
    try {
      const currentDate = moment.utc().toDate();
      const docToUpdate = {
        lastModifiedDate: currentDate,
        clientRating,
      };

      const resultUpdate = await JobModel.findByIdAndUpdate(jobId, docToUpdate);
      if (resultUpdate) {
        const query = {
          userName: clientId,
          clientRating: { $exists: true },
        };

        const group = {
          _id: '$userName',
          total: { $sum: '$clientRating' },
          count: { $sum: 1 },
        };

        const totalJob = await JobModel.countDocuments(query);

        const aggregate = JobModel.aggregate();
        aggregate.match(query);
        aggregate.group(group);
        const result = await aggregate.exec();

        const totalRating = result[0].total;
        const ratingAv = totalRating / totalJob;

        const queryUpdateEmployer = {
          userName: clientId,
        };
        const ratingToUpdate = {
          lastModifiedDate: currentDate,
          rating: ratingAv.toFixed(1),
        };
        const employerUpdate = await ProfileEmployerModel.findOneAndUpdate(queryUpdateEmployer, ratingToUpdate);
        if (employerUpdate) return resultUpdate;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getTotalJobsClient(userName) {
    // check input
    if (!userName) {
      return false;
    }
    try {
      const query = {
        userName,
        status: { $ne: constant.jobStatus.CANC },
      };

      const resultCount = await JobModel.find(query).maxTimeMS(10000).lean().exec();
      return resultCount;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getTotalJobsWorker(userName) {
    // check input
    if (!userName) {
      return false;
    }
    try {
      const query = {
        worker: userName,
        status: { $ne: constant.jobStatus.CANC },
      };

      const resultCount = await JobModel.find(query).maxTimeMS(10000).lean().exec();
      return resultCount;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getTotalOfferJobsWorker(userName) {
    // check input
    if (!userName) {
      return false;
    }
    try {
      const query = {
        'offered.userName': userName,
        'offered.offerStatus': 'PENDING',
        status: { $ne: constant.jobStatus.CANC },
      };

      const resultCount = await JobModel.countDocuments(query);
      return resultCount;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getClientDisbursedAmount(userName) {
    if (!userName) {
      return false;
    }
    try {
      const query = {
        userName,
        status: constant.jobStatus.CMPL,
      };

      const group = {
        _id: '$userName',
        total: { $sum: '$jobAmount' },
        count: { $sum: 1 },
      };

      const aggregate = JobModel.aggregate();
      aggregate.match(query);
      aggregate.group(group);
      const result = await aggregate.exec();

      let totalAmount = 0;
      if (result[0]) {
        totalAmount = result[0].total;
      }
      return totalAmount;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getWorkerEarnAmount(userName) {
    if (!userName) {
      return false;
    }
    try {
      const query = {
        worker: userName,
        status: constant.jobStatus.CMPL,
      };

      const group = {
        _id: '$worker',
        total: { $sum: '$jobAmount' },
        count: { $sum: 1 },
      };
      let totalAmount = 0;

      const aggregate = JobModel.aggregate();
      aggregate.match(query);
      aggregate.group(group);
      const result = await aggregate.exec();
      if (result[0]) {
        totalAmount = result[0].total;
      }
      return totalAmount;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async clientCancelJob({ jobId, remarks }) {
    if (!jobId) {
      return false;
    }
    try {
      const currentDate = moment.utc().toDate();
      // Edit the job doc
      const jobObject = {
        status: constant.jobStatus.CANC,
        cancelReason: remarks,
        lastModifiedDate: currentDate,
      };

      const resultUpdate = await JobModel.findByIdAndUpdate(jobId, jobObject);
      if (resultUpdate) return resultUpdate;
      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JobsService;
