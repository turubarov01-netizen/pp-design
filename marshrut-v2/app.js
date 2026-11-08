(function () {
  'use strict';
  /* Прототип маршрутной карты v2.1 (07.11.2026, правки Игоря):
     сверху Фрими с одним следующим действием; первой идёт «Подготовка к росту»;
     пройденные шаги свёрнуты (виден только предыдущий), пропущенные всегда видны;
     места в маршруте называются шагами, у урока остаётся свой номер библиотеки.
     Правила: шаги 1–5 сразу и в любом порядке, 6-й после заданий 1–5 и подготовки,
     11-й после установочной. Данные: data.js из build_proto2.py */
  const L = window.LESSONS;
  const PROFILES = window.PROFILES;
  const NB = ' ';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
  const stepsWord = (n) => `${n}${NB}${plural(n, 'шаг', 'шага', 'шагов')}`;

  const ETAPY = {
    start: { name: 'Старт', res: 'Пройдены уроки о системе ПЭРЛ и устройстве Альянса.' },
    '1.1': { name: 'Выбор ниши', res: 'Выбраны пять бизнес-идей, на которых можно заработать.' },
    '1.2': { name: 'Тест ниши', res: 'Запущена тестовая реклама на все пять идей, выбрана самая эффективная ниша, получена первая оплата.' },
    '1.3': { name: 'Рабочая связка', res: 'Собрана одна воронка с полными показателями и прогнозируемым потоком продаж.' },
    '2.1': { name: 'Бизнес-модель для развития', res: 'Собрана таблица со всеми показателями и результатами: полный дашборд всех цифр.' },
    '2.2': { name: 'Бизнес чужими руками', res: 'Описаны структура компании и функции каждой должности, делегировано всё, что делается руками.' },
    '2.3': { name: 'Масштабирование', res: 'Есть цели по каждому показателю команды, и команда масштабируется.' },
    '3.1': { name: 'Game Changer', res: 'Есть цифры эффективности каждого члена команды и отдела, найдена точка роста.' },
    '3.2': { name: 'Реализация', res: 'Всё, что повторяется системно, делают роботы.' },
    '3.3': { name: 'X10', res: 'У компании миллион долларов.' },
  };
  const SEG = { E: 'Эксперт', P: 'Предприниматель' };
  const DAY = { E: 'вторник', P: 'среду' };
  const ACCESS = { free: 'Гость, бесплатно', starter: 'Стартовый доступ', club: 'Клуб' };
  const DEF_TASK = 'Запишите главный вывод из урока и одно действие, которое сделаете на этой неделе.';

  /* Пункты «Подготовки к росту» (решение Игоря 07.11.2026) */
  const PREP = [
    { k: 'an', t: 'Анализ доходов', where: 'Трекер Фримана → Финансы', items: [
      { k: 'inc', go: 'Трекер Фримана → Финансы', t: 'Личный средний доход за 3 месяца' },
      { k: 'biz', go: 'Трекер Фримана → Финансы', t: 'Оборот, выручка и прибыль бизнеса за 3 месяца', alt: 'Нет бизнеса: отметка «Стартап», точка ноль' },
    ] },
    { k: 'tr', t: 'Трекер Фримана', where: 'Трекер Фримана', items: [
      { k: 'wish', go: 'Трекер Фримана → Желания', t: 'Заполните 10 своих желаний: у каждого категория, горизонт 1, 5 или 10 лет и стоимость', n: 10 },
      { k: 'life', inline: true, t: 'Посчитайте стоимость жизни: сколько стоит жизнь мечты и через сколько лет она наступит' },
      { k: 'focus', go: 'Трекер Фримана → Фокус', t: 'Выберите одно из 10 желаний и поставьте его в фокус' },
      { k: 'fsteps', go: 'Трекер Фримана → Фокус', t: 'Пропишите минимум 5 потенциальных шагов по фокусу', n: 5 },
      { k: 'fday', go: 'Трекер Фримана → Фокус дня', t: 'Выполните фокус' },
      { k: 'zv', go: 'Трекер Фримана → Зверёк', t: 'Поставьте 3 награды для Зверька', n: 3 },
      { k: 'wheel', go: 'Трекер Фримана → Колесо баланса', t: 'Заполните колесо баланса за этот месяц' },
      { k: 'tasks', go: 'Трекер Фримана → Задачи', t: 'Занесите себе минимум 5 задач', n: 5 },
      { k: 'habit', go: 'Трекер Фримана → Привычки', t: 'Занесите минимум одну привычку' },
      { k: 'habitdone', go: 'Трекер Фримана → Привычки', t: 'Выполните привычку' },
    ] },
    { k: 'ch', t: 'Чат Альянса', where: 'Telegram', items: [
      { k: 'chat', go: 'Чат Альянса в Telegram', t: 'Вступить в чат Альянса в Telegram' },
      { k: 'hello', go: 'Чат Альянса в Telegram', t: 'Поздороваться и рассказать о себе в чате', club: true },
    ] },
    { k: 'pr', t: 'Профиль', where: 'Мой профиль', items: [
      { k: 'prof', go: 'Мой профиль', t: 'Ниши, опыт, город и чем вы можете быть полезны' },
    ] },
  ];
  const ALL_ITEMS = PREP.flatMap((s) => s.items.map((i) => i.k));

  const SIT = {
    fresh: 'Только прошёл онбординг',
    some: 'Посмотрел часть шагов 1–5',
    gate6: 'Задания 1–5 сданы, подготовка не закончена',
    at7: 'Подготовка готова, идёт шаг 7',
    wall: '10 бесплатных шагов пройдены',
    bought: 'Купил доступ после 10-го, установочной не было',
    at30: 'Идёт шаг 30, один шаг пропущен',
  };

  const ui = { pid: 'olga', sit: 'fresh', access: 'free', watched: new Set(), done: new Set(), skip: new Set(), prep: {}, cnt: {}, setup: 'no', openL: null, open: new Set(), shut: new Set(), answer: '', toast: null, flash: null, stage: {}, sf: {}, q: {}, life: null, tab: 'route', plvl: null, pdone: new Set() };
  const P = () => PROFILES.find((p) => p.id === ui.pid);
  const ten = () => P().route.ten;
  const rest = () => P().route.rest;
  const seq = () => ten().map((x) => x.k).concat(rest().map((x) => x.k));

  /* Подготовка */
  const itemOn = (i) => !(i.club && ui.access !== 'club');
  const secDone = (s) => s.items.filter(itemOn).every((i) => ui.prep[i.k]);
  const prepDoneN = () => PREP.filter(secDone).length;
  const prepDone = () => prepDoneN() === PREP.length;
  const firstFiveDone = () => ten().slice(0, 5).filter((x) => ui.done.has(x.k)).length;
  const gate6 = () => firstFiveDone() === 5 && prepDone();
  const paid = () => ui.access !== 'free';
  const passed = (k) => ui.done.has(k) || ui.skip.has(k);

  /* Состояние шага по месту в маршруте (1-based) */
  function state(pos) {
    const k = seq()[pos - 1];
    if (ui.done.has(k)) return 'done';
    if (ui.skip.has(k)) return 'skip';
    if (pos <= 5) return ui.watched.has(k) ? 'watched' : 'open';
    if (!gate6()) return 'gate';
    if (pos > 10 && !paid()) return 'paid';
    if (pos > 10 && ui.setup !== 'yes') return 'setup';
    if (pos > 6 && !passed(seq()[pos - 2])) return 'next';
    return ui.watched.has(k) ? 'watched' : 'open';
  }
  const actionable = (s) => s === 'open' || s === 'watched' || s === 'skip';
  /* Текущий шаг — первый открытый, не считая пропущенных */
  function curPos() {
    const n = seq().length;
    for (let i = 1; i <= n; i++) { const s = state(i); if (s === 'open' || s === 'watched') return i; }
    return null;
  }
  function lastDone() {
    const c = curPos() || seq().length + 1;
    for (let i = c - 1; i >= 1; i--) if (state(i) === 'done') return i;
    return null;
  }
  const doneTotal = () => seq().filter((k) => ui.done.has(k)).length;

  function setSit(k) {
    const all = seq();
    const t = all.slice(0, 10);
    const full = () => { ALL_ITEMS.forEach((i) => (ui.prep[i] = true)); ui.cnt = { wish: 10, fsteps: 5, zv: 3, tasks: 5 }; };
    Object.assign(ui, { sit: k, watched: new Set(), done: new Set(), skip: new Set(), prep: {}, cnt: { wish: 0, fsteps: 0, zv: 0, tasks: 0 }, stage: {}, sf: {}, q: {}, setup: 'no', access: 'free', answer: '', open: new Set(), shut: new Set() });
    const doneN = (n) => all.slice(0, n).forEach((x) => { ui.done.add(x); ui.watched.add(x); });
    if (k === 'some') { [t[0], t[2], t[3]].forEach((x) => ui.watched.add(x)); ui.done.add(t[0]); ui.done.add(t[2]); ui.prep.inc = true; ui.cnt = { wish: 3, tasks: 1 }; }
    if (k === 'gate6') { doneN(5); Object.assign(ui.prep, { inc: true, biz: true, focus: true, fday: true, wheel: true, habit: true, chat: true }); ui.cnt = { wish: 6, fsteps: 2, zv: 1, tasks: 3 }; }
    if (k === 'at7') { doneN(6); full(); }
    if (k === 'wall') { doneN(10); full(); }
    if (k === 'bought') { doneN(10); full(); ui.access = 'starter'; }
    if (k === 'at30') {
      const n = Math.min(29, all.length - 2);
      doneN(n); full(); ui.access = 'starter'; ui.setup = 'yes';
      const s = all[n - 6]; ui.done.delete(s); ui.skip.add(s);
    }
    const Q = {
      some: { les: [2, 1] },
      gate6: { fday: [1, 1], les: [5, 2] },
      at7: { fday: [3, 2], habitdone: [5, 3], les: [6, 3] },
      wall: { fday: [6, 5], habitdone: [8, 6], les: [10, 5] },
      bought: { fday: [6, 5], habitdone: [8, 6], les: [10, 5] },
      at30: { fday: [12, 4], habitdone: [20, 9], les: [29, 7] },
    }[k] || {};
    ui.q = Object.fromEntries(Object.entries(Q).map(([key, [t, st]]) => [key, { t, s: st }]));
    /* Пока подготовка не готова, Фрими ведёт в неё, карточку шага не раскрываем */
    const c = curPos();
    ui.openL = prepDone() && c ? all[c - 1] : null;
  }

  /* Иконки */
  const ICON = {
    dash: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    todo: '<rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    cal: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    feed: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9a2 2 0 0 1 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    lib: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    lock: '<rect width="16" height="11" x="4" y="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
    flag: '<path d="M4 22V4"/><path d="M4 4h12l-2 4 2 4H4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    skip: '<path d="M12 8v5"/><path d="M12 16.5h.01"/><circle cx="12" cy="12" r="9"/>',
  };
  const svg = (k, cls) => `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
  const SIDE = [['dash', 'Дашборд Альянса'], ['route', 'Мой маршрут'], ['todo', 'Трекер Фримана'], ['cal', 'Календарь'], ['feed', 'Лента'], ['msg', 'Сообщения'], ['lib', 'Библиотека'], ['people', 'Члены Альянса']];
  const MOB = [['dash', 'Альянс'], ['route', 'Маршрут'], ['todo', 'Трекер'], ['lib', 'Библиотека']];
  const side = () => `<aside class="side" aria-label="Меню Альянса">
    <div class="brand"><img src="img/context-alliance.png" alt="" width="34" height="34"><span><b>Freeman's Alliance</b><span>кабинет Альянса</span></span></div>
    ${SIDE.map(([k, l]) => `<div class="nav-i ${k === 'route' ? 'on' : ''}">${svg(k)}<span>${l}</span></div>`).join('')}
  </aside>`;
  const mnav = () => `<nav class="mnav" aria-label="Нижнее меню">${MOB.map(([k, l]) => `<span class="${k === 'route' ? 'on' : ''}">${svg(k)}${l}</span>`).join('')}</nav>`;
  const topBar = () => `<header class="top"><h1>Мой маршрут</h1><div class="me"><span class="ava">${esc(P().name[0])}</span><div><b>${esc(P().name)}</b><span>${esc(ACCESS[ui.access])}</span></div></div></header>`;

  function demoBar() {
    const opts = (o, v) => Object.entries(o).map(([k, l]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${esc(l)}</option>`).join('');
    return `<details class="demo" open><summary><span class="demo-tag">Прототип</span><span class="demo-sum">${esc(P().name)}: ${esc(P().who)}. ${esc(SIT[ui.sit] || 'Свой сценарий')}</span><span class="demo-more">Варианты</span></summary>
      <div class="demo-body">
        <div class="pf" role="group" aria-label="Анкета онбординга">${PROFILES.map((p) => `<button data-act="pid" data-v="${p.id}" aria-pressed="${p.id === ui.pid}"><b>${esc(p.name)}</b><span>${esc(p.who)}</span></button>`).join('')}</div>
        <label>Ситуация<select data-act="sit">${opts(SIT, ui.sit)}${SIT[ui.sit] ? '' : '<option selected>Свой сценарий</option>'}</select></label>
        <label>Доступ<select data-act="access">${opts(ACCESS, ui.access)}</select></label>
        <p class="demo-note">Участники вымышленные, ответы анкет составлены по образцу реальных. Пункты подготовки засчитывает сама платформа, когда в разделе всё записано. Клик по пункту ведёт в нужный раздел.</p><button data-act="auto">Прототип: платформа засчитала следующий пункт</button><p class="demo-note" hidden></p>
      </div></details>`;
  }

  /* Одно следующее действие: его говорит Фрими */
  function nextAction() {
    const p = P(), c = curPos();
    const free5 = 5 - firstFiveDone();
    if (!prepDone()) return { img: 'focus-flag', eb: firstFiveDone() ? `Осталось подготовиться` : 'С чего начать', t: 'Начните с подготовки к росту', d: `${prepDoneN()} из${NB}4 разделов готово. Без подготовки не${NB}откроется шаг 6. Шаги 1–5 можно смотреть уже сейчас, в${NB}любом порядке.`, cta: 'Продолжить подготовку', act: 'goprep' };
    if (free5 > 0) return { img: 'idea', eb: 'Подготовка готова', t: `Сдайте задания шагов 1–5`, d: `Осталось ${stepsWord(free5)}. После них откроется шаг 6.`, cta: 'Открыть шаг', act: 'gocur' };
    if (c) return { img: c <= 10 ? 'idea' : 'focus-flag', eb: `Следующий урок · шаг ${c} из${NB}${seq().length}`, t: L[seq()[c - 1]].t, d: c <= 10 && ten()[c - 1].kind === 'bar' ? ten()[c - 1].why + '.' : `Посмотрите урок и${NB}сдайте задание, затем откроется следующий шаг.`, cta: ui.watched.has(seq()[c - 1]) ? 'Сдать задание' : 'Смотреть урок', act: 'gocur' };
    if (!paid()) return { img: 'focus-cup', eb: '10 бесплатных шагов пройдены', t: 'Откройте весь маршрут', d: `Дальше ${stepsWord(seq().length - 10)} со${NB}стартовым доступом. После покупки нужна установочная сессия.`, cta: 'Открыть весь маршрут', act: 'buy' };
    if (ui.setup !== 'yes') return { img: 'focus-flag', eb: 'Перед шагом 11', t: 'Пройдите установочную сессию', d: `${p.seg === 'E' ? 'Эксперты' : 'Предприниматели'} встречаются по${NB}${p.seg === 'E' ? 'вторникам' : 'средам'}. После неё откроется шаг 11.`, cta: ui.setup === 'booked' ? 'Вы записаны' : `Записаться на${NB}${DAY[p.seg]}`, act: ui.setup === 'booked' ? 'gowall' : 'book' };
    return { img: 'hooray', eb: 'Маршрут пройден', t: 'Все шаги пройдены', d: 'Наставник подберёт следующие уроки.', cta: '', act: '' };
  }

  function guide() {
    const p = P(), a = nextAction();
    const done = doneTotal(), total = seq().length;
    const bars = p.bars.slice().sort((x, y) => (x === p.main ? -1 : y === p.main ? 1 : 0));
    return `<section class="card guide">
      <div class="g-main">
        <img class="g-fr" src="img/frimi-${a.img}.webp" alt="" width="132" height="132">
        <div class="g-say">
          <p class="eyebrow">${esc(p.name)} · ${a.eb}</p>
          <h2>${esc(a.t)}</h2>
          <p class="g-d">${a.d}</p>
          ${a.cta ? `<button class="btn" data-act="${a.act}">${a.act === 'gocur' ? svg('play', 'ic-f') : ''}${a.cta}</button>` : ''}
        </div>
        ${bizMini()}
      </div>
      <div class="g-foot">
        <div class="mini"><span class="num">${done} из${NB}${total}</span><i><u style="width:${(done / total) * 100}%"></u></i><span>шагов пройдено</span></div>
        <details class="why"><summary>Почему такой маршрут${svg('chev', 'chev')}</summary>
          <div class="why-b">
            <p>Собран по вашей анкете: ${SEG[p.seg].toLowerCase()}, шаг бизнеса ${p.step}, уровень ПЭРЛ «${esc(p.pearl)}». Вы начинаете с${NB}этапа ${p.route.start} «${esc(ETAPY[p.route.start].name)}». Шаги 1–5 про личность: первый у${NB}всех один, остальные закрывают то, что мешает. У${NB}каждого шага пометка: «Личность» или «Бизнес».</p>
            <ul>${bars.map((c) => `<li class="${c === p.main ? 'main' : ''}">${c === p.main ? '<b>Главное</b>' : ''}${esc(p.bar_labels[c])}</li>`).join('')}</ul>
          </div>
        </details>
      </div>
    </section>`;
  }

  /* Строка и карточка шага */
  const libOf = (k) => (L[k].n ? `Урок №${L[k].n}` : 'Ролик YouTube');
  const WHY = (x) => x.kind === 'bar' ? `<span class="tag pers">${esc(x.why)}</span>` : x.kind === 'base' ? `<span class="tag club">${esc(x.why.split(':')[0])}</span>` : '';
  const LVL = { 1: 'Product-Market Fit', 2: 'Scaling', 3: 'Enterprise' };
  const CAT_T = { P: 'Личность', B: 'Бизнес' };
  const catOf = (pos) => (pos <= 5 ? 'P' : L[seq()[pos - 1]].c || 'B');
  const catTag = (pos) => `<span class="tag cat cat-${catOf(pos)}">${CAT_T[catOf(pos)]}</span>`;
  function step(pos) {
    const k = seq()[pos - 1];
    const s = state(pos);
    const tag = catTag(pos) + (pos <= 5 ? WHY(ten()[pos - 1]) : '') + (s === 'skip' ? '<span class="tag warn">Пропущен</span>' : '');
    if (ui.openL === k && actionable(s)) return nowCard(pos, k, s, tag);
    const node = s === 'done' ? svg('check') : s === 'skip' ? svg('skip') : ['gate', 'paid', 'setup'].includes(s) ? svg('lock') : `<span class="num">${pos}</span>`;
    const what = {
      done: 'Задание сдано',
      skip: 'Задание не сдано, можно вернуться',
      watched: 'Видео просмотрено, осталось задание',
      open: pos <= 5 ? 'Можно смотреть сейчас' : 'Открыт',
      gate: 'После заданий 1–5 и подготовки',
      paid: 'Со стартовым доступом',
      setup: 'После установочной сессии',
      next: `После шага ${pos - 1}`,
    }[s];
    const cls = s === 'done' ? 'is-done' : s === 'skip' ? 'is-skip' : actionable(s) ? 'is-open' : s === 'next' ? 'is-next' : 'is-paid';
    return `<li class="ls ${cls}" id="l${pos}">
      <span class="nd">${node}</span>
      <button class="ls-b" data-act="row" data-v="${pos}" ${actionable(s) || s === 'done' ? '' : 'aria-disabled="true"'}><span class="ls-k">Шаг ${pos}</span><span class="ls-t">${esc(L[k].t)}</span><span class="ls-m"><span class="lib">${libOf(k)}</span>${tag}<span>${what}</span>${s === 'done' ? qIcons(lesScore(k), true) : ''}</span></button>
    </li>`;
  }

  function nowCard(pos, k, s, tag) {
    const watched = s === 'watched' || s === 'skip';
    const step1 = `<li class="${watched ? 'ok' : 'todo'}"><span class="chk-n">${watched ? svg('check') : '1'}</span>
        <div class="chk-b"><b>Посмотреть урок</b><span>${watched ? 'Смотрел до конца' : libOf(k)}</span></div>
        ${watched ? '<button class="btn soft sm" data-act="watch">Пересмотреть</button>' : `<button class="btn sm" data-act="watch">${svg('play', 'ic-f')}Смотреть</button>`}</li>`;
    const h = hwOf(k);
    const nohw = h === null;
    const title = nohw ? 'Поработать с уроком' : 'Задание';
    const text = nohw ? 'Домашки нет. Звёзды за то, как вы поработали с уроком.' : h ? h.t : DEF_TASK;
    const crit = nohw ? critList(window.NOHW, 'За что звёзды') : h && h.one ? critOne(h.s[0]) : critList(h ? h.s : LES_CRIT, h ? 'За что звёзды' : 'Как оценивается');
    const form = h && h.one
      ? `<div class="ans-a"><button class="btn sm" data-act="submit" data-free="1">Пройти тест</button></div>`
      : `<label class="ans"><span class="ans-l">${nohw ? 'Ваш инсайт' : 'Ваш результат'}</span><textarea data-act="answer" rows="3" placeholder="${nohw ? 'Что поняли из урока, 100–200 символов' : 'Что сделали и что поняли'}">${esc(ui.answer)}</textarea></label>
          <div class="ans-a"><button class="btn sm" data-act="submit" ${ui.answer.trim().length < 3 ? 'disabled' : ''}>${nohw ? 'Сохранить' : 'Сдать задание'}</button></div>`;
    const step2 = `<li class="${watched ? 'todo' : 'wait'}"><span class="chk-n">2</span>
        <div class="chk-b"><b>${title}</b><span class="hw-t">${esc(text)}</span>${crit}
        ${watched ? form : '<span class="wait-n">Откроется после просмотра</span>'}
        </div></li>`;
    const eyebrow = pos <= 5 ? `Шаг ${pos} · можно в${NB}любом порядке` : s === 'skip' ? `Шаг ${pos} · пропущен` : `Сейчас · шаг ${pos}`;
    return `<li class="ls is-now ${pos <= 10 && ten()[pos - 1].kind === 'bar' ? 'pers' : ''} ${ui.flash === k ? 'enter' : ''}" id="l${pos}">
      <span class="nd"><span class="num">${pos}</span></span>
      <div class="now"><div class="now-h"><p class="eyebrow">${eyebrow}</p><h3>${esc(L[k].t)}</h3><div class="ls-m"><span class="lib">${libOf(k)}</span>${tag}</div></div>
      <ol class="chk">${step1}${step2}</ol></div>
    </li>`;
  }

  /* Группа шагов со сворачиванием: пройденные прячутся, виден только предыдущий; пропущенные видны всегда */
  function group(gid, nd, title, meta, positions, extraCls, tail) {
    const ld = lastDone(), c = curPos();
    const allDone = positions.every((p) => state(p) === 'done');
    const hasCur = positions.some((p) => p === c || actionable(state(p)));
    const defOpen = positions.some((p) => actionable(state(p)) || p === c) || (positions.includes(6) && !gate6()) || (positions.includes(11) && doneTotal() >= 10 && wall11() !== '');
    const open = ui.open.has(gid) || (defOpen && !ui.shut.has(gid));
    const doneN = positions.filter((p) => state(p) === 'done').length;
    const m = allDone ? `<span>Пройдено, ${stepsWord(positions.length)}</span>` : meta;
    let out = `<li class="st ${allDone ? 'is-passed' : hasCur ? 'is-cur' : ''} ${extraCls || ''}" id="g-${gid}"><span class="nd sq">${allDone ? svg('check') : nd}</span>
      <button class="st-b" data-act="grp" data-v="${gid}" aria-expanded="${open}"><span class="st-t">${title}</span><span class="st-m">${m}</span>${svg('chev', 'chev')}</button></li>`;
    if (!open) return out;
    const showAll = ui.open.has('done-' + gid);
    const hidden = positions.filter((p) => state(p) === 'done' && !(p === ld && p > 5) && !showAll);
    if (hidden.length) out += `<li class="ls fold"><span class="nd nd-dot">${svg('check')}</span><button class="fold-b" data-act="fold" data-v="done-${gid}">Пройдено ${stepsWord(hidden.length)} · показать</button></li>`;
    else if (showAll && doneN > 1) out += `<li class="ls fold"><span class="nd nd-dot">${svg('check')}</span><button class="fold-b" data-act="fold" data-v="done-${gid}">Свернуть пройденные</button></li>`;
    let locked = 0, skipped = 0;
    const moreOpen = ui.open.has('more-' + gid);
    const visible = positions.filter((p) => !hidden.includes(p));
    const lockedAll = visible.filter((p) => ['next', 'gate', 'paid', 'setup'].includes(state(p)));
    const flushMore = () => { if (skipped) out += `<li class="ls fold"><span class="nd nd-dot">${svg('lock')}</span><button class="fold-b" data-act="fold" data-v="more-${gid}">Ещё ${stepsWord(skipped)} · показать</button></li>`; skipped = 0; };
    visible.forEach((p) => {
      if (p === 6) out += gate6Card();
      if (p === 11) { const w = wall11(); if (w) { flushMore(); out += w; locked = 0; } }
      if (lockedAll.includes(p)) { locked++; if (locked > 3 && !moreOpen) { skipped++; return; } }
      out += step(p);
    });
    flushMore();
    return out + (tail || '');
  }

  /* Звёзды качества: у каждой задачи 0–5 по её критериям, у раздела средняя по задачам.
     Критерии, кроме фокуса дня и привычки (голосовое Игоря 12:56), черновые: их утверждает Игорь */
  const CRIT = {
    inc: ['Внесён 1 месяц дохода', 'Внесены 2 месяца', 'Внесены 3 месяца', 'У дохода указаны источники', 'Ведётся полный учёт: доходы и расходы'],
    biz: ['Внесён 1 месяц', 'Внесены 3 месяца', 'Есть выручка и прибыль', 'Указаны источники выручки', 'Внесён текущий месяц'],
    life: ['Указаны возраст и доход', 'Вписаны машина и дом мечты', 'Вписаны путешествия и одежда', 'Стоимость жизни рассчитана', 'Записан вывод: что вы поняли'],
    wish: ['3 желания', '5 желаний', '10 желаний', 'У всех категория и горизонт', 'У всех указана стоимость'],
    focus: ['Фокус выбран', 'У фокуса есть стоимость', 'Есть срок', 'Описан результат: как поймёте, что достигли', 'Фокус на горизонте одного года'],
    fsteps: ['1 шаг', '3 шага', '5 шагов', 'У шагов есть сроки', 'Шаги разбиты на этапы'],
    fday: ['1 раз', '2 раза', '2 дня подряд', '5 раз', '5 дней подряд'],
    zv: ['1 награда', '2 награды', '3 награды', 'Награды разные по уровням', 'У наград есть стоимость'],
    wheel: ['Оценены 4 сферы', 'Оценены все 8 сфер', 'Есть комментарий к самой слабой', 'Выбрана сфера для роста', 'Заполнено второй месяц подряд'],
    tasks: ['1 задача', '3 задачи', '5 задач', 'У задач есть сроки', 'Выполнена хотя бы одна'],
    habit: ['1 привычка', 'У привычки выбраны дни', '2 привычки', '3 привычки', 'Есть привычка из «Спорта»'],
    habitdone: ['1 раз', '2 раза', '2 дня подряд', '5 раз', '5 дней подряд'],
    chat: ['Вступили в чат', 'Поставили фото', 'Поздоровались', 'Рассказали о себе', 'Ответили другому участнику'],
    hello: ['Поздоровались', 'Рассказали, чем занимаетесь', 'Написали, чем можете помочь', 'Написали, кого ищете', 'Ответили на вопрос участника'],
    prof: ['Указан город', 'Указаны ниши', 'Описан опыт', 'Заполнено «Чем могу помочь»', 'Заполнено «Кого ищу» и есть фото'],
  };
  const LES_CRIT = ['Задание сдано', 'Есть главный вывод своими словами', 'Есть конкретное действие на неделю', 'Действие выполнено, есть результат', 'Результат в цифрах или со ссылкой'];
  const STAGE_CRIT = {
    '1.1': ['Указаны 5 ниш', 'У каждой ниши есть «почему»', 'У ниш понятна аудитория', 'По каждой нише виден спрос', 'Выбрана ниша для теста'],
    '1.2': ['Протестированы 5 ниш', 'У каждой есть результат теста', 'Результаты в цифрах: заявки, оплаты, цена заявки', 'Ниша выбрана по цифрам', 'Есть первая оплата'],
  };
  const GEN_CRIT = ['Результат описан', 'Есть цифры', 'Есть ссылка на таблицу или документ', 'Результат совпадает с целью этапа', 'Принято без доработок'];
  const starsOf = (q) => (!q || !q.t ? 0 : q.s >= 5 ? 5 : q.t >= 5 ? 4 : q.s >= 2 ? 3 : q.t >= 2 ? 2 : 1);
  const seed = (x) => { let h = 7; for (const c of x + ui.pid) h = (h * 31 + c.charCodeAt(0)) % 9973; return h; };
  const qScore = (k) => (k === 'life' ? lifeStars() : k === 'fday' || k === 'habitdone' ? starsOf(ui.q[k]) : !ui.prep[k] ? 0 : 2 + (seed(k) % 4));
  const lesScore = (k) => (hwOf(k) && hwOf(k).one ? 5 : 2 + (seed(k) % 4));
  const qIcons = (n, sm) => `<span class="st-i ${sm ? 'sm' : ''}" role="img" aria-label="${n} из${NB}5 звёзд">${Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'on' : ''}">${svg('star')}</i>`).join('')}</span>`;
  function qLine(k) {
    const n = qScore(k), c = CRIT[k];
    if (!c) return '';
    return `<span class="stars">${qIcons(n)}<span class="st-x">${n >= 5 ? 'все звёзды' : `${n ? 'следующая звезда' : 'первая звезда'}: ${c[n]}`}</span></span>`;
  }
  const avgOf = (arr) => (arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : 0);
  const avgChip = (arr) => (arr.length ? `<span class="q-avg" title="Средняя оценка задач">${svg('star')}<b>${avgOf(arr).toFixed(1).replace('.', ',')}</b></span>` : '');
  const hwOf = (k) => (window.HW && k in window.HW ? window.HW[k] : undefined);
  const critOne = (t) => `<details class="crit"><summary>За что звёзды${svg('chev', 'chev')}</summary><ol><li>${qIcons(5, true)}<span>${esc(t)}</span></li></ol></details>`;
  const critList = (c, title) => `<details class="crit"><summary>${title || 'Как оценивается'}${svg('chev', 'chev')}</summary><ol>${c.map((t, i) => `<li>${qIcons(i + 1, true)}<span>${t}</span></li>`).join('')}</ol></details>`;

  /* «Стоимость жизни»: упражнение делается прямо в маршруте (Игорь, голосовое 08.11.2026).
     Поля, формула и выводы из спеки 020 и маршрутной карты /lab/route-map */
  const LIFE_INC = { olga: 500, denis: 2000, marina: 2000, artem: 9500, irina: 25000 };
  const lifeDef = () => ({ age: '', car: '', home: '', trip: '', tripn: '2', cloth: '', inc: String(LIFE_INC[ui.pid] || 500), note: '', calc: false });
  const L0 = () => (ui.life = ui.life || lifeDef());
  const num = (v) => Math.max(0, +String(v).replace(/\s/g, '') || 0);
  function lifeCalc(l) {
    const total = num(l.car) + num(l.home) + num(l.trip) * num(l.tripn) + num(l.cloth);
    const inc = num(l.inc), years = inc > 0 ? total / inc / 12 : Infinity;
    const end = isFinite(years) ? Math.ceil(num(l.age) + years) : null;
    return { total, inc, years, end };
  }
  function lifeVerdict(years, end) {
    if (!isFinite(years)) return 'Пока дохода нет, к${NB}такой жизни не${NB}прийти никогда. Цель на${NB}первые 30 дней: первые деньги. Добро пожаловать в${NB}Альянс.';
    if (years <= 3) return 'Жизнь мечты уже рядом. Возможно, вы мечтаете слишком скромно: попробуйте увеличить список желаний в${NB}десять раз и${NB}посчитать заново.';
    if (end <= 50) return `Хороший темп: к${NB}жизни мечты вы придёте в${NB}${end}. Альянс поможет дойти быстрее и${NB}не${NB}потерять по${NB}пути здоровье, семью и${NB}радость.`;
    const y = Math.ceil(years);
    return `Если вы сейчас начнёте отдавать весь свой доход, не${NB}оставляя себе на${NB}еду ни${NB}копейки, и${NB}всё сохранять, без учёта инфляции, вам понадобится ${y} ${yrs(y)}, и${NB}вам будет ${end}, когда вы достигнете своей цели. И${NB}это ещё не${NB}Luxury Life: здесь нет трёх машин на${NB}семью, вертолётов или яхт, дорогих часов и${NB}тому подобного. Это трезвый взгляд на${NB}реальность: система, в${NB}которой мы находимся, не${NB}рассчитана на${NB}то, чтобы вы превратили свою жизнь в${NB}шедевр. Для этого мы в${NB}Альянсе объединяемся, чтобы достигать своих целей. Поэтому пора что-то менять.`;
  }
  function lifeStars() {
    const l = ui.life; if (!l) return 0;
    let n = 0;
    if (num(l.age) && num(l.inc)) n = 1; else return 0;
    if (num(l.car) && num(l.home)) n = 2; else return n;
    if (num(l.trip) && num(l.cloth)) n = 3; else return n;
    if (l.calc) n = 4; else return n;
    if (l.note.trim().length >= 10) n = 5;
    return n;
  }
  function lifeResult() {
    const l = L0(); if (!l.calc) return '';
    const r = lifeCalc(l);
    const rows = isFinite(r.years)
      ? `<div><b data-cnt="${r.total}" data-f="usd">${usd(r.total)}</b><span>стоит жизнь мечты</span></div><div><b data-cnt="${Math.ceil(r.years)}" data-f="yrs">${Math.ceil(r.years)} ${yrs(Math.ceil(r.years))}</b><span>копить при доходе ${usd(r.inc)} в${NB}месяц, если откладывать всё</span></div><div><b data-cnt="${r.end}" data-f="yrs" data-from="${num(l.age)}">${r.end} ${yrs(r.end)}</b><span>будет вам, когда придёте к${NB}ней</span></div>`
      : `<div><b data-cnt="${r.total}" data-f="usd">${usd(r.total)}</b><span>стоит жизнь мечты</span></div><div><b>Никогда</b><span>при нулевом доходе</span></div>`;
    return `<div class="lc-r">${rows}</div><p class="lc-v">${lifeVerdict(r.years, r.end)}</p>`;
  }
  const yrs = (n) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? 'год' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'года' : 'лет'; };
  function lifeCount() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...app.querySelectorAll('#lc-out [data-cnt]')];
    const fmt = (el, v) => (el.dataset.f === 'usd' ? usd(v) : `${v} ${yrs(v)}`);
    const t0 = performance.now(), dur = 1500;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      els.forEach((el) => { const to = +el.dataset.cnt, from = +(el.dataset.from || 0); el.textContent = fmt(el, Math.round(from + (to - from) * e)); });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function lifeCard() {
    const l = L0();
    const f = (k, label, step) => `<label class="ans-f"><span>${label}</span><input type="number" inputmode="numeric" min="0" step="${step}" data-lf="${k}" value="${esc(l[k])}"></label>`;
    return `<div class="lc" id="lifecalc">
      <p class="lc-n">Найдите цены в${NB}интернете и${NB}впишите. Доход взяли из${NB}анкеты онбординга, его можно поправить.</p>
      <div class="lc-f">
        ${f('age', 'Сколько вам лет', 1)}
        ${f('inc', 'Ваш доход сейчас, $ в месяц', 50)}
        ${f('car', 'Машина мечты, $', 5000)}
        ${f('home', 'Квартира или дом мечты, $', 10000)}
        ${f('trip', 'Путешествие мечты на всю семью, $', 500)}
        <label class="ans-f"><span>Сколько раз в${NB}год путешествуете</span><select data-lf="tripn">${[1, 2, 3, 4].map((n) => `<option ${String(n) === l.tripn ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        ${f('cloth', 'Одежда в год, $', 500)}
      </div>
      <div class="ans-a"><button class="btn sm" data-act="lifego">${l.calc ? 'Пересчитать' : 'Рассчитать'}</button></div>
      <div id="lc-out">${lifeResult()}</div>
      ${l.calc ? `<label class="ans"><span class="ans-l">Что вы поняли</span><textarea data-lf="note" rows="3" placeholder="Главный вывод из${NB}расчёта">${esc(l.note)}</textarea></label>
      <div class="ans-a"><button class="btn sm" data-act="lifesave">Сохранить</button></div>` : ''}
    </div>`;
  }

  /* Подготовка к росту: первая в маршруте, сворачивается */
  function prepBlock() {
    const n = prepDoneN(), all = prepDone();
    const open = ui.open.has('prep') || (!all && !ui.shut.has('prep'));
    let out = `<li class="st ${all ? 'is-passed' : 'is-cur'}" id="sprep"><span class="nd sq">${all ? svg('check') : svg('user')}</span>
      <button class="st-b" data-act="grp" data-v="prep" aria-expanded="${open}"><span class="st-t">Подготовка к росту</span><span class="st-m"><span>${all ? 'Готово' : `${n} из${NB}4 · нужна для шага 6`}</span>${avgChip(PREP.flatMap((x) => x.items.filter(itemOn)).filter((i) => ui.prep[i.k]).map((i) => qScore(i.k)))}</span>${svg('chev', 'chev')}</button></li>`;
    if (!open) return out;
    const secs = PREP.map((s, si) => {
      const ok = secDone(s);
      const items = s.items.filter(itemOn);
      const doneI = items.filter((i) => ui.prep[i.k]).length;
      const firstOpen = PREP.find((x) => !secDone(x));
      const sOpen = ui.open.has('ps-' + s.k) || (firstOpen === s && !ui.shut.has('ps-' + s.k));
      const rows = sOpen ? `<ul>${items.map((i) => {
        const on = !!ui.prep[i.k];
        const c = i.n ? Math.min(ui.cnt[i.k] || 0, i.n) : null;
        const sub = i.k === 'biz' && on && P().step <= 2 ? 'Отмечено: стартап, точка ноль' : i.k === 'biz' ? i.alt : c != null && !on ? `${c} из${NB}${i.n}` : i.club ? 'В клубе и выше' : '';
        const st = qLine(i.k);
        const lOpen = i.inline && ui.open.has('life');
        return `<li class="${on ? 'ok' : ''}"><button class="pi" data-act="go" data-v="${i.k}" ${i.inline ? `aria-expanded="${lOpen}"` : ''}><span class="pi-c" title="${on ? 'Засчитано' : 'Ещё не сделано'}">${on ? svg('check') : ''}</span><span class="pi-t">${esc(i.t)}${sub ? `<em>${esc(sub)}</em>` : ''}${st}</span><span class="pi-go">${i.inline ? (lOpen ? 'Свернуть' : on ? 'Открыть' : 'Посчитать') : on ? 'Открыть' : 'Перейти'}${svg(i.inline ? 'chev' : 'arrow')}</span></button>${lOpen ? lifeCard() : ''}</li>`;
      }).join('')}</ul>` : '';
      return `<div class="ps ${ok ? 'ok' : ''}"><button class="ps-h" data-act="grp" data-v="ps-${s.k}" aria-expanded="${sOpen}"><b><span class="ps-n">${ok ? svg('check') : si + 1}</span>${esc(s.t)}</b><span>${avgChip(items.filter((i) => ui.prep[i.k] || qScore(i.k)).map((i) => qScore(i.k)))}${ok ? 'Готово' : `${doneI} из${NB}${items.length}`}${svg('chev', 'chev')}</span></button>${rows}</div>`;
    }).join('');
    out += `<li class="ls prep-body"><span class="nd nd-ghost"></span><div class="prep-c">${secs}${setupCard()}</div></li>`;
    return out;
  }

  /* Установочная: обязательна для шага 11 */
  function setupCard(flat) {
    const p = P(), day = DAY[p.seg];
    const who = p.seg === 'E' ? 'Эксперты' : 'Предприниматели';
    const when = `${who} встречаются по${NB}${p.seg === 'E' ? 'вторникам' : 'средам'}`;
    const lbl = `<b>${flat ? '' : '<span class="ps-n">5</span>'}Установочная сессия</b>`;
    if (ui.setup === 'yes') return `<div class="ps ok setup"><div class="ps-h st-static"><b><span class="ps-n">${svg('check')}</span>Установочная сессия</b><span>Пройдена</span></div></div>`;
    if (!paid()) return `<div class="ps setup locked"><div class="ps-h st-static">${lbl}<span>${svg('lock')}Нужно активировать доступ</span></div><p>Встреча с${NB}наставником: проверяем ваши цифры и${NB}собираем стратегию. ${when}. Без неё не${NB}откроется шаг 11.</p><button class="btn sm" data-act="buy">Повысить доступ</button></div>`;
    if (ui.setup === 'booked') return `<div class="ps setup ${flat ? 'flat' : ''}"><div class="ps-h st-static">${lbl}<span>Вы записаны</span></div><p>Встреча в${NB}${day}, ссылка придёт в${NB}Telegram. Шаг 11 откроется после встречи.</p><button class="btn soft sm" data-act="attend">Прототип: встреча прошла</button></div>`;
    return `<div class="ps setup ${flat ? 'flat' : ''}"><div class="ps-h st-static">${lbl}<span>Нужна для шага 11</span></div><p>${when}. Проверяем ваши цифры и${NB}собираем стратегию на${NB}ближайшие месяцы.</p><button class="btn sm" data-act="book">${svg('cal')}Записаться на${NB}${day}</button></div>`;
  }

  /* Ворота перед шагом 6: только пока закрыты */
  function gate6Card() {
    if (gate6()) return '';
    const f = firstFiveDone(), n = prepDoneN();
    const row = (ok, t, sub, act) => `<li class="${ok ? 'ok' : ''}"><span class="gi">${ok ? svg('check') : svg('x')}</span><span class="gi-t">${t}<em>${sub}</em></span>${!ok && act ? act : ''}</li>`;
    return `<li class="wall gate" id="gate6"><span class="nd">${svg('lock')}</span><div class="wall-b">
      <h3>Шаг 6 откроется, когда будет готово всё ниже</h3>
      <ul class="gl">
        ${row(f === 5, 'Задания шагов 1–5', `${f} из${NB}5 сдано`)}
        ${row(prepDone(), 'Подготовка к росту', `${n} из${NB}4 раздела`, `<button class="btn sm soft" data-act="goprep">Продолжить</button>`)}
      </ul></div></li>`;
  }

  function wall11() {
    if (doneTotal() < 10) return paid() ? '' :`<li class="wall" id="wall"><span class="nd">${svg('lock')}</span><div class="wall-b"><h3>Шаги 11–${seq().length} со${NB}стартовым доступом</h3><p>Первые 10${NB}шагов бесплатно. После покупки нужна установочная сессия.</p></div></li>`;
    if (!paid()) return `<li class="wall" id="wall"><span class="nd">${svg('lock')}</span><div class="wall-b">
      <h3>Дальше ${stepsWord(seq().length - 10)} со${NB}стартовым доступом</h3>
      <p>Первые 10${NB}шагов открыты бесплатно. После покупки нужна установочная сессия: без неё шаг 11 не${NB}откроется.</p>
      <button class="btn" data-act="buy">Открыть весь маршрут</button></div></li>`;
    if (ui.setup === 'yes') return '';
    return `<li class="wall gate" id="wall"><span class="nd">${svg('lock')}</span><div class="wall-b">
      <h3>Шаг 11 откроется после установочной сессии</h3>${setupCard(true)}</div></li>`;
  }

  /* Маршрут по уровням и этапам: шаги 1–10 и «Старт» входят в первый этап человека */
  function stages() {
    const st = P().route.start, out = [];
    seq().forEach((k, i) => {
      const pos = i + 1;
      let e = pos <= 10 ? st : rest()[pos - 11].etap;
      if (e === 'start') e = st;
      let g = out.find((x) => x.etap === e);
      if (!g) { g = { etap: e, items: [] }; out.push(g); }
      g.items.push(pos);
    });
    return out;
  }
  function pastLevels() {
    const cur = P().route.start[0];
    let out = '';
    for (let lv = 1; lv < +cur; lv++) {
      out += `<li class="lvl lvl-past ${lv === 1 ? 'lvl-first' : ''}"><span class="nd lvl-n">${svg('check')}</span><div class="lvl-b"><p class="eyebrow">Уровень ${lv} · пройден</p><h3>${LVL[lv]}</h3></div></li>`;
      [1, 2, 3].forEach((n) => {
        const k = lv + '.' + n, e = ETAPY[k];
        out += `<li class="st is-passed st-past"><span class="nd sq">${svg('check')}</span><div class="st-b st-static"><span class="st-t">Этап ${k} · ${esc(e.name)}</span><span class="st-m"><span>Пройден: ${esc(e.res.charAt(0).toLowerCase() + e.res.slice(1))}</span></span></div></li>`;
      });
    }
    return out;
  }
  /* Завершение этапа: заявка куратору. Этап засчитывается после проверки, уроки остаются открытыми */
  const SF = {
    '1.1': { intro: 'Укажите пять ниш, которые выбрали, и почему каждую.', rows: 5, a: 'Ниша', b: 'Почему выбрали' },
    '1.2': { intro: 'Укажите пять ниш, которые протестировали, и результат теста каждой. Внизу ниша, которую выбрали, и первая оплата.', rows: 5, a: 'Ниша', b: 'Результат теста: заявки, оплаты, цена заявки', extra: 'Выбранная ниша и первая оплата' },
  };
  function stageDone(etap) {
    const st = ui.stage[etap] || 'none', lv = +etap[0], last = etap[2] === '3';
    const head = (t) => `<div class="sd-h"><span class="sd-i">${svg(st === 'ok' ? 'check' : 'flag')}</span><div><b>${t}</b><span>Уроки этапа остаются открытыми, их можно пересматривать.</span></div></div>`;
    let body = '';
    if (st === 'ok') body = head(`Этап ${etap} пройден`) + `<p class="sd-n">Куратор принял результат.</p><div class="stars">${qIcons(4)}<span class="st-x">оценка куратора</span></div>`;
    else if (st === 'sent') body = head(`Этап ${etap}: заявка на${NB}проверке`) + `<p class="sd-n">Куратор проверит результат и${NB}ответит в${NB}Telegram.</p><button class="btn soft sm" data-act="stok" data-v="${etap}">Прототип: куратор принял</button>`;
    else if (last) {
      const fm = FIN[P().id], target = GOAL[fm.metric][lv - 1], year = fm.perMonth * 12, done = year >= target;
      body = head(`Завершение этапа ${etap}: финансовый результат уровня`) + `<p class="sd-n">Этап закрывает уровень ${LVL[lv]}. Нужен результат за${NB}год: ${fm.metric === 'income' ? 'личный доход' : 'выручка компании'} ${short(target)}.</p>
        <div class="sd-fin"><i><u style="width:${Math.min(100, (year / target) * 100).toFixed(1)}%"></u></i><span>Сейчас ${usd(year)} за${NB}год · ${done ? 'цель достигнута' : `осталось ${usd(target - year)}`}</span></div>
        ${done ? `<button class="btn sm" data-act="stsend" data-v="${etap}">Подать заявку куратору</button>` : `<button class="btn soft sm" data-act="go" data-v="inc">Открыть «Финансы»</button>`}`;
    } else if (SF[etap]) {
      const c = SF[etap], v = ui.sf[etap] || {};
      const rows = Array.from({ length: c.rows }, (_, i) => `<div class="sd-r"><span class="sd-k">${i + 1}</span><input data-sf="${etap}:a${i}" value="${esc(v['a' + i] || '')}" placeholder="${c.a}" aria-label="${c.a} ${i + 1}"><input data-sf="${etap}:b${i}" value="${esc(v['b' + i] || '')}" placeholder="${c.b}" aria-label="${c.b} ${i + 1}"></div>`).join('');
      body = head(`Завершение этапа ${etap}`) + `<p class="sd-n">${c.intro}</p>${critList(STAGE_CRIT[etap] || GEN_CRIT, 'Как куратор оценит')}<div class="sd-f">${rows}${c.extra ? `<input class="sd-x" data-sf="${etap}:x" value="${esc(v.x || '')}" placeholder="${c.extra}" aria-label="${c.extra}">` : ''}</div>
        <button class="btn sm" data-act="stsend" data-v="${etap}">Отправить на${NB}проверку</button>`;
    } else {
      const v = ui.sf[etap] || {};
      body = head(`Завершение этапа ${etap}`) + `${critList(GEN_CRIT, 'Как куратор оценит')}<p class="sd-n">Покажите результат этапа: ${esc(ETAPY[etap].res.charAt(0).toLowerCase() + ETAPY[etap].res.slice(1))}</p>
        <div class="sd-f"><textarea data-sf="${etap}:t" rows="3" placeholder="Что сделали, цифры, ссылка на${NB}таблицу или документ">${esc(v.t || '')}</textarea></div>
        <button class="btn sm" data-act="stsend" data-v="${etap}">Отправить на${NB}проверку</button>`;
    }
    return `<li class="ls sd-li"><span class="nd nd-ghost"></span><div class="sd ${st}">${body}</div></li>`;
  }

  function levelGroups() {
    let out = pastLevels(), lvl = out ? 'past' : null;
    stages().forEach((g) => {
      const lv = g.etap[0];
      if (lv !== lvl) {
        out += `<li class="lvl ${lvl ? '' : 'lvl-first'} ${lv === P().route.start[0] ? 'lvl-cur' : ''}"><span class="nd lvl-n">${lv}</span><div class="lvl-b"><p class="eyebrow">Уровень ${lv}${lv === P().route.start[0] ? ' · ваш' : ''}</p><h3>${LVL[lv]}</h3></div></li>`;
        lvl = lv;
      }
      const e = ETAPY[g.etap], first = g.items[0], lastP = g.items[g.items.length - 1];
      const pN = g.items.filter((p) => catOf(p) === 'P').length;
      if (lv !== P().route.start[0]) {
        out += `<li class="st st-future"><span class="nd sq">${g.etap}</span><div class="st-b st-static"><span class="st-t">Этап ${g.etap} · ${esc(e.name)}</span><span class="st-m"><span>${stepsWord(g.items.length)} · откроются на${NB}уровне ${LVL[lv]}</span><span class="res">Результат этапа: ${esc(e.res.charAt(0).toLowerCase() + e.res.slice(1))}</span></span></div></li>`;
        return;
      }
      const ok = ui.stage[g.etap] === 'ok';
      out += group('e' + g.etap, g.etap, `Этап ${g.etap} · ${esc(e.name)}`, `${ok ? '<span class="tag ok-t">Этап пройден</span>' : ''}<span>${first === lastP ? `Шаг ${first}` : `Шаги ${first}–${lastP}`} · личность ${pN}, бизнес ${g.items.length - pN}</span>${avgChip(g.items.filter((q) => state(q) === 'done').map((q) => lesScore(seq()[q - 1])))}<span class="res">Этап готов, когда: ${esc(e.res)}</span>`, g.items, ok ? 'stage-ok' : '', stageDone(g.etap));
    });
    return out;
  }

  /* Спидометр бизнеса: как в «Финансах» трекера (цели уровней в долларах, пример цифр) */
  const GOAL = { income: [36000, 120000, 1000000], rev: [120000, 500000, 5000000] };
  const FIN = {
    olga: { metric: 'income', perMonth: 450 },
    denis: { metric: 'income', perMonth: 1600 },
    marina: { metric: 'income', perMonth: 2300 },
    artem: { metric: 'rev', perMonth: 21500 },
    irina: { metric: 'rev', perMonth: 165000 },
  };
  const usd = (n) => '$' + Math.round(n).toLocaleString('ru-RU').replace(/\u00a0|\s/g, NB);
  const short = (n) => (n >= 1e6 ? `$${String(n / 1e6).replace('.', ',')}${NB}млн` : `$${Math.round(n / 1000)}${NB}тыс`);
  function dial(t) {
    const CX = 120, CY = 112, R = 92;
    const pt = (x, r = R) => { const q = Math.PI * (1 - x); return [CX + r * Math.cos(q), CY - r * Math.sin(q)]; };
    const arcD = (t0, t1) => { const [x0, y0] = pt(t0), [x1, y1] = pt(t1); return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
    let ticks = '';
    for (let i = 0; i <= 10; i++) { const [x0, y0] = pt(i / 10, R + 11), [x1, y1] = pt(i / 10, R + (i % 5 ? 15 : 19)); ticks += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"/>`; }
    const k = Math.max(0, Math.min(1, t));
    return `<svg viewBox="0 0 240 126" aria-hidden="true"><defs><linearGradient id="gF" gradientUnits="userSpaceOnUse" x1="28" y1="0" x2="212" y2="0"><stop offset="0" stop-color="#2f7bff"/><stop offset="1" stop-color="#7b61ff"/></linearGradient></defs>
      <path class="d-track" d="${arcD(0, 1)}"/>${k > 0.003 ? `<path class="d-fact" d="${arcD(0, k)}" stroke="url(#gF)"/>` : ''}<g class="d-ticks">${ticks}</g>
      <g class="d-needle" style="transform:rotate(${(-90 + 180 * k).toFixed(1)}deg)"><line x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - R + 14}"/><circle cx="${CX}" cy="${CY}" r="6"/><circle cx="${CX}" cy="${CY}" r="2.2"/></g></svg>`;
  }
  function bizCard() {
    const p = P(), f = FIN[p.id], lv = +p.route.start[0];
    const target = GOAL[f.metric][lv - 1], year = f.perMonth * 12, share = year / target;
    const what = f.metric === 'income' ? 'личный доход' : 'выручку компании';
    return `<section class="card sec biz"><p class="eyebrow">Ваш бизнес сейчас</p>
      <div class="biz-d">${dial(share)}<div class="biz-r"><b class="num">${usd(year)}</b><span>прогноз на${NB}год · ${Math.round(share * 100)}% цели</span></div></div>
      <dl class="biz-rows">
        <div><dt>Уровень</dt><dd>${LVL[lv]}</dd></div>
        <div><dt>Цель уровня за${NB}год</dt><dd class="num">${short(target)}</dd></div>
        <div><dt>Сейчас в${NB}среднем</dt><dd class="num">${usd(f.perMonth)} <span>в${NB}месяц</span></dd></div>
        <div><dt>Нужно для цели</dt><dd class="num">${usd(target / 12)} <span>в${NB}месяц</span></dd></div>
      </dl>
      <p class="biz-n">Считаем ${what}. Цифры из${NB}раздела «Финансы» трекера.</p>
      <button class="link biz-go" data-act="go" data-v="inc">Открыть «Финансы»${svg('arrow')}</button>
    </section>`;
  }

  function dialT(fact, plan, target, top) {
    const CX = 170, CY = 166, R = 136;
    const pt = (t, r = R) => { const q = Math.PI * (1 - t); return [CX + r * Math.cos(q), CY - r * Math.sin(q)]; };
    const arc = (t0, t1) => { const [x0, y0] = pt(t0), [x1, y1] = pt(t1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
    const cl = (x) => Math.max(0, Math.min(1, x)), fT = cl(fact / target), pT = cl(plan / target);
    let ticks = '';
    for (let i = 0; i <= 20; i++) { const big = i % 5 === 0; const [x0, y0] = pt(i / 20, R + 13), [x1, y1] = pt(i / 20, R + (big ? 22 : 18)); ticks += `<line class="tk-t" x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke-width="${big ? 1.6 : 1}"/>`; }
    const [lx, ly] = pt(0.5, R + 32);
    return `<svg viewBox="0 0 340 186" aria-hidden="true"><defs><linearGradient id="gTk" gradientUnits="userSpaceOnUse" x1="34" y1="0" x2="306" y2="0"><stop offset="0" stop-color="#2f7bff"/><stop offset="1" stop-color="#7b61ff"/></linearGradient></defs>
      <path class="tk-track" d="${arc(0, 1)}" fill="none" stroke-width="16" stroke-linecap="round"/>
      ${pT > fT ? `<path class="tk-plan" d="${arc(0, pT)}" fill="none" stroke-width="16" stroke-linecap="round"/>` : ''}
      ${fT > 0.002 ? `<path d="${arc(0, fT)}" fill="none" stroke="url(#gTk)" stroke-width="16" stroke-linecap="round"/>` : ''}
      ${ticks}<text x="${lx}" y="${ly + 4}" text-anchor="middle">50%</text><text x="8" y="184">0</text><text x="332" y="184" text-anchor="end">${top}</text>
      <g class="tk-n" style="transform:rotate(${(-90 + 180 * pT).toFixed(2)}deg)"><line x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - R + 16}"/><circle cx="${CX}" cy="${CY}" r="8"/><circle cx="${CX}" cy="${CY}" r="3"/></g></svg>`;
  }
  function bizMini() {
    const p = P(), fm = FIN[p.id], lv = +p.route.start[0];
    const target = GOAL[fm.metric][lv - 1], plan = fm.perMonth * 12, fact = fm.perMonth * 10, share = plan / target;
    const ladder = [1, 2, 3].map((n) => { const fill = n < lv ? 1 : n === lv ? Math.min(1, fact / target) : 0; return `<span class="rg ${n === lv ? 'rg-on' : ''}"><i><u style="width:${(fill * 100).toFixed(1)}%"></u></i><b>${LVL[n]}</b><em>${short(GOAL[fm.metric][n - 1])}</em></span>`; }).join('');
    return `<button class="biz-mini" data-act="go" data-v="inc" aria-label="Ваш бизнес: уровень ${LVL[lv]}, открыть «Финансы»"><span class="bm-go">${svg('arrow')}</span><span class="bm-d">${dialT(fact, plan, target, short(target))}</span><span class="bm-t"><b class="num">${usd(plan)}</b><span>прогноз на${NB}год · ${Math.round(share * 100)}% цели уровня</span></span><span class="bm-l">${ladder}</span></button>`;
  }

  /* «Знакомьтесь»: случайный фриман с «Чем могу помочь», как на дашборде Альянса (вымышленные люди) */
  const FREEMEN = [
    { n: 'Анна Соколова', c: 'Москва', lv: 'Бунтарь', help: 'Соберу воронку в Telegram-боте и настрою рассылку', look: 'Ищу маркетолога для запуска курса' },
    { n: 'Дмитрий Орлов', c: 'Лиссабон', lv: 'Мечтатель', help: 'Помогу посчитать юнит-экономику и цену продукта', look: 'Ищу партнёра на продажи в Европе' },
    { n: 'Елена Кравец', c: 'Алматы', lv: 'Бунтарь', help: 'Сниму и смонтирую Reels для эксперта', look: 'Ищу экспертов для совместного эфира' },
    { n: 'Павел Левин', c: 'Санкт-Петербург', lv: 'Архитектор', help: 'Разберу структуру отдела продаж и скрипты', look: 'Ищу сильного РОПа в команду' },
    { n: 'Мария Белова', c: 'Дубай', lv: 'Бунтарь', help: 'Упакую оффер и лендинг под запуск', look: 'Ищу таргетолога с кейсами' },
    { n: 'Сергей Тихонов', c: 'Казань', lv: 'Мечтатель', help: 'Подскажу, как оформить ИП и не переплатить налоги', look: 'Ищу клиентов на бухгалтерию' },
  ];
  ui.fm = Math.floor(Math.random() * FREEMEN.length);
  function helpCard() {
    const m = FREEMEN[ui.fm % FREEMEN.length];
    return `<section class="card sec hc"><p class="eyebrow">Знакомьтесь: фриманы на${NB}связи</p>
      <div class="hc-p"><span class="hc-a">${esc(m.n[0])}</span><div><b>${esc(m.n)}</b><span>${esc(m.c)} · ${esc(m.lv)}</span></div></div>
      <div class="hc-b ok"><em>Чем могу помочь</em><p>${esc(m.help)}</p></div>
      <div class="hc-b"><em>Кого ищу</em><p>${esc(m.look)}</p></div>
      <div class="hc-f"><button class="btn sm" data-act="hcwrite">${svg('msg')}Написать</button><button class="btn soft sm" data-act="hcnext">Другой фриман</button></div>${ui.hclock && ui.access !== 'club' ? `<div class="hc-lock">${svg('lock')}<p>Общаться с${NB}фриманами доступно членам Альянса</p><button class="btn sm" data-act="buy">Повысить доступ</button></div>` : ''}
      ${ui.mefilled ? '' : `<div class="hc-me">${svg('user')}<p>Вы не${NB}показываетесь другим фриманам: в${NB}профиле не${NB}заполнено «Чем могу помочь» и${NB}«Кого ищу»</p><button class="btn soft sm" data-act="hcprofile">Заполнить профиль</button></div>`}
    </section>`;
  }

  function aside() {
    return `<aside class="col">
      <section class="card sec rules"><p class="eyebrow">Как открываются шаги</p>
        <ol>
          <li><b>Шаги 1–5 открыты сразу</b><span>Смотрите в${NB}любом порядке. В${NB}каждом есть задание.</span></li>
          <li><b>Шаг 6</b><span>Откроется, когда сданы задания 1–5 и${NB}готова подготовка к${NB}росту.</span></li>
          <li><b>Шаг 11</b><span>Откроется со${NB}стартовым доступом после установочной сессии.</span></li>
          <li><b>Дальше по${NB}одному</b><span>Сдали задание, открылся следующий шаг.</span></li>
        </ol></section>
      ${helpCard()}
    </aside>`;
  }

  /* Переключатель «Маршрут / ПЭРЛ» и карта ПЭРЛ: уровни, этапы, задания личного роста, вызовы и челленджи */
  const PL_KEY = { 'Пешка': 'pawn', 'Раб': 'slave', 'Бунтарь': 'rebel', 'Мечтатель': 'dreamer' };
  const PL_ORD = ['pawn', 'slave', 'rebel', 'dreamer'];
  const myPl = () => PL_KEY[P().pearl] || 'pawn';
  const curPl = () => ui.plvl || myPl();
  const tabs = () => `<div class="vtabs" role="tablist" aria-label="Что показать">
      <button role="tab" class="vt${ui.tab === 'route' ? ' on' : ''}" aria-selected="${ui.tab === 'route'}" data-act="tab" data-v="route">${svg('route')}Бизнес</button>
      <button role="tab" class="vt${ui.tab === 'pearl' ? ' on' : ''}" aria-selected="${ui.tab === 'pearl'}" data-act="tab" data-v="pearl">${svg('flag')}Личность</button>
    </div>`;
  const cpKind = (t) => /^Челлендж/.test(t) ? 'Челлендж' : /^Вызов/.test(t) ? 'Вызов' : /^Тест-драйв/.test(t) ? 'Тест-драйв' : '';
  const plKey = (lv, i, j, x) => `${lv}:${i}:${j}:${x}`;
  function plStats(lv) {
    const L = window.PEARL[lv]; let req = 0, reqD = 0, tk = 0, tkD = 0, bn = 0, bnD = 0, ph = 0;
    L.st.forEach((st, i) => {
      st.cp.forEach((c, x) => { const d = ui.pdone.has(plKey(lv, i, 'c', x)); if (c[1]) { req++; if (d) reqD++; } else { bn++; if (d) bnD++; } if (d) ph += c[2]; });
      st.sub.forEach((sb, j) => sb.tk.forEach((t, x) => { const d = ui.pdone.has(plKey(lv, i, j, x)); tk++; if (d) { tkD++; ph += 100; } }));
    });
    return { req, reqD, tk, tkD, bn, bnD, ph };
  }
  function pearlView() {
    const lv = curPl(), L = window.PEARL[lv], m = plStats(lv), n = PL_ORD.indexOf(lv) + 1;
    const met = (lab, v, d, hot) => `<div class="pm${hot ? ' hot' : ''}"><span>${lab}</span><b>${v}</b>${d >= 0 ? `<i><u style="width:${d}%"></u></i>` : ''}</div>`;
    const pc = (a, b) => (b ? Math.round((a / b) * 100) : 0);
    const row = (key, t, tags, ph) => { const d = ui.pdone.has(key);
      return `<li><button class="pr${d ? ' done' : ''}" data-act="pdo" data-v="${key}" aria-pressed="${d}"><span class="pr-n">${d ? svg('check') : ''}</span><span class="pr-t">${esc(t)}</span><span class="pr-g">${tags}<em class="ph">+${ph.toLocaleString('ru-RU').replace(/\u00a0|\s/g, NB)}</em></span></button></li>`; };
    const stages = L.st.map((st, i) => `<section class="card pst">
        <p class="eyebrow">Этап ${i + 1}</p><h3>${esc(st.t)}</h3>
        <div class="pst-g">
          <div><h4>Личный рост</h4>${st.sub.map((sb, j) => `<p class="psub">${esc(sb.t)}</p><ul class="pl">${sb.tk.map((t, x) => row(plKey(lv, i, j, x), t, '', 100)).join('')}</ul>`).join('')}</div>
          <div><h4>Вызовы и чекпоинты</h4><ul class="pl">${st.cp.map((c, x) => { const k = cpKind(c[0]);
            const tags = (c[1] ? '<span class="tag club">Обязательный</span>' : '<span class="tag pers">Бонус</span>') + (k ? `<span class="tag kind">${k}</span>` : '') + (c[3] ? '<span class="tag warn">Командный</span>' : '');
            return row(plKey(lv, i, 'c', x), c[0], tags, c[2]); }).join('')}</ul></div>
        </div></section>`).join('');
    return `<section class="card phead">
        <p class="eyebrow">П.Э.Р.Л. · уровень ${n} из${NB}4</p>
        <h2>Путь: ${esc(L.t)}</h2>
        <p class="g-d">Задания формируют новый способ действовать. Чекпоинты подтверждают измеримый результат и${NB}открывают переход дальше.</p>
        <div class="plv" role="group" aria-label="Уровень">${PL_ORD.map((k) => `<button class="chip${k === lv ? ' on' : ''}" data-act="plvl" data-v="${k}" aria-pressed="${k === lv}">${esc(window.PEARL[k].t)}${k === myPl() ? '<small>ваш</small>' : ''}</button>`).join('')}</div>
        <div class="pms">${met('Обязательные', `${m.reqD} из${NB}${m.req}`, pc(m.reqD, m.req), true)}${met('Задания', `${m.tkD} из${NB}${m.tk}`, pc(m.tkD, m.tk))}${met('Бонусные', `${m.bnD} из${NB}${m.bn}`, pc(m.bnD, m.bn))}${met('Фениксов получено', m.ph.toLocaleString('ru-RU').replace(/\u00a0|\s/g, NB), -1)}</div>
      </section>
      ${stages}
      <section class="card pexam"><p class="eyebrow">Переход на следующий уровень</p><p>Когда все обязательные чекпоинты закрыты, экзамен уровня: босс «${esc(L.boss)}»${L.ritual ? `, обряд «${esc(L.ritual)}»` : ''}.</p></section>`;
  }

  const app = document.getElementById('app');
  function render() {
    app.innerHTML = `${demoBar()}<div class="kab">${side()}<div class="main">${topBar()}
      <main class="content">
        ${tabs()}
        ${ui.tab === 'pearl' ? `<div class="pv">${pearlView()}</div>` : `${guide()}
        <div class="split">
          <section class="card path-c" aria-label="Маршрут"><ol class="path">
            ${prepBlock()}
            ${levelGroups()}
          </ol></section>
          ${aside()}
        </div>`}
      </main></div></div>${mnav()}${ui.toast ? `<div class="toast" role="status">${esc(ui.toast)}</div>` : ''}`;
  }

  let tt;
  function toast(t) { ui.toast = t; clearTimeout(tt); tt = setTimeout(() => { ui.toast = null; const el = app.querySelector('.toast'); if (el) el.remove(); }, 3200); }
  function scrollTo(id) { requestAnimationFrame(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }); }); }
  const custom = () => { ui.sit = 'custom'; };
  const toggle = (id, defOpen) => { if (defOpen) { ui.shut.has(id) ? ui.shut.delete(id) : ui.shut.add(id); ui.open.delete(id); } else { ui.open.has(id) ? ui.open.delete(id) : ui.open.add(id); ui.shut.delete(id); } };

  app.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || b.tagName === 'SELECT' || b.tagName === 'TEXTAREA') return;
    const a = b.dataset.act, v = b.dataset.v;
    if (a === 'tab') { ui.tab = v; render(); window.scrollTo(0, 0); return; }
    if (a === 'plvl') { ui.plvl = v; render(); return; }
    if (a === 'pdo') { ui.pdone.has(v) ? ui.pdone.delete(v) : ui.pdone.add(v); render(); return; }
    if (a === 'pid') { ui.plvl = null; ui.pid = v; setSit(SIT[ui.sit] ? ui.sit : 'fresh'); }
    else if (a === 'row') {
      const pos = +v, k = seq()[pos - 1], s = state(pos);
      if (actionable(s)) { ui.openL = k; ui.answer = ''; render(); scrollTo('l' + pos); return; }
      if (s === 'done') toast('Задание этого шага уже сдано');
      else if (s === 'gate') { toast('Сначала задания 1–5 и подготовка'); scrollTo('gate6'); }
      else if (s === 'paid') toast('Открывается со стартовым доступом');
      else if (s === 'setup') { toast('Сначала установочная сессия'); scrollTo('wall'); }
      else toast(`Откроется после шага ${pos - 1}`);
      return;
    }
    else if (a === 'grp') { const el = b.getAttribute('aria-expanded') === 'true'; if (el) { ui.open.delete(v); ui.shut.add(v); } else { ui.shut.delete(v); ui.open.add(v); } }
    else if (a === 'fold') { ui.open.has(v) ? ui.open.delete(v) : ui.open.add(v); }
    else if (a === 'watch') { ui.watched.add(ui.openL); custom(); }
    else if (a === 'submit') {
      const k = ui.openL; const was6 = gate6();
      ui.done.add(k); ui.skip.delete(k); ui.watched.add(k); ui.answer = ''; custom();
      const c = curPos(); ui.openL = c ? seq()[c - 1] : null; ui.flash = ui.openL;
      if (!was6 && gate6()) toast('Шаг 6 открыт');
      else if (seq().indexOf(k) < 5 && firstFiveDone() === 5 && !prepDone()) toast('Задания 1–5 сданы. Осталась подготовка');
      else toast(hwOf(k) === null ? 'Инсайт сохранён' : 'Задание сдано');
    }
    else if (a === 'goprep') { ui.shut.delete('prep'); ui.open.add('prep'); render(); scrollTo('sprep'); return; }
    else if (a === 'gocur') {
      const c = curPos() || (ten().slice(0, 5).findIndex((x) => !ui.done.has(x.k)) + 1);
      if (c) { ui.openL = seq()[c - 1]; render(); scrollTo('l' + c); return; }
    }
    else if (a === 'gowall') { scrollTo('wall'); return; }
    else if (a === 'stsend') { ui.stage[v] = 'sent'; custom(); toast(`Заявка по этапу ${v} отправлена куратору`); }
    else if (a === 'stok') { ui.stage[v] = 'ok'; custom(); toast(`Этап ${v} пройден`); }
    else if (a === 'hcprofile') { ui.mefilled = true; toast('Здесь откроется профиль на полях «Чем могу помочь» и «Кого ищу»'); render(); return; }
    else if (a === 'hcnext') { ui.fm++; render(); return; }
    else if (a === 'hcwrite' && ui.access !== 'club') { ui.hclock = true; render(); return; }
    else if (a === 'hcwrite') { toast(`Здесь откроется чат: ${FREEMEN[ui.fm % FREEMEN.length].n}`); render(); return; }
    else if (a === 'go' && v === 'life') { ui.open.has('life') ? ui.open.delete('life') : ui.open.add('life'); render(); return; }
    else if (a === 'lifego') { L0().calc = true; render(); lifeCount(); return; }
    else if (a === 'lifesave') {
      const was6 = gate6();
      if (lifeStars() < 4) { toast('Сначала рассчитайте стоимость жизни'); return; }
      ui.prep.life = true; ui.open.delete('life'); custom(); toast('Стоимость жизни посчитана');
      if (!was6 && gate6()) toast('Подготовка пройдена. Шаг 6 открыт');
    }
    else if (a === 'go') { const it = PREP.flatMap((s) => s.items).find((i) => i.k === v); toast(`Здесь откроется: ${it.go}`); render(); return; }
    else if (a === 'auto') {
      const was6 = gate6();
      const it = PREP.flatMap((s) => s.items).find((i) => itemOn(i) && !ui.prep[i.k]);
      if (!it) { toast('Подготовка уже засчитана'); return; }
      ui.prep[it.k] = true; if (it.n) ui.cnt[it.k] = it.n; ui.open.add('prep');
      toast(`Засчитано: ${it.t}`);
      custom();
      const c = curPos(); if (c && prepDone()) ui.openL = seq()[c - 1];
      if (!was6 && gate6()) toast('Подготовка пройдена. Шаг 6 открыт');
    }
    else if (a === 'buy') { ui.access = 'starter'; custom(); toast('Стартовый доступ открыт. Запишитесь на установочную'); render(); scrollTo(doneTotal() >= 10 ? 'wall' : 'sprep'); return; }
    else if (a === 'book') { ui.setup = 'booked'; custom(); toast(`Вы записаны на ${DAY[P().seg]}`); }
    else if (a === 'attend') { ui.setup = 'yes'; custom(); const c = curPos(); if (c) ui.openL = seq()[c - 1]; toast('Установочная пройдена'); }
    render();
  });
  app.addEventListener('change', (e) => {
    const a = e.target.dataset.act;
    if (e.target.dataset.lf) { L0()[e.target.dataset.lf] = e.target.value; if (ui.life.calc) { const o = app.querySelector('#lc-out'); if (o) o.innerHTML = lifeResult(); } return; }
    if (a === 'sit') { setSit(e.target.value); render(); }
    if (a === 'access') { ui.access = e.target.value; custom(); const c = curPos(); if (c) ui.openL = seq()[c - 1]; render(); }
  });
  app.addEventListener('input', (e) => {
    if (e.target.dataset.lf) { L0()[e.target.dataset.lf] = e.target.value; if (ui.life.calc && e.target.dataset.lf !== 'note') { const o = app.querySelector('#lc-out'); if (o) o.innerHTML = lifeResult(); } return; }
    if (e.target.dataset.sf) { const [et, k] = e.target.dataset.sf.split(':'); (ui.sf[et] = ui.sf[et] || {})[k] = e.target.value; return; }
    if (e.target.dataset.act !== 'answer') return;
    ui.answer = e.target.value;
    const btn = app.querySelector('[data-act="submit"]');
    if (btn) btn.disabled = ui.answer.trim().length < 3;
  });

  const q = new URLSearchParams(location.search);
  if (q.get('p') && PROFILES.some((p) => p.id === q.get('p'))) ui.pid = q.get('p');
  setSit(SIT[q.get('s')] ? q.get('s') : 'fresh');
  render();
})();
