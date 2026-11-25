import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COLORS,createGame} from './engine.js';

// Test du contrôleur réel avec un DOM minimal simulé, sans rendu navigateur.
class Element {
  constructor(tag){this.tagName=tag;this.children=[];this.listeners={};this.style={};this.attributes={};this.value='';this.textContent='';}
  append(...nodes){this.children.push(...nodes);}
  add(option){this.children.push(option);}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(k,fn){this.listeners[k]=fn;}
  dispatchEvent(e){this.listeners[e.type]?.(e);}
  replaceChildren(...nodes){this.children=nodes;}
  focus(){document.activeElement=this;}
}
const ids=Object.fromEntries(['selectors','counter','choices','submit','empty','history','message','form','restart'].map(id=>[id,new Element(id)]));
const document={getElementById:id=>ids[id],createElement:tag=>new Element(tag),createTextNode:text=>text};
class Option {constructor(text,value){this.text=text;this.value=value;}}
const secret=['rouge','bleu','vert','jaune'];
const source=readFileSync(new URL('./app.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/,'');
new Function('document','Option','Event','COLORS','createGame','randomCode',source)(document,Option,Event,COLORS,createGame,()=>[...secret]);
const selects=ids.selectors.children.map(label=>label.children[0]);
const dots=ids.selectors.children.map(label=>label.children[1]);
const fill=values=>selects.forEach((s,i)=>{s.value=values[i]||'';s.dispatchEvent(new Event('change'));});
const submit=()=>ids.form.dispatchEvent({type:'submit',preventDefault(){}});
const reset=()=>ids.restart.dispatchEvent({type:'click'});
let passed=0;
function test(name,fn){fn();passed++;console.log('RÉUSSI : '+name);}
for(let n=0;n<4;n++)test(n+' couleur(s) : refus, saisie conservée, aucun essai',()=>{
 reset();const values=secret.slice(0,n);fill(values);submit();
 assert.deepEqual(selects.map(s=>s.value),[...values,...Array(4-n).fill('')]);
 assert.equal(ids.counter.textContent,'0 / 10 essais');assert.equal(ids.history.children.length,0);
 assert.equal(ids.message.textContent,'Veuillez sélectionner 4 couleurs avant de valider l’essai.');
 assert.equal(document.activeElement,selects[n]);
});
test('Essai accepté : saisie et pastilles réinitialisées, historique conservé',()=>{
 reset();fill(['rouge','vert','bleu','orange']);submit();
 assert.deepEqual(selects.map(s=>s.value),['','','','']);assert.ok(dots.every(d=>d.style.background==='#e5e8de'));
 assert.equal(ids.counter.textContent,'1 / 10 essais');assert.equal(ids.history.children.length,1);
 const row=ids.history.children[0];assert.deepEqual(row.children[1].children.map(p=>p.children[1]),['rouge','vert','bleu','orange']);
 const table=row.children[2];assert.equal(table.tagName,'table');
 assert.deepEqual(table.children[0].children[0].children.map(x=>[x.textContent,x.scope]),[['Bien placées','col'],['Mal placées','col']]);
 assert.deepEqual(table.children[1].children[0].children.map(x=>x.textContent),['1','2']);
});
test('Essai incomplet après un essai valide : historique inchangé',()=>{
 const row=ids.history.children[0];fill(['bleu','vert','jaune']);submit();
 assert.equal(ids.history.children[0],row);assert.equal(ids.counter.textContent,'1 / 10 essais');
 assert.deepEqual(selects.map(s=>s.value),['bleu','vert','jaune','']);
});
test('Victoire : saisie vidée, commandes désactivées et historique intact',()=>{
 fill(secret);submit();assert.deepEqual(selects.map(s=>s.value),['','','','']);
 assert.equal(ids.choices.disabled,true);assert.equal(ids.submit.disabled,true);assert.equal(ids.history.children.length,2);
 assert.match(ids.message.textContent,/Bravo/);
});
test('Nouvelle partie : commandes réactivées, historique et compteur remis à zéro',()=>{
 reset();assert.equal(ids.choices.disabled,false);assert.equal(ids.submit.disabled,false);
 assert.equal(ids.counter.textContent,'0 / 10 essais');assert.equal(ids.history.children.length,0);
});
test('Défaite : dix essais conservés et saisie vide',()=>{
 for(let i=0;i<10;i++){fill(['violet','violet','violet','violet']);submit();}
 assert.equal(ids.history.children.length,10);assert.equal(ids.submit.disabled,true);assert.deepEqual(selects.map(s=>s.value),['','','','']);
 assert.match(ids.message.textContent,/Partie perdue/);
});
console.log(passed+' scénarios du contrôleur réussis (DOM simulé).');
