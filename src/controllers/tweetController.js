const Tweet = require('../models/tweet')

module.exports = 
{
    async create(req,res,next)
    {
        try
        {
            const tweet = await Tweet.create({ ...req.body,user: req.userId })
            return res.json(tweet)
            
        }
        catch(err)
        {
            next(err)
        }
    },

    async destroy(req,res,next)
    {
        try
        {
            const tweet = await Tweet.findByIdAndRemove(req.params.id)
            return res.json({ message : 'Tweet Deletado' })
        }
        catch(err)
        {
            next(err)
        }
    }
}