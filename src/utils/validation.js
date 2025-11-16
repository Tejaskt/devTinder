const validator = require('validator');


const validateSignUpData = (req) => {
    const { firstName, lastName, emailId , password } = req.body;

    if (!firstName || !lastName || !emailId || !password) {
        return { isValid: false, message: "All fields are required." };
    }
    else if (!validator.isEmail(emailId)) {
        return { isValid: false, message: "Invalid email format." };
    }

    else if (password.length < 6) {
        return { isValid: false, message: "Password must be at least 6 characters long." };
    }

    return { isValid: true };
}

const validateEditProfileData = (req) => {
    const allowedFields = ['firstName', 'lastName', 'photoUrl', 'gender', 'age', 'skills', 'about'];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field));

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}