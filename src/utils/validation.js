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

module.exports = {
    validateSignUpData
}