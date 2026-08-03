from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path('/mnt/data/chronique-jeanne-v4')
html=(root/'index.html').read_text(); css=(root/'styles.css').read_text(); js=(root/'app.js').read_text()
js="const testStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v},removeItem(k){delete this.data[k]}};"+js.replace('localStorage','testStorage').replace("if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');",'')
html=html.replace('<link rel="stylesheet" href="styles.css">',f'<style>{css}</style>').replace('<script src="app.js" defer></script>',f'<script>{js}</script>')
res={'screens':[],'transitions':[]}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 pg=b.new_page(viewport={'width':390,'height':844}); pg.set_content(html)
 pg.evaluate("state.started=true;state.name='Test';")
 for i in range(8):
  for g in range(2):
   pg.evaluate(f"state.active={i};state.game={g};state.express=false;showMission({i})")
   res['screens'].append({'mission':i,'game':g,'title':pg.locator('.game h2').inner_text(),'overflow':pg.evaluate('document.documentElement.scrollWidth<=window.innerWidth')})
 for i in range(7):
  pg.evaluate(f'showTransition({i})')
  res['transitions'].append(pg.locator('.transition h1').inner_text())
 pg.evaluate('showFinal()')
 res['final']=pg.locator('.game h2').inner_text()
 b.close()
(root/'tests'/'browser-all-screens.json').write_text(json.dumps(res,ensure_ascii=False,indent=2))
print(json.dumps({'screen_count':len(res['screens']),'transitions':len(res['transitions']),'final':res['final'],'all_no_overflow':all(x['overflow'] for x in res['screens'])},ensure_ascii=False,indent=2))
assert len(res['screens'])==16
assert len(res['transitions'])==7
assert res['final']=='La dernière énigme'
assert all(x['overflow'] for x in res['screens'])
