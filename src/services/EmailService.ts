import { google } from 'googleapis'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import smtpConfig from '../config/smtp'

interface IEmailData {
  text: string
  subject: string
  to: string
  html?: string
}

class EmailService {
  private oAuth2Client

  constructor() {
    this.oAuth2Client = this.createOAuth2Client()
  }

  private createOAuth2Client() {
    const oAuth2Client = new google.auth.OAuth2(smtpConfig.auth.clientId, smtpConfig.auth.clientSecret, smtpConfig.redirectUrl)
    oAuth2Client.setCredentials({ refresh_token: smtpConfig.auth.refreshToken })
    return oAuth2Client
  }

  private createTransporter(accessToken: any): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    return nodemailer.createTransport({
      service: smtpConfig.service,
      auth: { ...smtpConfig.auth, type: 'OAUTH2', accessToken }
    })
  }

  public async execute({ text, subject, to, html }: IEmailData): Promise<void> {
    const accessToken = await this.oAuth2Client.getAccessToken()
    const transporter = this.createTransporter(accessToken)
    await transporter.sendMail({ text, subject, to, html })
  }
}

export default EmailService
