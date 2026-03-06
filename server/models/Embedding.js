import mongoose from "mongoose";

const embeddingSchema = new mongoose.Schema({
  documentId: mongoose.Schema.Types.ObjectId,
  documentName: String,
  pageNumber: Number,
  textChunk: String,

  embedding: {
    type: [Number],
    required: true
  }
});

embeddingSchema.index({ documentId: 1 });

export default mongoose.model("Embedding", embeddingSchema);