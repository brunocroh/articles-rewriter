import { PromptTemplate } from "@langchain/core/prompts";
import { openAi } from "../../llms";
import { parser } from "./outputParser";

export default async (text: string) => {
  const formatInstructions = `
Output the cleaned text inside a JSON object with the key "content". The JSON object should look like this:
{
  "content": string
}

Please provide the cleaned text inside the "content" field of the JSON object
`;

  const prompt = new PromptTemplate({
    template: `
You are an advanced text processing assistant. Your task is to clean up the content extracted from an HTML document by removing unnecessary content, such as advertisements, navigation links, and other extraneous information, while preserving the main text of the article. Please follow these guidelines:

1. Identify and remove content that is not part of the main article, including:
   - Advertisements
   - Navigation links
   - Author
   - Footers and headers
   - Sidebars
   - Scripts and styles
3. Ensure the remaining text is well-formatted and coherent using Markdown, maintaining the original structure of the article and images.

{formatInstructions}

Here is the original content to process:

{text}
`,
    inputVariables: ["text", "formatInstructions"],
  });

  const partialPrompt = await prompt.partial({
    formatInstructions,
  });

  const chain = partialPrompt.pipe(openAi).pipe(parser);

  const result = await chain.invoke({
    text,
  });

  return result.content;
};
