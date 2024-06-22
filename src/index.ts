import { loadContent } from "./document-loaders/html";
import { htmlToText } from "./output-parsers//article";
import { extractTitle, isArticleContent } from "./prompt";

const url =
  "https://www.tomshardware.com/pc-components/ssds/new-samsung-ssds-are-allegedly-right-around-the-corner-990-evo-plus-and-9100-pro-trademarks-have-surfaced";
const init = async () => {
  const title = await extractTitle(url);

  const docs = await loadContent(url);
  const chunks = await htmlToText(docs);

  const articleChunks = [];

  for (const [index, chunk] of chunks.entries()) {
    const response = await isArticleContent(chunk.pageContent);

    console.log(`isContent: ${response.isContent} : ${index}/${chunks.length}`);

    if (response.isContent) {
      articleChunks.push(chunk);
      console.log({ chunk });
    }
  }

  console.log({ title });

  console.log(articleChunks.map((doc) => doc.pageContent || ""));
};

init();
