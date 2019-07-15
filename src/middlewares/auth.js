const { secret } = require('../config/auth')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')

module.exports = async (req,res,next) =>
{
    const authHeader = req.headers.authorization

    if(!authHeader)
    {
        return res.status(401).json({ error: 'No token Provider' })
    }

    const parts = authHeader.split(' ')

    if(parts.length !== 2)
    {
        return res.status(401).json({ error: 'Token error' })
    }

    const [scheme, token] = parts

    if(scheme !== 'Bearer')
    {
        return res.status(401).json({ error: 'Token malformatted' })
    }

    try
    {
        const decoded = await promisify(jwt.verify)(token, secret)
        req.userId = decoded.id
        return next()
    }
    catch(error)
    {
        return res.status(401).json({ error: 'Token invalid' })
    }
}