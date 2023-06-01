const User = require("../models/user");

const signup = async (req, res, next) => {
    try {
        const user = new User(req.body);

        await user.save();

        res.send({
            success:
                "You have successfully created an account. You can now login.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
};
