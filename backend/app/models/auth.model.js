const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require("jsonwebtoken");
const crypto = require('crypto'); 

const userSchema = new mongoose.Schema({
    uuid: { 
        type: String, 
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    bio: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "https://static.productionready.io/images/smiley-cyrus.jpg"
    }
},
{
    timestamps: true
});

userSchema.plugin(uniqueValidator);

// Generar el uuid antes de validar el esquema
userSchema.pre('validate', async function (next) {
    if (!this.uuid) {
        console.log('Generando UUID...');
        this.uuid = crypto.randomUUID(); 
    }
    // console.log(this.uuid);
    next();
});

userSchema.methods.generateAccessToken = function() {
    const accessToken = jwt.sign({
            "user": {
                "id": this._id,
                "email": this.email,
                "password": this.password
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
    return accessToken;
}

userSchema.methods.toUserResponse = function() {
    return {
        uuid: this.uuid, 
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateAccessToken()
    }
};

userSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image
    };
};

module.exports = mongoose.model('User', userSchema);
