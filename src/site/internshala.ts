import { Page } from "playwright";

export async function scrapeInternshala(page: Page) {
    await page.goto("https://internshala.com/student/applications?referral=header");

    const internships: any[] = [];
    const links: string[] = [];
    // await page.pause();

    while(true){

        await page.waitForSelector('.body-small.text-n400', { timeout: 15000 });
        const applications = page.locator('.body-small.text-n400').locator("..").locator("..");

        const count = await applications.count();
        console.log(`Cards: ${count}, links so far: ${links.length}`);
        
        for(let i=0; i< count; i++){
            const elem = applications.nth(i);
    
            const link  = await elem.locator('a').nth(0)?.getAttribute("href") ?? "";
            if(link.includes("/internship/detail")) links.push(link);
        }
        // page.pause();

        // wait for pagination to fully render before checking
        await page.waitForSelector('.pagination', { timeout: 5000 }).catch(() => {});

        const next_btn = page.getByRole('link', { name: 'Next' });
        const isPresent = (await next_btn.count()) > 0;
        const isDisabled = isPresent && (await next_btn.getAttribute("aria-disabled")) === "true";

        console.log(`next present: ${isPresent}, disabled: ${isDisabled}`);

        if (!isPresent || isDisabled) break;

        await next_btn.click();
        const firstCardText = await page.locator('.body-small.text-n400').first().textContent();
        await page.waitForLoadState("domcontentloaded");

        //DOM is not reloading only the content in the tags is changing
        await page.waitForFunction((oldText) => {
            const el = document.querySelector('.body-small.text-n400');
            return el && el.textContent !== oldText;
        }, firstCardText);
 
    }
    // console.log(`Final count: ${links.length}`);
    // console.log(links);
    const uniqueLinks = [...new Set(links)];

    for(let i=0; i< uniqueLinks.length; i++){

        await page.goto(uniqueLinks[i]);
        await page.waitForSelector("#details_container");

        const container = page.locator("#details_container");


        const domain = await container.locator(".heading_4_5.profile").textContent();
        const company = await container.locator('.heading_6').first().locator("a").textContent();
        const duration = await container.locator(".ic-16-calendar").first().locator("..").locator("..").locator(".item_body").textContent();
        const location = await container.locator("#location_names").locator("a").textContent();
        const stipend = await container.locator(".other_detail_item.stipend_container").locator(".item_body").locator("span").textContent();
        const applicants = await container.locator(".applications_message").textContent();

        const details = {
            domain: domain?.trim(),
            company: company?.trim(),
            location: location?.trim(),
            duration: duration?.trim(),
            stipend: stipend?.replace("/month", "").trim(),
            applicants: applicants?.replace("applicants", "").trim()
        }

        internships.push(details);
    }

    console.table(internships);
}

// URL changes?          → waitForURL
// Element appears?      → waitForSelector
// Network request?      → waitForResponse
// Page reloads?         → waitForLoadState
// Content changes?      → waitForFunction 