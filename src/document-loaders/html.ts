import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "mistral", // Default value
});

const extractContent = async (content: string) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a scrapper tool. receiving a HTML of a page with an article, remove unecessary html not realated to article content`,
    ],
    ["human", `Extract article content from this "{HTML}"`],
  ]);

  const model = new ChatOllama({
    baseUrl: "http://localhost:11434", // Default value
    model: "mistral", // Default value
    format: "json",
  });

  const chain = prompt.pipe(model);

  const result = await chain.invoke({
    HTML: content,
  });

  console.log({ result });
};

export const loadContent = async (url: string) => {
  const loader = new PlaywrightWebBaseLoader(url, {
    launchOptions: {
      headless: false,
    },
  });

  const docs = await loader.load();
  console.log({ docs });
  await extractContent(JSON.stringify(docs));

  // return docs;
};
