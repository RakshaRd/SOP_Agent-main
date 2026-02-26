const mongoose = require("mongoose");

const SopChunkSchema = new mongoose.Schema({
    text: String,
    embedding: [Number],
    source: {
        fileName: String,
        page: Number
    }
});

module.exports = mongoose.model("SopChunk", SopChunkSchema);
