import * as puppeteer from 'puppeteer';
import { ElementHandle } from 'puppeteer';

const certFile = 'cert_file_path';
const keyFile = 'key_file_path';
const password = 'password';

const run = async () => {
    const option = {
        ignoreDefaultArgs: [
            '--disable-extensions',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
            '--start-maximized',
        ],
        args: [
            '--no-sandbox',
        ],
        headless: false,
    };
    const browser = await puppeteer.launch(option);
    const [page] = await browser.pages();
    await page.goto('https://www.sat.gob.mx/personas/iniciar-sesion');

    const frame = page.frames()[1];

    let button = await frame.waitForSelector('#buttonFiel');
    button.click();

    const certInput = await frame.waitForSelector('#fileCertificate') as ElementHandle<HTMLInputElement>;
    await certInput.uploadFile(certFile);

    const keyInput = await frame.$('#filePrivateKey') as ElementHandle<HTMLInputElement>;
    await keyInput.uploadFile(keyFile);

    const passwordInput = await frame.$('#privateKeyPassword');
    await passwordInput.type(password);
    await frame.click('#submit');

    button = await page.waitForSelector('#campo-busqueda a');
    button.click();

    button = await page.waitForSelector('.ui-dialog-buttonset button:nth-child(2)');
    button.click();
}

run();