
const UserModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const tokenService= require('./tokenService')
const UserDto = require('../dto/userDto');
const ApiError = require('../exceptions/apiError')
class UserService {
    async registration(email, password, username, date = new Date().toISOString(), lastLogin = new Date().toISOString(), status = 'active') {
        const candidate = await UserModel.findOne({email})
        if (candidate) throw ApiError.BadRequest(`This email ${email} is already in use`)
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({email, password: hashPassword, username, date, lastLogin, status})
        const userDto = await new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async login(email, password,) {
        const user = await UserModel.findOne({email})
        if (!user) throw ApiError.BadRequest('User not found')
        if(user.status === 'blocked') throw ApiError.UnauthorizedError()
        const isPasswordEqual = await bcrypt.compare(password, user.password)
        if (!isPasswordEqual) throw ApiError.BadRequest('Incorrect password')
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto,}
    }
   async  deleteUser(email) {
        const user = await UserModel.findOne({email})
       const userDto = new UserDto(user)
       const userData = UserModel.deleteOne(userDto.id)
       return userData

    }

    async lastLogin(email, lastLogin = new Date().toISOString()) {
        await UserModel.findOneAndUpdate({email: email, lastLogin: lastLogin})
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token
    }
    async blockUser(email,status){
        await UserModel.findOneAndUpdate({email: email, status: status})
    }
    async unblockUser(email,status){
        await UserModel.findOneAndUpdate({email: email, status: status})
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError()
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}
module.exports = new UserService()