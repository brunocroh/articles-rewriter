import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const htmlToChunks = async (htmlText: string) => {
  const htmlSplitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 1000,
    chunkOverlap: 0,
  });
  return await htmlSplitter.createDocuments([htmlText]);
};
