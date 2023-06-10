module.exports = (err, req, res, next) => {
    try {
        let errorMessage = "";
        if (err.errors) {
            const fields = Object.keys(err.errors);
            errorMessage = err.errors[fields[0]].message;
        }

        if (err?.code && err?.code === 11000) {
            errorMessage = "Another account already exists with that email.";
        }

        if (
            err?.code === 11000 &&
            err?.message.includes("duplicate") &&
            err?.message.includes("products")
        ) {
            errorMessage = "Another product already has that name.";
        }

        return res.status(400).send({ error: errorMessage || err.message });
    } catch (error) {
        res.status(500).send({
            error: "A unknown error occurred. Please try again.",
        });
    }
};
