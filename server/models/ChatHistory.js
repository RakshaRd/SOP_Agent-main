import mongoose from "mongoose";

const ChatHistorySchema = new mongoose.Schema({
    question: String,
    answer: String,
    sources: Array,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);

export default ChatHistory;