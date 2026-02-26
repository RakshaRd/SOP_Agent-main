const express = require("express");
const SopChunk = require("../models/SopChunk");
const generateEmbedding = require("../services/embedding");
const askLLM = require("../services/ragChain");
const ChatHistory = require("../models/ChatHistory");

const router = express.Router();

router.get("/stream", async (req, res) => {
    const question = req.query.q;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");

    const queryEmbedding = await generateEmbedding(question);

    const results = await SopChunk.aggregate([
        {
            $vectorSearch: {
                index: "sopVectorIndex",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: 5
            }
        }
    ]);

    if (results.length === 0) {
        res.write(`data: I don't know.\n\n`);
        res.end();
        return;
    }

    const context = results.map(r => r.text).join("\n");

    const answer = await askLLM(context, question);

    for (const char of answer) {
        res.write(`data: ${char}\n\n`);
        await new Promise(r => setTimeout(r, 10));
    }

    await ChatHistory.create({
        question,
        answer,
        sources: results.map(r => r.source)
    });

    res.end();
});

module.exports = router;
