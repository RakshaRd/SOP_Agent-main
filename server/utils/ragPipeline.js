import Embedding from "../models/Embedding.js";

/**
 * Simple, reliable RAG (NO embeddings, NO Gemini)
 */
export async function queryRAG(question) {
  // 1️⃣ Fetch all stored text chunks
  const chunks = await Embedding.find({});

  if (!chunks.length) {
    return {
      answer: "No document uploaded yet.",
      found: false,
      sources: [],
    };
  }

  const lowerQuestion = question.toLowerCase();

  // 2️⃣ Find relevant chunks using keyword overlap
  const relevant = chunks.filter(chunk =>
    lowerQuestion
      .split(" ")
      .some(word =>
        chunk.textChunk.toLowerCase().includes(word)
      )
  );

  // 3️⃣ If NOTHING matches → truly not related
  if (!relevant.length) {
    return {
      answer: "This question is not related to the uploaded document.",
      found: false,
      sources: [],
    };
  }

  // 4️⃣ Build answer from document itself
  const answer = `
Based on the uploaded document:

${relevant
      .slice(0, 3)
      .map(r => `• ${r.textChunk}`)
      .join("\n")}
  `.trim();

  // 5️⃣ Return with page numbers
  return {
    answer,
    found: true,
    sources: relevant.slice(0, 5).map(r => ({
      documentName: r.documentName,
      pageNumber: r.pageNumber,
      section: "",
    })),
  };
}