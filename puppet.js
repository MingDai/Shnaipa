const puppeteer = require('puppeteer')


const TICKET_URL = 'https://www.nike.com/launch/t/lebron-7-fairfax/'

const run = async () => {
  const browser = await puppeteer.launch({headless: false, devtools: true});
  const page = await browser.newPage();
  await page.goto(TICKET_URL);

  await page.evaluate(() => {
    const SHOE_SIZE_BTN = {
      CLASS_SELECTOR: 'size-grid-button',
      SIZE_TEXT: 'M 9 / W 10.5'
    }
  
    const allShoeSizeBtns = document.querySelectorAll(
      `button[class~=${SHOE_SIZE_BTN.CLASS_SELECTOR}]`
    );
    let shoeSizeBtn = null;
    allShoeSizeBtns.forEach((elem) => {
      if (elem.innerText.includes(SHOE_SIZE_BTN.SIZE_TEXT)){
        shoeSizeBtn = elem;
      }
    });
    shoeSizeBtn.click();
  });
  //await page.waitForNavigation({timeout:10, waitUntil:domcontentloaded});
  await page.evaluate(() => {
    const ADD_CART_BTN = {
      BOLD_TEXT: 'ncss-brand',
      TEXT: 'ADD TO CART'
    }
    const possibleAddCartBtns = document.querySelectorAll(
      `button[class~=${ADD_CART_BTN.BOLD_TEXT}]`
    );
    console.log(possibleAddCartBtns);
    let addCartBtn = null;
    possibleAddCartBtns.forEach((btn) => {
      if (btn.innerText.includes(ADD_CART_BTN.TEXT)){
        addCartBtn = btn;
      }
    });
    console.log(addCartBtn);
    resp = addCartBtn.click({clickCount:3, delay:2000});
    // while (!resp){
    //   a = addCartBtn.click({clickCount:10, delay:200});
    //   console.log(a);
    // }
  });

  // page.click(`button[class~=${SHOE_SIZE_BUTTON}]`)
  //await browser.close();
}

run();

