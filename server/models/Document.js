import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  totalPages: {
    type: Number,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  }
});

export default mongoose.model("Document", documentSchema);
