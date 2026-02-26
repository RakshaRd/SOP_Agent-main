import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

import Document from "./models/Document.js";
import Embedding from "./models/Embedding.js";
import { processPDF } from "./utils/pdfProcessor.js";
import { queryRAG } from "./utils/ragPipeline.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ---------- Multer ---------- */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) =>
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Only PDF allowed")),
});

/* ---------- MongoDB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });

/* ---------- UPLOAD ---------- */
app.post("/api/admin/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const chunks = await processPDF(req.file.buffer);

    if (!chunks.length) {
      return res.status(400).json({ error: "No readable text" });
    }

    const document = await Document.create({
      name: req.file.originalname,
      totalPages: chunks.length,
      fileSize: req.file.size,
    });

    const records = chunks.map((chunk, index) => ({
      documentId: document._id,
      documentName: document.name,
      pageNumber: index + 1,
      textChunk: chunk, // ✅ STRING
    }));

    await Embedding.insertMany(records);

    res.json({ success: true });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ---------- LIST ---------- */
app.get("/api/admin/documents", async (_, res) => {
  const docs = await Document.find().sort({ uploadDate: -1 });

  const result = await Promise.all(
    docs.map(async doc => ({
      id: doc._id,
      name: doc.name,
      uploadDate: doc.uploadDate,
      totalPages: doc.totalPages,
      fileSize: doc.fileSize,
      chunkCount: await Embedding.countDocuments({ documentId: doc._id }),
    }))
  );

  res.json(result);
});

/* ---------- DELETE ---------- */
app.delete("/api/admin/documents/:id", async (req, res) => {
  await Embedding.deleteMany({ documentId: req.params.id });
  await Document.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ---------- QUERY ---------- */
app.post("/api/query", async (req, res) => {
  const result = await queryRAG(req.body.question);
  res.json(result);
});

/* ---------- HEALTH ---------- */
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", message: "OpsMind AI server is running" });
});

app.listen(PORT, () => {
  console.log(`OpsMind AI server running on port ${PORT}`);
});