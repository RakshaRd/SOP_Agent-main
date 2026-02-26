require("dotenv").config();
require("./db");

const express = require("express");
const cors = require("cors");

const uploadRoute = require("./routes/upload");
const chatRoute = require("./routes/chat");

const app = express();
app.use(cors());

app.use("/api/upload", uploadRoute);
app.use("/api/chat", chatRoute);

app.listen(process.env.PORT, () =>
    console.log("Server running on port", process.env.PORT)
);
