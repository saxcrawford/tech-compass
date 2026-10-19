import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const sandbox={document:{querySelector:()=>null,addEventListener:()=>{},getElementById:()=>null}};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(new URL('assets/app.js',root),'utf8'),sandbox);
sandbox.articles=JSON.parse(fs.readFileSync(new URL('dist/assets/search-index.json',root),'utf8'));
const tests=[['My laptop can’t get online','fix-wifi'],['What is RAM?','what-is-ram'],['bluetoth headphones','bluetooth-not-connecting'],['Why does my computer keep disconnecting from Wi-Fi?','fix-wifi'],['Build a gaming PC','how-to-build-a-pc'],['learn cybersecurity','keep-your-computer-secure'],['quantum teleportation',undefined],['iPhone cannot connect to wifi','iphone-ipad-wifi'],['Google Nest offline','nest-speaker-wifi'],['wireless headphones wont connect','bluetooth-not-connecting']];
for(const [q,expected] of tests){assert.equal(vm.runInContext(`rank(articles,${JSON.stringify(q)},'')[0]?.slug`,sandbox),expected,q)}
assert.equal(vm.runInContext("rank(articles,'','smart-home').length",sandbox),1);
assert.equal(vm.runInContext("rank(articles,'','security').length",sandbox),2);
assert.equal(vm.runInContext("rank([...articles,{title:'Secret',status:'draft'}],'secret','').length",sandbox),0);
console.log('PASS: 10 search relevance/typo/empty cases, 2 category cases, draft exclusion.');
