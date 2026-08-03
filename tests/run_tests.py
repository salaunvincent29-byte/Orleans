#!/usr/bin/env python3
from __future__ import annotations
import json, re, subprocess, sys, xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
results=[]
def check(name,cond,detail=''):
    results.append((name,bool(cond),detail))
    if not cond: print(f'FAIL: {name} {detail}')

def contrast(a,b):
    def L(h):
        vals=[]
        for i in (1,3,5):
            c=int(h[i:i+2],16)/255
            vals.append(c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4)
        return .2126*vals[0]+.7152*vals[1]+.0722*vals[2]
    x,y=sorted((L(a),L(b)),reverse=True)
    return (x+.05)/(y+.05)

required=['index.html','styles.css','app.js','sw.js','manifest.webmanifest','404.html','README.md']
for f in required: check(f'Fichier {f}',(ROOT/f).is_file())
assets=['icon-192.png','icon-512.png','hero.svg','brouilleur.svg','martroi.svg','maison.svg','loire.svg','cathedrale.svg','groslot.svg','campo.svg','train.svg','cabu.svg']
for f in assets: check(f'Asset {f}',(ROOT/'assets'/f).is_file())

html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'styles.css').read_text(encoding='utf-8')
js=(ROOT/'app.js').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
manifest=json.loads((ROOT/'manifest.webmanifest').read_text(encoding='utf-8'))

check('Langue française','<html lang="fr">' in html)
check('Viewport mobile','viewport-fit=cover' in html)
check('Lien manifeste','manifest.webmanifest' in html)
check('Zone principale accessible','id="app"' in html and 'aria-live="polite"' in html)
check('Navigation étiquetée','aria-label="Navigation principale"' in html)
check('Lien d’évitement','skip-link' in html)
check('Contrôles >= 44px','--tap:52px' in css)
check('Réduction des animations','prefers-reduced-motion' in js and 'reduced-motion' in css)
check('Contraste renforcé','high-contrast' in css)
check('Impression du diplôme','@media print' in css)

check('Nom PWA',manifest.get('name')=='La Chronique des huit preuves')
check('Start URL relatif',manifest.get('start_url')=='./')
check('Scope relatif',manifest.get('scope')=='./')
check('Mode standalone',manifest.get('display')=='standalone')
check('Langue manifeste',manifest.get('lang')=='fr-FR')
check('Deux icônes',len(manifest.get('icons',[]))==2)
for size in (192,512):
    with Image.open(ROOT/'assets'/f'icon-{size}.png') as im:
        check(f'Icône {size}x{size}',im.size==(size,size),str(im.size))

for svg in [x for x in assets if x.endswith('.svg')]:
    try: ET.parse(ROOT/'assets'/svg); ok=True
    except Exception as e: ok=False; detail=str(e)
    check(f'SVG valide {svg}',ok,detail if not ok else '')

# JavaScript and data structure
node=subprocess.run(['node','--check',str(ROOT/'app.js')],capture_output=True,text=True)
check('Syntaxe app.js',node.returncode==0,node.stderr.strip())
node_sw=subprocess.run(['node','--check',str(ROOT/'sw.js')],capture_output=True,text=True)
check('Syntaxe sw.js',node_sw.returncode==0,node_sw.stderr.strip())
check('Version V3',"APP_VERSION = '3.0.0'" in js)
check('Huit missions',len(re.findall(r"id:'(?:martroi|maison|loire|cathedrale|groslot|campo|train|cabu)'\s*,\s*title:",js))==8)
check('36 épreuves de lieux',len(re.findall(r"\{id:'m[1-8]-",js))==36)
check('Quatre manches finales',len(re.findall(r"\{id:'f-",js))==4)
for t in ['single','singleVisual','multi','fieldSelect','order','sort','match','map','rotatePuzzle','memorySequence','collect']:
    check(f'Moteur {t}',f"case '{t}'" in js or f"case 'multi':case 'fieldSelect'" in js if t in ('multi','fieldSelect') else f"case '{t}'" in js)
check('Sauvegarde locale','localStorage.setItem' in js and 'localStorage.getItem' in js)
check('Aucune géolocalisation','geolocation' not in js.lower())
check('Service worker enregistré',"serviceWorker.register('./sw.js')" in js)
check('Mode fatigue','state.fatigue' in js and 'effectiveStages' in js)
check('Mode adulte','adultCompleteBtn' in js and 'adultFinalBtn' in js)
check('Synthèse vocale','SpeechSynthesisUtterance' in js)

# Offline cache integrity
cached=re.findall(r"'\./([^']*)'",sw)
for rel in cached:
    p=ROOT/rel if rel else ROOT/'index.html'
    check(f'Cache présent {rel or "./"}',p.exists(),str(p))
check('Cache versionné','huit-preuves-v3.0.0' in sw)
check('Fallback navigation',"caches.match('./index.html')" in sw)

# No runtime CDN / external dependencies
external=[]
for name,text in [('index.html',html),('styles.css',css),('app.js',js),('sw.js',sw)]:
    if re.search(r'https?://',text): external.append(name)
check('Aucune dépendance réseau',not external,','.join(external))

# Key contrast pairs (WCAG AA text)
pairs=[('#231b17','#fffdf7'),('#17365d','#fffdf7'),('#ffffff','#17365d'),('#8a3030','#fffdf7'),('#665d55','#fffdf7')]
for fg,bg in pairs: check(f'Contraste {fg}/{bg}',contrast(fg,bg)>=4.5,f'{contrast(fg,bg):.2f}:1')

passed=sum(x[1] for x in results);total=len(results)
out='\n'.join([f"{'PASS' if ok else 'FAIL'} | {name}"+(f' | {detail}' if detail else '') for name,ok,detail in results])
(ROOT/'tests'/'test-results.txt').write_text(out+f'\n\n{passed}/{total} tests réussis.\n',encoding='utf-8')
print(f'{passed}/{total} tests réussis.')
sys.exit(0 if passed==total else 1)
