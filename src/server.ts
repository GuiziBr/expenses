import app from './app'
import docSetup from './doc/docSetup'
import JobService from './services/JobService'

const { PORT } = process.env

docSetup(app)

const sendMonthlyReportJob = async () => {
  const jobService = new JobService()
  const sendMonthlyReport = await jobService.sendMonthlyReportJob()
  return sendMonthlyReport.start()
}

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`)
  await sendMonthlyReportJob()
})
