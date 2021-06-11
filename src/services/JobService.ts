import { CronJob } from 'cron'
import { isLastDayOfMonth } from 'date-fns'
import constants from '../constants'
import ReportService from './ReportService'

class JobService {
  public async sendMonthlyReportJob(): Promise<CronJob> {
    const sendEmailJob = new CronJob(constants.cronJobTime, async () => {
      if (isLastDayOfMonth(new Date())) {
        const reportService = new ReportService()
        await reportService.executeMonthlyReport(new Date())
        console.log(`CronJob executed at ${new Date()}`)
        return true
      }
      return false
    }, null, false, constants.cronJobTimeZone)
    return sendEmailJob
  }
}

export default JobService
