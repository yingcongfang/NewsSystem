const mongoose = require('mongoose');
mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/news", {
    keepAlive: true,
    useCreateIndex: true,
    useNewUrlParser: true
})

module.exports.User = require("./user");