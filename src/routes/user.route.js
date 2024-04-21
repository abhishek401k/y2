import { Router } from 'express'
import { create, findAll, findById, update } from '../controllers/user.controller.js'
import { validId, validUser } from '../middlewares/global.middlewares.js'

const userRouter = Router()

userRouter.post('/', create)
userRouter.get('/', findAll)
userRouter.get('/:id', validId, validUser, findById)
userRouter.patch('/:id', validId, validUser, update)

export default userRouter