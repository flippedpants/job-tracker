import { chromium } from "playwright";

const browser = await chromium.launch({headless: false});
const page = await browser.newPage();

await page.goto("https://books.toscrape.com");
await page.waitForSelector(".product_pod");

const books = await page.$$eval(".product_pod", (cards) => {
    return cards.slice(0,5).map(card => ({
        title: card.querySelector("h3 a")?.getAttribute("title") ?? "",
        price: card.querySelector(".price_color")?.textContent ?? "",
        availability: card.querySelector(".product_price .instock")?.textContent.trim() ?? ""
    }))
})

console.table(books)
await browser.close();