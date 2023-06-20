const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        products: [
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

                image: {
                    type: String,
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

cartSchema.virtual("totalQuantity").get(function () {
    const allQuantity = this.products.map((product) => product?.quantity);

    if (allQuantity.length > 0) {
        const totalPrice = allQuantity.reduce(
            (accumulator, currValue) => accumulator + currValue
        );
        return totalPrice;
    }

    return [];
});

cartSchema.virtual("totalPrice").get(function () {
    const cartItemsPrices = this.products.map(
        (product) => product.quantity * product.price
    );
    if (cartItemsPrices.length > 0) {
        const totalPrice = Math.round(
            cartItemsPrices.reduce(
                (accumulator, currValue) => accumulator + currValue
            )
        );

        return totalPrice;
    }

    return [];
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
