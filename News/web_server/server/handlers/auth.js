const db = require("../models");
const jwt = require("jsonwebtoken");
const validator = require('validator');

exports.login = async function(req, res, next) {
    //Finding a user
    try {
        const validationResult = validateLoginForm(req.body);
        if (!validationResult.success) {
            console.log('validationResult failed');
            return res.status(400).json({
                success: false,
                message: validationResult.message,
                errors: validationResult.errors
            });
        }
        let user = await db.User.findOne({
            email: req.body.email
        });
        let { id } = user
        let isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {
            let token = jwt.sign({
                id
            }, process.env.SECRET_KEY);
            return res.status(200).json({
                id,
                token,
                message: 'You have successfully logged in!'
            });
        } else {
            return res.status(409).json({
                success: false,
                message: 'Check the form for errors.',
                errors: {
                    password: 'Invalid email or password.'
                }
            });
        }
    } catch(err) {
        return next({
            status: 400,
            message: err.message,
        })
    }
    //Checking if their password matches what was sent to the server
    // if it all matches
    // log them in
};

exports.signup = async function(req, res, next) {
    try {
        const validationResult = validateSignupForm(req.body);
        if (!validationResult.success) {
            console.log('validationResult failed');
            return res.status(400).json({
                success: false,
                message: validationResult.message,
                errors: validationResult.errors
            });
        }
        let user = await db.User.create(req.body);
        let { id } = user;
        let token = jwt.sign(
            {
                id
            }, 
            process.env.SECRET_KEY
        );
        return res.status(200).json({
            id,
            token,
            message: 'You have successfully signed up!'
        });
    } catch(err) {
        if(err.code === 11000) {
            err.message = "Sorry, that email is already token";
            return res.status(409).json({
                success: false,
                message: 'Check the form for errors.',
                errors: {
                    email: 'This email is already taken.'
                }
            });
        }
        return next({
            status: 400,
            message: err.message,
        })
    }
};

function validateSignupForm(payload) {
    console.log(payload);
    const errors = {};
    let isFormValid = true;
    let message = '';
    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Please provide a correct email address.';
    }
    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Password must have at least 8 characters.';
    }
    if (!isFormValid) {
        message = 'Check the form for errors.';
    }
    return {
        success: isFormValid,
        message,
        errors
    };
}

function validateLoginForm(payload) {
    console.log(payload);
    const errors = {};
    let isFormValid = true;
    let message = '';
    if (!payload || typeof payload.email !== 'string' || payload.email.trim().
        length === 0) {
        isFormValid = false;
        errors.email = 'Please provide your email address.';
    }
    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password.';
    }
    if (!isFormValid) {
        message = 'Check the form for errors.';
    }
    return {
        success: isFormValid,
        message,
        errors
    };
}