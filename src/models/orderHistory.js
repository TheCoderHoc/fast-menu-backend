const mongoose = require("mongoose");

const orderHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    items: [
        
    ]
}, {timestamps: true})

const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema)

module.exports = OrderHistory