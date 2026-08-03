from pathlib import Path
import json,re,sys
from PIL import Image
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
errors=[]; checks=[]
def check(cond,msg):
    checks.append((cond,msg))
    if not cond: errors.append(msg)
required=['index.html','styles.css','app.js','sw.js','manifest.webmanifest','README.md','404.html','assets/icon-192.png','assets/icon-512.png']
for f in required: check((ROOT/f).is_file(),f'Ressource présente : {f}')
manifest=json.loads((ROOT/'manifest.webmanifest').read_text())
check(manifest.get('display')=='standalone','Manifeste en mode standalone')
check(manifest.get('start_url')=='./','Start URL relative compatible GitHub Pages')
check(len(manifest.get('icons',[]))>=2,'Deux tailles d’icônes déclarées')
for sz in (192,512):
    im=Image.open(ROOT/f'assets/icon-{sz}.png')
    check(im.size==(sz,sz),f'Icône {sz}×{sz} valide')
html=(ROOT/'index.html').read_text()
js=(ROOT/'app.js').read_text()
check("const fragments = ['JEANNE','ENTRE','DANS','ORLÉANS','LE','29','AVRIL','1429']" in js,'Huit fragments historiques présents')
check(js.count("fragment:'") == 8,'Huit missions définies')
combined=js+html
for word in ['localStorage','serviceWorker','speechSynthesis','Mode mission courte','Mode adulte']:
    check(word in combined,f'Fonctionnalité présente : {word}')
sw=(ROOT/'sw.js').read_text()
for f in ['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png']:
    check(f in sw,f'Cache hors ligne référence {f}')
for token in ['lang="fr"','name="viewport"','aria-live="polite"','<main id="app"','<link rel="manifest"']:
    check(token in html,f'HTML/accessibilité : {token}')
# Ensure all queried static IDs exist in HTML
ids=set(re.findall(r'id="([^"]+)"',html))
queried=set(re.findall(r"querySelector\('#([^']+)'\)",js))
missing=sorted(i for i in queried if i not in ids and i not in {'startBtn','continueBtn','restartPrompt','littleToggle','littleWrap','littleInput','nameInput','readMode','setupNext','acceptBtn','finalBtn','backMap','missionContent','shortDone','obsNext','hintBtn','openAnswer','voiceBtn','finishMission','rewardNext','chestFinal','finalTarget','finalSource','finalHint','finalCheck','printBtn','reviewBtn'})
check(not missing,f'IDs statiques cohérents ({missing or "aucun manquant"})')
print('\n'.join(('PASS ' if ok else 'FAIL ')+msg for ok,msg in checks))
print(f'\n{sum(x for x,_ in checks)}/{len(checks)} contrôles réussis')
sys.exit(1 if errors else 0)
