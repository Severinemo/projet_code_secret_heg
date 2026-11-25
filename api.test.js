import assert from 'node:assert/strict';
import {createController,exposeTestAPI} from './controller.js';
const R='rouge',B='bleu',V='vert',J='jaune',O='orange',P='violet';
let count=0;
async function test(name,fn){await fn();count++;console.log('RÉUSSI : '+name);}
const fresh={status:'not-started',attempts:0,history:[],lastGuess:null,lastResult:null,lastError:null};
await test('Configuration, exposition conditionnelle et état initial',async()=>{
 const api=createController();assert.equal(api.version,'0.2');assert.deepEqual(api.getState(),fresh);
 assert.deepEqual(api.getConfig(),{apiVersion:'0.2',rulesVersion:'code-couleurs-1.0',secretLength:4,maxAttempts:10,allowDuplicates:true,colors:[R,B,V,J,O,P]});
 for(const search of ['', '?test=0','?test=true']){const target={};assert.equal(exposeTestAPI(target,search,api),false);assert.equal('codeSecretTest' in target,false);}
 const target={};assert.equal(exposeTestAPI(target,'?autre=1&test=1',api),true);assert.equal(target.codeSecretTest,api);
 const pending=api.submitGuess(null);assert.ok(pending instanceof Promise);const s=await pending;assert.equal(s.lastError.code,'game-not-started');
 assert.deepEqual({...s,lastError:null},fresh);
});
const cases=[[[R,B,V,J],[R,V,B,O],1,2],[[R,B,V,J],[O,P,R,B],0,2],[[R,B,V,J],[B,R,J,V],0,4],[[R,B,V,J],[R,B,J,V],2,2],[[R,B,V,J],[R,B,V,J],4,0],[[R,R,B,V],[R,R,R,R],2,0],[[R,R,B,V],[R,B,R,V],2,2],[[R,R,B,V],[R,R,B,V],4,0],[[R,R,B,V],[R,B,R,R],1,2]];
for(const [i,[secret,guess,wellPlaced,misplaced]] of cases.entries())await test('T'+String(i+1).padStart(2,'0'),async()=>{
 const api=createController();const p=api.startGame({secret});assert.ok(p instanceof Promise);await p;
 assert.deepEqual(api.getState(),{...fresh,status:'playing'});
 const s=await api.submitGuess(guess);assert.deepEqual(s,{status:wellPlaced===4?'won':'playing',attempts:1,history:[{guess,result:{wellPlaced,misplaced}}],lastGuess:guess,lastResult:{wellPlaced,misplaced},lastError:null});
});
await test('Refus de saisie : priorité, tableaux creux et couleurs exactes',async()=>{
 const api=createController();await api.startGame({secret:[R,R,R,R]});
 const invalid=[[null,'invalid-type'],[[R,null],'invalid-type'],[Array(4),'invalid-type'],[[R],'invalid-length'],[['Violet',B,V,J],'invalid-color'],[['violet ',B,V,J],'invalid-color'],[['purple',B,V,J],'invalid-color']];
 for(const [guess,code] of invalid){const before=api.getState();const s=await api.submitGuess(guess);assert.equal(s.lastError.code,code);assert.ok(s.lastError.message.length);assert.deepEqual({...s,lastError:null},{...before,lastError:null});}
 const valid=await api.submitGuess([P,P,P,P]);assert.equal(valid.attempts,1);assert.equal(valid.lastError,null);
});
await test('Démarrages invalides : rejet et état/interface inchangés',async()=>{
 let notifications=0;const api=createController(()=>notifications++);await api.startGame({secret:[R,R,R,R]});await api.submitGuess([R]);
 const before=api.getState(),calls=notifications;
 const invalid=[[null,'invalid-options'],[[], 'invalid-options'],[new Date(),'invalid-options'],[{other:true},'invalid-options'],[{secret:null,other:true},'invalid-options'],[{secret:undefined},'invalid-type'],[{secret:null},'invalid-type'],[{secret:[R,null]},'invalid-type'],[{secret:Array(4)},'invalid-type'],[{secret:[R]},'invalid-length'],[{secret:[R,R,R,'Violet']},'invalid-color']];
 for(const [options,code] of invalid){await assert.rejects(api.startGame(options),e=>e instanceof Error&&e.code===code&&e.message.length>0);assert.deepEqual(api.getState(),before);assert.equal(notifications,calls);}
});
await test('Victoire au dixième, refus au neuvième, après-fin et redémarrage',async()=>{
 const api=createController();await api.startGame({secret:[R,R,R,R]});for(let i=0;i<9;i++)await api.submitGuess([B,B,B,B]);
 assert.equal((await api.submitGuess([R])).lastError.code,'invalid-length');assert.equal(api.getState().attempts,9);
 const won=await api.submitGuess([R,R,R,R]);assert.equal(won.status,'won');assert.equal(won.attempts,10);assert.equal(won.history.length,10);
 const refused=await api.submitGuess(null);assert.equal(refused.lastError.code,'game-finished');assert.deepEqual({...refused,lastError:null},won);
 await api.startGame();assert.deepEqual(api.getState(),{...fresh,status:'playing'});
});
await test('Défaite, après-fin et redémarrage',async()=>{
 const api=createController();await api.startGame({secret:[R,R,R,R]});for(let i=0;i<10;i++)await api.submitGuess([B,B,B,B]);
 const lost=api.getState();assert.equal(lost.status,'lost');assert.equal(lost.attempts,10);assert.deepEqual(lost.lastResult,{wellPlaced:0,misplaced:0});
 assert.equal((await api.submitGuess(null)).lastError.code,'game-finished');assert.deepEqual({...api.getState(),lastError:null},lost);
 await api.startGame({});assert.deepEqual(api.getState(),{...fresh,status:'playing'});
 await api.startGame(undefined);assert.deepEqual(api.getState(),{...fresh,status:'playing'});
});
await test('Copies indépendantes, getters sans effet et aucune fuite du secret',async()=>{
 let calls=0;const api=createController(()=>calls++);const secret=[R,R,B,V];await api.startGame({secret});secret.fill(P);
 const guess=[R,B,R,V];const s=await api.submitGuess(guess);guess.fill(P);const before=api.getState();
 s.history[0].guess.fill(P);s.history[0].result.wellPlaced=99;s.lastGuess.fill(P);s.lastResult.misplaced=99;
 api.getConfig().colors.fill('x');assert.equal(api.getConfig().colors[0],R);
 assert.deepEqual(api.getState(),before);assert.deepEqual(before.lastResult,{wellPlaced:2,misplaced:2});
 const n=calls;api.getState();api.getConfig();assert.equal(calls,n);
 assert.ok(!JSON.stringify(before).includes('secret'));assert.ok(!JSON.stringify(before).includes('solution'));
 await api.submitGuess(null);const err=api.getState();err.lastError.code='changed';assert.equal(api.getState().lastError.code,'invalid-type');
});
await test('Mutation résolue après notification de la même partie',async()=>{
 let visible;const api=createController(state=>{visible=state;state.history.push({fake:true});});
 await api.startGame({secret:[R,R,R,R]});assert.equal(api.getState().history.length,0);
 const s=await api.submitGuess([B,B,B,B]);assert.equal(visible.attempts,s.attempts);assert.equal(s.history.length,1);
});
console.log(count+' scénarios API 0.2 réussis.');
