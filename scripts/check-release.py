"""Exercise production metadata in an isolated copy, without changing the preview."""
import os, shutil, subprocess, tempfile, json
from pathlib import Path
from xml.etree import ElementTree
root=Path(__file__).resolve().parent.parent
with tempfile.TemporaryDirectory(prefix='tech-compass-release-') as directory:
 project=Path(directory)
 for name in ('assets','content','scripts'):shutil.copytree(root/name,project/name)
 env={**os.environ,'SITE_URL':'https://release-check.example'}
 subprocess.run(['python3',str(project/'scripts/build.py')],env=env,check=True,capture_output=True)
 subprocess.run(['python3',str(project/'scripts/check.py')],env=env,check=True,capture_output=True)
 out=project/'dist';sitemap=ElementTree.parse(out/'sitemap.xml')
 urls=[x.text for x in sitemap.findall('.//{*}loc')]
 assert len(urls)==len(set(urls)) and 'https://release-check.example/' in urls
 assert all('/search/' not in u and '/404/' not in u for u in urls)
 for url in urls:
  path=out/url.removeprefix('https://release-check.example/').strip('/')/'index.html'
  assert f'<link rel="canonical" href="{url}">' in path.read_text(),url
 for slug in ('search','404'):assert 'content="noindex,follow"' in (out/slug/'index.html').read_text()
 assert 'Sitemap: https://release-check.example/sitemap.xml' in (out/'robots.txt').read_text()
 assert "object-src 'none'" in (out/'_headers').read_text()
 # Fail closed on invalid origins, rather than embedding malformed metadata.
 for origin in ('http://insecure.example','https://example.com/path','https://user:pass@example.com','https://example.com/?q=x'):
  result=subprocess.run(['python3',str(project/'scripts/build.py')],env={**env,'SITE_URL':origin},capture_output=True)
  assert result.returncode!=0,origin
 # Drafts must disappear from both route output and the downloadable search index.
 file=project/'content/articles.json';articles=json.loads(file.read_text());articles[-1]['status']='draft';file.write_text(json.dumps(articles))
 subprocess.run(['python3',str(project/'scripts/build.py')],env=env,check=True,capture_output=True)
 assert not (out/'guides'/articles[-1]['slug']).exists()
 assert articles[-1]['slug'] not in {a['slug'] for a in json.loads((out/'assets/search-index.json').read_text())}
 print(f'PASS: {len(urls)} canonical/sitemap destinations; noindex; robots; header template; 4 invalid origins; draft removal.')
