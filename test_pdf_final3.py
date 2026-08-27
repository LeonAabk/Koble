import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        import subprocess
        server = subprocess.Popen(["python3", "-m", "http.server", "3000", "--bind", "0.0.0.0"])
        await asyncio.sleep(2)

        await page.goto('http://localhost:3000/')

        # Click the Kalkulator link to show the view explicitly
        await page.click('#nav-calculator-btn')

        await page.wait_for_selector('#download-pdf-btn', state='visible')

        # Fill inputs
        await page.fill('#calc-employer', 'Test Employer')
        await page.fill('#calc-worker', 'Test Worker')
        await page.fill('#calc-task', 'Test Task')
        await page.fill('#calc-persons', '2')
        await page.fill('#calc-hours', '5')
        await page.fill('#calc-rate', '200')

        async with page.expect_download() as download_info:
            await page.click('#download-pdf-btn')

        download = await download_info.value
        await download.save_as('downloaded_test_final3.pdf')

        server.terminate()
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
