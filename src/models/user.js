const mongoose = require("mongoose");
const { isEmail } = require("validator");
const PasswordValidator = require("password-validator");
const bcrypt = require("bcryptjs");

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

const User = mongoose.model("User", userSchema);

module.exports = User;
