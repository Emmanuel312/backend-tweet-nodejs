const User = require('../models/user')
const sendMail = require('../services/mailer')

module.exports =
{
    async signin(req,res,next)
    {
        try
        {
            const { email,password } = req.body
            
            const user = await User.findOne({ email })
            if(!user)
            {
                return res.status(400).json({error: 'User not found'})
            }
            if(!await user.compareHash(password))
            {
                return res.status(400).json({error: 'Invalid password'})
            }
            return res.json({ user,token: user.generateToken() })
        }
        catch(err)
        {
            return next(err)
        }
    },
    async signup(req,res,next)
    {
        try
        {
            const { email,userName } = req.body
            if(await User.findOne({ $or: [{ email },{ userName }] }))
            {
                return res.status(400).json({ error: 'User already exists' })
            }
            const user = await User.create(req.body)
            console.log(user.email)
            sendMail({ from: 'Emmanuel Nery <efn@cin.ufpe.br>',
            to: user.email,
            subject: `Bem vindo ao RocketTwitter, ${user.name}`,
            template: 'auth/register',
            context:
            {
                name: user.name,
                username: user.userName
            }
            })
            return res.json({ user,token: user.generateToken() })
        }
        catch(err)
        {
            return next(err)
        }
    }

}