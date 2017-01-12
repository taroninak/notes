class Util {
    static hashPassword (password) {
        let hash = crypto.createHash('md5').update(password || '').digest('hex');
        return hash;
    }

    static getSpecifiedFields() {
        let args = [].slice.call(arguments);
        let self = args.splice(0,1)[0];
        if (Array.isArray(self)) {
            let arr = [];
            self.forEach(function (el) {
                let obj = {};

                [].filter.call(args, function (k) {
                    if (typeof k == 'function') {

                        obj[k.name] = k.call(el);
                    } else {
                        obj[k] = el[k];
                    }
                });

                arr.push(obj);
            });

            return arr;
        } else if (self) {
            let obj = {}, el = self;

            [].filter.call(args, function (k) {
                if (typeof k == 'function') {
                    obj[k.name] = k.call(el);
                } else {
                    obj[k] = el[k];
                }
            });

            return obj;
        }

        return self;
    }
}

module.exports = Util;
