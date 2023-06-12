// GET ALL USER CART ITEMS
const getAllUserCartItems = async (req, res) => {
    if (req.user.cart.length === 0) {
        res.send({
            error: "Cart is empty...",
        });

        return;
    }

    res.send({ cart: req.user.cart });
};

// ADD A NEW USER CART ITEM
const addUserCartItem = async (req, res) => {
    console.log(req.user);
};

module.exports = {
    getAllUserCartItems,
    addUserCartItem,
};
