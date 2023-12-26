const puppeteer = require('puppeteer');
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

  //   const getCurrStock = async (ind) => {
  //     const tempStock = await getStock(urlArr[ind]);
  //     const t = tempStock.json();
  //     return t;
  //   };
  //   const resultArr = urlLength.reduce((acc, _, ind) => {
  //     const currStock = getCurrStock(ind);
  //     console.log(artArr);
  //     console.log(currStock);
  //     const item = {
  //       art: artArr[ind],
  //       stock: currStock,
  //     };
  //     acc = [...acc, item];
  //     return acc;
  //   }, []);
  //   console.log(resultArr);
})();
