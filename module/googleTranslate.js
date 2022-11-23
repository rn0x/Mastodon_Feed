import puppeteer from 'puppeteer';

export default async function googleTranslate(text) {

    try {

        let launchOptions = { headless: true, args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'] };
        let browser = await puppeteer.launch(launchOptions);
        let page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        // https://translate.google.com/#view=home&op=translate&sl=auto&tl=ar&text=${text}

        await page.goto(`https://translate.google.com/?hl=ar&sl=auto&tl=ar&text=${text}`, {
            waitUntil: 'load',
            timeout: 0
        });
        let XPath = '/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[3]/c-wiz[2]/div/div[8]/div/div[1]/span[1]/span/span'
        await page.waitForXPath(XPath);
        let [element] = await page.$x(XPath);
        let translate = await page.evaluate(e => e.textContent, element);
        await browser.close();
        return translate

    } catch (error) {

        return undefined
    }
}