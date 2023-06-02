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

const login = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (error) {
        res.status(409).send({ error: error.message });
    }
};

module.exports = {
    signup,
    login,
};
