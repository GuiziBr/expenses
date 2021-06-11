import { format } from 'date-fns'
import { getCustomRepository, getRepository, Repository } from 'typeorm'
import constants from '../constants'
import User from '../models/User'
import ExpensesRepository from '../repositories/ExpensesRepository'
import { formatAmount } from '../utils/formatAmount'
import EmailService from './EmailService'

interface IBalance {
  personalBalance: number
  sharedBalance: {
    payed: number
    paying: number
    total: number
  }
}

interface IEmailData {
  text: string
  subject: string
  to: string
  html?: string
}

interface IMonthlyReport {
  balance: IBalance
  to: string
  name: string
  reportDate: Date
}

class ReportService {
  private usersRepository: Repository<User>

  private expensesRepository: ExpensesRepository

  private emailService: EmailService

  constructor() {
    this.usersRepository = getRepository(User)
    this.expensesRepository = getCustomRepository(ExpensesRepository)
    this.emailService = new EmailService()
  }

  private buildReport({ balance, to, name, reportDate }: IMonthlyReport): IEmailData {
    const text = `
      Dear ${name},

      Monthly Report - ${format(reportDate, constants.reportDateFormat)}

      Shared Balance:
      Your Incomes are ${formatAmount(balance.sharedBalance.paying)}
      Your Outcomes are ${formatAmount(balance.sharedBalance.payed)}
      Your Current Balance is ${formatAmount(balance.sharedBalance.total)}

      Your Current Personal Balance is ${formatAmount(balance.personalBalance)}

      Please bear in mind that your deadline for registering new expenses is up to today at 23h59, consider taking a moment to check your dashboard

      To see more details visit https://expenses-portal.herokuapp.com/

      Regards,

      Admin
    `
    return { to, subject: constants.reportSubject, text }
  }

  public async executeMonthlyReport(reportDate: Date) {
    const users = await this.usersRepository.find()
    const balances = await Promise.all([
      this.expensesRepository.getBalance({ owner_id: users[0].id, date: reportDate }),
      this.expensesRepository.getBalance({ owner_id: users[1].id, date: reportDate })
    ])
    const reports = balances.map((balance, index) => this.buildReport({
      balance,
      to: users[index].email,
      name: users[index].name,
      reportDate
    }))
    return Promise.all(reports.map((report) => this.emailService.execute(report)))
  }
}

export default ReportService
