const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY
});

async function askLLM(context, question) {
    const prompt = `
You are an SOP assistant.
Answer ONLY from the context.
If the answer is not present, say "I don't know."

Context:
${context}

Question:
${question}
  `;
    const response = await llm.invoke(prompt);
    return response.content;
}

module.exports = askLLM;
