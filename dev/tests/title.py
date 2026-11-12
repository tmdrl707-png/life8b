import os
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':760}); await pg.route('https://**',lambda r:r.abort())
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','title.png')); await b.close()
asyncio.run(main())
