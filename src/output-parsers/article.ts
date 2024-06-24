import {
  RecursiveCharacterTextSplitter,
  CharacterTextSplitter,
} from "@langchain/textsplitters";

export const htmlToChunks = async (text: string) => {
  const htmlSplitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 1000,
    chunkOverlap: 0,
  });
  return await htmlSplitter.splitText(text);
};

export const textToChunks = async (text: string) => {
  const htmlSplitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 200,
    chunkOverlap: 0,
  });
  return await htmlSplitter.splitText(text);
};
