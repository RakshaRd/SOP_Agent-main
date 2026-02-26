const pdf = require("pdf-parse");

function chunkText(text, size = 1000, overlap = 100) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size - overlap) {
        chunks.push(text.slice(i, i + size));
    }
    return chunks;
}

async function parsePDF(buffer) {
    const data = await pdf(buffer);
    return chunkText(data.text);
}

module.exports = parsePDF;
