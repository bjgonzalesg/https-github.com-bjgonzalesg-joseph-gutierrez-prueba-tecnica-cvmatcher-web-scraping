const { chromium } = require("playwright");
const fs = require("fs");


const main = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const url = "https://www.laborum.pe/job/BCP---Otras-posiciones/Practicante-Pre-Profesional/67a6138fb3e5207fb22e0d56";

  //  *Go to web
  await page.goto(url);

  // *Search
  // await page.fill(
  //   'input[aria-label="Busca un puesto, área o empresa"]',
  //   "backend"
  // );
  // await page.click('button[aria-label="buscar trabajo"]');

  // *Wait for the items to load
  await page.waitForSelector("#listJobs");

  // *Get items
  const items = await page.$$("#listJobs > div > div > li a");

  const data = [];

  for (const item of items) {

    // *Title
    const titleElement = await item.$("h6");
    const title = titleElement && await titleElement.textContent();

    // *Enterprise
    const enterpriseElement = await item.$("h6 + p");
    const enterprise = enterpriseElement && await enterpriseElement.textContent();

    // *Location
    const [locationElement] = await item.$$("ul > li");
    const location = locationElement && await locationElement.textContent();

    // *PublishedAt
    const publishedAtElement = await item.$("ul + p");
    const publishedAt = publishedAtElement && await publishedAtElement.textContent();

    // *Description
    await item.click();
    await page.waitForSelector("h4 + div");

    const descriptionElement = await page.$("h4 + div");
    const description = descriptionElement && await descriptionElement.textContent();

    data.push({
      title,
      enterprise,
      location,
      publishedAt,
      description
    });

  }

  // *Save file
  saveFile(data);


  await page.close();
  await context.close();
  await browser.close();
}


const saveFile = (items) => {
  try {
    fs.writeFileSync("./data.json", JSON.stringify(items, null, 3));
  } catch (error) {
    throw Error(error);
  }
}

(async () => {
  await main();
})()
