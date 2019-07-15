const express = require('express')
const router = express.Router()
const requireDir = require('require-dir')
const controllers = requireDir('./controllers')
const authMiddleware = require('./middlewares/auth')

router.post('/signup', controllers.authController.signup)
router.post('/signin', controllers.authController.signin)

router.use(authMiddleware)
// todas as rotas abaixo vao passar pelo authMiddleware

// Users
router.put('/users',controllers.userController.update)


// Tweets
router.post('/tweets', controllers.tweetController.create)
router.delete('/tweets/:id', controllers.tweetController.destroy)

// Like
router.post('/like/:id', controllers.likeController.toggle)

module.exports = router