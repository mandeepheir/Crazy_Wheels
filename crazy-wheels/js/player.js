// Player: the vehicle with legs. Physics lives here; the world is passed in.
class Player{
 constructor(){this.w=50;this.h=64;this.reset(0,0)}
 reset(x,y){Object.assign(this,{x,y:y-this.h,vx:0,vy:0,ground:null,jumps:0,coyote:0,face:1,boost:0,cool:0,leg:0,inv:1.2,sq:0,nc:false})}
 hit(s){return this.x<s.x+s.w&&this.x+this.w>s.x&&this.y<s.y+s.h&&this.y+this.h>s.y}
 update(dt,k,solids,g){
  const mx=k.right-k.left,B=this.boost>0,max=B?480:280;
  if(mx){this.vx+=mx*(B?3200:1900)*dt;this.face=mx}else{const f=2300*dt;this.vx=Math.abs(this.vx)<=f?0:this.vx-Math.sign(this.vx)*f}
  this.vx=Math.max(-max,Math.min(max,this.vx));
  this.boost-=dt;this.cool-=dt;this.inv-=dt;this.sq*=Math.pow(.001,dt);
  if(k.boostP&&this.cool<=0){this.boost=1.1;this.cool=3;Sfx.play('boost')}
  if(this.ground&&this.ground.dx)this.x+=this.ground.dx;           // ride moving platforms
  this.coyote=this.ground?.1:this.coyote-dt;                        // small grace time after leaving an edge
  const fx=this.x+25,fy=this.y+64;
  if(k.jumpP){
   if(this.coyote>0){this.vy=-650;this.coyote=0;this.jumps=1;Sfx.play('jump');g.fx.burst(fx,fy,'#fff',6,90,.3)}
   else if(this.jumps<2){this.vy=-580;this.jumps=2;Sfx.play('djump');g.fx.burst(fx,fy,'#ffd23f',10,140,.4)}}
  if(this.vy>0)this.nc=false;
  if(!k.jump&&!this.nc&&this.vy<-260)this.vy=-260;                  // release early = short hop
  this.vy=Math.min(this.vy+1700*dt,950);
  this.x+=this.vx*dt;                                               // move X, then fix overlaps
  for(const s of solids)if(this.hit(s)){this.x=this.x+25<s.x+s.w/2?s.x-this.w:s.x+s.w;this.vx=0}
  const prevBottom=this.y+this.h;this.y+=this.vy*dt;this.ground=null; // move Y, then fix overlaps
  for(const s of solids)if(this.hit(s)){
   if(this.vy>=0&&prevBottom<=s.y+14){this.y=s.y-this.h;if(this.vy>300){this.sq=.5;g.fx.burst(fx,fy,'#fff',6,100,.3)}this.vy=0;this.ground=s;this.jumps=0;this.nc=false}
   else if(this.vy<0){this.y=s.y+s.h;this.vy=0}}
  this.leg+=Math.abs(this.vx)*dt*.06+dt*2;
 }
 draw(c,t){
  if(this.inv>0&&Math.floor(t*14)%2)return;
  const air=!this.ground,s=this.sq*.3;
  c.save();c.translate(this.x+25,this.y+64);c.scale(this.face*(1+s),1-s);
  if(this.boost>0){c.fillStyle='#ff9f1c';c.beginPath();c.moveTo(-28,-48);c.lineTo(-62-Math.random()*14,-38);c.lineTo(-28,-28);c.fill()}
  c.lineWidth=7;c.lineCap='round';c.strokeStyle='#3a2a5c';
  for(const[hx,ph]of[[-12,0],[14,Math.PI]]){
   const sw=Math.sin(this.leg+ph),lf=Math.cos(this.leg+ph),moving=Math.abs(this.vx)>10;
   const px=hx+(air?(hx<0?-6:8):moving?sw*13:0),py=air?-8:moving?-Math.max(0,lf)*7:0;
   c.beginPath();c.moveTo(hx,-26);c.lineTo(px,py-2);c.stroke();
   c.fillStyle='#ffd23f';c.beginPath();c.ellipse(px+3,py-2,9,5,0,0,6.283);c.fill()}
  c.fillStyle=SKINS[Store.d.skin].c;c.beginPath();c.roundRect(-28,-64,56,44,14);c.fill();
  c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-22,-32,30,5);
  c.fillStyle='#bfefff';c.beginPath();c.roundRect(2,-58,24,16,6);c.fill();
  c.fillStyle='#fff';c.beginPath();c.arc(14,-50,6,0,6.283);c.fill();
  c.fillStyle='#222';c.beginPath();c.arc(16,-50,3,0,6.283);c.fill();
  c.fillStyle='#ffd23f';c.beginPath();c.arc(27,-30,5,0,6.283);c.fill();
  c.restore();
 }
}
