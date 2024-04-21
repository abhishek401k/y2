import { Router } from 'express'
import { validId } from '../middlewares/global.middlewares.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import {
    create,
    findAll,
    topNews,
    findById,
    searchByTitle,
    byUser,
    update,
    erase,
    likeNews,
    addComment,
    deleteComment
} from '../controllers/news.controller.js'

const newsRouter = Router()

newsRouter.post('/', authMiddleware, create)
newsRouter.get('/', findAll)
newsRouter.get('/top', topNews)
newsRouter.get('/search', searchByTitle)
newsRouter.get('/byUser', authMiddleware, byUser)
newsRouter.get('/:id', authMiddleware, findById)
newsRouter.patch('/:id', authMiddleware, update)
newsRouter.delete('/:id', authMiddleware, erase)
newsRouter.patch('/like/:id', authMiddleware, likeNews)
newsRouter.patch('/comment/:id', authMiddleware, addComment)
newsRouter.patch('/comment/:idNews/:idComment', authMiddleware, deleteComment)

export default newsRouter