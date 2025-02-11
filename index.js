const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto("https://www.laborum.pe/");

  await page.fill(
    'input[aria-label="Busca un puesto, área o empresa"]',
    "backend"
  );

  await page.click('button[aria-label="buscar trabajo"]');

  await page.waitForSelector("#listJobs");

  const data = await page.evaluate(async () => {
    const items = document.querySelectorAll("#listJobs>div>div>li");

    const data = [];

    for (const item of items) {
      const title = item.querySelector("h6").textContent;

      const enterprise = item.querySelector("h6").nextSibling.textContent;
      const location = item
        .querySelector("a>div>div")
        .nextElementSibling.querySelector("ul>li>span").textContent;

      const publishedAt = item
        .querySelector("a>div>div")
        .nextElementSibling.querySelector("p").textContent;

      const pageUrl = item.querySelector("a").href;

      await page.goto(pageUrl);

      data.push({
        title,
        enterprise,
        location,
        publishedAt,
      });
    }

    return data;
  });

  console.log(data);
})();
