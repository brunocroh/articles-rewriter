import {
  PromptTemplate,
  FewShotChatMessagePromptTemplate,
  ChatPromptTemplate,
} from "@langchain/core/prompts";
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

export const isArticleContent = async (text: string) => {
  interface CheckArticleContent {
    isContent: boolean;
  }

  const parser = new JsonOutputParser<CheckArticleContent>();
  const formatInstructions =
    "Respond with a valid JSON object, containing one field: 'isContent' as a boolean. dont return anything else";

  const prompt = ChatPromptTemplate.fromTemplate(
    "check if this following text is part of an article or not, return false when identify html tags, attributes, css or javascript code.\n{formatInstructions}\n{text}",
  );

  const partialPrompt = await prompt.partial({
    formatInstructions,
  });

  const chain = partialPrompt.pipe(mistral).pipe(parser);

  return await chain.invoke({
    text: text,
  });
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
