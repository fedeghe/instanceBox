const puppeteer = require('puppeteer');


describe('test localStorage', () => {
    let browser, page;
    beforeEach(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:9999', { waitUntil: 'load' });
        await page.evaluate(() => {
            var p = new Person("John", 33, 'male');
            instanceBox.useLocalStorage();
            instanceBox.set("Persons/John", p);
        });
    });
    test('should return John`s data', async () => {
        // await page.screenshot({path:'example.png'});
        await page.goto('http://localhost:9999/#5', { waitUntil: 'load' });

        var data = await page.evaluate(() => {
            instanceBox.useLocalStorage();
                return [
                    instanceBox.get("Persons/John"),
                    instanceBox.getSize("Persons/John")
                ]
            }),
            jo = data[0],
            size = data[1];

        expect(jo.name).toBe('John');
        expect(jo.age).toBe(33);
        expect(size).toBe(580);
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
            p.setSurname('Pozzi');
            instanceBox.useSessionStorage();
            instanceBox.set("Persons/Moana", p);
        });
    });
    test('should return Moana`s data', async () => {
        // await page.screenshot({ path: 'example.png' });
        await page.goto('http://localhost:9999/#3', { waitUntil: 'load' });
        var data = await page.evaluate(() => {
            instanceBox.useSessionStorage();
                return [
                    instanceBox.get("Persons/Moana"),
                    instanceBox.getSize("Persons/Moana")
                ];
            }),
            moana = data[0],
            size = data[1];
        expect(moana.name).toBe('Moana');
        expect(moana.age).toBe(41);
        expect(moana.gender).toBe('female');

        expect(size).toBe(644);
        await page.evaluate(() => instanceBox.clear());
        await browser.close();
    });
});
