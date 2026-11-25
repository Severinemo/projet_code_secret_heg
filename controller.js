import {COLORS,createGame,randomCode} from './engine.js';
const messages={
  'invalid-options':'Les options doivent être un objet contenant uniquement la clé secret.',
  'invalid-type':'Le code doit être un tableau complet de chaînes de caractères.',
  'invalid-length':'Veuillez sélectionner 4 couleurs avant de valider l’essai.',
  'invalid-color':'La couleur proposée n’est pas autorisée.',
  'game-not-started':'Démarrez une nouvelle partie avant de jouer.',
  'game-finished':'La partie est terminée. Lancez une nouvelle partie.'
};
function error(code){return {code,message:messages[code]};}
function codeError(value){
  if(!Array.isArray(value))return 'invalid-type';
  for(let i=0;i<value.length;i++)if(!Object.hasOwn(value,i)||typeof value[i]!=='string')return 'invalid-type';
  if(value.length!==4)return 'invalid-length';
  if(!value.every(c=>COLORS.includes(c)))return 'invalid-color';
  return null;
}
function secretFrom(options){
  if(options===undefined)options={};
  if(options===null||typeof options!=='object'||Array.isArray(options)||
    ![Object.prototype,null].includes(Object.getPrototypeOf(options))||
    Reflect.ownKeys(options).some(k=>k!=='secret')){
    throw Object.assign(new Error(messages['invalid-options']),{code:'invalid-options'});
  }
  if(!Object.hasOwn(options,'secret'))return randomCode();
  const invalid=codeError(options.secret);
  if(invalid)throw Object.assign(new Error(messages[invalid]),{code:invalid});
  return [...options.secret];
}
// Une seule instance du moteur est détenue ici, partagée par l'interface et l'API.
export function createController(onChange=()=>{}){
  let game=null;let lastError=null;
  function getState(){
    const source=game?.getState();
    const history=(source?.history||[]).map(entry=>({
      guess:[...entry.guess],result:{wellPlaced:entry.exact,misplaced:entry.misplaced}
    }));
    const last=history.at(-1);
    return {status:source?.status||'not-started',attempts:history.length,history,
      lastGuess:last?[...last.guess]:null,lastResult:last?{...last.result}:null,
      lastError:lastError?{...lastError}:null};
  }
  return {
    version:'0.2',
    getConfig:()=>({apiVersion:'0.2',rulesVersion:'code-couleurs-1.0',secretLength:4,maxAttempts:10,allowDuplicates:true,colors:[...COLORS]}),
    getState,
    async startGame(options){
      const secret=secretFrom(options); // Validation avant toute mutation ou notification.
      game=createGame(secret);lastError=null;
      onChange(getState(),{action:'start',accepted:true});
      return getState();
    },
    async submitGuess(guess){
      const status=getState().status;
      const invalid=status==='not-started'?'game-not-started':status!=='playing'?'game-finished':codeError(guess);
      if(invalid)lastError=error(invalid);
      else {game.submit([...guess]);lastError=null;}
      onChange(getState(),{action:'submit',accepted:!invalid});
      return getState();
    }
  };
}
export function exposeTestAPI(target,search,controller){
  const enabled=new URLSearchParams(search).get('test')==='1';
  if(enabled)target.codeSecretTest=controller;
  return enabled;
}
