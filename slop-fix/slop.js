/* Пошаговые правки дашбордов по ролику @buildwithomar (Fable 5.2 «kills AI slop»).
   Шаг берётся из ?step=N, правки накапливаются: на шаге N действуют все шаги 1..N. */
(function () {
  const PAGE = document.documentElement.dataset.slop; // main | fa | pp
  const Q = new URLSearchParams(location.search);
  const STEP = Math.max(0, Math.min(7, parseInt(Q.get('step') || '0', 10) || 0));
  const html = document.documentElement;
  for (let i = 1; i <= STEP; i++) html.classList.add('s' + i);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const vis = s => [...document.querySelectorAll(s)].find(e => e.offsetParent !== null);
  const el = (tag, cls, inner) => { const e = document.createElement(tag); if (cls) e.className = cls; if (inner != null) e.innerHTML = inner; return e; };

  const STEPS = [
    ['Как есть', 'Исходный дашборд без правок.'],
    ['Лучшие практики', '«Подними дизайн по лучшим практикам»: одна шкала шрифтов, один стиль карточек, спокойный фон, одна главная кнопка.'],
    ['Иерархия', PAGE === 'main' ? 'Фрими и приветствие на месте, под ними три быстрых действия; маршрут в подвале «Моего дня», чаты внутри членства.' : 'Порядок прежний: «Мой ритм» и сегодняшние дела сверху, справа встреча, календарь и вдохновение. В шапке дата.'],
    ['Кнопки-награды', 'Каждая кнопка при наведении поднимается и говорит о выигрыше: текст меняется на результат, значок летит по кругу.'],
    ['Матовое стекло', 'Панели полупрозрачные поверх пейзажа, внутренние плитки, люди и карта в одном чистом стиле.'],
    ['Календарь и видео', 'Ничего не свёрнуто. Календарь: неделя и ближайшие события, месяц по кнопке, события дня внутри карточки. Видео открывается на месте.'],
    ['Меню', '«Сгруппируй меню, подпиши группы, каждому пункту иконку»: меньше пунктов на виду.'],
    ['Поиск ⌘K', '«Поиск — маленький виджет с ⌘K, по нему окно быстрых действий». Нажмите ⌘K или на поиск.'],
  ];

  const I = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
    coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1.2 1.6 2.5 2 2.5.9 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5v1.5M12 16v1.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM8 7h7"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .6 3.2 2.5 3.5 5.5"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.4-9-9.2C1.6 8.2 4 5 7.2 5c2 0 3.6 1.2 4.8 2.8C13.2 6.2 14.8 5 16.8 5 20 5 22.4 8.2 21 11.8 19 16.6 12 21 12 21z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    go: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  // ---------- шаг 2: иерархия ----------
  function step2() {
    if (PAGE === 'main') {
      // Фрими и приветствие остаются; быстрые действия встают прямо под приветствием
      const hello = $('#d-hello');
      const box = hello && hello.querySelector(':scope > div');
      if (box) {
        const acts = el('div', 'sl-acts', `<a class="sl-q p" href="#">${I.flag}Шаг на сегодня</a><a class="sl-q" href="#">${I.route}Мой маршрут</a><a class="sl-q" href="#">${I.cal}Календарь</a>`);
        box.append(acts); hello.classList.add('sl-hello');
      }
      // маршрут — подвал «Моего дня»
      const day = $('#d-day'), route = $('#d-route');
      if (day && route) { route.classList.add('sl-in'); day.append(route); }
      // членство и чаты — одна карточка
      const mem = $('#d-mem'), chats = $('#d-chats');
      if (mem && chats) { const a = [...chats.querySelectorAll('a.chat')].filter(x => x.offsetParent !== null); if (a.length) { mem.append(el('p', 'sl-sub', 'Чаты в Telegram'), ...a); } chats.remove(); }
    } else {
      // порядок прежний: «Мой ритм» сверху, «Сегодня в работе» внутри него; дата в шапке
      const sm = $('header.top h1 small');
      if (sm) sm.innerHTML = 'Пятница, 6 ноября · ' + sm.innerHTML;
    }
  }

  // ---------- шаг 3: кнопки-награды ----------
  const norm = s => (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  function delight(btn, b, icon, primary) {
    if (!btn || btn.classList.contains('sl-win')) return;
    const own = btn.querySelector(':scope > svg');
    const a = norm(btn.textContent);
    const ic = own ? own.outerHTML : (icon || '');
    btn.classList.add('sl-win'); if (primary) btn.classList.add('sl-prime');
    btn.innerHTML = (ic ? `<span class="sl-ico">${ic}</span>` : '') + `<span class="sl-lbl"><span class="sl-a">${a}</span><span class="sl-b">${b}</span></span>`;
  }
  function step3() {
    const M = PAGE === 'main' ? {
      'Шаг на сегодня': ['Ближе к цели', I.flag, 1], 'Мой маршрут': ['Куда дальше', I.route], 'Календарь': ['5 событий', I.cal],
      'Выбрать время': ['Место за мной', I.cal, 1], 'Выбрать шаг': ['Ещё шаг к цели', I.flag, 1], 'Открыть': ['Клиент ждёт', I.go],
      'Собрать мой оффер': ['Оффер за 15 минут', I.spark, 1],
    } : {
      'Доход': ['К $1 000', I.coin, 1], 'Шаг к цели': ['17 из 100', null], 'Задача': ['В план', null], 'Желание': ['К мечте', null], 'Дневник успеха': ['Ещё победа', null],
      'Записаться': ['Место за мной', I.plane, 1], 'Сделал': ['+1 к серии', null], 'Открыть': ['Что скажет карта', I.spark], 'Хочу тоже!': ['В мои мечты', I.star],
      'Привет': ['Помахать', null], 'Написать': ['Начать диалог', I.plane], 'Апгрейд': ['Новый уровень', I.spark],
    };
    $$('a.btn, button.btn, .rt-q, .rt-done, .sl-q, .po-btn, .oracle a, .oracle button, .dream a').forEach(b => {
      if (b.closest('.sl-steps, .sl-pal, aside.side')) return;
      const m = M[norm(b.textContent)]; if (m) delight(b, m[0], m[1], m[2]);
    });
  }

  // ---------- шаг 4: карта в тон стеклу ----------
  function step4() {
    const fog = PAGE === 'pp'
      ? { color: 'rgb(18, 24, 34)', 'high-color': 'rgb(44, 52, 66)', 'horizon-blend': 0.08, 'space-color': 'rgb(20, 24, 32)', 'star-intensity': 0 }
      : { color: 'rgb(246, 248, 252)', 'high-color': 'rgb(214, 226, 244)', 'horizon-blend': 0.06, 'space-color': 'rgb(234, 240, 250)', 'star-intensity': 0 };
    let n = 0; const t = setInterval(() => {
      const m = window.__fm; n++;
      // карта всё время догружает плитки, поэтому ждём только стиль и туман из макета, затем ставим свой
      try { if (m && m.isStyleLoaded() && m.getFog() && m.getFog().color !== fog.color) m.setFog(fog); } catch (e) {}
      if (n > 120) clearInterval(t);
    }, 150);
  }

  // ---------- шаг 5: без сворачивания: календарь и видео ----------
  const EV = { 7: [['13:00', 'Нетворк участников']], 10: [['19:00', 'Открытая встреча с Игорем']], 11: [['17:00', 'Разборы по средам']], 12: [['18:00', 'Эфир «Как упаковать оффер»']], 14: [['12:00', 'Комнаты Альянса']], 18: [['17:00', 'Разборы по средам']], 21: [['12:00', 'Комнаты Альянса']], 25: [['17:00', 'Разборы по средам']] };
  const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'], WDF = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const wd = d => new Date(2026, 10, d).getDay();
  function calCard(sec) {
    if (!sec) return;
    const TODAY = 6;
    sec.classList.add('sl-cal'); sec.innerHTML = '';
    const dayBtn = (d, cls) => `<button type="button" class="${cls}${d === TODAY ? ' today' : ''}${d < TODAY ? ' past' : ''}${EV[d] ? ' has' : ''}" data-d="${d}" aria-pressed="false" aria-label="${d} ноября${EV[d] ? ', есть события' : ''}">`;
    let week = ''; for (let d = 2; d <= 8; d++) week += dayBtn(d, 'sl-d') + `<small>${WD[wd(d)]}</small><b>${d}</b><i></i></button>`;
    let month = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(x => `<span class="sl-mw">${x}</span>`).join('') + '<span></span>'.repeat(6);
    for (let d = 1; d <= 30; d++) month += dayBtn(d, 'sl-md') + `${d}<i></i></button>`;
    sec.innerHTML = `<div class="ph"><h3>Календарь</h3><button type="button" class="sl-mon" aria-expanded="false"><span>Весь ноябрь</span>${I.chev}</button></div>
      <div class="sl-week" role="group" aria-label="Эта неделя">${week}</div>
      <div class="sl-month"><div><div class="sl-mg">${month}</div></div></div>
      <div class="sl-agenda" aria-live="polite"></div>`;
    const ag = sec.querySelector('.sl-agenda');
    const row = (d, [t, n]) => `<a class="sl-ev" href="#"><span class="sl-leaf"><small>${WD[wd(d)]}</small><b>${d}</b></span><span class="sl-evt"><b>${n}</b><small>${t} · онлайн</small></span><em>${I.go}</em></a>`;
    const upcoming = (from, k) => Object.keys(EV).map(Number).filter(d => d >= from).slice(0, k);
    function show(d) {
      sec.querySelectorAll('[data-d]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.d === d)));
      let h;
      if (d == null) h = `<p class="sl-ah">Ближайшие события</p>` + upcoming(TODAY, 3).map(x => EV[x].map(e => row(x, e)).join('')).join('');
      else if (EV[d]) h = `<p class="sl-ah">${d} ноября, ${WDF[wd(d)]}</p>` + EV[d].map(e => row(d, e)).join('');
      else { const nx = upcoming(d + 1, 1)[0]; h = `<p class="sl-ah">${d} ноября, ${WDF[wd(d)]}</p><p class="sl-none">В этот день событий нет${nx ? '. Ближайшее после:' : ''}</p>` + (nx ? EV[nx].map(e => row(nx, e)).join('') : ''); }
      ag.innerHTML = h + `<a class="sl-all" href="#">Все события${I.go}</a>`;
      ag.classList.remove('sl-swap'); void ag.offsetWidth; ag.classList.add('sl-swap');
    }
    let sel = null;
    sec.addEventListener('click', e => {
      const b = e.target.closest('[data-d]');
      if (b) { const d = +b.dataset.d; sel = sel === d ? null : d; show(sel); return; }
      const m = e.target.closest('.sl-mon');
      if (m) { const o = sec.classList.toggle('sl-mopen'); m.setAttribute('aria-expanded', String(o)); m.querySelector('span').textContent = o ? 'Только неделя' : 'Весь ноябрь'; }
    });
    show(null);
    if (Q.get('cal')) { const v = Q.get('cal'); if (v === 'm' || v.startsWith('m')) sec.querySelector('.sl-mon').click(); const n = parseInt(v.replace(/\D/g, ''), 10); if (n) { sel = n; show(n); } }
  }
  function vidCard(v) {
    if (!v) return;
    const t = v.querySelector('.vm-t'); const play = v.querySelector('.vm-play');
    v.classList.add('sl-vc');
    const pl = el('div', 'sl-vpl', `<div><div class="sl-vin"><div class="sl-vbox"><img src="img/proryv-igor.webp" alt=""><span class="sl-vbig"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span><span class="sl-vtime">4:12</span></div>
      <ol class="sl-vch"><li><b>0:00</b>Мой день и шаг на сегодня</li><li><b>1:10</b>Маршрут и трекер</li><li><b>2:30</b>Календарь и встречи</li><li><b>3:20</b>Люди и карта фриманов</li></ol></div></div>`);
    v.append(pl);
    const tog = () => { const o = v.classList.toggle('sl-vopen'); play.setAttribute('aria-expanded', String(o)); play.setAttribute('aria-label', o ? 'Свернуть видео' : 'Смотреть видео'); };
    play.addEventListener('click', tog); if (t) { t.addEventListener('click', tog); t.style.cursor = 'pointer'; }
    if (Q.get('vid') === '1') tog();
  }
  function step5() {
    calCard($('#d-cal'));
    if (PAGE === 'main') vidCard($('#d-vid'));
  }

  // ---------- шаг 6: меню ----------
  function navItem(label, icon, on, extra) { return `<a class="nav sl-n${on ? ' on' : ''}" href="#">${icon}<span>${label}</span>${extra || ''}</a>`; }
  function step6() {
    const side = $('aside.side');
    if (!side) return;
    const logo = side.querySelector('.logo').outerHTML, foot = side.querySelector('.foot').outerHTML;
    let g;
    if (PAGE === 'main') {
      g = `<p class="navh">Сегодня</p>${navItem('Мой дашборд', I.grid, true)}${navItem('Мой маршрут', I.route)}${navItem('Календарь', I.cal)}
        <p class="navh">Мои продукты</p><a class="nav sl-n" href="#"><img src="img/fa-logo.webp" alt="" class="sl-pi"><span>Альянс</span><em class="sl-tag">клуб</em></a>${navItem('Все продукты', I.book)}
        <p class="navh">Инструменты</p>${navItem('Мой оффер', I.star, false, '<em class="sl-tag">ИИ</em>')}<button class="nav sl-n sl-more" type="button">${I.more}<span>Ещё 10 сервисов</span>${I.chev}</button>
        <div class="sl-moreg">${['Регистратор 24/7', 'Выбор ниши', 'Мой лендинг', 'Визитка', 'Мой КЭВ', 'Уникализатор Reels', 'Колесо баланса', 'Кругосветка', 'Тесты', 'Гид на год'].map(t => navItem(t, I.spark)).join('')}</div>
        <p class="navh">Помощь</p>${navItem('Служба заботы', I.help)}`;
    } else {
      const ex = PAGE === 'pp' ? 'Экспедиция' : 'Поход';
      g = `<p class="navh">Сегодня</p>${navItem('Дашборд', I.grid, true)}${navItem('Календарь', I.cal, false, '<em class="sl-cnt">3</em>')}
        <p class="navh">Мой путь</p>${navItem('Мой маршрут', I.route)}${navItem('Трекер Фримана', I.task)}${navItem(ex + ': записаться', I.flag)}${navItem('Библиотека', I.book)}
        <p class="navh">Люди</p>${navItem('Лента', I.spark, false, '<em class="sl-cnt">12</em>')}${navItem('Сообщения', I.plane)}${navItem('Члены Альянса', I.users)}
        <button class="nav sl-n sl-more" type="button">${I.more}<span>Ещё: кланы, книги, инвестиции</span>${I.chev}</button>
        <div class="sl-moreg">${navItem('Кланы и команды', I.users)}${navItem('Книжный клуб', I.book)}${navItem('Инвестиции', I.coin)}${navItem('Обмен жизнями', I.help)}</div>`;
    }
    side.innerHTML = logo + '<nav class="sl-nav">' + g + '</nav>' + foot;
    const m = side.querySelector('.sl-more');
    m && m.addEventListener('click', () => side.classList.toggle('sl-open'));
  }

  // ---------- шаг 7: ⌘K ----------
  function step7() {
    const top = $('header.top');
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const k = el('button', 'sl-k', `${I.search}<span>Поиск и действия</span><kbd>${mac ? '⌘' : 'Ctrl'} K</kbd>`);
    k.type = 'button';
    const h1 = top.querySelector('h1'); h1.after(k);
    const meet = PAGE === 'pp' ? 'Разбор по средам · ср, 17:00' : 'Комната: Оффер · сб, 16:00';
    const groups = PAGE === 'main'
      ? [['Сделать', [[I.flag, 'Выбрать шаг на сегодня', 'Фокус дня'], [I.cal, 'Записаться на установочную', 'вт, 18:00'], [I.star, 'Собрать мой оффер', 'ИИ-сервис']]],
         ['Перейти', [[I.route, 'Мой маршрут', ''], [I.book, 'Все продукты', ''], [I.help, 'Служба заботы', ''], [I.users, 'Карта фриманов', '']]]]
      : [['Быстро записать', [[I.coin, 'Доход', 'к цели $1 000'], [I.flag, 'Шаг к цели', '16 из 100'], [I.task, 'Задача', ''], [I.star, 'Желание', ''], [I.book, 'Дневник успеха', '']]],
         ['Ближайшее', [[I.plane, meet, 'записаться']]],
         ['Перейти', [[I.route, 'Мой маршрут', '4 из 12'], [I.task, 'Трекер Фримана', ''], [I.users, 'Члены Альянса', ''], [I.cal, 'Календарь', '']]]];
    const ov = el('div', 'sl-pal');
    ov.innerHTML = `<div class="sl-pbox" role="dialog" aria-label="Поиск и быстрые действия">
      <label class="sl-pin">${I.search}<input placeholder="Что сделать или куда перейти?" aria-label="Поиск"><kbd>Esc</kbd></label>
      <div class="sl-plist">${groups.map(([t, items]) => `<p class="sl-pg">${t}</p>` + items.map(([ic, l, s]) => `<a href="#" class="sl-pi2">${ic}<span>${l}</span><small>${s}</small><em>${I.go}</em></a>`).join('')).join('')}</div>
      <div class="sl-pfoot"><span><kbd>↑</kbd><kbd>↓</kbd> выбрать</span><span><kbd>↵</kbd> открыть</span></div></div>`;
    document.body.append(ov);
    const inp = ov.querySelector('input');
    const items = () => $$('.sl-pi2', ov).filter(a => a.style.display !== 'none');
    let cur = 0;
    const mark = () => { items().forEach((a, i) => a.classList.toggle('on', i === cur)); };
    const open = () => { ov.classList.add('open'); inp.value = ''; filter(); setTimeout(() => inp.focus(), 30); };
    const close = () => ov.classList.remove('open');
    function filter() { const v = inp.value.trim().toLowerCase(); $$('.sl-pi2', ov).forEach(a => a.style.display = !v || a.textContent.toLowerCase().includes(v) ? '' : 'none'); $$('.sl-pg', ov).forEach(p => { let n = p.nextElementSibling, any = false; while (n && !n.classList.contains('sl-pg')) { if (n.style.display !== 'none') any = true; n = n.nextElementSibling; } p.style.display = any ? '' : 'none'; }); cur = 0; mark(); }
    inp.addEventListener('input', filter);
    k.addEventListener('click', open);
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ov.classList.contains('open') ? close() : open(); return; }
      if (!ov.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown') { e.preventDefault(); cur = Math.min(items().length - 1, cur + 1); mark(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); cur = Math.max(0, cur - 1); mark(); }
    });
    if (Q.get('pal') === '1') open();
  }

  // ---------- панель шагов ----------
  function stepbar() {
    const go = n => { const u = new URLSearchParams(location.search); u.set('step', n); return '?' + u; };
    const page = p => { const u = new URLSearchParams(location.search); u.delete('k'); u.delete('pal'); if (p === 'fa') u.set('k', 'm'); if (p === 'main') u.set('k', 'm'); return { main: 'glavnaya.html', fa: 'alyans.html', pp: 'pp.html' }[p] + '?' + u; };
    const b = el('div', 'sl-steps');
    b.innerHTML = `<div class="sl-pages">${[['main', 'Главная'], ['fa', 'Альянс'], ['pp', 'ПП']].map(([p, l]) => `<a href="${page(p)}" class="${p === PAGE ? 'on' : ''}">${l}</a>`).join('')}</div>
      <div class="sl-nums">${STEPS.map((s, i) => `<a href="${go(i)}" class="${i === STEP ? 'on' : ''}${i < STEP ? ' done' : ''}" title="${s[0]}">${i}</a>`).join('')}</div>
      <div class="sl-cap"><b>Шаг ${STEP}. ${STEPS[STEP][0]}</b><span>${STEPS[STEP][1]}</span></div>
      <div class="sl-arr"><a href="${go(Math.max(0, STEP - 1))}" aria-label="Назад" class="${STEP === 0 ? 'off' : ''}">←</a><a href="${go(Math.min(7, STEP + 1))}" aria-label="Дальше" class="${STEP === 7 ? 'off' : ''}">→</a></div>`;
    document.body.append(b);
    document.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input')) return;
      if (e.key === 'ArrowRight' && STEP < 7 && !document.querySelector('.sl-pal.open')) location.search = go(STEP + 1);
      if (e.key === 'ArrowLeft' && STEP > 0 && !document.querySelector('.sl-pal.open')) location.search = go(STEP - 1);
    });
  }

  function run() {
    const fns = [null, null, step2, step3, step4, step5, step6, step7];
    for (let i = 1; i <= STEP; i++) if (fns[i]) try { fns[i](); } catch (e) { console.error('step', i, e); }
    stepbar();
  }
  if (document.readyState === 'complete') setTimeout(run, 0); else window.addEventListener('load', () => setTimeout(run, 0));
})();
