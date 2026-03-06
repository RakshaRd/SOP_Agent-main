import axios from "axios";

async function generateEmbedding(text) {

    const response = await axios.post(
        "http://127.0.0.1:11434/api/embeddings",
        {
            model: "nomic-embed-text",
            prompt: text
        }
    );

    return response.data.embedding;
}

export default generateEmbedding;