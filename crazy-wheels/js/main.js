// Entry point + button wiring.
const game=new Game($('game'));
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;Sfx.play('click');const g=game;
 ({menu:()=>{g.state='menu';UI.show('menu')},play:()=>g.start(Math.min(Store.d.unlocked,LEVELS)-1),levels:()=>UI.show('levels'),skins:()=>UI.show('skins'),settings:()=>UI.show('settings'),
  pause:()=>g.pause(),resume:()=>g.pause(),restart:()=>g.start(g.li),next:()=>g.start(g.li+1),lvl:()=>g.start(+b.dataset.i),skin:()=>UI.pick(+b.dataset.i)})[b.dataset.act]?.()});
$('snd').onchange=e=>{Store.d.sound=e.target.checked;Store.save()};
$('vol').oninput=e=>{Store.d.vol=+e.target.value;Store.save()};
