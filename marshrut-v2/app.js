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
      { k: 'inc', t: 'Личный средний доход за 3 месяца' },
      { k: 'biz', t: 'Оборот, выручка и прибыль бизнеса за 3 месяца', alt: 'Нет бизнеса: отметка «Стартап», точка ноль' },
    ] },
    { k: 'tr', t: 'Трекер Фримана', where: 'Трекер Фримана', items: [
      { k: 'wish', t: '10 желаний: категория, горизонт 1, 5 или 10 лет и цена', n: 10 },
      { k: 'focus', t: 'Выбран фокус' },
      { k: 'fday', t: 'Фокус дня выполнен хотя бы раз' },
      { k: 'zv', t: 'Зверёк' },
      { k: 'wheel', t: 'Колесо баланса' },
      { k: 'tasks', t: '5 задач', n: 5 },
      { k: 'habit', t: 'Одна привычка' },
    ] },
    { k: 'ch', t: 'Чат Альянса', where: 'Telegram', items: [
      { k: 'chat', t: 'Вступить в чат Альянса в Telegram' },
      { k: 'hello', t: 'Поздороваться и рассказать о себе в чате', club: true },
    ] },
    { k: 'pr', t: 'Профиль', where: 'Мой профиль', items: [
      { k: 'prof', t: 'Ниши, опыт, город и чем вы можете быть полезны' },
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

  const ui = { pid: 'olga', sit: 'fresh', access: 'free', watched: new Set(), done: new Set(), skip: new Set(), prep: {}, cnt: {}, setup: 'no', openL: null, open: new Set(), shut: new Set(), answer: '', toast: null, flash: null };
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
    const full = () => { ALL_ITEMS.forEach((i) => (ui.prep[i] = true)); ui.cnt = { wish: 10, tasks: 5 }; };
    Object.assign(ui, { sit: k, watched: new Set(), done: new Set(), skip: new Set(), prep: {}, cnt: { wish: 0, tasks: 0 }, setup: 'no', access: 'free', answer: '', open: new Set(), shut: new Set() });
    const doneN = (n) => all.slice(0, n).forEach((x) => { ui.done.add(x); ui.watched.add(x); });
    if (k === 'some') { [t[0], t[2], t[3]].forEach((x) => ui.watched.add(x)); ui.done.add(t[0]); ui.done.add(t[2]); ui.prep.inc = true; ui.cnt = { wish: 3, tasks: 1 }; }
    if (k === 'gate6') { doneN(5); Object.assign(ui.prep, { inc: true, biz: true, focus: true, zv: true, wheel: true, habit: true, chat: true }); ui.cnt = { wish: 6, tasks: 3 }; }
    if (k === 'at7') { doneN(6); full(); }
    if (k === 'wall') { doneN(10); full(); }
    if (k === 'bought') { doneN(10); full(); ui.access = 'starter'; }
    if (k === 'at30') {
      const n = Math.min(29, all.length - 2);
      doneN(n); full(); ui.access = 'starter'; ui.setup = 'yes';
      const s = all[n - 6]; ui.done.delete(s); ui.skip.add(s);
    }
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
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
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
        <p class="demo-note">Участники вымышленные, ответы анкет составлены по образцу реальных. Пункты подготовки отмечаются кликом.</p>
      </div></details>`;
  }

  /* Одно следующее действие: его говорит Фрими */
  function nextAction() {
    const p = P(), c = curPos();
    const free5 = 5 - firstFiveDone();
    if (!prepDone()) return { img: 'focus-flag', eb: firstFiveDone() ? `Осталось подготовиться` : 'С чего начать', t: 'Начните с подготовки к росту', d: `${prepDoneN()} из${NB}4 разделов готово. Без подготовки не${NB}откроется шаг 6. Шаги 1–5 можно смотреть уже сейчас, в${NB}любом порядке.`, cta: 'Продолжить подготовку', act: 'goprep' };
    if (free5 > 0) return { img: 'idea', eb: 'Подготовка готова', t: `Сдайте задания шагов 1–5`, d: `Осталось ${stepsWord(free5)}. После них откроется шаг 6.`, cta: 'Открыть шаг', act: 'gocur' };
    if (c) return { img: c <= 10 ? 'idea' : 'focus-flag', eb: `Шаг ${c} из${NB}${seq().length}`, t: L[seq()[c - 1]].t, d: c <= 10 && ten()[c - 1].kind === 'bar' ? ten()[c - 1].why + '.' : `Посмотрите урок и${NB}сдайте задание, затем откроется следующий шаг.`, cta: ui.watched.has(seq()[c - 1]) ? 'Сдать задание' : 'Смотреть урок', act: 'gocur' };
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
      </div>
      <div class="g-foot">
        <div class="mini"><span class="num">${done} из${NB}${total}</span><i><u style="width:${(done / total) * 100}%"></u></i><span>шагов пройдено</span></div>
        <details class="why"><summary>Почему такой маршрут${svg('chev', 'chev')}</summary>
          <div class="why-b">
            <p>Собран по вашей анкете: ${SEG[p.seg].toLowerCase()}, шаг бизнеса ${p.step}, уровень ПЭРЛ «${esc(p.pearl)}». Шаг 1 у${NB}всех один, шаги 2–5 закрывают то, что мешает, шаги 6–10 начинают этап ${p.route.start} «${esc(ETAPY[p.route.start].name)}».</p>
            <ul>${bars.map((c) => `<li class="${c === p.main ? 'main' : ''}">${c === p.main ? '<b>Главное</b>' : ''}${esc(p.bar_labels[c])}</li>`).join('')}</ul>
          </div>
        </details>
      </div>
    </section>`;
  }

  /* Строка и карточка шага */
  const libOf = (k) => (L[k].n ? `Урок №${L[k].n}` : 'Ролик YouTube');
  const WHY = (x) => x.kind === 'bar' ? `<span class="tag pers">${esc(x.why)}</span>` : x.kind === 'base' ? `<span class="tag club">${esc(x.why.split(':')[0])}</span>` : `<span class="tag etap">${esc(x.why)}</span>`;
  function step(pos) {
    const k = seq()[pos - 1];
    const s = state(pos);
    const tag = (pos <= 10 ? WHY(ten()[pos - 1]) : '') + (s === 'skip' ? '<span class="tag warn">Пропущен</span>' : '');
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
      <button class="ls-b" data-act="row" data-v="${pos}" ${actionable(s) || s === 'done' ? '' : 'aria-disabled="true"'}><span class="ls-k">Шаг ${pos}</span><span class="ls-t">${esc(L[k].t)}</span><span class="ls-m"><span class="lib">${libOf(k)}</span>${tag}<span>${what}</span></span></button>
    </li>`;
  }

  function nowCard(pos, k, s, tag) {
    const watched = s === 'watched' || s === 'skip';
    const step1 = `<li class="${watched ? 'ok' : 'todo'}"><span class="chk-n">${watched ? svg('check') : '1'}</span>
        <div class="chk-b"><b>Посмотреть урок</b><span>${watched ? 'Видео просмотрено' : libOf(k)}</span></div>
        ${watched ? '<button class="btn soft sm" data-act="watch">Пересмотреть</button>' : `<button class="btn sm" data-act="watch">${svg('play', 'ic-f')}Смотреть</button>`}</li>`;
    const step2 = `<li class="${watched ? 'todo' : 'wait'}"><span class="chk-n">2</span>
        <div class="chk-b"><b>Задание</b><span>${esc(DEF_TASK)}</span>
        ${watched ? `<label class="ans"><span class="ans-l">Ваш результат</span><textarea data-act="answer" rows="3" placeholder="Что сделали и что поняли">${esc(ui.answer)}</textarea></label>
          <div class="ans-a"><button class="btn sm" data-act="submit" ${ui.answer.trim().length < 3 ? 'disabled' : ''}>Сдать задание</button></div>` : '<span class="wait-n">Откроется после просмотра</span>'}
        </div></li>`;
    const eyebrow = pos <= 5 ? `Шаг ${pos} · можно в${NB}любом порядке` : s === 'skip' ? `Шаг ${pos} · пропущен` : `Сейчас · шаг ${pos}`;
    return `<li class="ls is-now ${pos <= 10 && ten()[pos - 1].kind === 'bar' ? 'pers' : ''} ${ui.flash === k ? 'enter' : ''}" id="l${pos}">
      <span class="nd"><span class="num">${pos}</span></span>
      <div class="now"><div class="now-h"><p class="eyebrow">${eyebrow}</p><h3>${esc(L[k].t)}</h3><div class="ls-m"><span class="lib">${libOf(k)}</span>${tag}</div></div>
      <ol class="chk">${step1}${step2}</ol></div>
    </li>`;
  }

  /* Группа шагов со сворачиванием: пройденные прячутся, виден только предыдущий; пропущенные видны всегда */
  function group(gid, nd, title, meta, positions, extraCls) {
    const ld = lastDone(), c = curPos();
    const allDone = positions.every((p) => state(p) === 'done');
    const hasCur = positions.some((p) => p === c || actionable(state(p)));
    const defOpen = positions.some((p) => actionable(state(p)));
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
    let locked = 0;
    const moreOpen = ui.open.has('more-' + gid);
    const visible = positions.filter((p) => !hidden.includes(p));
    const lockedAll = visible.filter((p) => ['next', 'gate', 'paid', 'setup'].includes(state(p)));
    visible.forEach((p) => {
      const isLocked = lockedAll.includes(p);
      if (isLocked) { locked++; if (locked > 3 && !moreOpen) return; }
      out += step(p);
    });
    if (lockedAll.length > 3 && !moreOpen) out += `<li class="ls fold"><span class="nd nd-dot">${svg('lock')}</span><button class="fold-b" data-act="fold" data-v="more-${gid}">Ещё ${stepsWord(lockedAll.length - 3)} · показать</button></li>`;
    return out;
  }

  /* Подготовка к росту: первая в маршруте, сворачивается */
  function prepBlock() {
    const n = prepDoneN(), all = prepDone();
    const open = ui.open.has('prep') || (!all && !ui.shut.has('prep'));
    let out = `<li class="st ${all ? 'is-passed' : 'is-cur'}" id="sprep"><span class="nd sq">${all ? svg('check') : svg('user')}</span>
      <button class="st-b" data-act="grp" data-v="prep" aria-expanded="${open}"><span class="st-t">Подготовка к росту</span><span class="st-m"><span>${all ? 'Готово' : `${n} из${NB}4 · нужна для шага 6`}</span></span>${svg('chev', 'chev')}</button></li>`;
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
        return `<li class="${on ? 'ok' : ''}"><button class="pi" data-act="pi" data-v="${i.k}" aria-pressed="${on}"><span class="pi-c">${on ? svg('check') : ''}</span><span class="pi-t">${esc(i.t)}${sub ? `<em>${esc(sub)}</em>` : ''}</span></button></li>`;
      }).join('')}</ul>` : '';
      return `<div class="ps ${ok ? 'ok' : ''}"><button class="ps-h" data-act="grp" data-v="ps-${s.k}" aria-expanded="${sOpen}"><b><span class="ps-n">${ok ? svg('check') : si + 1}</span>${esc(s.t)}</b><span>${ok ? 'Готово' : `${doneI} из${NB}${items.length}`}${sOpen ? ` · ${esc(s.where)}` : ''}${svg('chev', 'chev')}</span></button>${rows}</div>`;
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

  function etapGroups() {
    const groups = [];
    rest().forEach((x, i) => {
      const last = groups[groups.length - 1];
      if (!last || last.etap !== x.etap) groups.push({ etap: x.etap, items: [] });
      groups[groups.length - 1].items.push(11 + i);
    });
    return groups.map((g) => {
      const e = ETAPY[g.etap];
      const label = g.etap === 'start' ? 'Старт' : `Этап ${g.etap} · ${esc(e.name)}`;
      const first = g.items[0], lastP = g.items[g.items.length - 1];
      return group('e' + g.etap, g.etap === 'start' ? 'С' : g.etap, label, `<span>${first === lastP ? `Шаг ${first}` : `Шаги ${first}–${lastP}`}</span><span class="res">Этап готов, когда: ${esc(e.res)}</span>`, g.items);
    }).join('');
  }

  function aside() {
    return `<aside class="col">
      <section class="card sec rules"><p class="eyebrow">Как открываются шаги</p>
        <ol>
          <li><b>Шаги 1–5</b><span>сразу, в${NB}любом порядке. В${NB}каждом есть задание.</span></li>
          <li><b>Шаг 6</b><span>когда сданы задания 1–5 и${NB}пройдена подготовка.</span></li>
          <li><b>Шаг 11</b><span>со${NB}стартовым доступом и после установочной.</span></li>
          <li><b>Дальше</b><span>по${NB}очереди, после задания предыдущего шага.</span></li>
        </ol></section>
    </aside>`;
  }

  const app = document.getElementById('app');
  function render() {
    app.innerHTML = `${demoBar()}<div class="kab">${side()}<div class="main">${topBar()}
      <main class="content">
        ${guide()}
        <div class="split">
          <section class="card path-c" aria-label="Маршрут"><ol class="path">
            ${prepBlock()}
            ${group('g15', '1–5', 'Знакомство: шаги 1–5', '<span>Можно смотреть сразу и в любом порядке</span>', [1, 2, 3, 4, 5])}
            ${gate6Card()}
            ${group('g610', '6–10', 'Начало пути: шаги 6–10', `<span>По очереди, начало этапа ${P().route.start}</span>`, [6, 7, 8, 9, 10])}
            ${wall11()}
            ${paid() ? etapGroups() : ''}
          </ol></section>
          ${aside()}
        </div>
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
    if (a === 'pid') { ui.pid = v; setSit(SIT[ui.sit] ? ui.sit : 'fresh'); }
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
      else toast('Задание сдано');
    }
    else if (a === 'goprep') { ui.shut.delete('prep'); ui.open.add('prep'); render(); scrollTo('sprep'); return; }
    else if (a === 'gocur') {
      const c = curPos() || (ten().slice(0, 5).findIndex((x) => !ui.done.has(x.k)) + 1);
      if (c) { ui.openL = seq()[c - 1]; render(); scrollTo('l' + c); return; }
    }
    else if (a === 'gowall') { scrollTo('wall'); return; }
    else if (a === 'pi') {
      const was6 = gate6();
      ui.prep[v] = !ui.prep[v];
      const it = PREP.flatMap((s) => s.items).find((i) => i.k === v);
      if (it.n) ui.cnt[v] = ui.prep[v] ? it.n : Math.max(0, it.n - 2);
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
    if (a === 'sit') { setSit(e.target.value); render(); }
    if (a === 'access') { ui.access = e.target.value; custom(); const c = curPos(); if (c) ui.openL = seq()[c - 1]; render(); }
  });
  app.addEventListener('input', (e) => {
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
