const puppeteer = require('puppeteer');
const { getStock } = require('./stock.js');
const { getArt } = require('./getArt.js');

const puppeteerLaunchOptions = {
  headless: 'new',
  ignoreDefaultArgs: ['--no-sandbox'],
};

(async () => {
  const startTime = new Date().getTime();

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(
    'https://www.wildberries.ru/catalog/146972802/detail.aspx?targetUrl=EX'
  );
  await page.waitForNetworkIdle();
  await page.waitForSelector('a.img-plug');

  const urlArr = await page.evaluate(() => {
    const anotherArtUrls = Array.from(
      document.querySelectorAll('a.img-plug'),
      (e) => e.getAttribute('href')
    ).slice(1);

    return anotherArtUrls;
  });

  await browser.close();

  const artArr = getArt(urlArr);

  const result = await getResultArr(urlArr, artArr);

  const endTime = new Date().getTime();
  console.log(result);
  console.log(
    `Time -- ${endTime - startTime}ms / ${(endTime - startTime) / 1000}s`
  );
  return result;
})();

const getResultArr = async (urls, arts) => {
  try {
    const result = await Promise.all(
      Array.from(Array(4).keys()).map(async (acc, ind) => {
        try {
          const stocks = await getStock(urls[ind]);

          const item = {
            art: arts[ind],
            stock: stocks,
          };

          return item;
        } catch (error) {
          console.error(`Error on itteration - ${ind}: ${error.message}`);
        }
      })
    );

    return result;
  } catch (error) {
    console.error(error.message);
  }
};
