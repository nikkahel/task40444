const Router = require('express').Router
const userController = require('../controller/userController')
const router = new Router()
const {body} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 1, max: 36})
    ,userController.registration)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.post('/block',userController.userBlock)
router.post('/unblock',userController.userUnblock)
router.post('/delete',userController.delete)
router.get('/users',authMiddleware,userController.getUsers)
router.get('/refresh',userController.refresh)

module.exports = router