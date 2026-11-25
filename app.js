import {COLORS} from './engine.js';
import {createController,exposeTestAPI} from './controller.js';
const hues={rouge:'#c74742',bleu:'#3975b8',vert:'#40845f',jaune:'#f1cc42',orange:'#e88937',violet:'#8956b1'};
const $=id=>document.getElementById(id);
let controller;
const selects = COLORS.slice(0,4).map((_,i)=>{
  const label=document.createElement('label');label.textContent='POSITION '+(i+1);
  const select=document.createElement('select');select.setAttribute('aria-label','Couleur en position '+(i+1));
  select.add(new Option('Choisir…',''));COLORS.forEach(c=>select.add(new Option(c,c)));
  const swatch=document.createElement('span');swatch.className='swatch';swatch.setAttribute('aria-hidden','true');
  select.addEventListener('change',()=>{swatch.style.background=hues[select.value]||'#e5e8de'});
  label.append(select,swatch);$('selectors').append(label);return select;
});
function render(){
  const state=controller.getState();$('counter').textContent=state.history.length+' / 10 essais';
  $('choices').disabled=state.status!=='playing';$('submit').disabled=state.status!=='playing';
  $('empty').hidden=state.history.length>0;$('history').replaceChildren();
  state.history.forEach((entry,i)=>{
    const li=document.createElement('li');li.className='attempt';
    const n=document.createElement('span');n.className='attempt-number';n.textContent=String(i+1).padStart(2,'0');
    const pegs=document.createElement('div');pegs.className='pegs';
    entry.guess.forEach(c=>{const peg=document.createElement('span');peg.className='peg';const dot=document.createElement('span');dot.className='swatch';dot.style.background=hues[c];dot.setAttribute('aria-hidden','true');peg.append(dot,document.createTextNode(c));pegs.append(peg)});
    const result=document.createElement('table');result.className='result';
    result.setAttribute('aria-label','Indices de l’essai '+(i+1));
    const head=document.createElement('thead');const headings=document.createElement('tr');
    ['Bien placées','Mal placées'].forEach(text=>{const th=document.createElement('th');th.scope='col';th.textContent=text;headings.append(th)});
    head.append(headings);
    const body=document.createElement('tbody');const values=document.createElement('tr');
    [entry.result.wellPlaced,entry.result.misplaced].forEach(value=>{const td=document.createElement('td');td.textContent=String(value);values.append(td)});
    body.append(values);result.append(head,body);
    li.append(n,pegs,result);$('history').append(li);
  });
}
function clearSelection(){
  selects.forEach(s=>{s.value='';s.dispatchEvent(new Event('change'))});
}
function onChange(state,event){
  if(event.accepted){clearSelection();render();}
  if(event.action==='start'){
    $('message').className='';
    $('message').textContent='À vous de jouer. Une couleur peut apparaître plusieurs fois.';
  }else if(state.lastError){
    $('message').textContent=state.lastError.message;
    if(state.status==='playing'){const blank=selects.find(s=>!s.value);if(blank)blank.focus();}
  }else{
    const result=state.lastResult;
    $('message').textContent=state.status==='won'?'Bravo ! Vous avez trouvé le code en '+state.attempts+' essai(s).':state.status==='lost'?'Les dix essais sont épuisés. Partie perdue. Prêt pour un nouveau défi ?':result.wellPlaced+' bien placée(s), '+result.misplaced+' mal placée(s). Affinez votre prochain essai.';
    $('message').className=state.status==='playing'?'':'end';
    if(state.status==='playing')selects[0].focus();
  }
}
controller=createController(onChange);
$('form').addEventListener('submit',async e=>{
  e.preventDefault();
  // Une case vide de l'interface représente une couleur non choisie.
  const guess=selects.map(s=>s.value);
  await controller.submitGuess(guess.includes('')?guess.filter(Boolean):guess);
});
$('restart').addEventListener('click',async()=>{await controller.startGame();selects[0].focus()});
render();
const testMode=exposeTestAPI(window,window.location.search,controller);
if(testMode){
  $('message').textContent='Mode test : démarrez une nouvelle partie pour jouer.';
}else{
  await controller.startGame();
}
