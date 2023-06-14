const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

// GET ALL USER CART ITEMS
const getCartProducts = async (req, res) => {
    try {
        // RETRIEVE THE USER ID FROM THE AUTH MIDDLEWARE
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId })
            .populate("products")
            .exec();

        res.send({ cart: cart.toJSON({ virtuals: true }) });
        // res.send({ cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// ADD A NEW USER CART ITEM
const addProductToCart = async (req, res) => {
    try {
        // RETRIEVE THE USER ID FROM THE AUTH MIDDLEWARE
        const userId = req.user._id;

        // RETRIEVE THE ID AND QUANTITY OF THE PRODUCT TO ADD TO THE USER CART
        const { productId } = req.body;

        // FIND THE PRODUCT WHOSE ID WAS SENT WITH THE INTENTION OF ADDING TO CART
        const product = await Product.findById({ _id: productId });

        if (!product) {
            res.send({
                error: "Product was not found. Please try again later!",
            });
            return;
        }

        // FETCH THE CART DOCUMENT THAT HAS THE USER ID
        const cart = await Cart.findOne({ user: userId });

        // IF THE USER ALREADY HAS A CART
        if (cart) {
            // RETRIEVE THE PRODUCT FROM THE PRODUCTS ARRAY WHICH IS A LIST OF PRODUCTS IN THE USER CART
            const productInCart = cart.products.find(
                (cartProduct) =>
                    cartProduct._id.toString() === product._id.toString()
            );

            // IF THE PRODUCT EXISTS IN THE USER CART ALREADY, INCREMENT THE QUANTITY BY ONE
            if (productInCart) {
                productInCart.quantity += 1;
            }

            // IF THE PRODUCT DOES NOT EXIST IN THE USER CART, ADD THE PRODUCT TO THE CART
            else {
                cart.products = [...cart.products, { ...product, quantity: 1 }];
            }

            // SAVE THE EXISTING CART TO THE DATABASE
            await cart.save();

            // res.send(cart.toJSON({ virtuals: true }));
            res.send({ cart: cart.toJSON({ virtuals: true }) });
        }
        // IF THE USER DOES NOT HAVE A CART
        else {
            // CREATE A NEW CART DOCUMENT FOR THE USER AND ADD THE PRODUCT
            const newCart = new Cart({
                user: userId,
                products: [{ ...product, quantity: 1 }],
            });

            // SAVE THE NEW CART TO THE DATABASE
            await newCart.save();

            res.send({ cart: cart.toJSON({ virtuals: true }) });

            // res.send(cart.toJSON({ virtuals: true }));
            // res.send({ cart });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteCartProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            throw new Error("Operation failed. Please try again later!");
        } else {
            const itemIndex = cart.products.findIndex(
                (item) => item._id.toString() === productId.toString()
            );

            // IF THE ITEM EXISTS IN THE USER CART
            if (itemIndex > -1) {
                // DELETE THE ITEM OFF THE CART
                cart.products.splice(itemIndex, 1);
            }

            // SAVE THE UPDATE CART TO THE DATABASE
            await cart.save();

            // SEND BACK THE UPDATED CART TO THE CLIENT WITH RESPONSE: 201
            res.send({ cart: cart.toJSON({ virtuals: true }) });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getCartProducts,
    addProductToCart,
    deleteCartProduct,
};
