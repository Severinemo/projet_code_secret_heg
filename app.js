import {COLORS,createGame,randomCode} from './engine.js';
const hues={rouge:'#c74742',bleu:'#3975b8',vert:'#40845f',jaune:'#f1cc42',orange:'#e88937',violet:'#8956b1'};
const $=id=>document.getElementById(id);
let game;
const selects = COLORS.slice(0,4).map((_,i)=>{
  const label=document.createElement('label');label.textContent='POSITION '+(i+1);
  const select=document.createElement('select');select.setAttribute('aria-label','Couleur en position '+(i+1));
  select.add(new Option('Choisir…',''));COLORS.forEach(c=>select.add(new Option(c,c)));
  const swatch=document.createElement('span');swatch.className='swatch';swatch.setAttribute('aria-hidden','true');
  select.addEventListener('change',()=>{swatch.style.background=hues[select.value]||'#e5e8de'});
  label.append(select,swatch);$('selectors').append(label);return select;
});
function render(){
  const state=game.getState();$('counter').textContent=state.history.length+' / 10 essais';
  $('choices').disabled=state.status!=='playing';$('submit').disabled=state.status!=='playing';
  $('empty').hidden=state.history.length>0;$('history').replaceChildren();
  state.history.forEach((entry,i)=>{
    const li=document.createElement('li');li.className='attempt';
    const n=document.createElement('span');n.className='attempt-number';n.textContent=String(i+1).padStart(2,'0');
    const pegs=document.createElement('div');pegs.className='pegs';
    entry.guess.forEach(c=>{const peg=document.createElement('span');peg.className='peg';const dot=document.createElement('span');dot.className='swatch';dot.style.background=hues[c];dot.setAttribute('aria-hidden','true');peg.append(dot,document.createTextNode(c));pegs.append(peg)});
    const result=document.createElement('span');result.className='result';result.textContent=entry.exact+' / '+entry.misplaced;result.setAttribute('aria-label',entry.exact+' bien placées et '+entry.misplaced+' mal placées');
    li.append(n,pegs,result);$('history').append(li);
  });
}
function restart(){
  game=createGame(randomCode());selects.forEach(s=>{s.value='';s.dispatchEvent(new Event('change'))});
  $('message').className='';$('message').textContent='À vous de jouer. Une couleur peut apparaître plusieurs fois.';render();
}
$('form').addEventListener('submit',e=>{
  e.preventDefault();const result=game.submit(selects.map(s=>s.value));
  if(!result.ok){$('message').textContent=result.message;const blank=selects.find(s=>!s.value);if(blank)blank.focus();return}
  render();
  $('message').textContent=result.status==='won'?'Bravo ! Vous avez trouvé le code en '+game.getState().history.length+' essai(s).':result.status==='lost'?'Les dix essais sont épuisés. Partie perdue. Prêt pour un nouveau défi ?':result.exact+' bien placée(s), '+result.misplaced+' mal placée(s). Affinez votre prochain essai.';
  $('message').className=result.status==='playing'?'':'end';
});
$('restart').addEventListener('click',()=>{restart();selects[0].focus()});
restart();
