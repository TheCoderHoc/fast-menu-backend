const mongoose = require("mongoose");
const { isEmail } = require("validator");
const PasswordValidator = require("password-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: [true, "Please enter your full name above."],
        },

        email: {
            type: String,
            trim: true,
            required: [true, "Please enter your email address above."],
            lowercase: true,
            unique: [
                true,
                "Email has already been registered with another account.",
            ],
            validate(value) {
                if (!isEmail(value)) {
                    throw new Error("Please enter a valid email address.");
                }
            },
        },

        password: {
            type: String,
            trim: true,
            required: [true, "Please enter your password above."],
            minlength: [6, "Password must be a minimum of 6 characters."],
            validate(value) {
                const schema = new PasswordValidator();

                schema
                    .has()
                    .lowercase()
                    .uppercase()
                    .has()
                    .digits(1)
                    .has()
                    .symbols(1)
                    .is()
                    .min(6)
                    .has()
                    .not()
                    .spaces();

                if (!schema.validate(value)) {
                    throw new Error(
                        "Password must contain a lowercase, uppercase, at least one digit and a symbol, and should not coontain space."
                    );
                }
            },
        },

        phone: {
            type: String,
            validate(value) {
                if (value.length !== 11) {
                    throw new Error("Please enter a valid phone number.");
                }
            },
        },

        subscriptionPlan: {
            type: String,
            default: "Basic",
        },

        address: {
            country: {
                type: String,
                trim: true,
            },

            state: {
                type: String,
                trim: true,
            },

            city: {
                type: String,
                trim: true,
            },

            street: {
                type: String,
                trim: true,
            },

            postalCode: {
                type: Number,
                trim: true,
            },
        },

        role: {
            type: String,
            default: "user",
        },

        avatar: {
            type: String,
        },

        token: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Please enter your credentials correctly.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Please enter your credentials correctly.");
    }

    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET
    );

    user.token = token;

    await user.save();

    return token;
};

userSchema.methods.getPublicProfile = function () {
    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.token;

    return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
