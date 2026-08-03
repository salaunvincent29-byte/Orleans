from pathlib import Path
import json,re,sys
root=Path(__file__).resolve().parents[1]
checks=[]
def check(name,cond):
    checks.append((name,bool(cond)))
files=['index.html','styles.css','app.js','sw.js','manifest.webmanifest','README.md','404.html']
for f in files: check(f'Fichier {f}',(root/f).is_file())
for f in ['hero.svg','martroi.svg','maison.svg','loire.svg','cathedrale.svg','groslot.svg','campo.svg','train.svg','cabu.svg','icon-192.png','icon-512.png']:
    check(f'Asset {f}',(root/'assets'/f).is_file())
man=json.loads((root/'manifest.webmanifest').read_text())
check('Manifest start_url relatif',man.get('start_url')=='./')
check('Manifest standalone',man.get('display')=='standalone')
js=(root/'app.js').read_text()
check('Version 4.0.0',"VERSION='4.0.0'" in js)
check('8 missions',len(re.findall(r"\{id:'(?:martroi|maison|loire|cathedrale|groslot|campo|train|cabu)'",js))==8)
check('7 transitions',js.count("name:'")>=7)
for place in ['Place du Martroi','Maison de Jeanne d’Arc','Bords de Loire','Cathédrale Sainte-Croix','Hôtel Groslot','Campo Santo','Petit train touristique','Hôtel Cabu']:
    check(f'Lieu {place}',place in js)
check('Deux jeux par lieu',js.count("games:[") == 8)
check('Mode express', 'state.express' in js)
check('Sauvegarde locale','localStorage' in js)
check('Service worker enregistré',"serviceWorker.register('./sw.js')" in js)
check('Adresse Maison','3 place du Général-de-Gaulle' in js)
check('Adresse Cathédrale','Place Sainte-Croix' in js)
check('Adresse Hôtel Groslot','2 place de l’Étape' in js)
check('Finale 29 avril 1429','29 avril 1429' in js)
sw=(root/'sw.js').read_text()
for f in ['./index.html','./styles.css','./app.js','./manifest.webmanifest']:
    check(f'Cache {f}',f in sw)
failed=[n for n,v in checks if not v]
out='\n'.join(('OK   ' if v else 'FAIL ')+n for n,v in checks)
(root/'tests'/'test-results.txt').write_text(out+'\n')
print(out)
print(f'\n{len(checks)-len(failed)}/{len(checks)} tests réussis')
sys.exit(1 if failed else 0)
