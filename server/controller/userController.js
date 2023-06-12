const userService = require('../service/userService')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/apiError')
class UserController{
    async registration(req,res,next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Error in validation',errors.array()))
            }
            const {email,password,username} = req.body
            const userData = await userService.registration(email,password,username)
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)
        }catch (e) {

            next(e)
        }
    }
    async userBlock(req, res, next) {
       try {
           const {email,status} = req.body
           const userData = await userService.blockUser(email,status)
           return userData
        }catch (e) {
           next(e)
       }
    }
    async userUnblock(req, res, next) {
        try {
            const {email,status} = req.body
            const userData = await userService.blockUser(email,status)
            return userData
        }catch (e) {
            next(e)
        }
    }
    async login(req,res,next){
        try{
            const {email,password} = req.body
            const userData = await userService.login(email,password)
            await userService.lastLogin(email)
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }
    async delete(req, res, next){
        try{
            const {email} = req.body
            const userData = await userService.deleteUser(email)
            return userData
        }catch (e) {
            next(e)
        }
    }
    async logout(req,res,next){
        try{
            const {refreshToken}=req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        }catch (e) {
            next(e)
        }
    }
    async refresh(req,res,next){
        try{
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }
    async getUsers(req,res,next){
        try{
            const users = await userService.getAllUsers();
            return res.json(users);
        }catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()