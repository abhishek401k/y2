import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import {
    findByIdService
} from '../services/user.service.js'
dotenv.config()
export const authMiddleware = (req, res, next) => {
    try {
        const {
            authorization
        } = req.headers
        if (!authorization) {
            res.send(401)
        }
        const parts = authorization.split(" ")
        const [schema, token] = parts
        if (parts.length !== 2) {
            res.send(401)
        }
        if (schema !== 'Bearer') {
            res.send(401)
        }
        jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
            if (error) {
                return res.status(401).send({
                    message: "invalid token"
                })
            }
            const user = await findByIdService(decoded.id)
            if (!user || !user.id) {
                return res.status(401).send({
                    message: "invalid token"
                })
            }
            req.userId = user._id
            return next()
        })
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}