// Procedural levels: same number always gives the same level; higher number = harder.
const LEVELS=5;
const THEMES=[
{n:'Sunny Meadow',sky:['#ff9a8b','#ffd7a8','#fff1c9'],h1:'#8f6bd1',h2:'#6a4cb0',g:'#5fcf80',d:'#7a4a2b'},
{n:'Mint Hills',sky:['#7fd8e6','#bdf2e0','#eafff4'],h1:'#5fb89a',h2:'#3f957c',g:'#9be564',d:'#5b4a3a'},
{n:'Dusk City',sky:['#2b1b4a','#6a3d8f','#ff8c7a'],h1:'#3d2c6e',h2:'#2a1d52',g:'#ff6fb5',d:'#2f2150'},
{n:'Sandy Dunes',sky:['#ffcf70','#ffe4a8','#fff6d8'],h1:'#e8b25c',h2:'#d1923f',g:'#f2c46d',d:'#b5762e'},
{n:'Candy Land',sky:['#ffb3e6','#ffd6f5','#fff0fb'],h1:'#ff8fd0',h2:'#e56bb8',g:'#8ff0c5',d:'#a85a8c'}];
function makeLevel(i){
 let s=i*7919+13;const r=()=>(s=s*16807%2147483647)/2147483647;
 const d=i,L=3600+i*1000,P=[],S=[],C=[],M=[],B=[],U=[],K=[{x:60,y:420,on:true}];
 let x=0,y=420,lastK=0;
 const plat=(px,py,w,h)=>P.push({x:px,y:py,w,h:h||700-py});
 const arc=(a,b,yy)=>{for(let k=0;k<=4;k++)C.push({x:a+(b-a)*k/4,y:yy-Math.sin(k/4*Math.PI)*60-30})};
 const row=(a,n,yy)=>{for(let k=0;k<n;k++)C.push({x:a+k*34,y:yy})};
 plat(0,y,420);x=420;
 while(x<L){const t=r();
  if(t<.28){const g=90+d*14+r()*30,ny=Math.max(320,Math.min(440,y+r()*90-45)),w=200+r()*150;arc(x-20,x+g+20,Math.min(y,ny));x+=g;plat(x,ny,w);y=ny;x+=w}
  else if(t<.48){const w=320+r()*60;plat(x,y,w);const n=d>2?2:1;for(let k=0;k<n;k++)S.push({x:x+90+k*110,y:y-22,w:36,h:22});arc(x+60,x+90+n*110,y);x+=w}
  else if(t<.6){const g=260;M.push({x:x+10,x0:x+10,x1:x+g-120,y,w:110,h:20,sp:80+d*12,dir:1,dx:0});x+=g;plat(x,y,260);x+=260}
  else if(t<.72){plat(x,y,260);B.push({x:x+190,y:y-12,w:50,h:12,a:0});x+=260;const g=290;arc(x-60,x+g+20,y-120);x+=g;plat(x,y,220);x+=220}
  else{const w=300+r()*200;plat(x,y,w);row(x+40,5,y-40);if(r()<.4)U.push({x:x+w/2,y:y-90});if(r()<.5){plat(x+80,y-95,110,18);row(x+100,3,y-125)}
   if(x-lastK>1400){K.push({x:x+40,y,on:false});lastK=x}x+=w}}
 plat(x,y,600);
 return{theme:THEMES[i%5],name:THEMES[i%5].n,P,S,C:C.map(c=>({...c,got:false})),M,B,U:U.map(u=>({...u,got:false})),K,F:{x:x+360,y},W:x+600}}
