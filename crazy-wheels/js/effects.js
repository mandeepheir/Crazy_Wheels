// Sound effects (Web Audio) and particles.
const Sfx={ctx:null,
 tone(f,d,type='square',v=.2,slide=0){if(!Store.d.sound)return;try{this.ctx=this.ctx||new(window.AudioContext||window.webkitAudioContext)();const c=this.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);g.gain.setValueAtTime(v*Store.d.vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(c.destination);o.start();o.stop(t+d)}catch(e){}},
 play(n){const T=(...a)=>this.tone(...a);({jump:()=>T(300,.15,'square',.2,400),djump:()=>T(450,.15,'square',.2,500),coin:()=>{T(880,.08,'triangle',.3);setTimeout(()=>T(1320,.12,'triangle',.3),70)},boost:()=>T(200,.4,'sawtooth',.2,700),die:()=>T(300,.5,'sawtooth',.3,-250),bounce:()=>T(250,.3,'sine',.4,600),check:()=>T(660,.2,'triangle',.3),click:()=>T(500,.05,'square',.1),win:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>T(f,.25,'triangle',.3),i*120))})[n]?.()}};
class Particles{constructor(){this.p=[]}
 burst(x,y,c,n=10,sp=200,l=.6){for(let i=0;i<n;i++){const a=Math.random()*6.283,s=sp*(.3+Math.random());this.p.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,l,m:l,c,r:2+Math.random()*3})}}
 update(dt){for(const q of this.p){q.l-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=600*dt}this.p=this.p.filter(q=>q.l>0)}
 draw(c){for(const q of this.p){c.globalAlpha=q.l/q.m;c.fillStyle=q.c;c.beginPath();c.arc(q.x,q.y,q.r,0,6.283);c.fill()}c.globalAlpha=1}}
