const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log('Dialog detected: ' + dialog.message());
    await dialog.accept('Mangler timepris'); // Provide rejection reason
  });

  await page.goto('http://localhost:8000');

  // Wait a bit
  await page.waitForTimeout(1000);

  // Inject an admin user temporarily to test admin view
  await page.evaluate(() => {
      currentUser = { email: 'admin@koble.no', id: 'fake-admin-id' };
      window.location.hash = '#admin';
      handleRouting();
  });

  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'admin-dashboard.png' });
  console.log("Admin dashboard screenshot taken.");

  // Find a job to reject
  const rejectBtn = await page.$('.admin-reject-btn');
  if (rejectBtn) {
      console.log("Found reject button, clicking...");
      await rejectBtn.click();
      await page.waitForTimeout(2000); // wait for update
  } else {
      console.log("No reject button found");
  }

  // Inject a regular user and open employer dashboard explicitly to "Mine publiserte oppdrag"
  await page.evaluate(() => {
      currentUser = { email: 'leon.aabak@gmail.com', id: '1c22e5f1-5c24-4b58-ad8f-f83cc3fd584a' }; // from check_db3.py
      document.getElementById('employer-role-btn').click();
      setTimeout(() => {
          document.getElementById('tab-my-jobs').click();
      }, 500);
  });

  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'employer-dashboard2.png' });
  console.log("Employer dashboard screenshot taken.");

  await browser.close();
})();
