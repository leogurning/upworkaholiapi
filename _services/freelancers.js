const ProfileFreelancerModel = require('../_models/profileFreelancer');

class FreelancersService {
  static async getFreelancers(inputText) {
    // Check input param
    /* if (!inputText) {
      return false;
    } */
    try {
      // returns songs records based on query
      const query = {
        $or: [
          { firstName: new RegExp(inputText, 'i') },
          { lastName: new RegExp(inputText, 'i') },
          { title: new RegExp(inputText, 'i') },
          { skills: new RegExp(inputText, 'i') },
          { city: new RegExp(inputText, 'i') },
          { province: new RegExp(inputText, 'i') },
        ],
      };

      const findCommand = ProfileFreelancerModel.find(query).limit(1000).maxTimeMS(10000).lean();
      const resultQuery = await findCommand.exec();
      if (resultQuery) {
        return resultQuery;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getFreelancerProfile(id) {
    // Check input param
    if (!id) {
      return false;
    }
    // Search the freelancer profile by Id
    try {
      const resultQuery = await ProfileFreelancerModel.findById(id).maxTimeMS(10000).lean().exec();
      if (resultQuery) {
        return resultQuery;
      }
      return null;
    } catch (error) {
      // If method is error, throw error
      console.log(error.message);
      throw error;
    }
  }

  static async getFreelancerList(inputText, userNameList) {
    // Check input param
    if (!userNameList) {
      return false;
    }
    try {
      let query = { userName: { $in: userNameList } };
      if (inputText) {
        query = Object.assign(query, {
          $or: [
            { firstName: new RegExp(inputText, 'i') },
            { lastName: new RegExp(inputText, 'i') },
            { title: new RegExp(inputText, 'i') },
          ],
        });
      }
      const fieldToDisplay = {
        userName: 1,
        firstName: 1,
        lastName: 1,
        title: 1,
      };
      const resultQuery = await ProfileFreelancerModel.find(query, fieldToDisplay).maxTimeMS(10000).lean().exec();
      if (resultQuery) return resultQuery;
      return null;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}

module.exports = FreelancersService;
