import axios from "axios";

async function askLLM(context, question) {

    const prompt = `
You are an enterprise SOP assistant.

Answer ONLY using the provided SOP context.

If the answer is not in the context, say:
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
            prompt: prompt,
            stream: false
        }
    );

    return response.data.response;
}

export default askLLM;