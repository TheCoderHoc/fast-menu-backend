const Favourite = require("../models/favourite");
const Product = require("../models/product");

// GET ALL FAVOURITE MEALS
const getAllFavourites = async (req, res) => {
    try {
        // RETRIEVE THE USER ID FROM THE AUTH MIDDLEWARE
        const userId = req.user._id;

        const favourite = await Favourite.findOne({ user: userId });

        if (!favourite) {
            res.send({ error: "You do not have any favourite meals" });
            return;
        }

        res.send({ favourite });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// ADD A MEAL TO THE USER FAVOURITES
const toggleFavourites = async (req, res) => {
    try {
        // RETRIEVE THE USER ID FROM THE AUTH MIDDLEWARE
        const userId = req.user._id;

        // RETRIEVE THE ID OF THE PRODUCT TO ADD TO THE USER CART
        const productId = req.params.productId;

        // FIND THE PRODUCT WHOSE ID WAS SENT WITH THE INTENTION OF ADDING TO CART
        const product = await Product.findById({ _id: productId });

        if (!product) {
            res.send({
                error: "Product was not found. Please try again later!",
            });
            return;
        }

        // FETCH THE FAVOURITE DOCUMENT THAT HAS THE USER ID
        const favourite = await Favourite.findOne({ user: userId });

        // IF THE USER ALREADY HAS A FAVOURITE DOCUMENT
        if (favourite) {
            const itemIndex = favourite.items.findIndex(
                (item) => item._id.toString() === productId.toString()
            );

            // IF THE ITEM EXISTS IN THE USER FAVOURITE
            if (itemIndex > -1) {
                // DELETE THE ITEM OFF THE USER FAVOURITES
                favourite.items.splice(itemIndex, 1);
            }

            // IF THE ITEM DOES NOT EXIST IN THE USER FAVOURITE
            else {
                favourite.items = [...favourite.items, { ...product }];
            }

            // SAVE THE UPDATE CART TO THE DATABASE
            await favourite.save();

            // SEND BACK THE UPDATED FAVOURITES TO THE CLIENT WITH RESPONSE: 200
            res.send({ favourite });
        }
        // IF THE USER DOES NOT HAVE A FAVOURITE DOCUMENT
        else {
            // CREATE A NEW FAVOURITE DOCUMENT FOR THE USER AND ADD THE PRODUCT
            const newFav = new Favourite({
                user: userId,
                items: [{ ...product }],
            });

            // SAVE THE NEW CART TO THE DATABASE
            await newFav.save();

            // SEND THE FAVOURITES BACK TO THE CLIENT
            res.send({ favourite: newFav });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getAllFavourites,
    toggleFavourites,
};
