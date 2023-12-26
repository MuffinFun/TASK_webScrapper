const puppeteer = require('puppeteer');
const { getStock } = require('./stock.js');
const { getArt } = require('./getArt.js');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    'https://www.wildberries.ru/catalog/146972802/detail.aspx?targetUrl=EX'
  );
  await page.waitForNetworkIdle();
  await page.waitForSelector('a.img-plug');

  const temp = await page.$$eval('a.img-plug', (e) => e);

  const urlLength = Array.from(temp, (_, ind) => ind);

  const urlArr = await page.evaluate(() => {
    const anotherArtUrls = Array.from(
      document.querySelectorAll('a.img-plug'),
      (e) => e.getAttribute('href')
    ).slice(1);

    return anotherArtUrls;
  });

  await browser.close();

  const artArr = getArt(urlArr);

  const tempStock = [];

  const resultArr = async () => {
    const result = urlLength.reduce((acc, _, ind) => {
      if (ind >= 3) return acc;

      const item = {
        art: artArr[ind],
        stock: tempStock[ind],
      };

      acc = [...acc, item];

      return acc;
    }, []);

    console.log(result);
    return;
  };

  for (let i = 0; i <= 3; i++) {
    if (i == 3) resultArr();
    const stocks = await getStock(urlArr[i]);
    tempStock.push(stocks);
  }
})();
