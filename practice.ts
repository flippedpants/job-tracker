import { chromium } from "playwright";

// const browser = await chromium.launch({headless: false});
// const page = await browser.newPage();

// await page.goto("https://books.toscrape.com");
// const allBooks: {title: String, price: String}[] = []; 

// while(true){
//     await page.waitForSelector(".product_pod");

//     const books = await page.$$eval(".product_pod", (cards) => {
//         return cards.slice(0,5).map(card => ({
//             title: card.querySelector("h3 a")?.getAttribute("title") ?? "",
//             price: card.querySelector(".price_color")?.textContent ?? "",
//            // availability: card.querySelector(".product_price .instock")?.textContent.trim() ?? ""
//         }))
//     })

//     allBooks.push(...books);
//     const next_btn = await page.$("li.next a");
//     if(!next_btn) break;


//   await Promise.all([
//     page.waitForNavigation({ waitUntil: "domcontentloaded" }),
//     next_btn.click(),
//   ]);
//     // next_btn.click()
//     // await page.waitForLoadState("networkidle");
// }

// console.table(allBooks.slice(0,10))
// await browser.close();

{
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://practicetestautomation.com/practice-test-login/");
  await page.fill("#username", "student");
  await page.fill("#password", "Password123");
  await page.click("#submit");
  await page.waitForURL("**/logged-in-successfully/");

  await context.storageState({ path: "session.json" });
  console.log("Session saved!");

  await browser.close();
}

const browser = await chromium.launch({ headless: false });


// load saved session
const context = await browser.newContext({
  storageState: "session.json",
});

const page = await context.newPage();
await page.goto("https://practicetestautomation.com/practice-test-login/");

console.log("Loaded at:", page.url());

await browser.close();