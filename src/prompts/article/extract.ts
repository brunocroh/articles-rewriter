import { PromptTemplate } from "@langchain/core/prompts";
import { openAi } from "../../llms";
import { parser } from "./outputParser";

export default async (text: string) => {
  const formatInstructions = `
  Output the cleaned text inside a JSON object with the key "content". Dont return anything else, the JSON object should look like this:

  {
    "content": string | null,
  }
`;

  const prompt = new PromptTemplate({
    template: `
You are an advanced text processing assistant. Your task is to extract the plain text content from an HTML document an format it to markdown, removing all HTML tags, scripts, and styles, and preserving only the original text of the article. Please follow these guidelines:

1. Remove all HTML tags (e.g., <html>, <head>, <body>, <picutre>, <image>, <div>, <span>, <p> etc.).
1. Remove all HTML data attributes data-article and etc.
2. Remove all script and style content (e.g., <script>...</script>, <style>...</style>).
3. Preserve the textual content without the tags.
4. Ensure that no code, comments, or extraneous characters are included in the final text.
5. if any image is fount rewrite it to Markdown format with original alt and source url.

{formatInstructions}

Here is the HTML content to process:

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
