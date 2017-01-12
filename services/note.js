const co = require('coroutinify');
const Note = require('../models/note');

class NoteService {
    constructor() {
        return co(this);
    }

    *listByGroup(group, offset=0, limit=20) {
        return Note.find({group}).skip(offset).limit(limit);
    }

    *listByUser(author, offset=0, limit=20) {
        return Note.find({author}).skip(offset).limit(limit);
    }

    *find(id) {
        let user = yield Note.findOne({_id: id});
        if(!user) throw new Error('Note not found!');
        return user;
    }

    *create (author, group, content_type, content) {
        if(!author) throw new Error('No author has been specified!');
        if(!group) throw new Error('No group has been specified!');
        return Note.create({ author, group, content_type, content });
    }

    *update(id, group, content_type, content) {
        let options = { group, content_type, content, edited: new Date() };
        Object.keys(options).forEach((key) => (typeof options[key] === 'undefined') && delete options[key]);
        return Note.findByIdAndUpdate(id, { $set: options}, { new: true });
    }

    *remove(id) {
        return Note.findOneAndRemove({_id:id});
    }

    *removeByGroup(group) {
        return Note.find({group}).remove();
    }

}

module.exports = new NoteService();
module.exports.NoteService = NoteService;
