import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { mistral } from "../../llms";

export default async (url: string) => {
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
