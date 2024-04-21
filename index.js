import express from 'express'
import dotenv from 'dotenv'
import userRouter from './src/routes/user.route.js'
import authRouter from './src/routes/auth.route.js'
import newsRouter from './src/routes/news.route.js'
import connectDatabase from './src/database/db.js'

dotenv.config()
connectDatabase()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/user', userRouter)
app.use('/news', newsRouter)
app.use('/auth', authRouter)

app.listen(port, () => console.log('server runing on port: ' + port))