module.exports = class UserDto {
    email;
    id;
    lastLogin;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.lastLogin = model.lastLogin;
    }
}