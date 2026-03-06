import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";

import Document from "./models/Document.js";
import Embedding from "./models/Embedding.js";
import { processPDF } from "./utils/pdfProcessor.js";
import chatRoutes from "./routes/chat.js";
import { createEmbedding } from "./utils/embeddings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/chat", chatRoutes);

/* ---------- Multer ---------- */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) =>
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Only PDF files allowed"))
});

/* ---------- MongoDB ---------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });

/* ---------- Upload Document ---------- */

app.post("/api/admin/upload", upload.single("pdf"), async (req, res) => {

  try {

    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    console.log("Processing PDF:", req.file.originalname);

    const chunks = await processPDF(req.file.buffer);

    console.log("Chunks created:", chunks.length);

    const document = await Document.create({
      name: req.file.originalname,
      totalPages: chunks.length,
      fileSize: req.file.size
    });

    const records = [];

    for (const chunk of chunks) {

      if (!chunk.text || chunk.text.trim().length === 0) continue;

      try {

        const embedding = await createEmbedding(chunk.text);

        if (!embedding || embedding.length === 0) {
          console.log("Skipping empty embedding");
          continue;
        }

        records.push({
          documentId: document._id,
          documentName: document.name,
          pageNumber: chunk.page,
          textChunk: chunk.text,
          embedding: embedding
        });

        console.log("Embedding created");

      } catch (err) {
        console.log("Embedding failed for chunk");
      }

    }

    if (records.length === 0) {
      return res.status(500).json({
        error: "No embeddings created from document"
      });
    }

    await Embedding.insertMany(records);

    console.log("Embeddings saved:", records.length);

    res.json({ success: true });

  } catch (err) {

    console.error("Upload error:", err);

    res.status(500).json({
      error: "Upload failed"
    });

  }

});

/* ---------- List Documents ---------- */

app.get("/api/admin/documents", async (_, res) => {

  const docs = await Document.find().sort({ uploadDate: -1 });

  const result = await Promise.all(
    docs.map(async doc => ({
      id: doc._id,
      name: doc.name,
      uploadDate: doc.uploadDate,
      totalPages: doc.totalPages,
      fileSize: doc.fileSize,
      chunkCount: await Embedding.countDocuments({ documentId: doc._id })
    }))
  );

  res.json(result);

});

/* ---------- Delete Document ---------- */

app.delete("/api/admin/documents/:id", async (req, res) => {

  await Embedding.deleteMany({ documentId: req.params.id });
  await Document.findByIdAndDelete(req.params.id);

  res.json({ success: true });

});

/* ---------- Health ---------- */

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`OpsMind AI server running on port ${PORT}`);
});