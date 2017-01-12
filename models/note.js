const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const Schema = mongoose.Schema;

let Note = new Schema({
    author: { type: Schema.ObjectId, ref: 'User', index: true, autopopulate: true },
    group: { type: Schema.ObjectId, ref: 'Group', index: true, autopopulate: true },
    content_type: { type: String, default: 'text/plain' },
    content: { type: String, default: '' },
    created: { type: Date, default: Date.now },
    edited: Date
});

Note.plugin(autopopulate);

Note.method('toJSON', function () {
    let note = this.toObject();

    note.id = String(note._id);
    delete note._id;
    delete note.__v;

    note.author.id = String(note.author._id);
    delete note.author._id;
    delete note.author.password;
    delete note.author.__v;

    note.group.id = String(note.group._id);
    delete note.group._id;
    delete note.group.__v;
    delete note.group.author;

    return note;
});

module.exports = mongoose.model('Note', Note);
