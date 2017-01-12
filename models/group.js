const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const Schema = mongoose.Schema;

let Group = new Schema({
    name: String,
    author: { type: Schema.ObjectId, ref: 'User', index: true, autopopulate: true },
    is_public: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    edited: Date
});

Group.plugin(autopopulate);

Group.method('toJSON', function () {
    let group = this.toObject();

    group.id = String(group._id);
    delete group._id;
    delete group.__v;

    group.author.id = String(group.author._id);
    delete group.author._id;
    delete group.author.password;
    delete group.author.__v;

    return group;
});

module.exports = mongoose.model('Group', Group);
