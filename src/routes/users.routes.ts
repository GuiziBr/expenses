import { Router } from 'express'
import multer from 'multer'
import { assembleUser } from '../assemblers/userAssembler'
import uploadConfig from '../config/upload'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateUser } from '../middlewares/validateInput'
import CreateUserService from '../services/CreateUserService'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'

const usersRouter = Router()
const upload = multer(uploadConfig)

usersRouter.post('/', validateUser, async (request, response) => {
  const { name, email, password } = request.body
  const createUser = new CreateUserService()
  const user = await createUser.execute({ name, email, password })
  return response.status(201).json({ name: user.name, email: user.email })
})

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
  const updateUserAvatar = new UpdateUserAvatarService()
  const user = await updateUserAvatar.execute({ user_id: request.user.id, avatarFileName: request.file.filename })
  return response.json(assembleUser(user))
})

export default usersRouter
