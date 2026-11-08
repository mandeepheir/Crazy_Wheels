// Saves progress in LocalStorage.
const SKINS=[{n:'Cherry',c:'#ff5d73',cost:0},{n:'Mint',c:'#2ec4b6',cost:25},{n:'Sunny',c:'#ffb703',cost:60},{n:'Grape',c:'#9b5de5',cost:100},{n:'Ocean',c:'#00a6fb',cost:150}];
const Store={key:'crazyWheels.v1',d:{unlocked:1,best:{},coins:0,skin:0,owned:[0],sound:true,vol:.6},
 load(){try{Object.assign(this.d,JSON.parse(localStorage.getItem(this.key)||'{}'))}catch(e){}},
 save(){try{localStorage.setItem(this.key,JSON.stringify(this.d))}catch(e){}}};
Store.load();
