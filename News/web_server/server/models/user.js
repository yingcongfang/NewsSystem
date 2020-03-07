const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, 
        required: true
    },
    password: {
        type: String, 
        required: true
    }
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch(err) {
        return next(err);
    }
};

// A pre hook
userSchema.pre('save',  async function (next) {
    try {
        if(!this.isModified("password")) {
            return next();
        }
        let salt = await bcrypt.genSalt();
        let hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        return next();
    } catch(err) {
        return next(err);
    }
});

module.exports = mongoose.model('User', userSchema);