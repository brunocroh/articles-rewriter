import { ChatPromptTemplate } from "@langchain/core/prompts";
import { mistral, openAi } from "../models";

export const extractTitle = async (doc: any) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a robot especialized on extract texts from a document with content of a website`,
    ],
    ["human", `Extract article title from this doc "{doc}"`],
  ]);

  const chain = prompt.pipe(mistral);

  const result = await chain.invoke({
    doc: doc,
  });

  return result;
};

export const extractArticle = async (doc: any) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a robot especialized on extract texts from a document with content of a website`,
    ],
    ["human", `Extract article content from this doc "{doc}"`],
  ]);

  const chain = prompt.pipe(openAi);

  const result = await chain.invoke({
    doc: doc,
  });

  return result;
};
