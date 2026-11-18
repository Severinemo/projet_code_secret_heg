export const COLORS = ['rouge','bleu','vert','jaune','orange','violet'];
export function valid(code) { return Array.isArray(code) && code.length === 4 && code.every(c => COLORS.includes(c)); }
export function score(secret, guess) {
  if (!valid(secret) || !valid(guess)) throw new Error('Quatre couleurs autorisées sont nécessaires.');
  let exact = 0; const remaining = {}, proposed = {};
  secret.forEach((c,i) => { if(c === guess[i]) exact++; else { remaining[c]=(remaining[c]||0)+1; proposed[guess[i]]=(proposed[guess[i]]||0)+1; } });
  return { exact, misplaced: Object.keys(proposed).reduce((n,c)=> n + Math.min(proposed[c],remaining[c]||0),0) };
}
export function createGame(secret) {
  if(!valid(secret)) throw new Error('Code invalide');
  const hidden = [...secret]; let history = []; let status = 'playing';
  return {
    getState: () => ({status, history:history.map(x=>({...x,guess:[...x.guess]}))}),
    submit(guess) {
      if(status !== 'playing') return {ok:false, message:'La partie est terminée. Lancez une nouvelle partie.'};
      if(!valid(guess)) return {ok:false,message:'Choisissez une couleur pour chacune des quatre positions.'};
      const result = score(hidden,guess); history.push({guess:[...guess],...result});
      if(result.exact === 4) status='won'; else if(history.length === 10) status='lost';
      return {ok:true,...result,status};
    }
  };
}
export function randomCode() {
  const out = [];
  while(out.length < 4) {
    const value = crypto.getRandomValues(new Uint32Array(1))[0];
    if(value < 4294967292) out.push(COLORS[value % 6]);
  }
  return out;
}
