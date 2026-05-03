import { chromium } from "playwright";
import {login} from "./auth/auth.Internshala";
import { scrapeInternshala } from "./site/internshala";
import 'dotenv/config';
import fs from "fs";

const browser = await chromium.launch({"headless": false });

const context = await browser.newContext({
    storageState: fs.existsSync("auth.json") ? "auth.json" : undefined,
});

const page = await context.newPage();

const email = process.env.email;
const password = process.env.password;

await login(page, email, password);
await scrapeInternshala(page);