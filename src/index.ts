import { loadContent } from "./document-loaders/html";

const url =
  "https://www.tomshardware.com/pc-components/ssds/new-samsung-ssds-are-allegedly-right-around-the-corner-990-evo-plus-and-9100-pro-trademarks-have-surfaced";
const init = async () => {
  const result = await loadContent(url);

  console.log(result);
};

init();
