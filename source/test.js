const puppeteer = require('puppeteer');


describe('test localStorage', () => {
    let browser, page;
    beforeEach(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:9999', { waitUntil: 'load' });
        await page.evaluate(() => {
            var p = new Person("John", 33, 'male');
            instanceBox.use('local');
            instanceBox.set("Persons/John", p);
        });
        
    });
    test('should return John`s data', async () => {
        // await page.screenshot({path:'example.png'});
        await page.goto('http://localhost:9999', { waitUntil: 'load' });

        var jo = await page.evaluate(() => {
            instanceBox.use('local');
            return instanceBox.get("Persons/John")
        });
        expect(jo.name).toBe('John');
        expect(jo.data.age).toBe(33);
        await page.evaluate(() => instanceBox.clear());
        await browser.close();
    });
});

describe('test sessionStorage', () => {
    let browser, page;
    beforeEach(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:9999', { waitUntil: 'load' });
        await page.evaluate(() => {
            var p = new Person("Moana", 41, 'female');
            instanceBox.use('session');
            instanceBox.set("Persons/Moana", p);
        });

    });
    test('should return Moana`s data', async () => {
        // await page.screenshot({ path: 'example.png' });
        await page.goto('http://localhost:9999', { waitUntil: 'load' });

        var moana = await page.evaluate(() => {
            instanceBox.use('session');
            return instanceBox.get("Persons/Moana")
        });
        expect(moana.name).toBe('Moana');
        expect(moana.data.age).toBe(41);
        expect(moana.data.gender).toBe('female');
        await page.evaluate(() => instanceBox.clear());
        await browser.close();
    });
});
