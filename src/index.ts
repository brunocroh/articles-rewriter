import { loadContent } from "./document-loaders/html";
import { htmlToText } from "./output-parsers//article";
import { extractArticle, extractTitle } from "./prompt";

const url =
  "https://www.tomshardware.com/pc-components/ssds/new-samsung-ssds-are-allegedly-right-around-the-corner-990-evo-plus-and-9100-pro-trademarks-have-surfaced";
const init = async () => {
  const docs = await loadContent(url);
  const result = await htmlToText(docs);

  const reducedDocs = result.map((item) => item.pageContent);

  // const title = await extractTitle(JSON.stringify(result));
  // const article = await extractArticle(JSON.stringify(reducedDocs));

  console.log({ title: result[0].pageContent.length });
  console.log({ article: reducedDocs.join(" ").length });
};

init();
