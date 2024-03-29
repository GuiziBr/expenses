import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '../config/upload'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateUser } from '../middlewares/validateInput'
import CreateUserService from '../services/user/CreateUserService'
import UpdateUserAvatarService from '../services/user/UpdateUserAvatarService'

const usersRouter = Router()
usersRouter.use(ensureAuthenticated)

const upload = multer(uploadConfig)

usersRouter.post('/', validateUser, async (request, response) => {
  const { name, email, password } = request.body
  const createUser = new CreateUserService()
  const user = await createUser.execute({ name, email, password })
  return response.status(201).json({ name: user.name, email: user.email })
})

usersRouter.patch('/avatar', upload.single('avatar'), async (request, response) => {
  const updateUserAvatar = new UpdateUserAvatarService()
  const user = await updateUserAvatar.execute({ user_id: request.user.id, avatarFileName: request.file.filename })
  return response.json(user)
})

export default usersRouter
