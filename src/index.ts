import { loadContent } from "./document-loaders/html";
import { htmlToChunks, textToChunks } from "./output-parsers//article";
import { Article } from "./prompts/article";

const url =
  "https://www.tomshardware.com/raspberry-pi/this-custom-raspberry-pi-pc-is-battery-powered-has-a-built-in-handle-and-glows-with-rgb-leds";

const init = async () => {
  const article = await loadContent(url);

  if (!article?.content) {
    return;
  }

  const docs = await htmlToChunks(article.content);

  console.log({ chunks: docs.length });

  let draftArticle = "";

  for (const [index, chunk] of docs.entries()) {
    const content = await Article.extract(chunk);

    if (content) {
      draftArticle += `${content} \n\n`;
    }

    console.log(`${index + 1}/${docs.length}`);
  }

  const pipeline = [
    Article.removeUnrelatedContent,
    Article.rewrite,
    async (text: string) => Article.translate(text, "Brazilian portuguese"),
  ];

  const finalArticle = await pipeline.reduce(
    async (content: Promise<string> | string, fn) => {
      if (typeof content !== "string") {
        const _content = await content;
        console.log(_content);
        return fn(await content);
      }
      return fn(content);
    },
    draftArticle,
  );

  console.log(finalArticle);

  console.log({ length: finalArticle.length });
};

init();
