const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/auth')

const UserSchema = new mongoose.Schema(
{
    name:
    {
        type: String,
        required: true
    },
    userName:
    {
        type: String,
        required: true,
        unique: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password:
    {
        type: String,
        required: true,
        //select: false,
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    createdAt:
    {
        type: Date,
        default: Date.now
    },
})

// hooks pre/post
UserSchema.pre('save', async function(next)
{
    if(!this.isModified('password')) next()
    this.password = await bcryptjs.hash(this.password, 8)
})

UserSchema.methods = 
{
    compareHash(password)
    {
        return bcryptjs.compare(password,this.password)
    },
    generateToken()
    {
        return jwt.sign({id: this._id}, secret,{ expiresIn: 86400 })
    }
}

module.exports = mongoose.model('User', UserSchema)