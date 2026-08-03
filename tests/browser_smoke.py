from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path('/mnt/data/chronique-jeanne-v4')
html=(root/'index.html').read_text()
css=(root/'styles.css').read_text()
js=(root/'app.js').read_text()
js="const testStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v},removeItem(k){delete this.data[k]}};"+js.replace('localStorage','testStorage').replace("if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');",'')
html=html.replace('<link rel="stylesheet" href="styles.css">',f'<style>{css}</style>')
html=html.replace('<script src="app.js" defer></script>',f'<script>{js}</script>')
results={}
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=browser.new_page(viewport={"width":390,"height":844})
  page.set_content(html,wait_until='domcontentloaded')
  results['title']=page.title()
  results['home']=page.locator('h1').inner_text()
  page.fill('#nameInput','Aelys'); page.click('#startBtn')
  results['map_steps']=page.locator('.map-step').count()
  page.locator('[data-open="martroi"]').click()
  results['mission_title']=page.locator('.mission-head h1').inner_text()
  results['game_count_text']=page.locator('.game .eyebrow').inner_text()
  results['overflow']=page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
  page.click('#settingsBtn'); page.check('#expressToggle'); page.locator('#settingsDialog .primary').click()
  for i in [0,1,2]: page.locator(f'[data-multi="{i}"]').click()
  page.click('[data-checkmulti]'); page.wait_for_timeout(900)
  results['reward']=page.locator('.reward h1').inner_text()
  page.locator('[data-next="0"]').click()
  results['transition']=page.locator('.transition h1').inner_text()
  results['address_present']=page.locator('.address').count()==1
  browser.close()
(root/'tests'/'browser-smoke.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
assert results['title'].endswith('V4')
assert results['map_steps']==8
assert results['mission_title']=='Le cheval de bronze'
assert results['overflow']
assert results['reward']=='L’épée du courage'
assert results['transition']=='Maison de Jeanne d’Arc'
assert results['address_present']
