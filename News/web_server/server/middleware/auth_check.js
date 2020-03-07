require("dotenv").config();
const jwt = require('jsonwebtoken');
const db = require("../models");

exports.loginRequired = function(req, res, next) {
    console.log('auth_checker: req: ' + req.headers);
    if (!req.headers.authorization) {
        return res.status(401).end();
    }
    // get the last part from a authorization header string like "bearer token-value"
    const token = req.headers.authorization.split(' ')[1];
    console.log('auth_checker: token: ' + token);
    // decode the token using a secret key-phrase
    return jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        // the 401 code is for unauthorized status
        if (err) { 
            return res.status(401).end(); 
        }
        const email = decoded.id;
        // check if a user exists
        return db.User.findById(email, (userErr, user) => {
            if (userErr || !user) {
                return res.status(401).end();
            }
            return next();
        });
    });
}