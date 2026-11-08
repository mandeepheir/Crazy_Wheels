// UI: shows/hides menu screens and fills in their content.
const $=id=>document.getElementById(id);
const UI={
 show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));
  const play=id==='';$('hud').classList.toggle('on',play);$('touch').classList.toggle('on',play);
  if(id==='levels')this.levels();if(id==='skins')this.skins();if(id==='settings'){$('snd').checked=Store.d.sound;$('vol').value=Store.d.vol}},
 levels(){$('lg').innerHTML=Array.from({length:LEVELS},(_,i)=>{const lock=i+1>Store.d.unlocked,b=Store.d.best[i];
  return`<button class="card ${lock?'lock':''}" ${lock?'disabled':`data-act="lvl" data-i="${i}"`}>Level ${i+1}<br><small>${THEMES[i].n}</small><br>${lock?'Locked':b?'Best '+b:'New'}</button>`}).join('')},
 skins(){$('wal').textContent=Store.d.coins;$('sg').innerHTML=SKINS.map((k,i)=>{const own=Store.d.owned.includes(i);
  return`<button class="card ${i===Store.d.skin?'sel':''}" data-act="skin" data-i="${i}"><div class="sw" style="background:${k.c}"></div>${k.n}<br><small>${own?(i===Store.d.skin?'Equipped':'Owned'):k.cost+' coins'}</small></button>`}).join('')},
 pick(i){const k=SKINS[i];if(!Store.d.owned.includes(i)){if(Store.d.coins<k.cost)return;Store.d.coins-=k.cost;Store.d.owned.push(i)}Store.d.skin=i;Store.save();Sfx.play('coin');this.skins()}};
