import { PromptTemplate } from "@langchain/core/prompts";
import { openAi } from "../../llms";
import { parser } from "./outputParser";

export default async (
  text: string,
  language: string = "Brazilian portuguese",
) => {
  const formatInstructions = `
Output the cleaned text inside a JSON object with the key "content". The JSON object should look like this:
{
  "content": string
}

Please provide the cleaned text inside the "content" field of the JSON object
`;

  const prompt = new PromptTemplate({
    template: `
You are an advanced language translation assistant. Your task is to translate the entire article provided below from English to {language}. Please follow these guidelines:

1. Translate the text accurately, ensuring that the meaning and context are preserved.
2. Use natural and fluent Brazilian Portuguese.
3. Maintain the original formatting, including paragraphs, headings, and lists.
4. Ensure the translated text is clear and easy to read.

{formatInstructions}

Here is the original article to translate:

{text}
`,
    inputVariables: ["text", "formatInstructions", "language"],
  });

  const partialPrompt = await prompt.partial({
    formatInstructions,
  });

  const chain = partialPrompt.pipe(openAi).pipe(parser);

  const result = await chain.invoke({
    text,
    language,
  });

  return result.content;
};
