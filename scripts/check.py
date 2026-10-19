"""Check generated content, internal destinations, metadata, and fragment links."""
import json
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
root=Path(__file__).resolve().parent.parent
out=root/'dist'
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.links=[];self.ids=[];self.h1=0;self.description=False;self.title=False;self.feed(path.read_text())
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='title':self.title=True
  if tag=='meta' and a.get('name')=='description':self.description=True
  for key in ('href','src','action'):
   if key in a:self.links.append(a[key])
pages={p:Page(p) for p in out.rglob('*.html')}
errors=[]
for path,page in pages.items():
 if page.h1!=1:errors.append(f'{path}: expected one h1')
 if not page.description or not page.title:errors.append(f'{path}: missing metadata')
 if len(set(page.ids))!=len(page.ids):errors.append(f'{path}: duplicate IDs')
 for link in page.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  target=out/unquote(u.path).lstrip('/') if u.path.startswith('/') else path.parent/u.path if u.path else path
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{path}: broken link {link}')
  elif u.fragment and target in pages and u.fragment not in pages[target].ids:errors.append(f'{path}: missing fragment {link}')
articles=json.loads((root/'content/articles.json').read_text())
slugs={a['slug'] for a in articles if a['status']=='published'}
assert len(slugs)==len([a for a in articles if a['status']=='published'])
for a in articles:
 if a['status']!='published':continue
 assert a['related'] and set(a['related'])<=slugs
 assert len(a['sections'])>=3
 assert a['answer'] and a['source'] and a['published']
if errors:raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML files; internal links, fragments, unique IDs, titles, descriptions, h1s; {len(slugs)} published articles.')
