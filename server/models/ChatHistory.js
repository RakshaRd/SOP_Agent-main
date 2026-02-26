const mongoose = require("mongoose");

const ChatHistorySchema = new mongoose.Schema({
    question: String,
    answer: String,
    sources: Array,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatHistory", ChatHistorySchema);
