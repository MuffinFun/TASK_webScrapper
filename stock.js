const puppeteer = require('puppeteer');

const getStock = async (url) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForNetworkIdle();
  await page.waitForSelector('ul.sizes-list');

  const temp = await page.$$eval('li.sizes-list__item', (e) => e);

  const stockLength = Array.from(temp, (_, ind) => ind);

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
    stockLength.reduce((acc, _, index) => {
      const elem = [
        stockValues.shortNames[index].toString(),
        stockValues.sizes[index],
      ];
      acc = [...acc, elem];
      return acc;
    }, [])
  );
  //console.log(stock);

  await browser.close();

  return stock;
};

module.exports = { getStock };
