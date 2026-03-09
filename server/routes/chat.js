import express from "express";
import Embedding from "../models/Embedding.js";
import { createEmbedding } from "../utils/embeddings.js";
import axios from "axios";

const router = express.Router();

/* ---------- Cosine Similarity ---------- */

function cosineSimilarity(a, b) {

    if (!a || !b) return 0;

    const len = Math.min(a.length, b.length);

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < len; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    if (magA === 0 || magB === 0) return 0;

    return dot / (magA * magB);
}

/* ---------- Ask Question ---------- */

router.post("/ask", async (req, res) => {

    try {

        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        console.log("Question:", question);

        /* Create embedding for question */

        const queryEmbedding = await createEmbedding(question);

        /* Get stored chunks */

        const chunks = await Embedding.find();

        if (!chunks || chunks.length === 0) {

            return res.json({
                answer: "No documents uploaded yet.",
                sources: [],
                found: false
            });

        }

        let bestChunks = [];

        for (const chunk of chunks) {

            if (!chunk.embedding || chunk.embedding.length === 0) continue;

            const embeddingArray = Array.from(chunk.embedding);

            const similarity = cosineSimilarity(
                queryEmbedding,
                embeddingArray
            );

            bestChunks.push({
                text: chunk.textChunk,
                score: similarity,
                documentName: chunk.documentName,
                pageNumber: chunk.pageNumber
            });

        }

        if (bestChunks.length === 0) {

            return res.json({
                answer: "No valid document embeddings found.",
                sources: [],
                found: false
            });

        }

        /* Sort by similarity */

        bestChunks.sort((a, b) => b.score - a.score);

        const topChunks = bestChunks.slice(0, 2);

        if (!topChunks[0] || topChunks[0].score < 0.3) {

            return res.json({
                answer: "Question not related to uploaded documents.",
                sources: [],
                found: false
            });

        }

        /* Build context */

        const context = topChunks.map(c => c.text).join("\n\n");

        /* Ask Ollama */

        const response = await axios.post(
            "http://127.0.0.1:11434/api/generate",
            {
                model: "llama3",
                prompt: `
Answer ONLY using the context below.

Context:
${context}

Question:
${question}
`,
                stream: false
            }
        );

        const answer = response.data.response || "No answer generated.";

        res.json({
            answer,
            sources: topChunks.map(c => ({
                documentName: c.documentName,
                pageNumber: c.pageNumber
            })),
            found: true
        });

    } catch (error) {

        console.error("Chat error:", error);

        res.status(500).json({
            error: "Chat processing failed"
        });

    }

});

export default router;