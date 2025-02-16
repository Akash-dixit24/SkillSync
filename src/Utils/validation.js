const validator = require("validator");

// Improved validation for sign-up data
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password, age } = req.body;
    const errors = [];

    // Validate first and last names
    if (!firstName || !lastName) {
        errors.push("First name and last name are required.");
    } else {
        if (!validator.isAlpha(firstName)) {
            errors.push("First name must contain only letters.");
        }
        if (!validator.isAlpha(lastName)) {
            errors.push("Last name must contain only letters.");
        }
    }

    // Validate email
    if (!emailId || !validator.isEmail(emailId)) {
        errors.push("Email ID is not valid.");
    }

    // Validate password strength (same rules as Mongoose schema)
    if (!password || !validator.isStrongPassword(password, { minLength: 6, minNumbers: 1, minUppercase: 1 })) {
        errors.push("Password must be at least 6 characters long and include one number and one uppercase letter.");
    }

    // Validate age
    if (age && (isNaN(age) || age < 18)) {
        errors.push("Age must be a valid number and at least 18.");
    }

    return errors;
};

// Validate profile data for allowed fields and correct values
const validateProfileEditData = (req) => {
    const allowEditFields = [
        "firstName",
        "lastName",
        "gender",
        "about",
        "skills",
        "photo",
        "age"
    ];

    const errors = [];
    const requestFields = Object.keys(req.body);

    // Check if all fields in the request are allowed for profile editing
    requestFields.forEach((field) => {
        if (!allowEditFields.includes(field)) {
            errors.push(`Field '${field}' is not allowed for editing.`);
        }

        // Additional checks for specific fields
        if (field === 'firstName' || field === 'lastName') {
            if (req.body[field] && !validator.isAlpha(req.body[field])) {
                errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must contain only letters.`);
            }
        }

        if (field === 'emailId' && req.body[field] && !validator.isEmail(req.body[field])) {
            errors.push("Email ID is not valid.");
        }

        if (field === 'age' && req.body[field] && (isNaN(req.body[field]) || req.body[field] < 18)) {
            errors.push("Age must be a valid number and at least 18.");
        }

        if (field === 'photo' && req.body[field] && !validator.isURL(req.body[field])) {
            errors.push("Invalid photo URL.");
        }
    });

    return errors;
};

module.exports = {
    validateSignUpData,
    validateProfileEditData
};
