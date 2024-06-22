import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MozillaReadabilityTransformer } from "@langchain/community/document_transformers/mozilla_readability";
// import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";

export const htmlToText = async (docs: any) => {
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const transformer = new MozillaReadabilityTransformer();

  const sequence = splitter.pipe(transformer);
  const newDocuments = await sequence.invoke(docs);

  return newDocuments;
};
