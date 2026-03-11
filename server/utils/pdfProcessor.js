import pdf from "pdf-parse";

export async function processPDF(buffer) {

  const data = await pdf(buffer);

  const pages = data.text.split("\n\n");

  const chunks = [];

  pages.forEach((pageText, index) => {

    const chunkSize = 400;

    for (let i = 0; i < pageText.length; i += chunkSize) {

      chunks.push({
        text: pageText.slice(i, i + chunkSize),
        page: index + 1
      });

    }

  });

  return chunks;

}