const co = require('coroutinify');
const errors = require('common-errors');
const utilService = require('../services/util');
const userService = require('../services/user');
const groupService = require('../services/group');
const noteService = require('../services/note');

const ph = (promise) => {
    return (req, res, next) => {
        promise(req, res, next).then(data => {
            let fields = req.query.fields ? req.query.fields.split(',') : [];
            (fields.length) ? res.json(utilService.getSpecifiedFields(data, ...fields)) : res.json(data);
        }).catch(err => {
            let httpError = new errors.HttpStatusError(err);
            res.status(httpError.status).json({ message: httpError.message });
        });
    }
}

class ApiController {
    constructor() {
        return co(this);
    }

    handle(app) {
        app.get('/api', this.getApiStatus);

        /**
         * User related
         */
        app.get('/api/users', ph(this.listUsers));
        app.get('/api/users/:id([\\da-fA-F]+)', ph(this.getUser));
        app.post('/api/users', ph(this.postUser));
        app.put('/api/users/:id([\\da-fA-F]+)', ph(this.putUser));
        app.delete('/api/users/:id([\\da-fA-F]+)', ph(this.deleteUser));
        app.get('/api/users/:id([\\da-fA-F]+)/groups', ph(this.getUserGroups));
        app.get('/api/users/:id([\\da-fA-F]+)/notes', ph(this.getUserNotes));

        /**
         * Group related
         */
        app.get('/api/groups/:id([\\da-fA-F]+)', ph(this.getGroup));
        app.post('/api/groups', ph(this.postGroup));
        app.put('/api/groups/:id([\\da-fA-F]+)', ph(this.putGroup));
        app.delete('/api/groups/:id([\\da-fA-F]+)', ph(this.deleteGroup));
        app.get('/api/groups/:id([\\da-fA-F]+)/notes', ph(this.getGroupNotes));

        /**
         * Note related
         */
        app.get('/api/notes/:id([\\da-fA-F]+)', ph(this.getNote));
        app.post('/api/notes', ph(this.postNote));
        app.put('/api/notes/:id([\\da-fA-F]+)', ph(this.putNote));
        app.delete('/api/notes/:id([\\da-fA-F]+)', ph(this.deleteNote));
    }

    getApiStatus(req, res, next) {
        res.send('Api is OK!');
    }

    /**
     * User related
     */
    *listUsers(req, res, next) {
        let {offset=0, limit=20} = req.query;
        return userService.list(parseInt(offset), parseInt(limit));
    }

    *getUser(req, res, next) {
        return userService.find(req.params.id);
    }

    *postUser(req, res, next) {
        let {username, name, password, email} = req.body;
        return userService.create(username, name, password, email);
    }

    *putUser(req, res, next) {
        let {username, name, email} = req.body;
        return userService.update(req.params.id, username, name, email);
    }

    *deleteUser(req, res, next) {
        return userService.remove(req.params.id);
    }

    *getUserNotes(req, res, next) {
        let {offset=0, limit=20} = req.query;
        return noteService.listByUser(req.params.id, parseInt(offset), parseInt(limit));
    }

    *getUserGroups(req, res, next) {
        let {offset=0, limit=20} = req.query;
        return groupService.list(req.params.id, parseInt(offset), parseInt(limit));
    }

    /**
     * Group related
     */
    *getGroup(req, res, next) {
        return groupService.find(req.params.id);
    }

    *postGroup(req, res, next) {
        let {author, name, is_public} = req.body;
        return groupService.create(author, name, is_public);
    }

    *putGroup(req, res, next) {
        let {name, is_public} = req.body;
        return groupService.update(req.params.id, name, is_public);
    }

    *deleteGroup(req, res, next) {
        return groupService.remove(req.params.id);
    }

    *getGroupNotes(req, res, next) {
        let {offset=0, limit=20} = req.query;
        return noteService.listByGroup(req.params.id, parseInt(offset), parseInt(limit));
    }

    /**
     * Note related
     */
    *getNote(req, res, next) {
        return noteService.find(req.params.id);
    }

    *postNote(req, res, next) {
        let {author, group, content_type, content} = req.body;
        return noteService.create(author, group, content_type, content);
    }

    *putNote(req, res, next) {
        let {group, content_type, content} = req.body;
        return noteService.update(req.params.id, group, content_type, content);
    }

    *deleteNote(req, res, next) {
        return noteService.remove(req.params.id);
    }
}

module.exports = new ApiController();
module.exports.ApiController = ApiController;
