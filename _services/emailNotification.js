const nodemailer = require('nodemailer');
const fs = require('fs');
const config = require('../config');
const constant = require('../_globals/constants');

const smtpTransport = nodemailer.createTransport({
  service: config.email_service,
  auth: {
    type: 'OAuth2',
    user: config.email_userid,
    clientId: config.email_clientid,
    clientSecret: config.email_clientsecret,
    refreshToken: config.email_refresh_token,
    // accessToken: serverConfig.gmail.access_token
  },
});
let mailOptions;
const htmltemplatepath = __dirname.replace('_services', '_templateEmailNotif');

class emailNotifService {
  // Send email verification
  static async sendVerification(emailto, vlink) {
    const configVal = constant.csEmail;
    const oriemailBody = fs.readFileSync(`${htmltemplatepath}/emailVer.html`).toString();
    const emailBody = oriemailBody.replace(new RegExp('{urlperipikasiimel}', 'g'), vlink);
    // Process to send email verification
    try {
      const rsemailBody = emailBody.replace(new RegExp('{contactno}', 'g'), configVal);
      mailOptions = {
        from: 'upworkaholi',
        to: emailto,
        subject: 'Please confirm your Email account',
        html: rsemailBody,
      };
      const smtpResponse = await smtpTransport.sendMail(mailOptions);
      if (smtpResponse) {
        return smtpResponse;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async sendResetPassword(emailto, vlink) {
    const configVal = constant.csEmail;

    const oriemailBody = fs.readFileSync(`${htmltemplatepath}/resetPassword.html`).toString();
    const emailBody = oriemailBody.replace(new RegExp('{resetpassurl}', 'g'), vlink);
    try {
      const rsemailBody = emailBody.replace(new RegExp('{contactno}', 'g'), configVal);
      mailOptions = {
        from: 'upworkaholi',
        to: emailto,
        subject: 'Account Reset Password',
        html: rsemailBody,
      };
      const smtpResponse = await smtpTransport.sendMail(mailOptions);
      if (smtpResponse) {
        return smtpResponse;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = emailNotifService;
