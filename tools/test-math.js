require('../js/registry.js'); const M=require('../js/math.js');
let fail=0;
function t(src,exp,mode,scope){ let v; try{ v=M.evaluate(src,scope||{},mode||'deg'); }catch(e){ v='ERR:'+e.message; }
  const ok = typeof exp==='number' ? Math.abs(v-exp)<=1e-9*Math.max(1,Math.abs(exp)) : v===exp;
  if(!ok){fail++;console.log('FAIL',src,'=>',v,'expected',exp);} }
t('1+2*3',7); t('(1+2)*3',9); t('2^3^2',512); t('-2^2',-4); t('2^-2',0.25);
t('1/2π',1/(2*Math.PI)); t('2π',2*Math.PI); t('sin(30)',0.5); t('sin(180)',0); t('cos(90)',0); t('tan(45)',1);
t('sin(π)',0,'rad'); t('cos(π/2)',0,'rad'); t('sin(30°)',0.5,'rad'); t('asin(1)',90); t('atan(1)',45);
t('5!',120); t('0!',1); t('3!^2',36); t('2^3!',64); t('nCr(5,2)',10); t('nPr(5,2)',20);
t('√(16)',4); t('√16',4); t('∛27',3); t('cbrt(-8)',-2); t('(-8)^(1/3)',-2); t('log(1000)',3); t('ln(e)',1); t('log(8,2)',3);
t('50%',0.5); t('10 mod 3',1); t('5 mod 3 + 1',3); t('2(3+4)',14); t('(1+1)(2+2)',8); t('3sin(30)',1.5);
t('sin(30',0.5); t('2e3',2000); t('1.5E-3',0.0015); t('2e',2*Math.E); t('x^2+1',10,'rad',{x:3}); t('2x',6,'rad',{x:3});
t('ans*2',8,'deg',{ans:4}); t('abs(-3)',3); t('max(1,5,3)',5); t('gcd(12,18)',6); t('hypot(3,4)',5);
t('1+',"ERR:Syntax Error"); t('()',"ERR:Syntax Error"); t('2 3',"ERR:Syntax Error"); t('q+1',"ERR:Undefined variable q");
t('sin x',0.5,'deg',{x:30}); t('sqrt(2)^2',2); t('0.1+0.2',0.3);
const f=M.compile(M.parse('x^2-4'),{args:['x']});
const r=M.num.roots(f,-10,10); if(r.length!==2||Math.abs(r[0]+2)>1e-6||Math.abs(r[1]-2)>1e-6){fail++;console.log('FAIL roots',r);}
if(Math.abs(M.num.integrate(x=>x*x,0,3)-9)>1e-8){fail++;console.log('FAIL integrate');}
const ex=M.num.extrema(M.compile(M.parse('x^3-3x'),{args:['x']}),-5,5); if(ex.length!==2){fail++;console.log('FAIL extrema',ex);}
const pr=M.num.polyRoots([1,-6,11,-6]); if(pr.length!==3||Math.abs(pr[0].re-1)>1e-8||Math.abs(pr[2].re-3)>1e-8){fail++;console.log('FAIL polyRoots',pr);}
const ls=M.num.solveLinear([[2,1],[1,3]],[5,10]); if(ls.type!=='unique'||Math.abs(ls.x[0]-1)>1e-9||Math.abs(ls.x[1]-3)>1e-9){fail++;console.log('FAIL linear');}
if(M.num.solveLinear([[1,1],[2,2]],[1,3]).type!=='none'){fail++;console.log('FAIL inconsistent');}
console.log(fail?('FAILS '+fail):'ALL OK');
