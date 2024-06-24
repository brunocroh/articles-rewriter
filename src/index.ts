import { loadContent } from "./document-loaders/html";
import { htmlToChunks } from "./output-parsers//article";
import { extractTitle, sanitizeHTML } from "./prompt";

const url =
  "https://www.tomshardware.com/pc-components/ssds/new-samsung-ssds-are-allegedly-right-around-the-corner-990-evo-plus-and-9100-pro-trademarks-have-surfaced";
const init = async () => {
  const article = await loadContent(url);

  if (!article?.content) {
    return;
  }
  const docs = await htmlToChunks(article.content);

  let newArticle = "";

  for (const [index, chunk] of docs.entries()) {
    const content = await sanitizeHTML(chunk.pageContent);

    if (content) {
      newArticle += content;
    }

    console.log(`${index}/${docs.length}`);
  }

  console.log({ newArticle });
};

init();
