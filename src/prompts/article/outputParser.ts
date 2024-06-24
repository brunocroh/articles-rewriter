import { JsonOutputParser } from "@langchain/core/output_parsers";

interface ArticleContent {
  content: string;
}

export const parser = new JsonOutputParser<ArticleContent>();
