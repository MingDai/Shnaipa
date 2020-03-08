const puppeteer = require('puppeteer')

const TICKET_URL = 'https://www.nike.com/launch/t/lebron-7-fairfax/'
// const TICKET_URL = 'https://www.nike.com/launch/t/sacai-ldv-waffle-white/'
// const TICKET_URL = 'https://www.nike.com/launch/t/womens-waffle-racer-off-white-athlete-in-progress-vivid-sky/

_tryAddToCart = async (page, num, startTime) => {
  try {
    console.log(`try ${num}`);

    console.log("sleep before selecting shoe size");
    await new Promise(r => setTimeout(r, 1000));

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
    await page.evaluate(() => {
      const ADD_CART_BTN = {
        BOLD_TEXT: 'ncss-brand',
        TEXT: 'ADD TO CART'
      }
      const possibleAddCartBtns = document.querySelectorAll(
        `button[class~=${ADD_CART_BTN.BOLD_TEXT}]`
      );
      let addCartBtn = null;
      possibleAddCartBtns.forEach((btn) => {
        if (btn.innerText.includes(ADD_CART_BTN.TEXT)){
          addCartBtn = btn;
        }
      });
      addCartBtn.click({clickCount: 2});
    });
    const addedCarttime = new Date().getTime();
    console.log(`Added to cart in: ${(addedCarttime - startTime)/1000} seconds`);

    console.log("sleep before selecting checkout pop up modal");
    await new Promise(r => setTimeout(r, 3000));

    await page.evaluate(() => {
      const CHECKOUT_BTN = {
        MODAL_CLASS: 'cart-link',
        TEXT: 'CHECKOUT'
      }
      const possibleAddCartBtns = document.querySelectorAll(
        `button[class~=${CHECKOUT_BTN.MODAL_CLASS}]`
      );
      let addCartBtn = null;
      possibleAddCartBtns.forEach((btn) => {
        if (btn.innerText.includes(CHECKOUT_BTN.TEXT)){
          addCartBtn = btn;
        }
      });
      addCartBtn.click();
    });

    return true;
  } catch (e) {
    console.log(e);
    page.reload();
  }
}

const run = async () => {
  const browser = await puppeteer.launch({headless: false, devtools: true});
  const page = await browser.newPage();
  await page.goto(TICKET_URL);
  // await page.waitForNavigation();

  let num = 0;
  let addedToCart = null;
  const startTime = new Date().getTime();
  while (!addedToCart) {
    num++;
    addedToCart = await _tryAddToCart(page, num, startTime);
  }
  console.log("ADDED TO CART!");
  
  console.log("sleep before selecting guest checkout");
  await new Promise(r => setTimeout(r, 2000));
  
  try{
    await page.click('button[id^=qa-guest-checkout]');
  }catch{
    await page.click('button[id^=qa-guest-checkout]');
  }
  const end = new Date().getTime();
  console.log(`TOTAL EXECUTION TIME: ${(end - start)/1000} seconds`);
}

run();

