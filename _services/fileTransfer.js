const cloudinary = require('cloudinary');
const config = require('../config');

// const uploadpath = "kaxet/images/genres/";
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

function ThrowError(errMessage, log) { // TE stands for Throw Error
  if (log === true) {
    console.error(errMessage);
  }
  throw new Error(errMessage);
}

class fileTransferService {
  static async inputfileupload(uploadpath, file) {
    const d = new Date();
    const ts = (`0${d.getDate()}`).slice(-2) + (`0${d.getMonth() + 1}`).slice(-2)
                        + d.getFullYear() + (`0${d.getHours()}`).slice(-2)
                        + (`0${d.getMinutes()}`).slice(-2) + (`0${d.getSeconds()}`).slice(-2);
    return new Promise((resolve, reject) => {
      if (!uploadpath) {
        reject(ThrowError('Posted input data is not correct or incompleted.'));
      }
      if (file) {
        const oriname = file.name;
        const filename = `_file${oriname.substr(oriname.length - 4)}`;
        const name = ts + filename;

        cloudinary.v2.uploader.upload_stream(
          {
            public_id: name, folder: uploadpath, invalidate: true, resource_type: 'raw',
          },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        ).end(file.data);
      } else {
        reject(ThrowError('No File selected !'));
      }
    });
  }

  static async inputfiledelete(uploadpath, filename) {
    return new Promise((resolve, reject) => {
      if (!uploadpath || !filename) {
        reject(ThrowError('Posted input data is not correct or incompleted.'));
      }
      if (filename) {
        cloudinary.v2.uploader.destroy(filename,
          { invalidate: true, resource_type: 'raw' },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
      } else {
        reject(ThrowError('No File selected !'));
      }
    });
  }
}

module.exports = fileTransferService;
