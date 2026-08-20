const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // Inject mock data
  await page.evaluate(() => {
      window.mockUpdateData = null;

      const realFrom = supabaseClient.from.bind(supabaseClient);

      // Override supabase to return our mock job
      supabaseClient.from = function(table) {
          if (table !== 'jobs') return realFrom(table);

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
              },
              update: function(data) {
                  window.mockUpdateData = data;
                  console.log("Mock update called with", data);
                  return {
                      eq: function(f, v) {
                          return {
                              eq: function(f2, v2) {
                                  return {
                                      select: async function() {
                                          console.log("Returning mock data from select");
                                          return { data: [{id: 'mock-id-123'}], error: null };
                                      }
                                  }
                              },
                              select: async function() {
                                  console.log("Returning mock data from select");
                                  return { data: [{id: 'mock-id-123'}], error: null };
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
          setTimeout(() => {
              const editBtn = document.querySelector('.edit-btn');
              if (editBtn) editBtn.click();
          }, 500);
      }, 500);
  });

  await page.waitForTimeout(2000);

  // Submit the form
  await page.click('button:has-text("Oppdater jobb")');
  await page.waitForTimeout(1000);

  const updateData = await page.evaluate(() => window.mockUpdateData);
  console.log("Update Data:", updateData);

  await browser.close();
})();
