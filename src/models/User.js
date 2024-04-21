import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    email: {
        unique: true,
        type: String,
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
})
UserSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
const User = mongoose.model("User", UserSchema)
export default User