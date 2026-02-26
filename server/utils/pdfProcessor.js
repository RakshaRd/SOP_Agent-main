import pdfParse from "pdf-parse";

export async function processPDF(buffer) {
  const data = await pdfParse(buffer);

  if (!data.text || !data.text.trim()) {
    throw new Error("PDF contains no readable text");
  }

  // ✅ SPLIT INTO STRING CHUNKS ONLY
  const chunks = data.text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 10); // limit for speed

  return chunks; // ⬅️ array of STRINGS
}