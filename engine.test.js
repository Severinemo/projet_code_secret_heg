import * as api from './engine.js';
function runTests(api) {
 const {score,createGame}=api;let count=0;
 function equal(a,b){count++;if(JSON.stringify(a)!==JSON.stringify(b))throw Error('Test '+count+' : '+JSON.stringify(a));}
 const s=['rouge','bleu','vert','jaune'];
 equal(score(s,['rouge','vert','bleu','orange']),{exact:1,misplaced:2});
 equal(score(['rouge','rouge','bleu','vert'],['rouge','rouge','rouge','rouge']),{exact:2,misplaced:0});
 equal(score(s,['bleu','vert','jaune','rouge']),{exact:0,misplaced:4});
 const g=createGame(s);equal(g.submit(['rouge']).ok,false);equal(g.submit(['rose','bleu','vert','jaune']).ok,false);equal(g.getState().history.length,0);
 for(let i=0;i<9;i++)g.submit(['violet','violet','violet','violet']);
 equal(g.submit(s).status,'won');equal(g.getState().history.length,10);
 const snapshot=g.getState();equal(g.submit(s).ok,false);equal(g.getState(),snapshot);
 const lost=createGame(s);for(let i=0;i<10;i++)lost.submit(['violet','violet','violet','violet']);
 equal(lost.getState().status,'lost');equal(lost.submit(s).ok,false);equal(lost.getState().history.length,10);
 equal(createGame(s).getState(),{status:'playing',history:[]});
 const copy=g.getState();copy.history[0].guess[0]='rouge';equal(g.getState().history[0].guess[0],'violet');
 return count;
}
console.log(runTests(api)+' vérifications réussies.');

