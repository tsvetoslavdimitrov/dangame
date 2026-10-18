(function(){
'use strict';
const $=s=>document.querySelector(s);
const stage=$('#stage');
function fit(){const s=Math.min(innerWidth/1280,innerHeight/800);stage.style.transform='scale('+s+')';}
addEventListener('resize',fit);fit();

const VILLAGES=[
 {name:'Ябълково село',short:'Ябълково',grade:1,color:'#e53935',part:'Слънце',x:120,y:200,size:10,
  cw:[['ЯБЪЛКА','Червен или зелен плод, расте на дърво.'],['КОШ','В него събираме набраните ябълки.'],['ЛИСТ','Зелен е през лятото, а наесен пожълтява и пада.'],['ПЧЕЛА','Жужи от цвят на цвят и прави мед.']]},
 {name:'Морско село',short:'Морско',grade:2,color:'#1e88e5',part:'Къща',x:440,y:390,size:8,
  cw:[['РИБА','Плува във водата и има люспи.'],['ЛОДКА','С нея плаваме по морето с гребла или платно.'],['ВЪЛНА','Издига се по морето, когато духа вятър.'],['ПЯСЪК','Жълт е на плажа и от него строим замъци.']]},
 {name:'Горско село',short:'Горско',grade:3,color:'#43a047',part:'Дърво',x:760,y:200,size:8,
  cw:[['ГЪБА','Расте в гората след дъжд и има шапка.'],['ЛИСИЦА','Хитра горска животинка с рижава опашка.'],['ЕЛХА','Иглолистно дърво, което украсяваме за Нова година.'],['ЖЪЛЪД','Плодът на дъба – катеричките го обичат.']]},
 {name:'Островът на звездата',short:'Островът',grade:4,color:'#8e24aa',part:'Лодка',x:960,y:400,size:8,
  cw:[['ЗВЕЗДА','Свети високо в нощното небе.'],['ДРАКОН','Приказно създание с крила, което бълва огън.'],['ОСТРОВ','Суша, заобиколена отвсякъде с вода.'],['ФАР','Кула със светлина, която показва пътя на корабите.']]}
];
const KEY='dangame-progress-v1';
function load(){try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return fresh();}}
function fresh(){return {done:[false,false,false,false],solved:{},visits:[0,0,0,0],relayDone:false,celebrated:false,muted:false,grade:null};}
let P=load();
function save(){localStorage.setItem(KEY,JSON.stringify(P));}
const nDone=()=>P.done.filter(Boolean).length;
const unlocked=i=>i===0||i<=(P.grade||1)-1||P.done[i-1];

// ---------- speech ----------
let curAudio=null;
function stopSpeech(){if(curAudio){curAudio.pause();curAudio=null;}if(window.speechSynthesis)speechSynthesis.cancel();}
function webSpeak(text){if(!text||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(text);u.lang='bg-BG';u.rate=0.9;
 const v=speechSynthesis.getVoices().find(v=>/^bg/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u);}
function say(key){stopSpeech();if(P.muted)return;const text=(window.SPEECH||{})[key];
 const a=new Audio('audio/'+key+'.mp3');curAudio=a;let fell=false;const fb=()=>{if(fell||curAudio!==a)return;fell=true;curAudio=null;webSpeak(text);};
 a.onerror=fb;const pr=a.play();if(pr&&pr.catch)pr.catch(e=>{if(e&&e.name!=='AbortError')fb();});}
const spk=(key,size)=>`<button class="spk" data-say="${key}" title="Чуй отново" style="${size?'width:'+size+'px;height:'+size+'px;font-size:'+(size*0.5)+'px':''}">🔊</button>`;
// ---------- art ----------
function starSVG(s,c,stroke){c=c||'#ffd600';stroke=stroke||'#e65100';return `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><polygon points="50,4 62,38 98,38 69,59 80,94 50,73 20,94 31,59 2,38 38,38" fill="${c}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/></svg>`;}
const grayStar=s=>starSVG(s,'#cfd8dc','#90a4ae');
function villageStar(i,s){if(!P.done[i])return grayStar(s);return i===3?`<span class="glow" style="display:inline-block">${starSVG(s,'#fffde7','#ff6f00')}</span>`:starSVG(s);}
const PARTS=[
 ()=>{let r='';for(let a=0;a<360;a+=45){const t=a*Math.PI/180;r+=`<line x1="115" y1="105" x2="${115+95*Math.cos(t)}" y2="${105+95*Math.sin(t)}"/>`;}return `<g stroke="#ff9800" stroke-width="9" stroke-linecap="round">${r}</g><circle cx="115" cy="105" r="55" fill="#ffca28"/><circle cx="98" cy="95" r="6" fill="#5d4037"/><circle cx="132" cy="95" r="6" fill="#5d4037"/><path d="M95 120 Q115 138 135 120" stroke="#5d4037" stroke-width="5" fill="none"/>`;},
 ()=>`<rect x="40" y="90" width="150" height="110" fill="#ef5350"/><polygon points="25,95 115,20 205,95" fill="#8d6e63"/><rect x="95" y="140" width="40" height="60" fill="#5d4037"/><rect x="55" y="110" width="30" height="30" fill="#bbdefb"/><rect x="150" y="110" width="30" height="30" fill="#bbdefb"/>`,
 ()=>`<rect x="100" y="120" width="30" height="90" fill="#6d4c41"/><circle cx="115" cy="90" r="70" fill="#43a047"/><circle cx="90" cy="80" r="10" fill="#e53935"/><circle cx="140" cy="105" r="10" fill="#e53935"/><circle cx="120" cy="55" r="10" fill="#e53935"/>`,
 ()=>`<path d="M0 195 Q60 175 115 195 T230 195" stroke="#0288d1" stroke-width="10" fill="none"/><path d="M25 160 Q115 225 205 160 Z" fill="#8d6e63"/><line x1="115" y1="40" x2="115" y2="165" stroke="#5d4037" stroke-width="6"/><polygon points="120,45 200,145 120,145" fill="#fff" stroke="#90a4ae" stroke-width="3"/><polygon points="115,40 85,52 115,64" fill="#e53935"/>`
];
function drawing(filled,w){w=w||500;let o=`<svg width="${w}" height="${w*0.88}" viewBox="0 0 500 440">`;
 for(let i=0;i<4;i++){const x=(i%2)*250,y=Math.floor(i/2)*220;
  o+=filled[i]?`<g transform="translate(${x},${y})"><rect width="246" height="216" rx="18" fill="#e1f5fe" stroke="#ffb300" stroke-width="5"/><g transform="translate(8,4)">${PARTS[i]()}</g></g>`
   :`<g transform="translate(${x},${y})"><rect width="246" height="216" rx="18" fill="#eceff1" stroke="#90a4ae" stroke-width="5" stroke-dasharray="14 10"/><text x="123" y="130" font-size="80" text-anchor="middle" fill="#b0bec5" font-weight="900">?</text></g>`;}
 return o+'</svg>';}
const ISLAND=`<svg width="1280" height="800" class="abs" style="left:0;top:0"><ellipse cx="640" cy="480" rx="580" ry="280" fill="#ffe082"/><ellipse cx="640" cy="470" rx="540" ry="250" fill="#8bc34a"/><ellipse cx="380" cy="420" rx="140" ry="70" fill="#7cb342"/><ellipse cx="900" cy="560" rx="160" ry="70" fill="#7cb342"/><g fill="#2e7d32"><circle cx="230" cy="600" r="26"/><circle cx="660" cy="300" r="22"/><circle cx="1080" cy="330" r="24"/><circle cx="620" cy="650" r="20"/></g></svg>`;
const DRAGON=`<svg width="220" height="200" viewBox="0 0 260 230"><path d="M60 150 Q20 120 40 80 Q70 110 90 110Z" fill="#81c784"/><path d="M200 140 Q250 100 230 60 Q200 100 180 100Z" fill="#81c784"/><ellipse cx="130" cy="150" rx="70" ry="55" fill="#4caf50"/><ellipse cx="130" cy="165" rx="40" ry="32" fill="#c5e1a5"/><circle cx="130" cy="78" r="45" fill="#4caf50"/><circle cx="114" cy="72" r="10" fill="#fff"/><circle cx="146" cy="72" r="10" fill="#fff"/><circle cx="116" cy="74" r="5"/><circle cx="148" cy="74" r="5"/><path d="M115 98 Q130 108 145 98" stroke="#1b5e20" stroke-width="4" fill="none"/><polygon points="105,40 112,15 122,38" fill="#ffb300"/><polygon points="138,38 148,15 155,40" fill="#ffb300"/><path d="M195 170 Q245 190 240 215" stroke="#4caf50" stroke-width="16" fill="none" stroke-linecap="round"/></svg>`;
function house(c){return `<svg width="130" height="104"><polygon points="15,52 65,8 115,52" fill="${c}"/><rect x="27" y="52" width="76" height="48" fill="#fff8e1" stroke="#6d4c41" stroke-width="4"/><rect x="55" y="68" width="22" height="32" fill="#6d4c41"/></svg>`;}
function esc(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function top(title){return `<div class="top"><button class="pill" data-act="map">🏝 DanGame</button><span class="h">${title}</span><span class="pill">⭐ ${nDone()}/4</span><span class="pill">🖍 Части: ${nDone()}/4</span></div>`;}
function confetti(n){let h='';const cs=['#e53935','#ffb300','#43a047','#1e88e5','#8e24aa','#ff80ab'];for(let i=0;i<(n||60);i++)h+=`<i class="conf" style="left:${Math.random()*1280}px;background:${cs[i%6]};animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*2}s"></i>`;return h;}
function show(html,night){stopSpeech();stage.className=night?'night':'';stage.innerHTML=html;}
stage.addEventListener('click',e=>{const sp=e.target.closest('[data-say]');if(sp){e.stopPropagation();if(P.muted){toast('🔇 Звукът е изключен (меню Родители)');return;}say(sp.dataset.say);return;}const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 stopSpeech();if(a==='map')map();else if(a==='play'){P.grade?map():gradeScreen();}else if(a==='parents')parents();else if(a==='drawing')drawingScreen();else if(a==='title')title();});

// ---------- screens ----------
function title(){show(ISLAND+`<div class="abs" style="top:70px;width:100%;text-align:center"><div style="font-size:110px;font-weight:900;color:#fff;-webkit-text-stroke:4px #6a1b9a;text-shadow:0 8px 0 #6a1b9a">DanGame</div>
<div style="font-size:40px;font-weight:900;color:#4a148c">Нарисувай острова част по част</div>
<div style="font-size:26px;margin-top:8px;color:#311b92">Реши задачите във всяко село и сглоби голямата рисунка на острова! ${spk("ui-title",56)}</div></div>
<div class="abs" style="left:0;right:0;top:390px;display:flex;justify-content:center;gap:30px">${[0,1,2].map(i=>villageStar(i,80)).join('')}${P.done[3]?villageStar(3,100):grayStar(100)}</div>
<div class="abs" style="top:560px;width:100%;text-align:center"><button class="btn g" data-act="play" style="font-size:46px">▶ Играй</button>&nbsp;&nbsp;<button class="btn p" data-act="parents">Родители</button></div>
<div class="abs pill" style="bottom:14px;right:16px;font-size:16px">За деца 7–10 години</div>`);}

function gradeScreen(fromParents){show(ISLAND+`<div class="abs card" style="left:190px;top:110px;width:900px;padding:34px;text-align:center">
<div style="font-size:44px;font-weight:900">В кой клас си? ${spk('ui-grade',60)}</div><div style="font-size:24px;margin:8px 0 26px">Ще започнеш от селото за твоя клас.</div>
<div style="display:flex;justify-content:center;gap:24px">${VILLAGES.map((v,i)=>`<button class="gradeBtn" data-g="${i+1}" style="width:170px;height:200px;border-radius:30px;border:6px solid ${v.color};background:#fff;cursor:pointer;font-family:inherit;box-shadow:0 8px 0 ${v.color}"><div style="font-size:84px;font-weight:900;color:${v.color}">${i+1}</div><div style="font-size:26px;font-weight:900">клас</div><div style="font-size:16px;color:#555">${v.short}</div></button>`).join('')}</div></div>`);
 stage.querySelectorAll('.gradeBtn').forEach(b=>b.onclick=()=>{P.grade=+b.dataset.g;save();map();toast('Започваш от '+VILLAGES[P.grade-1].name+'!');});
 say('ui-grade');}
function map(){
 if(nDone()===4&&!P.celebrated){return finale();}
 let h=ISLAND+`<svg width="1280" height="800" class="abs" style="left:0;top:0"><path d="M225 300 C 380 300, 420 520, 545 490 S 760 300, 865 300 S 1000 520, 1065 500" stroke="#fff" stroke-width="14" fill="none" stroke-dasharray="4 26" stroke-linecap="round"/></svg>`+top('Картата на острова');
 VILLAGES.forEach((v,i)=>{const st=P.done[i]?'done':unlocked(i)?'open':'lock';
  h+=`<div class="village ${st==='lock'?'lock':''}" data-v="${i}" style="left:${v.x}px;top:${v.y}px">${house(v.color)}<div class="name" style="border-color:${v.color}">${i+1}. ${v.name}</div><div style="margin-top:4px">${st==='lock'?'<span style="font-size:40px">🔒</span>':villageStar(i,i===3?56:48)}</div></div>`;});
 let next=P.done.findIndex((d,i)=>!d&&i>=(P.grade||1)-1);if(next<0)next=P.done.indexOf(false);
 h+=`<div class="card" style="left:30px;top:640px;width:720px;padding:14px 22px 14px 90px;font-size:23px"><span style="position:absolute;left:14px;top:14px">${spk('ui-map',60)}</span>${next<0?'Всички села са спасени! 🎉 Можеш да играеш отново във всяко село.':`<b>Следва:</b> ${VILLAGES[next].name} – ${['лесни задачи за начало','по-трудни задачи','още по-трудни задачи','най-трудните задачи на острова'][next]}. Натисни селото!`}</div>
 <div class="abs" style="left:790px;top:660px"><button class="btn p s" data-act="drawing">🖼 Рисунката</button> <button class="btn s" data-act="parents" style="background:#90a4ae;box-shadow:0 6px 0 #546e7a">⚙ Родители</button></div>`;
 show(h);
 stage.querySelectorAll('.village').forEach(el=>el.onclick=()=>{const i=+el.dataset.v;if(unlocked(i))startVillage(i);else toast('🔒 Първо спаси предишното село!');});
}
function toast(t){const d=document.createElement('div');d.className='abs card pop';d.style.cssText='left:390px;top:330px;width:500px;padding:24px;font-size:28px;font-weight:900;text-align:center;z-index:60';d.textContent=t;stage.appendChild(d);setTimeout(()=>d.remove(),1800);}

function parents(){const m=document.createElement('div');m.className='modal';
 m.innerHTML=`<div class="box"><div style="font-size:34px;font-weight:900;margin-bottom:10px">⚙ За родители</div>
 <p>Завършени села: <b>${nDone()} от 4</b><br>Решени задачи: <b>${Object.keys(P.solved).length}</b></p>
 <p style="font-size:18px;color:#666;margin:12px 0">Задачите са от примерните тестове „Математика без граници“ (1.–4. клас). Прогресът се пази само на това устройство.</p>
 <p style="margin:10px 0"><button class="btn s ${P.muted?'':'g'}" id="mute">${P.muted?'🔇 Гласът е изключен – включи':'🔊 Гласът е включен – изключи'}</button></p><p style="margin:10px 0">Клас: <b>${P.grade||'не е избран'}</b> <button class="btn s p" id="chg">Смени класа</button></p><p style="margin:14px 0">За да изтриеш прогреса, реши: <b id="pq"></b> <input id="pa" inputmode="numeric" style="width:90px;font-size:26px;text-align:center;border:3px solid #7e57c2;border-radius:12px"></p>
 <button class="btn s" id="reset" style="background:#e53935;box-shadow:0 6px 0 #b71c1c">Изтрий прогреса</button> <button class="btn g s" id="close">Затвори</button></div>`;
 stage.appendChild(m);const a=6+Math.floor(Math.random()*4),b=6+Math.floor(Math.random()*4);m.querySelector('#pq').textContent=`${a} × ${b} =`;
 m.querySelector('#close').onclick=()=>m.remove();
 m.querySelector('#chg').onclick=()=>{m.remove();gradeScreen(true);};
 m.querySelector('#mute').onclick=()=>{P.muted=!P.muted;save();stopSpeech();m.remove();parents();};
 m.querySelector('#reset').onclick=()=>{if(+m.querySelector('#pa').value===a*b){P=fresh();save();m.remove();title();toast('Прогресът е изтрит.');}else{m.querySelector('#pa').style.borderColor='#e53935';}};
}

// ---------- session ----------
let S=null;
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startVillage(vi){const v=VILLAGES[vi];const all=TASKS[String(v.grade)];
 const relay=all.filter(t=>t.round==='shtafeta').sort((a,b)=>a.number-b.number);
 const reg=all.filter(t=>t.round!=='shtafeta');
 const pick=n=>{const uns=shuffle(reg.filter(t=>!P.solved[t.id])),sol=shuffle(reg.filter(t=>P.solved[t.id]));return uns.concat(sol).slice(0,n);};
 let list;
 if(relay.length&&(!P.relayDone?P.visits[vi]>=1:P.visits[vi]%2===1)){list=pick(v.size-relay.length).concat(relay.map(t=>Object.assign({relay:true},t)));} // relay block kept in order
 else list=pick(v.size);
 // sort easier first: shorter answers / earlier numbers first within village 1
 const RO={esen:0,zima:1,prolet:2,final:3};if(vi===0)list=list.filter(t=>!t.relay).sort((a,b)=>(RO[a.round]-RO[b.round])||(a.number-b.number)).concat(list.filter(t=>t.relay));
 const items=list.map(t=>({kind:'task',t}));items.splice(Math.ceil(items.length/2),0,{kind:'cw'});
 P.visits[vi]++;save();
 S={vi,items,idx:0,correct:0};next();}
function next(){if(S.idx>=S.items.length)return villageComplete();const it=S.items[S.idx];if(it.kind==='cw')crossword();else task(it.t);}
function header(){const v=VILLAGES[S.vi];return top(`${S.vi+1}. ${v.name} · ${S.idx+1} от ${S.items.length}`)+`<div class="abs prog" style="left:530px;top:800px"></div>`;}
function dragonCorner(msg){return S.vi===3?`<div class="abs bob" style="right:6px;bottom:30px;z-index:4;pointer-events:none">${DRAGON}</div><div class="abs card" style="right:12px;top:120px;width:220px;padding:10px 14px;font-size:19px;font-weight:800;z-index:4;border-color:#81c784">🐉 Искрица: ${msg} ${spk('ui-dragon',44)}</div>`:'';}

function normalize(s){return String(s).toLowerCase().replace(/\s+/g,'').replace(/[−–]/g,'-').replace(/или/g,',').replace(/и/g,',');}
function nums(s){return (String(s).match(/\d+/g)||[]).map(Number);}
function check(t,val){
 if(t.answers_all){const a=nums(val).sort((x,y)=>x-y).join(','),b=t.answers_all.slice().sort((x,y)=>x-y).join(',');return a===b;}
 if(t.type==='number')return val!==''&&Number(String(val).replace(/\s/g,''))===Number(t.answer);
 return normalize(val)===normalize(t.answer);}
function task(t){
 const v=VILLAGES[S.vi];let tries=0,val='';
 const relayBadge=t.relay?`<span class="pill" style="background:#e1bee7;border-color:#8e24aa;font-size:18px">🏃 Щафета ${t.number}/5 · отговорът ти отива в следващата задача</span><br><br>`:'';
 const q=esc(t.question_bg);
 const img=t.image?`<img src="${t.image}" alt="" style="max-width:100%;max-height:${S.vi===3?250:300}px;border-radius:14px;border:3px solid #eee;margin-top:12px;background:#fff">`:'';
 const qsize=q.length>170?24:q.length>110?28:32;
 const isChoice=t.type==='choice';
 const keys=t.answers_all?['1','2','3','4','5','6','7','8','9',', ','0','⌫']:(t.type==='text'?['1','2','3','4','5','6','7','8','9','+','0','−','<','>','=','⌫']:['1','2','3','4','5','6','7','8','9','⌫','0']);
 let right=isChoice?`<div style="font-size:26px;font-weight:800;margin-bottom:8px">Избери отговор:</div><div>${t.choices.map(c=>`<button class="opt" data-c="${esc(c)}" style="font-size:${c.length>3?28:44}px">${esc(c)}</button>`).join('')}</div>`
  :`<div style="font-size:24px;font-weight:800">${t.answers_all?'Запиши всички отговори (със запетая):':'Твоят отговор:'}</div><div class="ans" id="ans">&nbsp;</div><div class="pad" style="margin-top:14px">${keys.map(k=>`<button data-k="${k}">${k}</button>`).join('')}<button class="ok" data-k="ok">✔ Провери</button></div>`;
 show(top(`${S.vi+1}. ${v.name} · Задача ${S.idx+1} от ${S.items.length}`)+`<div class="card" style="left:30px;top:92px;width:${S.vi===3?990:1220}px;height:690px;padding:26px 30px;display:flex;gap:28px">
 <div style="flex:1;overflow:hidden" id="left">${relayBadge}<div style="display:flex;gap:14px;align-items:flex-start">${spk(t.id,72)}<div class="q" style="font-size:${qsize}px">${q}</div></div>${t.example&&!t.relay?`<div class="ex">👀 Разгледай: ${esc(t.example)}</div>`:''}${img}<div id="fb"></div></div>
 <div style="width:${isChoice?420:390}px;text-align:center;flex:none">${right}<div id="nextbox" style="margin-top:14px"></div></div></div>`+dragonCorner(['Ти можеш! Помисли спокойно.','Аз пазя последната част от рисунката!','Огнено добре се справяш! 🔥'][S.idx%3]),S.vi===3);
 const fb=$('#fb'),ans=$('#ans');say(t.id);
 const done=(ok)=>{if(ok){P.solved[t.id]=true;S.correct++;}if(t.relay&&t.number===5)P.relayDone=true;save();
  $('#nextbox').innerHTML=`<button class="btn g" id="nx">Напред ➜</button>`;$('#nx').onclick=()=>{S.idx++;next();};
  stage.querySelectorAll('.pad button,.opt').forEach(b=>b.disabled=true);};
 const submit=(x)=>{if(String(x).trim()==='')return;
  if(check(t,x)){fb.innerHTML=`<div class="fb good pop">${['🎉 Браво! Вярно е!','⭐ Супер! Точно така!','👏 Отлично! Справи се!'][Math.floor(Math.random()*3)]}</div>`;done(true);return true;}
  tries++;
  if(tries>=3){fb.innerHTML=`<div class="fb show">💙 Нищо страшно! Верният отговор е <b>${esc(t.answers_all?t.answers_all.join(', '):t.answer)}</b>. Следващия път ще успееш!</div>`;done(false);return false;}
  const hint=tries===1?(t.example?'Почти! Погледни пак примера в лилавото поле и опитай отново.':['Почти! Прочети задачата бавно още веднъж.','Опитай пак! Може да си помогнеш с рисунка или с пръстите.','Хм, не съвсем. Пресметни стъпка по стъпка.'][Math.floor(Math.random()*3)])
   :(t.answers_all?'Подсказка: тук има повече от един отговор – запиши всички!':`Подсказка: отговорът ${String(t.answer).length>1&&!isNaN(t.answer)?'има '+String(t.answer).length+' цифри':'започва с „'+String(t.answer)[0]+'“'}. Още един опит!`);
  fb.innerHTML=`<div class="fb hint pop">🤔 ${hint}</div>`;return false;};
 if(isChoice){stage.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=submit(b.dataset.c);b.classList.add(ok?'ok':'bad');});}
 else{const upd=()=>ans.innerHTML=val?esc(val):'&nbsp;';
  stage.querySelectorAll('.pad button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;
   if(k==='⌫')val=val.slice(0,-1);else if(k==='ok'){submit(val);return;}else if(val.length<12)val+=(k==='−'?'-':k);
   upd();ans.style.borderColor='#64b5f6';});
  S._key=e=>{if(!document.body.contains(ans))return;if(/^[0-9+<>=,\- ]$/.test(e.key)&&val.length<12){val+=e.key;upd();}else if(e.key==='Backspace'){val=val.slice(0,-1);upd();}else if(e.key==='Enter')submit(val);};
 }
}
addEventListener('keydown',e=>{if(S&&S._key)S._key(e);});

function crossword(){
 S._key=null;const v=VILLAGES[S.vi];const words=v.cw;let wi=0,pos=0;const filled=words.map(w=>Array(w[0].length).fill(''));
 function letters(){const w=words[wi][0];const pool=new Set(w.split(''));const extra='АБВГДЕЖЗИКЛМНОПРСТУФЪЯ'.split('');while(pool.size<Math.min(12,w.length+5))pool.add(extra[Math.floor(Math.random()*extra.length)]);return shuffle([...pool]);}
 let pool=letters();
 function render(){
  show(top(`${S.vi+1}. ${v.name} · Кръстословица`)+`<div class="card" style="left:30px;top:92px;width:${S.vi===3?560:720}px;height:690px;padding:24px 30px"><div style="font-size:30px;font-weight:900">✏ Кръстословица на селото ${spk("ui-cw",50)}</div><div style="font-size:19px;color:#666;margin-bottom:8px">Натисни буквите, за да попълниш думата.</div>
  ${words.map((w,i)=>`<div class="cw-row ${i===wi?'active':''}"><div class="num">${i+1}</div>${w[0].split('').map((c,j)=>`<div class="cw-cell ${i<wi?'done':''} ${i===wi&&j===pos?'cur':''}">${filled[i][j]}</div>`).join('')}</div>`).join('')}
  <div id="cwfb"></div></div>
  <div class="card" style="left:${S.vi===3?610:780}px;top:92px;width:${S.vi===3?410:470}px;height:690px;padding:24px;text-align:center">
  ${wi<words.length?`<div style="font-size:24px;font-weight:900;color:#e65100">Дума ${wi+1}: ${spk("cw-"+S.vi+"-"+wi,64)}</div><div style="font-size:26px;font-weight:800;margin:10px 0 20px;min-height:110px">${esc(words[wi][1])}</div>
  <div class="kb">${pool.map(c=>`<button data-l="${c}">${c}</button>`).join('')}<button data-l="⌫" style="background:#ffccbc;box-shadow:0 4px 0 #ff7043">⌫</button></div>
  <div style="margin-top:20px"><button class="btn s p" id="hint">💡 Покажи буква</button></div>`
  :`<div class="pop" style="font-size:80px">🎉</div><div style="font-size:32px;font-weight:900">Кръстословицата е решена!</div><br><button class="btn g" id="nx">Напред ➜</button>`}</div>`+dragonCorner('Обичам думи! Особено „ДРАКОН“ 😄'),S.vi===3);
  stage.querySelectorAll('.kb button').forEach(b=>b.onclick=()=>press(b.dataset.l));
  const h=$('#hint');if(h)h.onclick=()=>press(words[wi][0][pos]);
  const nx=$('#nx');if(nx)nx.onclick=()=>{S.idx++;next();};
  sayClue();
 }
 let lastSaid=-1;function sayClue(){if(wi<words.length&&lastSaid!==wi){lastSaid=wi;say('cw-'+S.vi+'-'+wi);}}
 function press(l){const w=words[wi][0];
  if(l==='⌫'){if(pos>0){pos--;filled[wi][pos]='';}render();return;}
  if(l===w[pos]){filled[wi][pos]=l;pos++;if(pos===w.length){wi++;pos=0;if(wi<words.length)pool=letters();}render();}
  else{render();$('#cwfb').innerHTML=`<div class="fb hint pop" style="font-size:22px">🤔 Тази буква не пасва тук. Опитай друга!</div>`;}}
 render();
}

function villageComplete(){S._key=null;const vi=S.vi,v=VILLAGES[vi];const first=!P.done[vi];P.done[vi]=true;save();
 const rare=vi===3;
 show(`<div class="abs" style="inset:0;background:${rare?'radial-gradient(circle at 30% 40%,#fff,#ce93d8 40%,#4a148c)':'radial-gradient(circle at 30% 40%,#fff9c4,#ffcc80 50%,#ff8a65)'}"></div>${confetti()}
 <div class="abs" style="top:30px;width:100%;text-align:center;font-size:56px;font-weight:900;color:${rare?'#fff':'#bf360c'}">${v.name} е спасено!</div>
 <div class="abs" style="left:110px;top:160px;width:400px;text-align:center"><div class="pop ${rare?'glow':''}" style="display:inline-block">${rare?starSVG(300,'#fffde7','#ff6f00'):starSVG(280)}</div>
 <div style="font-size:30px;font-weight:900;color:${rare?'#fff':'#2b2350'}">${rare?'✨ Рядка Сияйна звезда! ✨':'Легендарна звезда №'+(vi+1)}</div><div style="font-size:22px;color:${rare?'#fff':'#2b2350'}">Верни отговори: ${S.correct} от ${S.items.length-1}</div></div>
 <div class="card" style="left:600px;top:150px;width:560px;padding:20px;text-align:center"><div style="font-size:30px;font-weight:900">Ти нарисува една част: ${v.part}!</div>${drawing(P.done,500)}</div>
 ${rare?`<div class="abs bob" style="left:470px;top:520px">${DRAGON}</div>`:''}
 <div class="abs" style="top:700px;width:100%;text-align:center"><button class="btn g" data-act="map">${nDone()===4&&!P.celebrated?'Към голямата рисунка ➜':'Към картата ➜'}</button></div>`,false);
 say(rare?'ui-rare':'ui-done');S=null;}

function drawingScreen(){S=null;show(ISLAND+top('Голямата рисунка')+`<div class="card" style="left:70px;top:100px;width:580px;height:670px;padding:30px;text-align:center">${drawing(P.done,510)}<div style="font-size:24px;margin-top:12px">${nDone()===4?'Рисунката е готова! 🎨':'Остават <b>'+(4-nDone())+'</b> части.'}</div></div>
 <div class="card" style="left:690px;top:100px;width:520px;height:670px;padding:30px;font-size:25px;line-height:1.9"><b style="font-size:30px">Моите части</b><br>${VILLAGES.map((v,i)=>`<div style="display:flex;align-items:center;gap:10px">${P.done[i]?villageStar(i,40):grayStar(40)} ${i+1}. ${v.short} – ${P.done[i]?v.part+' ✅':'? 🔒'}</div>`).join('')}
 <br><button class="btn g s" data-act="map">⬅ Към картата</button></div>`);}

function finale(){P.celebrated=true;save();S=null;
 show(`${''.padEnd(0)}${Array.from({length:40},(_,i)=>`<div class="abs" style="left:${(i*137)%1280}px;top:${(i*71)%700+20}px;color:#fff;font-size:${10+i%3*8}px">✦</div>`).join('')}${confetti(120)}
 <div class="abs" style="top:24px;width:100%;text-align:center;font-size:58px;font-weight:900;color:#fff59d;text-shadow:0 4px 0 #6a1b9a">Островът е нарисуван! 🎉</div>
 <div class="card pop" style="left:60px;top:120px;width:560px;padding:20px;text-align:center">${drawing([1,1,1,1],510)}<div style="font-size:26px;font-weight:900">Голямата рисунка е сглобена!</div></div>
 <div class="abs" style="left:680px;top:140px;width:560px;text-align:center"><div style="display:flex;justify-content:center;gap:16px;align-items:center">${[0,1,2].map(i=>starSVG(90)).join('')}<span class="glow">${starSVG(150,'#fffde7','#ff6f00')}</span></div>
 <div style="color:#fff;font-size:26px;font-weight:800;margin:10px 0">Събра всички 4 легендарни звезди!</div>
 <div class="bob" style="display:inline-block">${DRAGON}</div><div class="card" style="position:relative;padding:12px;font-size:22px;font-weight:800;border-color:#81c784">🐉 Искрица: „Ти си истински художник и математик! Благодаря ти!“</div>
 <br><button class="btn g" data-act="map">Към картата ➜</button></div>`,true);say('ui-final');}

window.DanGame={map,title,drawingScreen,finale,get progress(){return P;}};
title();
})();
