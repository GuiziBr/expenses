import constants from '../constants/index'

export default {
  service: constants.smtpService,
  redirectUrl: process.env.MAIL_REDIRECT_URL,
  auth: {
    user: process.env.MAIL_USER,
    clientId: process.env.MAIL_CLIENT_ID,
    clientSecret: process.env.MAIL_CLIENT_SECRET,
    refreshToken: process.env.MAIL_REFRESH_TOKEN
  }
}
