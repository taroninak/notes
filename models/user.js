const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let User = new Schema({
    name: { type: String, index: true },
    username: { type: String, index: true, unique: true },
    email: { type: String, index: true, unique: true, sparse: true },
    password: { type: String, index: true, sparse: true },
    created: { type: Date, default: Date.now },
    edited: Date
});

User.method('toJSON', function () {
    let user = this.toObject();
    user.id = String(user._id);
    delete user._id;
    delete user.password;
    delete user.__v;
    return user;
});

module.exports = mongoose.model('User', User);
