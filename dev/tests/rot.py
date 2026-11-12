import asyncio
from playwright.async_api import async_playwright
import os; S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/'; os.makedirs(S,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(**p.devices['Pixel 7']); await ctx.route('https://**',lambda r:r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(400)
        await pg.screenshot(path=S+'rot_title.png')
        await pg.click('#btnTeacher'); await pg.fill('#tCode','2026'); await pg.click('#btnTCode'); await pg.select_option('#tCountry','KR'); await pg.click('#btnTStart'); await pg.wait_for_timeout(800)
        await pg.screenshot(path=S+'rot_game.png'); print(errs)
        await b.close()
asyncio.run(main())
