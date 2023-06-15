const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },

            name: {
                type: String,
                required: true,
                trim: true,
            },

            price: {
                type: Number,
                required: true,
                min: 1,
            },

            rating: {
                type: Number,
                required: true,
            },

            image: {
                type: String,
                required: true,
            },
        },
    ],
});

const Favourite = mongoose.model("Favourite", favouriteSchema);

module.exports = Favourite;
