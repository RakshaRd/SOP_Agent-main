import mongoose from "mongoose";

const SopChunkSchema = new mongoose.Schema({
    text: String,
    embedding: [Number],
    page: Number,
    source: String
});

export default mongoose.model("SopChunk", SopChunkSchema);