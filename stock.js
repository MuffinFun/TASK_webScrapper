const puppeteer = require('puppeteer');

const puppeteerLaunchOptions = {
  headless: 'new',
  ignoreDefaultArgs: ['--no-sandbox'],
};

const getStock = async (url) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForNetworkIdle();
  await page.waitForSelector('ul.sizes-list');

  const stockValues = await page.evaluate(() => {
    const shortNames = Array.from(
      document.querySelectorAll('.sizes-list__size'),
      (e) => e.innerText
    );
    const sizes = Array.from(
      document.querySelectorAll('.sizes-list__size-ru'),
      (e) => e.innerText
    );

    return { sizes, shortNames };
  });
  const stock = Object.fromEntries(
    Array.from(Array(stockValues.sizes.length).keys()).reduce(
      (acc, _, index) => {
        const elem = [
          stockValues.shortNames[index].toString(),
          stockValues.sizes[index],
        ];

        acc = [...acc, elem];
        return acc;
      },
      []
    )
  );

  await browser.close();

  return stock;
};

module.exports = { getStock };
