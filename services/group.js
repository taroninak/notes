const co = require('coroutinify');
const errors = require('common-errors');
const Group = require('../models/group');

class GroupService {
    constructor() {
        return co(this);
    }

    *list(author, offset=0, limit=20) {
        return Group.find({author}).skip(offset).limit(limit);
    }

    *find(id) {
        let user = yield Group.findOne({_id: id});
        if(!user) throw new Error('Group not found!');
        return user;
    }

    *create (author, name='', is_public=false) {
        if(!author) throw new Error('No author has been specified!');
        return Group.create({ author, name, is_public });
    }

    *update(id, name, is_public) {
        let options = { name, is_public, edited: new Date() };
        Object.keys(options).forEach((key) => (typeof options[key] === 'undefined') && delete options[key]);
        return Group.findByIdAndUpdate(id, { $set: options}, { new: true });
    }

    *remove(id) {
        return Group.findOneAndRemove({_id:id});
    }

    *removeByAuthor(author) {
        let groups = yield Group.find({author}).remove();
        console.log(groups);
        return groups;
    }

}

module.exports = new GroupService();
module.exports.GroupService = GroupService;
