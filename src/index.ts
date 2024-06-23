import { loadContent } from "./document-loaders/html";
import { htmlToText } from "./output-parsers//article";
import { extractTitle, isArticleContent } from "./prompt";

const url =
  "https://www.tomshardware.com/pc-components/ssds/new-samsung-ssds-are-allegedly-right-around-the-corner-990-evo-plus-and-9100-pro-trademarks-have-surfaced";
const init = async () => {
  const article = await loadContent(url);

  if (!article?.content) {
    return;
  }

  const title = article?.title;

  console.log("TITLE", title);
  console.log("TITLE", article.content);
};

init();
