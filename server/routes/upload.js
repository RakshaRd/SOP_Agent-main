import express from "express";
import multer from "multer";
import pdf from "pdf-parse";
import fs from "fs";
import { chunkText } from "../utils/chunker.js";
import { createEmbedding } from "../utils/embedding.js";
import Document from "../models/Document.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
    try {

        console.log("File received:", req.file.originalname);

        const pdfData = await pdf(fs.readFileSync(req.file.path));

        console.log("PDF parsed");

        const text = pdfData.text;

        const chunks = chunkText(text);

        console.log("Chunks created:", chunks.length);

        const embeddings = [];

        for (const chunk of chunks.slice(0, 10)) {
            const embedding = await createEmbedding(chunk);
            embeddings.push({ text: chunk, embedding });
        }

        console.log("Embeddings generated");

        const doc = new Document({
            name: req.file.originalname,
            chunks: embeddings
        });

        await doc.save();

        console.log("Document saved");

        res.json({
            success: true,
            file: req.file.originalname
        });

    } catch (error) {

        console.error("UPLOAD ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;