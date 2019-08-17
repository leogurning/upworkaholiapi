const moment = require('moment');
// const config = require('../config');
// const constant = require('../_globals/constants');
const ProfileFreelancerModel = require('../_models/profileFreelancer');
const fileTransfer = require('../_services/fileTransfer.js');
const jobsService = require('../_services/jobs');
const constant = require('../_globals/constants');

class ProfileFreelancerService {
  static async saveProfile({
    userName,
    firstName,
    lastName,
    title,
    summary,
    skills,
    address1,
    address2,
    city,
    province,
    country,
    contactNo,
    languages,
    isAvailable,
    availableDate,
    profileId,
    profilePhotoPath,
    profilePhotoName,
  }) {
    // Check input params
    if (!userName
        || !firstName
        || !lastName
        || !title
        || !summary
        || !skills
        || !address1
        || !city
        || !province
        || !country
        || !contactNo
        || !languages
        || isAvailable === undefined || isAvailable == null) {
      // Return false if input params not correct or incompleted
      return false;
    }

    try {
      let profileObject = {
        userName,
        firstName,
        lastName,
        title,
        summary,
        skills,
        address1,
        address2,
        city,
        province,
        country,
        contactNo,
        languages,
        isAvailable,
      };
      const currentDate = moment().utc(true).toDate();
      if (!isAvailable) {
        profileObject = Object.assign(profileObject, { availableDate });
      } else {
        profileObject = Object.assign(profileObject, { availableDate: null });
      }
      if (profileId) {
      // Edit the profile
        profileObject = Object.assign(profileObject, { lastModifiedDate: currentDate });

        const resultUpdate = await ProfileFreelancerModel.findByIdAndUpdate(profileId, profileObject);
        if (resultUpdate) {
          return resultUpdate;
        }
        return null;
      }
      // Add new profile
      const dateInfoObject = {
        createdDate: currentDate,
        lastModifiedDate: currentDate,
      };

      // Add photo profile info if any
      if (profilePhotoPath && profilePhotoName) {
        dateInfoObject.profilePhotoPath = profilePhotoPath;
        dateInfoObject.profilePhotoName = profilePhotoName;
      }

      profileObject = Object.assign(profileObject, dateInfoObject);
      const profileToSave = new ProfileFreelancerModel(profileObject);
      // Save new user data
      const resultInsert = await profileToSave.save();
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

  static async getProfile(userName) {
    // Check input param
    if (!userName) {
      return false;
    }
    try {
      const query = { userName };
      const resultQuery = await ProfileFreelancerModel.findOne(query).lean().exec();
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

  static async changeProfilePhoto({
    userName, uploadPath, photoName, profileId,
  }, file) {
    if (!uploadPath || !userName) {
      return false;
    }
    try {
      const currentDate = moment().utc(true).toDate();
      const resultUpload = await fileTransfer.inputfileupload(uploadPath, file);
      const newPhotoPath = resultUpload.secure_url;
      const newPhotoName = resultUpload.public_id;
      const dataToUpdate = {
        profilePhotoPath: newPhotoPath,
        profilePhotoName: newPhotoName,
        lastModifiedDate: currentDate,
      };
      // If no profileId provided, new data
      if (!profileId || profileId === undefined || profileId === 'undefined') {
        const newPhoto = { newPhotoPath, newPhotoName };
        return newPhoto;
      }

      const query = { userName };
      const resultUpdate = await ProfileFreelancerModel.findOneAndUpdate(query, dataToUpdate);
      if (resultUpdate) {
        // Delete previous photoname
        if (photoName) {
          const resultDelete = await fileTransfer.inputfiledelete(uploadPath, photoName);
          console.log(`${photoName} is deleted. Result: ${resultDelete.result}`);
        }
        const newPhoto = { newPhotoPath, newPhotoName };
        return newPhoto;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getDataDashboard(userName) {
    // Check input
    if (!userName) {
      return false;
    }
    try {
      let totalJobs = [];
      const query = { userName };
      const resultQuery = await ProfileFreelancerModel.findOne(query).maxTimeMS(10000).lean().exec();
      totalJobs = await jobsService.getTotalJobsWorker(userName);
      const totalOfferedJobs = await jobsService.getTotalOfferJobsWorker(userName);
      const totalOnGoingJobs = totalJobs.filter(element => element.status === constant.jobStatus.ONGO);
      const totalCompleteJobs = totalJobs.filter(element => element.status === constant.jobStatus.CMPL);
      const earnedAmount = await jobsService.getWorkerEarnAmount(userName);

      if (resultQuery) {
        const result = {
          ...resultQuery,
          totalOfferedJobs,
          totalOnGoingJobs: totalOnGoingJobs.length,
          totalCompleteJobs: totalCompleteJobs.length,
          earnedAmount,
        };
        return result;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProfileFreelancerService;
