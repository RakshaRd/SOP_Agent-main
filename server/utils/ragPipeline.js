import Embedding from "../models/Embedding.js";
import axios from "axios";

export async function queryRAG(question) {

  const chunks = await Embedding.find({});

  if (!chunks.length) {

    return {
      answer: "No SOP document uploaded yet.",
      found: false,
      sources: []
    };

  }

  const keywords = question
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(word => word.length > 2);

  const ranked = chunks
    .map(chunk => {

      const text = chunk.textChunk.toLowerCase();

      const score = keywords.filter(word =>
        text.includes(word)
      ).length;

      return {
        chunk,
        score
      };

    })
    .sort((a, b) => b.score - a.score);

  const topChunks = ranked.slice(0, 3).map(r => r.chunk);

  if (!topChunks.length) {

    return {
      answer: "I don't know based on the uploaded SOP documents.",
      found: false,
      sources: []
    };

  }

  const context = topChunks
    .map(c =>
      `${c.textChunk}\n(Source: ${c.documentName}, Page ${c.pageNumber})`
    )
    .join("\n\n");

  const prompt = `
You are an enterprise SOP assistant.

Answer ONLY using the context below.

If the answer is not present say:
"I don't know based on the uploaded SOP documents."

Context:
${context}

Question:
${question}
`;

  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "llama3",
      prompt,
      stream: false
    }
  );

  const answer = response.data.response;

  return {
    answer,
    found: true,
    sources: topChunks.map(c => ({
      documentName: c.documentName,
      pageNumber: c.pageNumber
    }))
  };

}