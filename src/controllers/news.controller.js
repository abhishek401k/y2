import mongoose from 'mongoose'
import {
    createService,
    findAllService,
    countNews,
    topNewsService,
    findByIdService,
    searchByTitleService,
    byUserService,
    updateService,
    eraseService,
    likeNewsService,
    deliteLikeNewsService,
    addCommentService,
    deleteCommentService
} from '../services/news.service.js'

export const create = async (req, res) => {
    try {
        const {
            title,
            text
        } = req.body
        if (!title || !text) {
            res.status(400).send({
                message: "submit all fields"
            })
        }
        const news = await createService({
            title,
            text,
            user: req.userId
        })
        if (!news) {
            return res.status(400).send({
                message: "Error creating news"
            })
        }
        res.status(201).send({
            message: "news created successfully",
            news: {
                id: news._id,
                title,
                text
            }
        })
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const findAll = async (req, res) => {
    try {
        let {
            limit,
            offset
        } = req.query
        limit = Number(limit)
        offset = Number(offset)
        if (!limit) {
            limit = 5
        }
        if (!offset) {
            offset = 0
        }
        const news = await findAllService(limit, offset)
        const total = await countNews()
        const currentUrl = req.baseUrl
        const next = offset + limit
        const nextUrl = next < total ? '${currentUrl}?limit=${limit}&offset=${next}' : null
        const previous = offset - limit < 0 ? null : offset - limit
        const previousUrl = previous != null ? '${currentUrl}?limit=${limit}&offset=${previous}' : null
        if (news.length === 0) {
            return res.status(400).send({
                message: "nenhuma news cadastrada"
            })
        }
        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username
            })),
        })
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const topNews = async (req, res) => {
    try{
        const news = await topNewsService()

        if (!news) {
            res.status(400).send({ message: "There id no regitered post" })
        }

        return res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username 
            }
        })
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const findById = async (req, res) => {
    try{
        const { id } = req.params
        const news = await findByIdService(id)

        if (!news) {
            res.status(400).send({ message: "There id no regitered post" })
        }

        return res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username 
            }
        })

    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const searchByTitle = async (req, res) => {
    try{
        const {title} = req.query

        const news = await searchByTitleService(title)

        if (news.length === 0) {
            return res.status(400).send({ message: "There are no news with this title" })
        }

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username
            }))
        })

    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const byUser = async (req, res) => {
    try{
        const id = req.userId
        const news = await byUserService(id)

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username
            }))
        })

    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const update = async (req, res) => {
    try{
        const { title, text } = req.body
        const { id } = req.params

        if (!title && !text) {
            return res.status(400).send({
                message: "submit fields"
            })
        }

        const news = await findByIdService(id) 

        if (String(news.user._id) !== String(req.userId)) {
            res.status(400).send({ message: "you didn't update this post" })
        }

        await updateService(id, title, text)

        return res.status(201).send({ message: "post updated successfully" })
        
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const erase = async (req, res) => {
    try{    
        const { id } = req.params

        const news = await findByIdService(id) 

        if (String(news.user._id) !== String(req.userId)) {
            res.status(400).send({ message: "you didn't update this post" })
        }

        await eraseService(id)
        return res.status(201).send({ message: "news deleted successfully" })

    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const likeNews = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId

        const newsLiked = await likeNewsService(id, userId)

        if (!newsLiked) {
            await deliteLikeNewsService(id, userId)
            return res.status(200).send({ message: "like successfully removed" })
        }
        res.send({ message: "like doe successfully" })

    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const addComment = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId
        const { comment } = req.body

        if (!comment) {
            return res.status(400).send({ message: "write a message to comment" })
        }

        await addCommentService(id, comment, userId)

        res.send({ message: "comment successfully completed" })

    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { idNews, idComment } = req.params
        const userId = req.userId

        const commentDeleted = await deleteCommentService(idNews, idComment, userId)

        const commentFinder = commentDeleted.comments.find(
            (comment) => comment.idComment === idComment
        )

        if (!commentFinder) {
            return res.status(400).send({ message: "comment not found" })
        }

        if (String(commentFinder.userId) !== String(userId)) {
            return res.status(400).send({ message: "you can't delete this comment" })
        }

        res.send({ message: "comment successfully removed" })

    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}