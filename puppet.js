const puppeteer = require('puppeteer')

const TICKET_URL = 'https://www.nike.com/launch/t/lebron-7-fairfax/'
// const TICKET_URL = 'https://www.nike.com/launch/t/sacai-ldv-waffle-white/'
// const TICKET_URL = 'https://www.nike.com/launch/t/womens-waffle-racer-off-white-athlete-in-progress-vivid-sky/

_trySelectSize = async (page) => {
  try {
    console.log("let the page load a lil");
    await new Promise(r => setTimeout(r, 1500));

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
    return true;
  } catch (e) {
    console.log(e);
    page.reload();
  } 
}

_tryAddToCart = async (page, num, startTime) => {
  try {
    console.log(`try ${num}`);
    if (num > 1000){ return true; }

    const ADD_CART_BTN = {
      BOLD_TEXT: 'ncss-brand',
      TEXT: 'ADD TO CART'
    }
    const buyButton = await page.waitFor((ADD_CART_BTN) => {
      const possibleAddCartBtns = document.querySelectorAll(
        `button[class~=${ADD_CART_BTN.BOLD_TEXT}]`
      );
      
      let addToCartBtn = null;
      possibleAddCartBtns.forEach((btn) => {
        if (btn.innerText.includes(ADD_CART_BTN.TEXT)){
          addToCartBtn = btn;
        }
      });
      addToCartBtn.click({clickCount: 3, delay: 500});
      return true
    }, {}, ADD_CART_BTN);

    const addedCarttime = new Date().getTime();
    console.log(`Added to cart in: ${(addedCarttime - startTime)/1000} seconds`);

    // if (buyButton); buyButton.click();
    console.log("sleep before selecting checkout pop up modal");
    await new Promise(r => setTimeout(r, 1500));
    // if (buyButton); buyButton.click();

    await page.evaluate(() => {
      const CHECKOUT_BTN = {
        MODAL_CLASS: 'cart-link',
        TEXT: 'CHECKOUT'
      }
      const checkoutModalBtns = document.querySelectorAll(
        `button[class~=${CHECKOUT_BTN.MODAL_CLASS}]`
      );
      let checkoutBtn = null;
      checkoutModalBtns.forEach((btn) => {
        if (btn.innerText.includes(CHECKOUT_BTN.TEXT)){
          checkoutBtn = btn;
        }
      });
      checkoutBtn.click();
    });

    return true;
  } catch (e) {
    //swallow errors
    console.log(e);
  }
}

const run = async () => {
  const browser = await puppeteer.launch({
    headless: false, 
    devtools: true
    // executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
  });
  const page = await browser.newPage();
  await page.goto(TICKET_URL);
  // await page.waitForNavigation();

  let selectedSize = null;
  while (!selectedSize) {
    selectedSize = await _trySelectSize(page);
  }

  let num = 0;
  const startTime = new Date().getTime();
  let addedToCart = null;
  while (!addedToCart) {
    num++;
    addedToCart = await _tryAddToCart(page, num, startTime)
  }

  console.log("sleep before selecting guest checkout");
  await new Promise(r => setTimeout(r, 2000));
  try{
    await page.click('button[id^=qa-guest-checkout]');
  }catch{
    await page.click('button[id^=qa-guest-checkout]');
  }
  const end = new Date().getTime();
  console.log(`TOTAL EXECUTION TIME: ${(end - startTime)/1000} seconds`);
}

run();
