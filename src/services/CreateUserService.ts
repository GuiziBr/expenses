import { hash } from 'bcryptjs'
import { getRepository } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import User from '../models/User'

interface Request {
  name: string,
  email: string,
  password: string
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User)
    const userExists = await usersRepository.findOne({ where: { email }})
    if (userExists) throw new AppError(constants.errorMessages.emailInUse)
    const hashedPassword = await hash(password, 8)
    const user = usersRepository.create({ name, email, password: hashedPassword })
    await usersRepository.save(user)
    return user
  }
}

export default CreateUserService
