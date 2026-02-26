const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const SopChunk = require("../models/SopChunk");
const generateEmbedding = require("../services/embedding");

const router = express.Router();

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post("/", upload.single("file"), async (req, res) => {
    try {
        console.log("➡️ Upload request");

        if (!req.file) {
            console.log("❌ No file received");
            return res.status(400).json({ error: "No file received" });
        }

        console.log("✅ File:", req.file.originalname);

        const parsed = await pdf(req.file.buffer);
        const text = parsed.text;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Empty or scanned PDF" });
        }

        const chunks = [];
        const size = 1000;
        const overlap = 100;

        for (let i = 0; i < text.length; i += size - overlap) {
            chunks.push(text.slice(i, i + size));
        }

        console.log("📄 Chunks:", chunks.length);

        for (const chunk of chunks) {
            const embedding = await generateEmbedding(chunk);

            await SopChunk.create({
                text: chunk,
                embedding,
                source: {
                    fileName: req.file.originalname,
                    page: 1
                }
            });
        }

        console.log("✅ SOP stored in MongoDB");
        res.json({ message: "SOP uploaded & indexed" });

    } catch (err) {
        console.error("❌ Upload failed:", err);
        res.status(500).json({ error: "Upload failed" });
    }
});

module.exports = router;
