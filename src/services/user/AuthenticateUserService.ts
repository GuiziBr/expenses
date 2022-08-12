import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import authConfig from '../../config/auth'
import constants from '../../constants'
import { IUser } from '../../domains/user'
import AppError from '../../errors/AppError'
import User from '../../models/User'

interface Request {
  email: string,
  password: string
}

interface Response {
  user: Omit<User, 'password'>,
  token: string
}

class AuthenticateUserService {
  private parseSession({ id, name, email, avatar, created_at, updated_at }: IUser, token: string): Response {
    return { user: { id, name, email, avatar, created_at, updated_at }, token }
  }

  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User)
    const user = await usersRepository.findOne({ where: { email }})
    if (!user) throw new AppError(constants.errorMessages.incorrectLogin, 401)
    const passwordMatched = await compare(password, user.password)
    if (!passwordMatched) throw new AppError(constants.errorMessages.incorrectLogin, 401)
    const token = sign({}, authConfig.jwt.secret, { subject: user.id, expiresIn: authConfig.jwt.expiresIn })
    return this.parseSession(user, token)
  }
}

export default AuthenticateUserService
