const path = require("path");
const express = require("express");
const multer = require("multer");
const user = require("../controllers/user");
const authMiddleware = require("../middleware/auth");

const router = new express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destFolder = path.join(__dirname, "../assets/avatars");

        cb(null, destFolder);
    },

    filename: function (req, file, cb) {
        const fileExtension = file.mimetype.split("/")[1];

        cb(null, `${req.user._id.toString()}-${Date.now()}.${fileExtension}`);
    },
});

const upload = multer({
    // RESTRICT AVATAR IMAGE FILE SIZE TO 2MB
    limits: {
        fileSize: 2000000,
    },

    // ONLY ACCEPT PNG JPEG AND PNG IMAGE FILE FORMATS
    fileFilter: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(new Error("Please upload an image file"));
            return;
        }

        callback(undefined, true);
    },

    storage: storage,
});

router.patch("/user", authMiddleware, user.updateUser);
router.get("/user/:id/avatar", user.getUserAvatar);
router.post(
    "/user/avatar",
    authMiddleware,
    upload.single("avatar"),
    user.addUserAvatar
);

module.exports = router;
