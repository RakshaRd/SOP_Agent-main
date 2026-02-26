// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const embeddingModel = genAI.getGenerativeModel({
//   model: "text-embedding-004",
// });

// export async function generateEmbedding(text) {
//   const result = await embeddingModel.embedContent({
//     content: {
//       parts: [{ text }],
//     },
//   }
//   );

//   return result.embedding.values; // ✅ array of numbers
// }

// export function cosineSimilarity(a, b) {
//   let dot = 0, magA = 0, magB = 0;

//   for (let i = 0; i < a.length; i++) {
//     dot += a[i] * b[i];
//     magA += a[i] * a[i];
//     magB += b[i] * b[i];
//   }

//   return dot / (Math.sqrt(magA) * Math.sqrt(magB));
// }

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const embeddingModel = genAI.getGenerativeModel({
//   model: "text-embedding-004",
// });

// export async function generateEmbedding(text) {
//   const result = await embeddingModel.embedContent({
//     content: { parts: [{ text }] },
//   });
//   return result.embedding.values;
// }

// export function cosineSimilarity(a, b) {
//   let dot = 0, magA = 0, magB = 0;
//   for (let i = 0; i < a.length; i++) {
//     dot += a[i] * b[i];
//     magA += a[i] ** 2;
//     magB += b[i] ** 2;
//   }
//   return dot / (Math.sqrt(magA) * Math.sqrt(magB));
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

export async function generateEmbedding(text) {
  if (!text || !text.trim()) {
    throw new Error("Empty text passed to embedding");
  }

  const result = await embeddingModel.embedContent({
    content: {
      parts: [{ text }],
    },
  });

  // 🔒 HARD SAFETY CHECK
  if (!result?.embedding?.values) {
    console.error("❌ Gemini embedding response:", result);
    throw new Error("Gemini embedding failed");
  }

  return result.embedding.values;
}

export function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}