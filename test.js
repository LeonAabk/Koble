const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        recordVideo: { dir: 'videos/' }
    });
    const page = await context.newPage();

    // Log in as user and create a worker profile
    await page.goto('http://localhost:3000/index.html');
    await page.click('button#nav-login-btn'); // Open modal
    await page.waitForSelector('#auth-email', { state: 'visible' });

    await page.click('#toggle-auth-mode-btn'); // Switch to register
    await page.fill('#auth-email', 'testuser' + Math.random() + '@example.com');
    await page.fill('#auth-password', 'password123');
    await page.click('#auth-submit-btn'); // Register

    // Wait a bit
    await page.waitForTimeout(3000);

    // Register profile
    await page.goto('http://localhost:3000/registrer-profil.html');
    await page.waitForSelector('#profile-title', { state: 'visible' });
    await page.fill('#profile-title', 'Test Profile');
    await page.selectOption('#profile-group-type', 'Enkeltperson');
    await page.selectOption('#profile-location', 'Hamar');
    await page.fill('#profile-description', 'I am a test worker');
    await page.fill('#profile-email', 'testworker@example.com');
    await page.fill('#profile-phone', '12345678');
    await page.click('#btn-submit-profile');

    // Wait to redirect
    await page.waitForTimeout(3000);

    // Check that it's in the worker feed (as pending for the owner)
    await page.goto('http://localhost:3000/index.html');

    await page.evaluate(() => {
       document.querySelector('#youth-view').classList.remove('hidden');
       document.querySelector('#landing-view').classList.add('hidden');
    });

    await page.waitForSelector('#main-tab-workers', { state: 'visible' });
    await page.click('#main-tab-workers');
    await page.waitForTimeout(2000);

    // Try to open edit modal
    await page.click('.edit-worker-btn');
    await page.waitForTimeout(1000);

    // Screenshot
    await page.screenshot({ path: 'screenshot-edit.png' });

    await context.close();
    await browser.close();
})();
