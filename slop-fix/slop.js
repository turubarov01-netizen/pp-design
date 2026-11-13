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
    ['Иерархия', '«Сделай иерархию и сгруппируй по смыслу»: действия вынесены наверх, связанные блоки собраны вместе.'],
    ['Кнопка-награда', '«Главная кнопка при наведении говорит о выигрыше»: текст меняется на результат, значок летит по кругу.'],
    ['Матовое стекло', '«Матовое стекло, сквозь которое видно фон»: панели и меню полупрозрачные поверх пейзажа.'],
    ['Аккордеоны', '«Второстепенное в аккордеоны, порядок по ходу дела»: сверху то, что делать сейчас, остальное свёрнуто.'],
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
    const top = $('header.top');
    const bar = el('section', 'sl-bar');
    if (PAGE === 'main') {
      const hello = $('#d-hello');
      const when = hello ? hello.innerText.split('\n').map(s => s.trim()).filter(Boolean) : ['', ''];
      bar.innerHTML = `<div class="sl-hi"><span>${when[0] || ''}</span><b>${when[1] || ''}</b></div>
        <div class="sl-acts"><a class="sl-q p" href="#">${I.flag}Шаг на сегодня</a><a class="sl-q" href="#">${I.route}Мой маршрут</a><a class="sl-q" href="#">${I.cal}Календарь</a></div>`;
      hello && hello.remove();
      const col = $('.grid > .col');
      col.prepend(bar);
      // маршрут — подвал «Моего дня»
      const day = $('#d-day'), route = $('#d-route');
      if (day && route) { route.classList.add('sl-in'); day.append(route); }
      // членство и чаты — одна карточка «Моё»
      const mem = $('#d-mem'), chats = $('#d-chats');
      if (mem && chats) { const a = [...chats.querySelectorAll('a.chat')].filter(x => x.offsetParent !== null); if (a.length) { mem.append(el('p', 'sl-sub', 'Чаты в Telegram'), ...a); } chats.remove(); }
      // видео-подсказка уходит из ленты (вернётся в аккордеоне на шаге 5)
      const vid = $('#d-vid'); if (vid) { vid.classList.add('sl-vid'); $('.grid > .col:last-child').append(vid); }
    } else {
      const acts = $('.rt-acts');
      const sub = $('h1.club-h small');
      bar.innerHTML = `<div class="sl-hi"><span>${sub ? sub.textContent : ''}</span><b>Пятница, 6 ноября</b></div>`;
      if (acts) { acts.classList.add('sl-acts'); bar.append(acts); }
      const col = $('.grid > .col');
      // «Сегодня в работе» — своя карточка первой; «Мой ритм» становится «Прогресс»
      const today = $('.rt-today'), rh = $('#k-rhythm');
      const tk = $('.rt-tk2'); tk && tk.remove();
      const tp = el('section', 'panel sl-today', '<div class="ph"><h3>Сегодня</h3><span class="fm-sub">урок, шаг дня, уведомления</span></div>');
      if (today) tp.append(today);
      col.prepend(bar, tp);
      const h = rh && rh.querySelector('.rt-ph h3'); if (h) h.textContent = 'Прогресс';
      // справа: встреча + календарь = «Расписание»; оракул, слово, мечта = «Вдохновение»
      const meet = vis('.panel.meet'), cal = $('#d-cal');
      if (meet && cal) { const c = cal.querySelector('.cal'); const ph = cal.querySelector('.ph'); ph.classList.add('sl-calph'); meet.append(ph, c); cal.remove(); meet.classList.add('sl-sched'); }
      const ins = el('section', 'panel sl-insp', '<div class="ph"><h3>Вдохновение</h3><span class="fm-sub">оракул, слово дня, мечта</span></div>');
      const parts = $$('.panel.oracle, .panel.word, .panel.dream');
      if (parts.length) { parts[0].before(ins); parts.forEach(p => { p.classList.add('sl-part'); ins.append(p); }); }
    }
  }

  // ---------- шаг 3: кнопка-награда ----------
  function delight(btn, a, b, icon) {
    if (!btn) return;
    btn.classList.add('sl-win');
    btn.innerHTML = `<span class="sl-ico">${icon}</span><span class="sl-lbl"><span class="sl-a">${a}</span><span class="sl-b">${b}</span></span>`;
  }
  function step3() {
    if (PAGE === 'main') {
      const b = $('#d-day .v-m .item[data-p="fa"] .btn.act') || $('#d-day .item .btn.act');
      delight(b, 'Выбрать шаг', 'Ещё шаг к цели', I.flag);
      delight($('.sl-q.p'), 'Шаг на сегодня', 'Ближе к цели', I.flag);
    } else {
      delight(vis('.meet .mt-go'), 'Записаться', 'Место за мной', I.plane);
      delight($('.sl-acts .rt-q.p') || $('.rt-q.p'), 'Доход', 'Ближе к $1 000', I.coin);
    }
  }

  // ---------- шаг 5: аккордеоны ----------
  function fold(sec, title, summary, open) {
    if (!sec) return;
    const ph = sec.querySelector(':scope > .ph');
    if (ph) ph.remove();
    const body = el('div', 'sl-body');
    while (sec.firstChild) body.append(sec.firstChild);
    const head = el('button', 'sl-acc', `<span class="sl-acc-t"><b>${title}</b><small>${summary}</small></span><span class="sl-chev">${I.chev}</span>`);
    head.type = 'button';
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    sec.classList.add('sl-fold'); if (open) sec.classList.add('open');
    sec.append(head, body);
    head.addEventListener('click', () => { const o = sec.classList.toggle('open'); head.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  }
  function step5() {
    if (PAGE === 'main') {
      const pr = $('#d-promos');
      if (pr) { pr.classList.add('panel'); fold(pr, 'Предложения для вас', '«Мой оффер» и «Прорыв за 30 дней»'); }
      fold($('#d-map'), 'Карта фриманов', '43 страны · 129 городов · кто чем может помочь');
      fold($('#d-cal'), 'Календарь', '5 событий в ноябре · ближайшее сб, 16:00');
      fold($('.sl-vid'), 'Как пользоваться платформой', 'видео Игоря Графа · 4 минуты');
      // порядок по ходу дня: что делать → своё → остальное
      const L = $('.grid > .col'); ['#d-promos', '#d-map'].forEach(s => { const e = $(s); e && L.append(e); });
    } else {
      fold($('#k-life'), PAGE === 'pp' ? 'Жизнь ПП-клуба' : 'Жизнь клуба', '37 фриманов на платформе · топ и результаты за 30 дней');
      fold($('#k-near'), 'Знакомьтесь — рядом с вами', '5 человек рядом · Лиссабон');
      fold($('#d-map'), 'Карта фриманов', '43 страны · 129 городов');
      fold($('.sl-insp'), 'Вдохновение', 'Карта дня Оракула, слово «Оффер», мечта участника');
      const stats = $('.rt-stats'), hero = $('.rt-hero');
      if (hero && stats) { const rh = $('#k-rhythm'); fold(rh, 'Прогресс', '$340 из $1 000 · 4 дня фокуса подряд · 7 задач за неделю', true); }
    }
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
    const fns = [null, null, step2, step3, null, step5, step6, step7];
    for (let i = 1; i <= STEP; i++) if (fns[i]) try { fns[i](); } catch (e) { console.error('step', i, e); }
    stepbar();
  }
  if (document.readyState === 'complete') setTimeout(run, 0); else window.addEventListener('load', () => setTimeout(run, 0));
})();
