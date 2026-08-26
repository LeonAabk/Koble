from playwright.sync_api import sync_playwright

def run_cuj(page):
    # 1. Load the page to see Hero and H1
    page.goto("http://localhost:3000")
    page.wait_for_timeout(1000)

    # Check H1 and new buttons
    page.wait_for_selector(".hero-section h1")
    page.wait_for_selector("#employer-role-btn-hero")
    page.wait_for_selector("#worker-role-btn-hero")

    # Capture hero screenshot
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(500)

    # 2. Scroll to see the preview cards (to verify gap and badges)
    page.evaluate("window.scrollBy(0, 400)")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    import os
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
