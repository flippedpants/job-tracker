import { Page } from "playwright";

export async function login(page: Page, email: string | undefined, password: string | undefined){
    await page.goto("https://internshala.com");

    if (await page.locator("text=Hi, ").isVisible().catch(() => false)){
        console.log("Already logged in");
        return;
    }

    if (typeof email === "undefined" || typeof password === "undefined"){
        throw new Error("Email/password is required for first login");
    }

    await page.click(".login-cta");
    await page.waitForSelector("#login-modal");

    await page.fill("#modal_email", email)
    await page.fill("#modal_password", password);

    const login_btn = await page.$("#modal_login_submit");
    await   login_btn?.click()
    await page.waitForURL("**/student/dashboard");

    await page.context().storageState({ path: "auth.json"});
}