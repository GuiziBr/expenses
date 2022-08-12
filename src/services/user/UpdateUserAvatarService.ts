import fs from 'fs'
import path from 'path'
import { getRepository } from 'typeorm'
import uploadConfig from '../../config/upload'
import constants from '../../constants'
import { IUpdateAvatarRequest } from '../../domains/request'
import { IUser } from '../../domains/user'
import AppError from '../../errors/AppError'
import User from '../../models/User'

class UpdateUserAvatarService {
  private parseUser({ id, name, email, avatar, created_at, updated_at }: User): IUser {
    return { id, name, email, avatar, created_at, updated_at }
  }

  public async execute({ user_id, avatarFileName }: IUpdateAvatarRequest): Promise<IUser> {
    const usersRepository = getRepository(User)
    const user = await usersRepository.findOne(user_id)
    if (!user) throw new AppError(constants.errorMessages.changeAvatarNotAllowed, 401)
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)
      if (userAvatarFileExists) await fs.promises.unlink(userAvatarFilePath)
    }
    user.avatar = avatarFileName
    await usersRepository.save(user)
    return this.parseUser(user)
  }
}

export default UpdateUserAvatarService
