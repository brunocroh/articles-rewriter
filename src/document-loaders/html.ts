import { TomsHardware } from "../scrappers";

export const loadContent = async (url: string) => {
  let docs = null;

  if (url.includes("tomshardware")) {
    docs = await TomsHardware.scraper(url);
  }

  return docs;
};
