const express = require("express");
const cors = require("cors");
require("./config/db");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const errorMiddleware = require("./middleware/errors");

const app = express();

const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(productRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
