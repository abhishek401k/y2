import mongoose from 'mongoose'
import { findByIdService } from '../services/user.service.js'

const validId = (req, res, next) => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({
                message: "invalid ID"
            })
        }
        next()
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const validUser = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await UserService.findByIdService(id)
        if (!user) {
            send.status(400).send({
                message: "user not found"
            })
        }
        req.id = id
        req.user = user
        next()
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export {
    validId,
    validUser
}