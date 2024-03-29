import { endOfMonth, format, getYear } from 'date-fns'
import { getCustomRepository, getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Expense from '../../models/Expense'
import StatementPeriod from '../../models/StatementPeriod'
import ExpensesRepository from '../../repositories/ExpensesRepository'

interface IBank {
  id: string
  name: string
  total: number
}

interface IPayment {
  id: string
  description: string
  banks: Array<IBank>
  total: number
}

interface ICategory {
  id: string
  description: string
  total: number
}

interface IReport {
  owner_id: string
  owner_name: string
  payments: Array<IPayment>
  categories: Array<ICategory>
  total: number
}

interface IOwner {
  id?: string
  name?: string
  payments?: Array<IPayment>
  categories?: Array<ICategory>
  total: number
}

interface IConsolidateResponse {
  requester: IOwner,
  partner?: IOwner,
  balance: number
}

class ConsolidateSharedExpensesService {
  private getBank(bank: { id: string, name: string }, amount: number): IBank {
    return { id: bank.id, name: bank.name, total: amount }
  }

  private getPayment(expense: Expense): IPayment {
    return {
      id: expense.payment_type_id,
      description: expense.payment_type.description,
      banks: [this.getBank(expense.bank, expense.amount)],
      total: expense.amount
    }
  }

  private getCategory(expense: Expense): ICategory {
    return {
      id: expense.category_id,
      description: expense.category.description,
      total: expense.amount
    }
  }

  private getStringDate(date: Date): string {
    return format(date, constants.dateFormat)
  }

  private assembleResponse(
    userId: string,
    requesterBalance: number,
    partnerBalance: number,
    requester?: IReport,
    partner?: IReport
  ): IConsolidateResponse {
    return {
      requester: {
        id: requester?.owner_id || userId,
        name: requester?.owner_name,
        payments: requester?.payments || [],
        categories: requester?.categories || [],
        total: requesterBalance
      },
      ...partner?.owner_id && {
        partner: {
          id: partner.owner_id,
          name: partner.owner_name,
          payments: partner?.payments,
          categories: partner?.categories || [],
          total: partnerBalance
        }
      },
      balance: requesterBalance - partnerBalance
    }
  }

  public async consolidate(userId: string, month: number, year: number): Promise<IConsolidateResponse> {
    const statementPeriodRepository = getRepository(StatementPeriod)
    const statementPeriods = await statementPeriodRepository.find()
    if (statementPeriods.length === 0) throw new AppError(constants.errorMessages.statementPeriodToConsolidate)

    const initialDate = new Date(year, month, 1)

    const initialDateString = this.getStringDate(initialDate)
    const finalDateString = this.getStringDate(endOfMonth(initialDate))

    const expensesRepository = getCustomRepository(ExpensesRepository)
    const expenses = await expensesRepository.createQueryBuilder('exp')
      .innerJoinAndSelect('exp.owner', 'user')
      .innerJoinAndSelect('exp.payment_type', 'pt')
      .innerJoinAndSelect('exp.bank', 'bank')
      .innerJoinAndSelect('exp.category', 'category')
      .where('exp.personal = false')
      .andWhere('pt.deleted_at is null')
      .andWhere(`(exp.due_date between '${initialDateString}' AND '${finalDateString}')`)
      .getMany()

    const consolidatedReport = expenses.reduce((acc, expense) => {
      const ownerIndex = acc.findIndex(({ owner_id }) => owner_id === expense.owner_id)
      if (ownerIndex >= 0) {
        const owner = acc[ownerIndex]

        const paymentTypeIndex = owner.payments?.findIndex(({ id }) => id === expense.payment_type_id)
        if (paymentTypeIndex >= 0) {
          const bankIndex = owner.payments[paymentTypeIndex].banks.findIndex((bank) => bank.id === expense.bank_id)
          if (bankIndex >= 0) {
            owner.payments[paymentTypeIndex].banks[bankIndex].total += expense.amount
          } else {
            owner.payments[paymentTypeIndex].banks.push(this.getBank(expense.bank, expense.amount))
          }
          owner.payments[paymentTypeIndex].total += expense.amount
        } else {
          owner.payments.push(this.getPayment(expense))
        }

        const categoryIndex = owner.categories?.findIndex(({ id }) => id === expense.category_id)
        if (categoryIndex >= 0) {
          owner.categories[categoryIndex].total += expense.amount
        } else {
          owner.categories.push(this.getCategory(expense))
        }

        owner.total += expense.amount
      } else {
        acc.push({
          owner_id: expense.owner_id,
          owner_name: expense.owner.name,
          payments: [this.getPayment(expense)],
          categories: [this.getCategory(expense)],
          total: expense.amount
        })
      }
      return acc
    }, [] as Array<IReport>)

    const requester = consolidatedReport.find(({ owner_id }) => owner_id === userId)
    const requesterBalance = requester ? requester.total : 0

    const partner = consolidatedReport.find(({ owner_id }) => owner_id !== userId)
    const partnerBalance = partner ? partner.total : 0

    return this.assembleResponse(userId, requesterBalance, partnerBalance, requester, partner)
  }
}

export default ConsolidateSharedExpensesService
