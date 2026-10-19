'use strict';
const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.getElementById('nav').classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu){menu.setAttribute('aria-expanded','false');document.getElementById('nav').classList.remove('open');if(document.getElementById('nav').contains(document.activeElement))menu.focus()}});
const normalize=s=>s.toLowerCase().replace(/[’']/g,'').replace(/wi[ -]fi/g,'wifi').replace(/[^a-z0-9 ]/g,' ').trim();
const stop=new Set('a an the is my i me it do does why how what can cant wont to of for on in with get keep you your computer technology t s from a'.split(' '));
function near(a,b){if(a===b)return true;if(a.length<4||Math.abs(a.length-b.length)>1)return false;let i=0,j=0,n=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue}if(++n>1)return false;if(a.length>=b.length)i++;if(b.length>=a.length)j++}return n+(i<a.length||j<b.length?1:0)<=1}
function rank(articles,q,category){const words=normalize(q).split(/\s+/).filter(w=>w&&!stop.has(w));return articles.filter(a=>a.status==='published'&&(!category||a.category===category||(category==='fundamentals'&&a.type==='Explanation'))).map(a=>{const title=normalize(a.title), keys=normalize(a.keywords), body=normalize(a.answer);let score=0;const query=normalize(q);if(title===query)score+=100;if(/\b(online|internet|wifi|wireless|disconnecting)\b/.test(query)&&!/(bluetooth|headphone|earbud|iphone|ipad|nest|speaker)/.test(query)&&a.slug==='fix-wifi')score+=15;if(/\b(iphone|ipad)\b/.test(query)&&/(wifi|internet|online|network)/.test(query)&&a.slug==='iphone-ipad-wifi')score+=25;if(/\b(nest|google home)\b/.test(query)&&a.slug==='nest-speaker-wifi')score+=25;for(const w of words){score+=title.split(' ').some(t=>near(w,t))?7:keys.split(' ').some(t=>near(w,t))?5:body.split(' ').includes(w)?1:0}return{a,score}}).filter(x=>!q.trim()||x.score>0).sort((a,b)=>b.score-a.score).map(x=>x.a)}
// One local request serves both suggestions and search results. Nothing is sent to a service.
let libraryPromise;
function loadLibrary(){
 if(!libraryPromise)libraryPromise=fetch('/assets/search-index.json').then(r=>{if(!r.ok)throw Error('Library unavailable');return r.json()});
 return libraryPromise;
}
const suggestionList=document.getElementById('guide-suggestions');
if(suggestionList){loadLibrary().then(articles=>{
 for(const article of articles.filter(a=>a.status==='published')){
  const option=document.createElement('option');option.value=article.title;suggestionList.append(option);
 }
}).catch(()=>{/* The ordinary search form remains usable if suggestions cannot load. */});}
const results=document.getElementById('search-results');
if(results){const input=document.getElementById('query'),filter=document.getElementById('category'),count=document.getElementById('result-count');const params=new URLSearchParams(location.search);input.value=(params.get('q')||'').slice(0,200);filter.value=params.get('category')||'';let data=[];
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n}
function render(){const matches=rank(data,input.value,filter.value);results.replaceChildren();count.textContent=`${matches.length} ${matches.length===1?'guide':'guides'}${input.value?' for “'+input.value+'”':''}`;for(const a of matches){const card=el('a','result');card.href='/guides/'+a.slug+'/';card.append(el('span','eyebrow',a.type+' · '+a.minutes+' MIN READ'),el('h3','',a.title),el('p','',a.answer),el('span','read','Read the guide ↗'));results.append(card)}if(!matches.length){const empty=el('div','empty');empty.append(el('h2','','We haven’t charted that one yet.'),el('p','','Try a shorter phrase such as “Wi-Fi”, “memory”, or “Bluetooth”, or choose another topic. Our search covers the published library, not every technology question.'));const a=el('a','button','Explore all topics ↗');a.href='/topics/';empty.append(a);results.append(empty)}}
function update(){const p=new URLSearchParams();if(input.value)p.set('q',input.value);if(filter.value)p.set('category',filter.value);history.replaceState(null,'','/search/'+(p.size?'?'+p:''));render()}
input.form.addEventListener('submit',e=>{e.preventDefault();update()});filter.addEventListener('change',update);let timer;input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(update,180)});loadLibrary().then(a=>{data=a;render()}).catch(()=>{count.textContent='Search could not load. Please reload or browse topics using the navigation.'})}
