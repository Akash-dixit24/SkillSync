const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
        trim: true,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error("First name must contain only letters.");
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
        trim: true,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error("Last name must contain only letters.");
            }
        }
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator(value) {
                return validator.isEmail(value);
            },
            message: "Enter a valid email ID."
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate(value) {
            if (!validator.isStrongPassword(value, { minLength: 6, minNumbers: 1, minUppercase: 1 })) {
                throw new Error("Password must be at least 6 characters long and include one number and one uppercase letter.");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        validate(value) {
            if (!Number.isInteger(value) || value < 18) {
                throw new Error("Age must be a valid number and at least 18.");
            }
        }
    },
    gender: {
        type: String,
        validate(value) {
            if (value && !["male", "female", "other"].includes(value.toLowerCase())) {
                throw new Error("Gender data is not valid. Choose 'male', 'female', or 'other'.");
            }
        }
    },
    photo: {
        type: String,
        default: function() {
            // Check gender and assign photo accordingly
            if (this.gender === 'female') {
                return "https://img.freepik.com/premium-photo/female-developer-background_665280-9650.jpg?w=900"; 
            } else if (this.gender === 'male') {
                return "https://img.freepik.com/premium-photo/happy-3d-cartoon-man-using-laptop-siting-transparent-white-background_973886-152.jpg?w=900"; 
            } else {
                return "https://example.com/default-photo.jpg"; 
            }
        },
        validate(value) {
            if (value && !validator.isURL(value)) {
                throw new Error("Invalid photo URL.");
            }
        }
    },
    about: {
        type: String,
        default: "The default description of user"
    },
    skills: {
        type:  [],
        default:["c++" , "java" , "python"],
        validate(value) {
            if (!Array.isArray(value)) {
                throw new Error("Skills should be an array of strings.");
            }
        }
    }
}, {
    timestamps: true,
});

userSchema.pre('save', async function(next) {
    const user = this;

    // Only check for duplicates if the email is being changed
    if (user.isModified('emailId')) {
        const existingUser = await mongoose.models.User.findOne({ emailId: user.emailId });
        if (existingUser) {
            throw new Error('Email ID is already in use.');
        }
    }

    next();
});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user.id }, "DEV@TINDER$790", {
        expiresIn: "7d"
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;



