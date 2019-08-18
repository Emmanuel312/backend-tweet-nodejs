const User = require('../models/user')
const Tweet = require('../models/tweet')


module.exports = 
{
    async me(req,res,next)
    {
        try
        {
            const user = await User.findById(req.userId)
            const tweetsCount = await Tweet.find({ user: user.id }).count()
            
            return res.json({user,tweetsCount,followersCount: user.followers.length, followingCount: user.following.length })
            
        }
        catch(err)
        {
            return next(err)
        }
    },

    async feed(req,res,next)
    {
        try
        {
            const user = await User.findById(req.userId)
            const { following } = user
            const tweet = await Tweet.find({user: { $in: [user.id,...following ] }}).limit(50).sort('-createdAt')
            return res.json(tweet)
        }
        catch(err)
        {
            return next(err)
        }
    },


    async update(req,res,next)
    {
        try
        {
            const id = req.userId
            const { name,userName,password, confirmPassword } = req.body
            
            if(password && password !== confirmPassword)
            {
                return res.status(400).json({ error: 'Password doesn\'t match' })
            }

            const user = await User.findByIdAndUpdate(id,{ name, userName },{ new: true })

            if(password)
            {
                user.password = password
                await user.save()
            }
            return res.json(user)

        }
        catch(error)
        {
            return next()
        }
    }
}