import { createService, findAllService, findByIdService, 
updateService } from '../services/user.service.js'
import mongoose from 'mongoose'

const create = async (req, res) => {
    try {
        const {
            name,
            username,
            email,
            password
        } = req.body
        if (!name || !username || !email || !password) {
            res.status(400).send({
                message: "submit all fields"
            })
        }
        const user = await createService(req.body)
        if (!user) {
            return res.status(400).send({
                message: "Error creating user"
            })
        }
        res.status(201).send({
            message: "user created successfully",
            user: {
                id: user._id,
                name,
                username,
                email,
            }
        })
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}
const findAll = async (req, res) => {
    try {
        const users = await findAllService()
        if (users.length === 0) {
            res.status(400).send({
                message: "nenhum usuario cadastrad"
            })
        }
        res.send(users)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}
const findById = async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch {
        res.status(500).send({
            message: err.message
        })
    }
}
const update = async (req, res) => {
    try {
        const {
            name,
            username,
            email,
            password
        } = req.body
        if (!name && !username && !email && !password) {
            res.status(400).send({
                message: 'submit at least one fields for update'
            })
        }
        const {
            id,
            user
        } = req
        await updateService(id, name, username, email, password, )
        res.send({
            message: "user update successfully"
        })
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}
export {
    create,
    findAll,
    findById,
    update
}