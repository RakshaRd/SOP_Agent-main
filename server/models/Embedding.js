import mongoose from "mongoose";

// const embeddingSchema = new mongoose.Schema({
//   documentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Document",
//     required: true
//   },
//   documentName: {
//     type: String,
//     required: true
//   },
//   pageNumber: {
//     type: Number,
//     required: true
//   },
//   section: {
//     type: String,
//     default: ""
//   },
//   textChunk: {
//     type: String,
//     required: true
//   },
//   vector: {
//     type: [Number],
//     required: true
//   }
// });
const embeddingSchema = new mongoose.Schema({
  documentId: mongoose.Schema.Types.ObjectId,
  documentName: String,
  pageNumber: Number,
  textChunk: String, // ✅ must be STRING
});

embeddingSchema.index({ documentId: 1 });

export default mongoose.model("Embedding", embeddingSchema);
