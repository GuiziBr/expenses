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

class ReportService {
  private usersRepository: Repository<User>

  private expensesRepository: ExpensesRepository

  private emailService

  private reportDate: Date

  constructor() {
    this.usersRepository = getRepository(User)
    this.expensesRepository = getCustomRepository(ExpensesRepository)
    this.reportDate = new Date()
    this.emailService = new EmailService()
  }

  private buildReport(balance: IBalance, to: string, name: string): IEmailData {
    const text = `
      Dear ${name},

      Monthly Report - ${format(this.reportDate, 'yyyy/MM')}

      Shared Balance:
      Your Incomes are ${formatAmount(balance.sharedBalance.paying)}
      Your Outcomes are ${formatAmount(balance.sharedBalance.payed)}
      Your Current Balance is ${formatAmount(balance.sharedBalance.total)}

      Your Current Personal Balance is ${formatAmount(balance.personalBalance)}

      Please bear in mind that your deadline for registering new expenses is up to today at 23h59, consider taking a moment to check your expenses

      To see more details visit https://expenses-portal.herokuapp.com/

      Regards,

      Admin
    `
    return { to, subject: constants.reportSubject, text }
  }

  public async execute() {
    const users = await this.usersRepository.find()
    const balances = await Promise.all([
      this.expensesRepository.getBalance({ owner_id: users[0].id, date: this.reportDate }),
      this.expensesRepository.getBalance({ owner_id: users[1].id, date: this.reportDate })
    ])
    const reports = balances.map((balance, index) => this.buildReport(balance, users[index].email, users[index].name))
    return Promise.all(reports.map((report) => this.emailService.execute(report)))
  }
}

export default ReportService
