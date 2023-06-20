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

const login = async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.generateAuthToken();

        const userObject = user.getPublicProfile();

        res.send({ userObject, token });
    } catch (error) {
        res.status(409).send({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.token = undefined;

        await user.save();

        res.status(200).send({});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    signup,
    login,
    logout,
};
