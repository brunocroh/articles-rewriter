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
You are an advanced text processing assistant. Your task is to rewrite the entire article provided below to ensure that it is unique and cannot be identified as plagiarized while maintaining the original meaning and coherence of the text. Please follow these guidelines:

1. Paraphrase the content thoroughly, changing the wording and sentence structure.
2. Maintain the original meaning and context of the article.
3. Preserve the key points and information, but express them in a new way.
4. Ensure the text remains clear, coherent, and easy to read.
5. Avoid using any phrases or sentences that are too similar to the original text.
6. Turn content in a good article formated with Markdown.

{formatInstructions}

Here is the original article to rewrite:

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
