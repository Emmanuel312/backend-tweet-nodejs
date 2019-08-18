const User = require('../models/user')

module.exports = 
{
    async create(req,res,next)
    {
        try
        {
            const user = await User.findById(req.params.id)
            if(!user)
            {
                return res.status(400).json({ err: 'User does not exist' })
            }

            if(user.followers.indexOf(req.userId) !== -1)
            {
                return res.status(400).json({ err: `You're already following ${ user.userName }` })
            }

            user.followers.push(req.userId)
            await user.save()

            const me = await User.findById(req.userId)
            me.following.push(user.id)
            await me.save()

            return res.json(me)
        }
        catch(err)
        {
            return next()    
        }
    },

    async destroy(req,res,next)
    {
        try
        {
            const user = await User.findById(req.params.id)
            if(!user)
            {
                return res.status(400).json({ err: 'User does not exist' })
            }
            
            const id = user.followers.indexOf(req.userId)
            if(id === -1)
            {
                return res.status(400).json({ err: `You're not following ${ user.userName }` })
            }

            user.followers.splice(id, 1)
            await user.save()

            const me = await User.findById(req.userId)
            me.following.splice(me.following.indexOf(user.id), 1)
            await me.save()

            return res.json(me)
        }
        catch(err)
        {
            return next()    
        }
    }
}