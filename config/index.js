module.exports = {
    PORT: process.env.PORT || 3000,
    IP: process.env.IP || "0.0.0.0",
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1/NOTES",
    IS_PRODUCTION: process.env.NODE_ENV == 'production'
}
