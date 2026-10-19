"""Read-only verification of an actual deployment: python3 scripts/check-live.py https://host"""
import sys
import urllib.request
import urllib.error
from urllib.parse import urlsplit
from xml.etree import ElementTree
if len(sys.argv)!=2:raise SystemExit('Usage: python3 scripts/check-live.py https://your-host')
origin=sys.argv[1].rstrip('/')
p=urlsplit(origin)
if p.scheme!='https' or not p.netloc or p.path or p.query or p.fragment or p.username:raise SystemExit('Provide an HTTPS origin, without credentials or a path.')
def get(path):
 try:r=urllib.request.urlopen(origin+path,timeout=20)
 except urllib.error.HTTPError as error:r=error
 assert urlsplit(r.url).scheme=='https','Redirect downgraded HTTPS'
 return r.status,r.headers,r.read().decode('utf-8')
status,headers,home=get('/')
assert status==200,f'Homepage returned {status}; private sites may require authentication.'
assert f'<link rel="canonical" href="{origin}/">' in home,'Homepage canonical mismatch'
for header in ('Content-Security-Policy','X-Content-Type-Options','Referrer-Policy'):
 assert headers.get(header),f'Missing {header}'
assert "object-src 'none'" in headers['Content-Security-Policy']
assert headers['X-Content-Type-Options'].lower()=='nosniff'
status,_,body=get('/tech-compass-check-missing-route-72ba/')
assert status==404,f'Missing route returned {status}, expected 404'
assert 'Let’s find your bearings.' in body,'Custom 404 page not served'
status,_,body=get('/search/?q=wifi')
assert status==200 and 'content="noindex,follow"' in body,'Search noindex missing'
status,_,body=get('/robots.txt')
assert status==200 and f'Sitemap: {origin}/sitemap.xml' in body,'Robots sitemap missing'
status,_,body=get('/sitemap.xml');assert status==200
urls=[x.text for x in ElementTree.fromstring(body).findall('.//{*}loc')]
assert urls and all(url.startswith(origin+'/') for url in urls),'Sitemap origin mismatch'
print('PASS: HTTPS responses, header presence, homepage canonical, custom 404, search noindex, robots and sitemap origin.')
print('Still inspect CSP behavior, authentication, caching, accessibility and performance in a browser.')
