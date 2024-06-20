import {
  PuppeteerWebBaseLoader,
  Page,
} from "@langchain/community/document_loaders/web/puppeteer";

export default {
  scraper: async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: false,
      },
      evaluate: async (page: Page): Promise<any> => {
        const agreeButton = await page.$('button[title="Agree"]');

        if (agreeButton) {
          agreeButton.click();
        }

        await page.$("article.article");

        const article = await page.evaluate(() => {
          const article = document.querySelector("article.article");
          return article ? article.innerHTML : "";
        });

        await page.$('button[title="Agree"]');

        return article;
      },
    });

    const docs = await loader.load();

    return docs;
  },
};
