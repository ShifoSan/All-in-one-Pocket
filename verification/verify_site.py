from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_homepage(page: Page):
    print("Navigating to homepage...")
    page.goto("http://localhost:8080/index.html")

    # Verify title
    expect(page).to_have_title("All-in-one Pocket | Modern Multi-Tool Hub")

    # Verify Search Bar exists
    search_input = page.locator("#searchInput")
    expect(search_input).to_be_visible()

    # Verify Filter Buttons
    expect(page.get_by_role("button", name="Converters")).to_be_visible()

    # Verify Sections
    expect(page.locator("h3").filter(has_text="Converters")).to_be_visible()

    # Verify Theme Toggle
    expect(page.locator("#themeToggle")).to_be_visible()

    # Take screenshot
    print("Taking screenshot of homepage...")
    page.screenshot(path="verification/homepage.png")

def verify_tool_page(page: Page):
    print("Navigating to Unit Converter...")
    page.goto("http://localhost:8080/tools/unit-converter.html")

    # Verify Header
    expect(page.locator(".app-header")).to_be_visible()
    expect(page.get_by_role("link", name="Back to Hub")).to_be_visible()

    # Verify content
    expect(page.get_by_role("heading", name="Unit Converter")).to_be_visible()

    # Take screenshot
    print("Taking screenshot of tool page...")
    page.screenshot(path="verification/unit_converter.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_homepage(page)
            verify_tool_page(page)
            print("Verification complete!")
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
