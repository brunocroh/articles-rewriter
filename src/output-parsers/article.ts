import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MozillaReadabilityTransformer } from "@langchain/community/document_transformers/mozilla_readability";
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";

export const htmlToText = async (docs: any) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  const transformer = new MozillaReadabilityTransformer();

  // The sequence processes the loaded documents through the splitter and then the transformer.
  const sequence = splitter.pipe(transformer);

  // Invoke the sequence to transform the documents into a more readable format.
  const newDocuments = await sequence.invoke(docs);

  return newDocuments;
};
