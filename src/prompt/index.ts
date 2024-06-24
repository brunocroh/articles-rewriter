import {
  PromptTemplate,
  FewShotChatMessagePromptTemplate,
  ChatPromptTemplate,
} from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { mistral, openAi } from "../llms";
import { RunnableSequence } from "@langchain/core/runnables";

interface ArticleContent {
  content: string;
}
const parser = new JsonOutputParser<ArticleContent>();

export const extractArticle = async (text: string) => {
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

export const removeUnrelatedContent = async (text: string) => {
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

export const rewrite = async (text: string) => {
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

export const translate = async (
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
5. Preserve markdown text formatted.

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

export const improveSEO = async (
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

export const extractTitle = async (url: string) => {
  const examples = [
    {
      url: "www.article.com/how-to-create-a-car",
      title: "How to create a car",
    },
    {
      url: "www.article.com/nvidia-become-the-most-valuable-company-in-the-world",
      title: "Nvidia become the most valuable company in the world",
    },
    {
      url: "www.article.com/how-to-use-use-effect-on-react",
      title: "How to use useEffect on React",
    },
    {
      url: "www.article.com/resume-of-last-apple-event",
      title: "Resume of last Apple event",
    },
  ];

  const examplePrompt = ChatPromptTemplate.fromMessages([
    ["human", "{url}"],
    ["ai", "{title}"],
  ]);

  const fewShotPrompt = new FewShotChatMessagePromptTemplate({
    examples,
    examplePrompt,
    inputVariables: ["url", "title"],
  });

  const finalPrompt = ChatPromptTemplate.fromMessages([
    ["system", "Your role is transform url on article titles"],
    await fewShotPrompt.format({}),
    ["human", "{url}"],
  ]);

  const chain = RunnableSequence.from([finalPrompt, mistral]);

  const response = await chain.invoke({
    url,
  });

  if (typeof response.content === "string") {
    const result = JSON.parse(response.content);
    return result.title;
  }

  return "";
};
