from pathlib import Path
import json, re, sys, zipfile, xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name,cond,detail=''):
    checks.append((name,bool(cond),detail))

required=['index.html','styles.css','app.js','sw.js','manifest.webmanifest','404.html','.nojekyll','README.md']
for f in required: check(f'Fichier requis : {f}',(ROOT/f).exists())
for f in ['hero.svg']+[f'm{i}.svg' for i in range(1,9)]+['icon-192.png','icon-512.png']:
    check(f'Asset : {f}',(ROOT/'assets'/f).exists())
for f in ['hero.svg']+[f'm{i}.svg' for i in range(1,9)]:
    try:
        ET.parse(ROOT/'assets'/f); ok=True
    except Exception:
        ok=False
    check(f'SVG valide : {f}',ok)

manifest=json.loads((ROOT/'manifest.webmanifest').read_text())
check('Manifest start_url relatif',manifest.get('start_url')=='./')
check('Manifest scope relatif',manifest.get('scope')=='./')
check('Manifest standalone',manifest.get('display')=='standalone')
check('Deux icônes PWA',len(manifest.get('icons',[]))>=2)

html=(ROOT/'index.html').read_text()
js=(ROOT/'app.js').read_text()
css=(ROOT/'styles.css').read_text()
sw=(ROOT/'sw.js').read_text()
check('Langue française','lang="fr"' in html)
check('Viewport mobile','viewport-fit=cover' in html)
check('Lien manifeste','manifest.webmanifest' in html)
check('Navigation accessible','aria-label="Navigation principale"' in html)
check('Version JS V2',"APP_VERSION = '2.0.0'" in js)
check('Huit définitions de missions',len(re.findall(r"id:'(?:sentinelle|maison|loire|vitrail|memoire|silence|train|musee)'",js))==8)
for marker in ['renderSwapPuzzle','Labyrinthe des patrouilles','Memory des objets','Bingo des monuments','Histoire ou mémoire ?','Le message codé']:
    check(f'Micro-jeu présent : {marker}',marker in js)
check('Mode contraste','.high-contrast' in css)
check('Réduction animations','.reduced-motion' in css)
check('Attribut hidden respecté','[hidden]{display:none!important}' in css)
check('Styles impression','@media print' in css)
check('Cache versionné V2','chronique-jeanne-v2.0.0' in sw)
for f in ['index.html','styles.css','app.js','manifest.webmanifest','assets/hero.svg']+[f'assets/m{i}.svg' for i in range(1,9)]:
    check(f'Cache : {f}',f"'./{f}'" in sw or f=='.nojekyll')

failed=[x for x in checks if not x[1]]
for name,ok,detail in checks: print(('PASS' if ok else 'FAIL'),'-',name,detail)
print(f'\n{len(checks)-len(failed)}/{len(checks)} contrôles réussis')
sys.exit(1 if failed else 0)
