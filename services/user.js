const co = require('coroutinify');
const errors = require('common-errors');
const utilService = require('../services/util');
const User = require('../models/user');

class UserService {
    constructor() {
        return co(this);
    }

    *authorize(id, password) {
        return User.findOne({_id: id, password: utilService.hashPassword(password)});
    }

    *list(offset=0, limit=20) {
        return User.find().skip(offset).limit(limit);
    }

    *find(id) {
        let user = yield User.findOne({_id: id});
        if(!user) throw new Error('User not found!');
        return user;
    }

    *create(username, name, password, email) {
        return User.create({
            username,
            name,
            email,
            password: utilService.hashPassword(password)
        });
    }

    *update(id, username, name, email) {
        let options = { username, name, email, edited: new Date() };
        Object.keys(options).forEach((key) => (typeof options[key] === 'undefined') && delete options[key]);
        return User.findByIdAndUpdate(id, { $set: options}, { new: true });
    }

    *remove(id) {
        let user = yield User.findOneAndRemove({_id:id});
        if(user && user.groups && user.groups.length)  {
            let group = yield groupService.removeByAuthor(user._id);
        }
        return user;
    }
}

module.exports = new UserService();
module.exports.UserService = UserService;
