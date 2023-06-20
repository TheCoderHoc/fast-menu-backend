const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const User = require("../models/user");

const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { ...req.body },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        res.send({ updatedUser });
    } catch (error) {
        next(error);
    }
};

const addUserAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error("Please provide a profile picture.");
        }

        // PATH TO SAVE THE IMAGE WHEN SHARP IS DONE
        const imagePath =
            path.join(__dirname, "../assets/avatars") +
            `/${req.user._id.toString()}.png`;

        // RESISE THE IMAGE AND SAVE TO THE SPECIFIED DIRECTORY
        await sharp(req.file.path)
            .resize({ width: 300, height: 300 })
            .toFile(imagePath);

        // DELETE THE ORIGINAL UPLOADED IMAGE
        fs.unlinkSync(req.file.path);

        // SAVE THE IMAGE PATH TO DATABASE
        req.user.avatar = imagePath;
        await req.user.save();

        res.send({ user: req.user });
    } catch (error) {
        next(error);
    }
};

const getUserAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // IF THE USER DOES NOT HAVE A CUSTOM AVATAR IMAGE
        if (!user.avatar) {
            // GET THE PATH TO THE DEFAULT AVATAR IMAGE
            const defaultAvatar = path.join(__dirname, "../assets/avatar.png");

            // SEND BACK THE DEFAULT AVATAR IMAGE
            res.sendFile(defaultAvatar);

            return;
        }

        // IF THE USER HAS A CUSTOM AVATAR IMAGE UPLOADED, SEND IT TO THE CLIENT
        res.sendFile(user.avatar);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    updateUser,
    addUserAvatar,
    getUserAvatar,
};
