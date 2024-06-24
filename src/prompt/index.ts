import {
  PromptTemplate,
  FewShotChatMessagePromptTemplate,
  ChatPromptTemplate,
} from "@langchain/core/prompts";
import {
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { mistral, openAi } from "../llms";
import { RunnableSequence } from "@langchain/core/runnables";

export const extractArticle = async (text: string) => {
  const prompt = new PromptTemplate({
    template:
      "Identify if the text is a content of a article or just html,css or js code {text}",
    inputVariables: ["text"],
  });

  const chain = prompt.pipe(mistral);

  const result = await chain.invoke({
    text: text,
  });

  return result;
};

export const sanitizeHTML = async (html: any) => {
  interface ArticleContent {
    content: string;
  }

  const parser = new JsonOutputParser<ArticleContent>();
  const formatInstructions = "Respond with text without html tags";

  const prompt = new PromptTemplate({
    template:
      "I want to have content of article present on following HTML, please remove tags, html, css and js related on this file {html}",
    inputVariables: ["html"],
  });

  const partialPrompt = await prompt.partial({
    formatInstructions,
  });

  const chain = partialPrompt.pipe(mistral);

  const result = await chain.invoke({
    html,
  });

  console.log({ result: result });

  return null;
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
