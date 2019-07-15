const User = require('../models/user')

module.exports = 
{
    async update(req,res)
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
            
        }
    }
}