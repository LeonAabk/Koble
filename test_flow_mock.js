const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
  const page = await context.newPage();

  await page.goto('http://localhost:8000');

  // Inject mock data
  await page.evaluate(() => {
      // Override getJobs to return a rejected job
      window.getJobs = async function(onlyApproved) {
          const rejectedJob = {
              id: "mock-id-123",
              title: "Mock Job",
              category: "Gårdsarbeid",
              location: "Hamar",
              pay: "100",
              email: "leon.aabak@gmail.com",
              description: "[STATUS:REJECTED]\n\n[REASON:Mangler timepris]\n\nNår: Neste uke\n\nTrenger hjelp",
              is_approved: false,
              created_at: new Date().toISOString(),
              user_id: '1c22e5f1-5c24-4b58-ad8f-f83cc3fd584a'
          };
          if (onlyApproved) return [];
          return [rejectedJob];
      };

      // Override supabase to return our mock job
      supabaseClient.from = function(table) {
          return {
              select: function(cols) {
                  return {
                      eq: function(field, val) {
                          return {
                              order: async function(field, opts) {
                                  const rejectedJob = {
                                      id: "mock-id-123",
                                      title: "Mock Job",
                                      category: "Gårdsarbeid",
                                      location: "Hamar",
                                      pay: "100",
                                      email: "leon.aabak@gmail.com",
                                      description: "[STATUS:REJECTED]\n\n[REASON:Mangler timepris]\n\nNår: Neste uke\n\nTrenger hjelp",
                                      is_approved: false,
                                      created_at: new Date().toISOString(),
                                      user_id: '1c22e5f1-5c24-4b58-ad8f-f83cc3fd584a'
                                  };
                                  return { data: [rejectedJob], error: null };
                              }
                          }
                      }
                  }
              }
          }
      };

      currentUser = { email: 'leon.aabak@gmail.com', id: '1c22e5f1-5c24-4b58-ad8f-f83cc3fd584a' };
      document.getElementById('employer-role-btn').click();
      setTimeout(() => {
          document.getElementById('tab-my-jobs').click();
      }, 500);
  });

  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'employer-dashboard-rejected.png' });
  console.log("Employer dashboard screenshot taken.");

  // Also check admin dashboard
  await page.evaluate(() => {
      currentUser = { email: 'admin@koble.no', id: 'fake-admin-id' };
      window.location.hash = '#admin';
      renderAdminJobs();
  });

  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'admin-dashboard-rejected.png' });

  // Test edit click
  await page.evaluate(() => {
      currentUser = { email: 'leon.aabak@gmail.com', id: '1c22e5f1-5c24-4b58-ad8f-f83cc3fd584a' };
      document.getElementById('employer-role-btn').click();
      setTimeout(() => {
          document.getElementById('tab-my-jobs').click();
          setTimeout(() => {
              const editBtn = document.querySelector('.edit-btn');
              if (editBtn) editBtn.click();
          }, 500);
      }, 500);
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'edit-rejected-job.png' });

  await browser.close();
})();
