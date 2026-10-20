(() => {
  // Неразрывный пробел после коротких слов и перед тире/единицами
  const walk = (n) => {
    if (n.nodeType === 3) { n.nodeValue = n.nodeValue.replace(/(^|[\s(«"])([А-Яа-яЁёA-Za-z]{1,3})\s(?=\S)/g, '$1$2 ').replace(/(\d)\s(?=[А-Яа-яЁё$%₽×])/g, '$1 '); return; }
    if (n.nodeType === 1 && !/^(SCRIPT|STYLE|INPUT|TEXTAREA)$/.test(n.tagName)) n.childNodes.forEach(walk);
  };
  walk(document.body);

  // Шапка
  const hdr = document.getElementById('hdr');
  const onScroll = () => {
    if (hdr) hdr.classList.toggle('scrolled', scrollY > 8);
    const st = document.getElementById('sticky');
    if (st) st.classList.toggle('show', scrollY > window.innerHeight * 0.7 && !dlg?.open);
  };
  addEventListener('scroll', onScroll, { passive: true });

  // Появление блоков
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));

  // Видео
  const vf = document.getElementById('vf'), vid = document.getElementById('vid'), vp = document.getElementById('vplay');
  if (vp) vp.addEventListener('click', () => { vid.controls = true; vid.play(); vf.classList.add('playing'); });

  // Маршрут
  const ROUTES = {
    income: { t: 'Выйти на стабильный доход', s: [
      ['Точка Сборки', 'Пять дней: твёрдая услуга, цена и первая воронка.', 'Бесплатно'],
      ['Мой оффер', 'Сервис соберёт ваше предложение клиенту.', 'Сервис платформы'],
      ['План Продюсера', 'Продукт и продажи с наставниками.', 'Программа'],
      ['Клан и встречи', 'Окружение, которое держит темп.', 'Клан Кристины']] },
    product: { t: 'Запустить свой продукт', s: [
      ['Выбор ниши', 'Сервис поможет выбрать, с чем выходить на рынок.', 'Сервис платформы'],
      ['Мой оффер', 'Упаковка предложения за несколько шагов.', 'Сервис платформы'],
      ['План Продюсера', 'Запуск продукта с наставниками.', 'Программа'],
      ['ИИнструменты', 'Нейросети, которые берут рутину на себя.', 'Курс']] },
    people: { t: 'Найти сильное окружение', s: [
      ['Профиль', 'Расскажите о себе и своём деле.', 'Кабинет'],
      ['Рядом со мной', 'Участники Альянса в вашем городе.', 'Карта участников'],
      ['Вебинары и события', 'Открытые эфиры и календарь Альянса.', 'Бесплатно'],
      ['Клан Кристины', 'Встречи, чат и поддержка директора.', 'Клан']] },
    order: { t: 'Навести порядок в целях', s: [
      ['Колесо баланса', 'Десять сфер жизни на одном экране.', 'Трекер'],
      ['Фокус дня и привычки', 'Каждый день один главный шаг.', 'Трекер'],
      ['Гид на год', 'Цели на год, разбитые на шаги.', 'Трекер'],
      ['ПЭРЛ', 'Карта роста по уровням Альянса.', 'Платформа']] },
  };
  let goal = 'income';
  const path = document.getElementById('path');
  const draw = () => {
    if (!path) return;
    path.innerHTML = ROUTES[goal].s.map((s, i) => `<div class="step"><div class="sn" aria-hidden="true">0${i + 1}</div><h3>${s[0]}</h3><p>${s[1]}</p><span class="where">${s[2]}</span></div>`).join('');
    walk(path);
  };
  document.querySelectorAll('.goal').forEach((b) => b.addEventListener('click', () => {
    goal = b.dataset.goal;
    document.querySelectorAll('.goal').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    draw();
  }));
  draw();

  // Регистрация
  const dlg = document.getElementById('reg');
  const mg = document.getElementById('m-goal');
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => {
    if (!dlg) return;
    const withGoal = b.hasAttribute('data-with-goal');
    mg.textContent = withGoal ? 'Ваша цель: ' + ROUTES[goal].t : '';
    mg.classList.toggle('on', withGoal);
    dlg.showModal();
    document.getElementById('sticky')?.classList.remove('show');
    setTimeout(() => dlg.querySelector('input')?.focus(), 60);
  }));
  dlg?.querySelector('[data-close]').addEventListener('click', () => dlg.close());
  dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg?.addEventListener('close', onScroll);
  const f = document.getElementById('f');
  const RULES = {
    name: (v) => v.trim() ? '' : 'Напишите, как к вам обращаться.',
    email: (v) => /^\S+@\S+\.\S+$/.test(v.trim()) ? '' : 'Проверьте почту: нужен адрес вида name@mail.ru.',
    pw: (v) => v.length >= 6 ? '' : 'Пароль от 6 символов.',
  };
  const check = (el) => {
    const msg = el.type === 'checkbox' ? (el.checked ? '' : 'Отметьте согласие, чтобы продолжить.') : RULES[el.name](el.value);
    const box = document.getElementById('e-' + el.name);
    if (box) box.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.closest('.consent')?.classList.toggle('bad', !!msg);
    return !msg;
  };
  if (f) {
    const fields = [f.name, f.email, f.pw, f.ok];
    // Проверяем поле, когда человек из него ушёл, и снимаем ошибку, как только её исправили
    fields.forEach((el) => {
      el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') check(el); });
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => { if (el.getAttribute('aria-invalid') === 'true') check(el); });
    });
    const pt = f.querySelector('.pw-t');
    pt?.addEventListener('click', () => {
      const show = f.pw.type === 'password';
      f.pw.type = show ? 'text' : 'password';
      pt.setAttribute('aria-pressed', String(show));
      pt.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = fields.filter((el) => !check(el));
      if (bad.length) { bad[0].focus(); return; }
      const btn = f.querySelector('[type=submit]');
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Регистрируем';
      // Прототип: настоящей регистрации нет, переходим на страницу разового предложения
      setTimeout(() => {
        location.href = 'oto.html?name=' + encodeURIComponent(f.name.value.trim()) + '&email=' + encodeURIComponent(f.email.value.trim());
      }, 700);
    });
  }
})();

// Первый экран: фоновое видео только на компьютере, видео Альянса во всплывающем окне
(()=>{const bv=document.querySelector('.h3-bg video');if(bv&&matchMedia('(min-width:861px)').matches){bv.src=bv.dataset.src;bv.autoplay=true;bv.play().catch(()=>{})}
const d=document.getElementById('vdlg'),v=document.getElementById('vfull');if(!d)return;const dv=v.getAttribute('src'),dp=v.getAttribute('poster');document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>{const s=b.dataset.src||dv;if(v.getAttribute('src')!==s){v.src=s;v.poster=b.dataset.poster||dp}d.showModal();v.currentTime=0;v.play().catch(()=>{})}));const c=()=>{v.pause();d.close()};d.querySelector('.vclose').addEventListener('click',c);d.addEventListener('click',e=>{if(e.target===d)c()});d.addEventListener('cancel',()=>v.pause())})();

// Блок 2: видео Игоря с YouTube, плеер грузится по нажатию
(()=>{const box=document.getElementById('a2v');if(!box)return;box.querySelector('.a2-play').addEventListener('click',()=>{const f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+box.dataset.yt+'?autoplay=1&rel=0&playsinline=1';f.title='Freeman’s Alliance: путь предпринимателя от $0 до $1 000 000';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;box.appendChild(f);box.classList.add('playing')})})();

// v4: живой трекер
(()=>{const t=document.querySelector('.trk');if(!t)return;const ring=t.querySelector('.trk-ring .on'),pc=t.querySelector('.trk-pc'),items=[...t.querySelectorAll('.trk-list li')],toast=t.querySelector('.trk-toast');const red=matchMedia('(prefers-reduced-motion:reduce)').matches;let timers=[];
const setPc=v=>{ring.style.strokeDashoffset=314-314*v/100;const s=+pc.textContent,st=performance.now();const f=n=>{const k=Math.min(1,(n-st)/900);pc.textContent=Math.round(s+(v-s)*k);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
const run=()=>{timers.forEach(clearTimeout);timers=[];items.forEach(i=>i.classList.remove('done'));toast.classList.remove('show');t.classList.remove('go');setPc(0);
 timers.push(setTimeout(()=>t.classList.add('go'),300));
 items.forEach((it,i)=>timers.push(setTimeout(()=>{it.classList.add('done');setPc(Math.round((i+1)/items.length*100));if(i===2)toast.classList.add('show')},900+i*1100)));
 timers.push(setTimeout(()=>toast.classList.remove('show'),900+5*1100));
 if(!red)timers.push(setTimeout(run,9000))};
if(red){t.classList.add('go');items.forEach(i=>i.classList.add('done'));ring.style.strokeDashoffset=0;pc.textContent=100;return}
let vis=false;new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!vis){vis=true;run()}else if(!e.isIntersecting&&vis){vis=false;timers.forEach(clearTimeout)}}),{threshold:.35}).observe(t)})();

// v4: глобус с городами участников
(()=>{const c=document.getElementById('globe');if(!c)return;const x=c.getContext('2d');const red=matchMedia('(prefers-reduced-motion:reduce)').matches;
const C=[[25.2,55.3],[25.8,-80.2],[55.75,37.6],[40.7,-74],[38.7,-9.1],[41,29],[52.5,13.4],[43.2,76.9],[41.7,44.8],[-8.4,115.2],[13.7,100.5],[-33.9,18.4],[9.9,-84.1],[-22.9,-43.2],[56.8,60.6],[59.9,30.3],[34,-118.2],[51.5,-0.1],[43,44.7],[57.15,65.5]];
const L=[[0,2],[0,4],[2,6],[6,3],[3,1],[0,9],[2,7],[7,8],[5,0],[4,3],[9,10],[0,11],[1,12],[12,13],[2,14],[2,15],[1,16],[17,4],[18,2],[19,14]];
const N=1100,P=[];const g=Math.PI*(3-Math.sqrt(5));for(let i=0;i<N;i++){const y=1-i/(N-1)*2,r=Math.sqrt(1-y*y),t=g*i;P.push([Math.cos(t)*r,y,Math.sin(t)*r])}
const v3=(la,lo)=>{la*=Math.PI/180;lo*=Math.PI/180;return[Math.cos(la)*Math.sin(lo),Math.sin(la),Math.cos(la)*Math.cos(lo)]};
const CV=C.map(a=>v3(a[0],a[1]));let W=0,R=0,dpr=1;
const size=()=>{dpr=Math.min(2,devicePixelRatio||1);const b=c.getBoundingClientRect();W=b.width;c.width=W*dpr;c.height=W*dpr;R=W*.42};size();addEventListener('resize',size);
const tilt=.42;let rot=-0.9;
const pr=p=>{const cy=Math.cos(rot),sy=Math.sin(rot);let X=p[0]*cy-p[2]*sy,Z=p[0]*sy+p[2]*cy,Y=p[1];const ct=Math.cos(tilt),st=Math.sin(tilt);const Y2=Y*ct-Z*st,Z2=Y*st+Z*ct;return[W/2+X*R,W/2-Y2*R,Z2]};
const slerp=(a,b,t)=>{const d=Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2])));if(d<1e-4)return a;const s=Math.sin(d),k1=Math.sin((1-t)*d)/s,k2=Math.sin(t*d)/s,h=1+Math.sin(Math.PI*t)*d*.22;return[(a[0]*k1+b[0]*k2)*h,(a[1]*k1+b[1]*k2)*h,(a[2]*k1+b[2]*k2)*h]};
let t0=performance.now(),on=true;
const draw=n=>{const T=(n-t0)/1000;if(!red)rot=-0.9+T*0.09;x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,W);
 for(const p of P){const q=pr(p);if(q[2]<-.05)continue;x.fillStyle=`rgba(180,190,250,${.18+q[2]*.6})`;x.fillRect(q[0]-.9,q[1]-.9,1.8,1.8)}
 L.forEach((l,i)=>{const a=CV[l[0]],b=CV[l[1]];x.beginPath();let vis=0;for(let k=0;k<=40;k++){const q=pr(slerp(a,b,k/40));if(q[2]>-.02){vis++;k&&vis>1?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}else vis=0}x.strokeStyle='rgba(216,178,90,.32)';x.lineWidth=1;x.stroke();
  const ph=((T*.35+i*.37)%1);const q=pr(slerp(a,b,ph));if(q[2]>0){x.fillStyle='#ffd447';x.shadowColor='#ffc306';x.shadowBlur=10;x.beginPath();x.arc(q[0],q[1],2.2,0,7);x.fill();x.shadowBlur=0}});
 CV.forEach((p,i)=>{const q=pr(p);if(q[2]<0)return;const pu=(T*.8+i*.23)%1;x.strokeStyle=`rgba(255,195,6,${(1-pu)*.7*q[2]})`;x.lineWidth=1.2;x.beginPath();x.arc(q[0],q[1],3+pu*12,0,7);x.stroke();x.fillStyle=`rgba(255,212,71,${.5+q[2]*.5})`;x.beginPath();x.arc(q[0],q[1],3,0,7);x.fill()});
 if(on&&!red)requestAnimationFrame(draw)};
new IntersectionObserver(es=>es.forEach(e=>{const was=on;on=e.isIntersecting;if(on&&!was)requestAnimationFrame(draw)}),{}).observe(c);requestAnimationFrame(draw)})();

// v4: карусель программ
(()=>{const car=document.getElementById('car');if(!car)return;document.querySelectorAll('[data-car]').forEach(b=>b.addEventListener('click',()=>{const w=car.querySelector('.pg').getBoundingClientRect().width+16;car.scrollBy({left:w*+b.dataset.car,behavior:'smooth'})}))})();

// v4: заглушка видео во всплывающем окне
(()=>{const d=document.getElementById('pdlg');if(!d)return;const t=document.getElementById('pdlg-t');document.querySelectorAll('[data-pvid]').forEach(b=>b.addEventListener('click',()=>{t.textContent=b.dataset.pvid;d.showModal()}));d.querySelector('.vclose').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d)d.close()})})();

/* v5: стопка направлений — следующая карточка наезжает, предыдущая уменьшается и темнеет */
(function(){
  var sec=document.querySelector('#paths'); if(!sec) return;
  var cards=[].slice.call(sec.querySelectorAll('.pw-card'));
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)');
  var wide=window.matchMedia('(min-width: 1025px)');
  var tick=false;
  function fits(){
    var ok=wide.matches&&cards.every(function(c){return c.offsetHeight<=window.innerHeight-130});
    sec.classList.toggle('pw-static',!ok);
    return ok;
  }
  function paint(){
    tick=false;
    var on=!sec.classList.contains('pw-static')&&!rm.matches;
    for(var i=0;i<cards.length;i++){
      var c=cards[i],n=cards[i+1];
      if(!on||!n){c.style.transform='';c.style.filter='';continue}
      var top=parseFloat(getComputedStyle(n).top)||88;
      var start=window.innerHeight, r=n.getBoundingClientRect().top;
      var p=Math.min(1,Math.max(0,(start-r)/(start-top)));
      c.style.transform='scale('+(1-.06*p).toFixed(4)+')';
      c.style.filter='brightness('+(1-.45*p).toFixed(3)+')';
    }
  }
  function req(){if(!tick){tick=true;requestAnimationFrame(paint)}}
  function setup(){fits();req()}
  window.addEventListener('scroll',req,{passive:true});
  window.addEventListener('resize',setup);
  if(wide.addEventListener) wide.addEventListener('change',setup);
  window.addEventListener('load',setup);
  setup();
})();

/* v6: «Как устроен Альянс» — бесконечная карусель, сдвиг на одну карточку каждые 5 с (v8.8) */
(function(){
  var sec=document.querySelector('.hw'); if(!sec) return;
  var track=sec.querySelector('.hw-track'), busy=false, timer=null, visible=false, hover=false;
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)');
  function step(){var c=track.children[0];return c.getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap||getComputedStyle(track).gap||24)}
  function rp(el){el.querySelectorAll('video[autoplay]').forEach(function(v){v.play().catch(function(){})})}
  function go(dir){
    if(busy) return; busy=true;
    var s=step(), dur=rm.matches?0:700;
    if(dir>0){
      track.style.transition='transform '+dur+'ms cubic-bezier(.22,1,.36,1)';
      track.style.transform='translateX('+(-s)+'px)';
      setTimeout(function(){track.style.transition='none';var m=track.children[0];track.appendChild(m);rp(m);track.style.transform='translateX(0)';void track.offsetWidth;busy=false},dur+20);
    }else{
      track.style.transition='none';var m2=track.lastElementChild;track.insertBefore(m2,track.children[0]);rp(m2);track.style.transform='translateX('+(-s)+'px)';void track.offsetWidth;
      track.style.transition='transform '+dur+'ms cubic-bezier(.22,1,.36,1)';track.style.transform='translateX(0)';
      setTimeout(function(){busy=false},dur+20);
    }
  }
  function tick(){if(visible&&!hover&&!rm.matches&&!document.hidden) go(1)}
  function start(){clearInterval(timer);timer=setInterval(tick,5000)}
  sec.querySelectorAll('[data-hw]').forEach(function(b){b.addEventListener('click',function(){go(+b.getAttribute('data-hw'));start()})});
  /* v8.8: автопрокрутка не встаёт от наведения мышью или касания; пауза только пока клавиатурный фокус внутри */
  sec.addEventListener('focusin',function(e){hover=!!(e.target.matches&&e.target.matches(':focus-visible'))});sec.addEventListener('focusout',function(){hover=false});
  var x0=null;
  track.addEventListener('pointerdown',function(e){x0=e.clientX});
  track.addEventListener('pointerup',function(e){if(x0===null)return;var dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40){go(dx<0?1:-1);start()}});
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting},{threshold:.3}).observe(sec)}else visible=true;
  start();
})();

(()=>{const v=document.querySelector('.pw-bgv');if(!v)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause()}})();

/* v8.4: «Личный маршрут» — проход по дереву навыков */
(function(){
  var tr=document.querySelector('.tr'); if(!tr) return;
  var els=[].slice.call(tr.querySelectorAll('[data-s]')), rail=[].slice.call(tr.querySelectorAll('.tr-rail li'));
  var t=null, st=0, vis=false, rm=matchMedia('(prefers-reduced-motion: reduce)');
  function paint(n){els.forEach(function(e){e.classList.toggle('on',+e.getAttribute('data-s')<n)});tr.classList.toggle('won',n>11);rail.forEach(function(l,i){l.classList.toggle('cur',i===(n>11?1:0))})}
  function tick(){if(!vis||document.hidden) return; st=st>=15?0:st+1; paint(st>12?12:st)}
  if(rm.matches){paint(12);return}
  paint(0);
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!t)t=setInterval(tick,520);if(!vis&&t){clearInterval(t);t=null}},{threshold:.35}).observe(tr)}else{vis=true;t=setInterval(tick,520)}
})();

/* v8.7: клик по обложке направления открывает видео (как кнопка в углу) */
document.querySelectorAll('.pw-cover-v').forEach(function(c){c.addEventListener('click',function(e){if(e.target.closest('.pw-play'))return;var b=c.querySelector('.pw-play');if(b)b.click()})});
document.querySelectorAll('.pw-cv').forEach(function(v){if(matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause()}});
/* v8.11: кейсы — стрелки карусели; видео-кейсы с YouTube в общем окне */
(()=>{const t=document.querySelector('.csr-t');if(t)document.querySelectorAll('.csr-b').forEach(b=>b.addEventListener('click',()=>{const c=t.querySelector('.cs');t.scrollBy({left:(+b.dataset.dir)*((c?c.offsetWidth:500)+18),behavior:'smooth'})}));
const d=document.getElementById('vdlg'),v=document.getElementById('vfull');if(!d)return;let f=null;const off=()=>{if(f){f.remove();f=null;v.hidden=false}};
document.querySelectorAll('[data-yt]').forEach(b=>b.addEventListener('click',()=>{v.pause();v.hidden=true;off();v.hidden=true;f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+b.dataset.yt+'?autoplay=1&rel=0';f.allow='autoplay; fullscreen; picture-in-picture';f.allowFullscreen=true;f.title=b.getAttribute('aria-label')||'Видео';d.appendChild(f);d.showModal()}));
document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',off,true));d.addEventListener('close',off)})();
(()=>{const b=document.querySelector('.mvid-snd');if(!b)return;const v=b.parentElement.querySelector('video'),t=b.querySelector('span');b.addEventListener('click',()=>{v.muted=!v.muted;if(!v.muted){v.volume=.8;v.play().catch(()=>{})}b.setAttribute('aria-pressed',String(!v.muted));t.textContent=v.muted?'Включить звук':'Выключить звук'})})();
