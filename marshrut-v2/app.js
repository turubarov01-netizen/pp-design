(function () {
  'use strict';
  /* Прототип маршрутной карты v2 (07.11.2026): десятка по ответам онбординга,
     уроки 1–5 сразу и в любом порядке, 6-й после заданий 1–5 и «Подготовки к росту»,
     11-й после установочной. Данные: data.js из build_proto2.py */
  const L = window.LESSONS;
  const PROFILES = window.PROFILES;
  const NB = ' ';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
  const lessonsWord = (n) => `${n}${NB}${plural(n, 'урок', 'урока', 'уроков')}`;
  const nb = (s) => s.replace(/ (в|и|с|к|о|у|а|на|по|до|за|из|от|не|без|для|при|или) /g, ` $1${NB}`);

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
    some: 'Посмотрел часть уроков 1–5',
    gate6: 'Задания 1–5 сданы, подготовка не закончена',
    at7: 'Подготовка готова, идёт урок 7',
    wall: '10 бесплатных уроков пройдены',
    bought: 'Купил доступ после 10-го, установочной не было',
    going: 'Стартовый доступ, установочная пройдена',
  };

  const ui = { pid: 'olga', sit: 'fresh', access: 'free', watched: new Set(), done: new Set(), prep: {}, cnt: {}, setup: 'no', openL: null, openPrep: false, openEt: new Set(), answer: '', toast: null, flash: null };
  const P = () => PROFILES.find((p) => p.id === ui.pid);
  const ten = () => P().route.ten;
  const rest = () => P().route.rest;
  const seq = () => ten().map((x) => x.k).concat(rest().map((x) => x.k));

  /* Состояние подготовки */
  const itemOn = (i) => !(i.club && ui.access !== 'club');
  const secDone = (s) => s.items.filter(itemOn).every((i) => ui.prep[i.k]);
  const prepDoneN = () => PREP.filter(secDone).length;
  const prepDone = () => prepDoneN() === PREP.length;
  const firstFiveDone = () => ten().slice(0, 5).filter((x) => ui.done.has(x.k)).length;
  const gate6 = () => firstFiveDone() === 5 && prepDone();
  const paid = () => ui.access !== 'free';

  /* Состояние урока по месту в маршруте (1-based) */
  function state(pos) {
    const k = seq()[pos - 1];
    if (ui.done.has(k)) return 'done';
    if (pos <= 5) return ui.watched.has(k) ? 'watched' : 'open';
    if (!gate6()) return 'gate';
    if (pos > 10 && !paid()) return 'paid';
    if (pos > 10 && ui.setup !== 'yes') return 'setup';
    const prev = seq()[pos - 2];
    if (pos > 6 && !ui.done.has(prev)) return 'next';
    return ui.watched.has(k) ? 'watched' : 'open';
  }
  const actionable = (s) => s === 'open' || s === 'watched';
  function defaultOpen() {
    const s = seq();
    for (let i = 1; i <= s.length; i++) if (actionable(state(i))) return s[i - 1];
    return null;
  }

  function setSit(k) {
    const t = ten().map((x) => x.k), r = rest().map((x) => x.k);
    const full = () => { ALL_ITEMS.forEach((i) => (ui.prep[i] = true)); ui.cnt = { wish: 10, tasks: 5 }; };
    Object.assign(ui, { sit: k, watched: new Set(), done: new Set(), prep: {}, cnt: { wish: 0, tasks: 0 }, setup: 'no', access: 'free', answer: '', openEt: new Set() });
    const doneN = (n, extra) => { t.concat(r).slice(0, n).forEach((x) => { ui.done.add(x); ui.watched.add(x); }); (extra || []).forEach((x) => ui.watched.add(x)); };
    if (k === 'some') { doneN(0); [t[0], t[2], t[3]].forEach((x) => ui.watched.add(x)); ui.done.add(t[0]); ui.prep.inc = true; ui.cnt = { wish: 3, tasks: 1 }; }
    if (k === 'gate6') { doneN(5); Object.assign(ui.prep, { inc: true, biz: true, focus: true, zv: true, wheel: true, habit: true, chat: true }); ui.cnt = { wish: 6, tasks: 3 }; }
    if (k === 'at7') { doneN(6); full(); }
    if (k === 'wall') { doneN(10); full(); }
    if (k === 'bought') { doneN(10); full(); ui.access = 'starter'; }
    if (k === 'going') { doneN(12); full(); ui.access = 'starter'; ui.setup = 'yes'; }
    ui.openPrep = k === 'gate6' || k === 'some';
    ui.openL = defaultOpen();
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
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
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
        <p class="demo-note">Участники вымышленные, ответы анкет составлены по образцу реальных. Десятку собирает правило: фундамент, затем уроки под отмеченные барьеры, затем начало этапа по шагу бизнеса. Пункты подготовки можно отмечать кликом.</p>
      </div></details>`;
  }

  /* Карточка «По анкете онбординга» */
  function profileCard() {
    const p = P(), r = p.route;
    const et = ETAPY[r.start];
    const bars = p.bars.slice().sort((a, b) => (a === p.main ? -1 : b === p.main ? 1 : 0));
    const done = seq().filter((k) => ui.done.has(k)).length;
    const total = seq().length;
    return `<section class="card anketa">
      <div class="an-h">
        <p class="eyebrow">Маршрут собран по анкете онбординга</p>
        <h2>${esc(p.name)}, ваш маршрут начинается с${NB}этапа ${r.start} «${esc(et.name)}»</h2>
        <p class="an-sub">${esc(nb(SEG[p.seg] + '. ' + p.goal + '.'))} Первые 10${NB}уроков подобраны под ваши ответы, дальше уроки идут по этапам бизнеса.</p>
      </div>
      <dl class="an-rows">
        <div><dt>Ветка</dt><dd>${SEG[p.seg]}</dd></div>
        <div><dt>Шаг бизнеса, 0–15</dt><dd><span class="num">${p.step}</span></dd></div>
        <div><dt>Уровень ПЭРЛ</dt><dd>${esc(p.pearl)}</dd></div>
        <div><dt>Доход</dt><dd>${esc(p.inc).replace(/ /g, NB)}</dd></div>
      </dl>
      <div class="an-bars"><span class="an-l">Что мешает, по${NB}вашим словам</span>
        <ul>${bars.map((c) => `<li class="${c === p.main ? 'main' : ''}">${c === p.main ? '<b>Главное</b>' : ''}${esc(p.bar_labels[c])}</li>`).join('')}</ul>
      </div>
      <div class="mini"><span class="num">${done} из${NB}${total}</span><i><u style="width:${(done / total) * 100}%"></u></i><span>уроков пройдено</span></div>
    </section>`;
  }

  /* Строка и карточка урока */
  const libOf = (k) => (L[k].n ? `Урок №${L[k].n}` : 'Ролик YouTube');
  const WHY = (x) => x.kind === 'bar' ? `<span class="tag pers">${esc(x.why)}</span>` : x.kind === 'base' ? `<span class="tag club">${esc(x.why.split(':')[0])}</span>` : `<span class="tag etap">${esc(x.why)}</span>`;
  function lesson(pos) {
    const k = seq()[pos - 1];
    const s = state(pos);
    const meta10 = pos <= 10 ? ten()[pos - 1] : null;
    const tag = meta10 ? WHY(meta10) : '';
    if (ui.openL === k && actionable(s)) return nowCard(pos, k, s, tag);
    const node = s === 'done' ? svg('check') : ['gate', 'paid', 'setup'].includes(s) ? svg('lock') : `<span class="num">${pos}</span>`;
    const what = {
      done: 'Задание сдано',
      watched: 'Видео просмотрено, осталось задание',
      open: pos <= 5 ? 'Можно смотреть сейчас' : 'Открыт',
      gate: 'Откроется после заданий 1–5 и подготовки',
      paid: 'Со стартовым доступом',
      setup: 'Откроется после установочной сессии',
      next: `Откроется после урока ${pos - 1}`,
    }[s];
    const cls = s === 'done' ? 'is-done' : actionable(s) ? 'is-open' : s === 'next' ? 'is-next' : 'is-paid';
    return `<li class="ls ${cls}" id="l${pos}">
      <span class="nd">${node}</span>
      <button class="ls-b" data-act="row" data-v="${pos}" ${actionable(s) || s === 'done' ? '' : 'aria-disabled="true"'}><span class="ls-t">${esc(L[k].t)}</span><span class="ls-m"><span class="lib">${libOf(k)}</span>${tag}<span>${what}</span></span></button>
    </li>`;
  }

  function nowCard(pos, k, s, tag) {
    const watched = s === 'watched';
    const step1 = `<li class="${watched ? 'ok' : 'todo'}"><span class="chk-n">${watched ? svg('check') : '1'}</span>
        <div class="chk-b"><b>Посмотреть урок</b><span>${watched ? 'Видео просмотрено' : libOf(k)}</span></div>
        ${watched ? '<button class="btn soft sm" data-act="watch">Пересмотреть</button>' : `<button class="btn sm" data-act="watch">${svg('play', 'ic-f')}Смотреть</button>`}</li>`;
    const step2 = `<li class="${watched ? 'todo' : 'wait'}"><span class="chk-n">2</span>
        <div class="chk-b"><b>Задание урока</b><span>${esc(DEF_TASK)}</span>
        ${watched ? `<label class="ans"><span class="ans-l">Ваш результат</span><textarea data-act="answer" rows="3" placeholder="Что сделали и что поняли">${esc(ui.answer)}</textarea></label>
          <div class="ans-a"><button class="btn sm" data-act="submit" ${ui.answer.trim().length < 3 ? 'disabled' : ''}>Сдать задание</button><span class="small mut">${pos <= 5 ? 'Задания уроков 1–5 и подготовка открывают 6-й урок.' : 'После задания откроется следующий урок.'}</span></div>` : '<span class="wait-n">Откроется после просмотра</span>'}
        </div></li>`;
    const eyebrow = pos <= 5 ? `Урок ${pos} · можно в${NB}любом порядке` : `Сейчас · урок ${pos} маршрута`;
    return `<li class="ls is-now ${pos <= 10 && ten()[pos - 1].kind === 'bar' ? 'pers' : ''} ${ui.flash === k ? 'enter' : ''}" id="l${pos}">
      <span class="nd"><span class="num">${pos}</span></span>
      <div class="now"><div class="now-h"><p class="eyebrow">${eyebrow}</p><h3>${esc(L[k].t)}</h3><div class="ls-m"><span class="lib">${libOf(k)}</span>${tag}</div></div>
      <ol class="chk">${step1}${step2}</ol></div>
    </li>`;
  }

  const head = (id, nd, title, meta, open, cls, act) => `<li class="st ${cls || ''}" id="${id}"><span class="nd sq">${nd}</span>
    <button class="st-b" ${act ? `data-act="${act}"` : 'disabled'} aria-expanded="${open}"><span class="st-t">${title}</span><span class="st-m">${meta}</span>${act ? svg('chev', 'chev') : ''}</button></li>`;

  /* Подготовка к росту */
  function prepBlock() {
    const n = prepDoneN();
    const all = prepDone();
    const meta = all ? '<span>Готово. Нужна для 6-го урока</span>' : `<span>${n} из${NB}4 · нужна для 6-го урока</span>`;
    let out = head('sprep', all ? svg('check') : svg('user'), 'Подготовка к росту', meta, ui.openPrep, all ? 'is-passed' : 'is-cur', 'prep');
    if (!ui.openPrep) return out;
    const secs = PREP.map((s, si) => {
      const ok = secDone(s);
      const rows = s.items.filter(itemOn).map((i) => {
        const on = !!ui.prep[i.k];
        const c = i.n ? Math.min(ui.cnt[i.k] || 0, i.n) : null;
        const sub = i.k === 'biz' && on && P().step <= 2 ? 'Отмечено: стартап, точка ноль' : i.k === 'biz' ? i.alt : c != null && !on ? `${c} из${NB}${i.n}` : i.club ? 'В клубе и выше' : '';
        return `<li class="${on ? 'ok' : ''}"><button class="pi" data-act="pi" data-v="${i.k}" aria-pressed="${on}"><span class="pi-c">${on ? svg('check') : ''}</span><span class="pi-t">${esc(i.t)}${sub ? `<em>${esc(sub)}</em>` : ''}</span></button></li>`;
      }).join('');
      const doneI = s.items.filter(itemOn).filter((i) => ui.prep[i.k]).length, allI = s.items.filter(itemOn).length;
      return `<div class="ps ${ok ? 'ok' : ''}"><div class="ps-h"><b><span class="ps-n">${ok ? svg('check') : si + 1}</span>${esc(s.t)}</b><span>${ok ? 'Готово' : `${doneI} из${NB}${allI}`} · ${esc(s.where)}</span></div><ul>${rows}</ul></div>`;
    }).join('');
    out += `<li class="ls prep-body"><span class="nd nd-ghost"></span><div class="prep-c">${secs}${setupCard(true)}</div></li>`;
    return out;
  }

  /* Установочная: обязательна для 11-го урока */
  function setupCard(inPrep) {
    const day = DAY[P().seg];
    const who = P().seg === 'E' ? 'Эксперты' : 'Предприниматели';
    const lbl = `<b><span class="ps-n">5</span>Установочная сессия</b>`;
    if (ui.setup === 'yes') return `<div class="ps ok setup"><div class="ps-h"><b><span class="ps-n">${svg('check')}</span>Установочная сессия</b><span>Пройдена</span></div></div>`;
    if (!paid()) return `<div class="ps setup locked"><div class="ps-h">${lbl}<span>${svg('lock')}Нужно активировать доступ</span></div><p>Встреча с${NB}наставником: проверяем ваши цифры и${NB}собираем стратегию. ${who} встречаются по${NB}${P().seg === 'E' ? 'вторникам' : 'средам'}. Без неё не${NB}откроется 11-й урок маршрута.</p><button class="btn sm" data-act="buy">Повысить доступ</button></div>`;
    if (ui.setup === 'booked') return `<div class="ps setup"><div class="ps-h">${lbl}<span>Вы записаны</span></div><p>Встреча в${NB}${day}, ссылка придёт в${NB}Telegram. 11-й урок откроется после встречи.</p><button class="btn soft sm" data-act="attend">Прототип: встреча прошла</button></div>`;
    return `<div class="ps setup ${inPrep ? '' : 'cta'}"><div class="ps-h">${lbl}<span>Нужна для 11-го урока</span></div><p>${who} встречаются по${NB}${P().seg === 'E' ? 'вторникам' : 'средам'}. Проверяем ваши цифры и собираем стратегию на${NB}ближайшие месяцы.</p><button class="btn sm" data-act="book">${svg('cal')}Записаться на${NB}${day}</button></div>`;
  }

  /* Ворота перед 6-м уроком */
  function gate6Card() {
    const f = firstFiveDone(), n = prepDoneN();
    if (gate6()) return `<li class="ls is-done gate-ok"><span class="nd">${svg('check')}</span><div class="ls-b static"><span class="ls-t">Урок 6 открыт</span><span class="ls-m"><span>Задания уроков 1–5 сданы, подготовка пройдена</span></span></div></li>`;
    const row = (ok, t, sub, act) => `<li class="${ok ? 'ok' : ''}"><span class="gi">${ok ? svg('check') : svg('x')}</span><span class="gi-t">${t}<em>${sub}</em></span>${!ok && act ? act : ''}</li>`;
    return `<li class="wall gate" id="gate6"><span class="nd">${svg('lock')}</span><div class="wall-b">
      <h3>Урок 6 откроется, когда будет готово всё ниже</h3>
      <ul class="gl">
        ${row(f === 5, 'Задания уроков 1–5', `${f} из${NB}5 сдано`)}
        ${row(prepDone(), 'Подготовка к росту', `${n} из${NB}4 раздела`, `<button class="btn sm soft" data-act="toprep">Продолжить</button>`)}
      </ul></div></li>`;
  }

  /* Граница после 10-го */
  function wall11() {
    const left = seq().length - 10;
    if (!paid()) return `<li class="wall" id="wall"><span class="nd">${svg('lock')}</span><div class="wall-b">
      <h3>Дальше ${lessonsWord(left)} со${NB}стартовым доступом</h3>
      <p>Первые 10${NB}уроков открыты бесплатно. После покупки нужна установочная сессия: без неё 11-й урок не${NB}откроется.</p>
      <button class="btn" data-act="buy">Открыть весь маршрут</button></div></li>`;
    if (ui.setup === 'yes') return '';
    return `<li class="wall gate" id="wall"><span class="nd">${svg('lock')}</span><div class="wall-b">
      <h3>Урок 11 откроется после установочной сессии</h3>${setupCard(false).replace('class="ps setup', 'class="ps setup flat').replace('<span class="ps-n">5</span>', '')}</div></li>`;
  }

  function etapBlocks() {
    const t = 10;
    const groups = [];
    rest().forEach((x, i) => {
      const last = groups[groups.length - 1];
      if (!last || last.etap !== x.etap) groups.push({ etap: x.etap, from: t + i + 1, items: [] });
      groups[groups.length - 1].items.push(t + i + 1);
    });
    const curPos = seq().findIndex((k, i) => actionable(state(i + 1)) && i >= 10) + 1;
    return groups.map((g) => {
      const e = ETAPY[g.etap];
      const doneN = g.items.filter((p) => state(p) === 'done').length;
      const isCur = curPos && g.items.includes(curPos);
      const open = ui.openEt.has(g.etap) || isCur;
      const passed = doneN === g.items.length;
      const label = g.etap === 'start' ? 'Старт' : `Этап ${g.etap} · ${esc(e.name)}`;
      const meta = `<span>${lessonsWord(g.items.length)}${doneN ? ` · ${doneN} пройдено` : ''}</span><span class="res">Этап готов, когда: ${esc(e.res)}</span>`;
      let h = head(`e${g.etap}`, passed ? svg('check') : g.etap === 'start' ? 'С' : g.etap, label, meta, open, passed ? 'is-passed' : isCur ? 'is-cur' : '', 'et" data-v="' + g.etap);
      if (open) h += g.items.map(lesson).join('');
      return h;
    }).join('');
  }

  function aside() {
    const p = P();
    return `<aside class="col">
      <section class="card sec rules"><p class="eyebrow">Как открываются уроки</p>
        <ol>
          <li><b>Уроки 1–5</b><span>сразу, в${NB}любом порядке, без подготовки. В${NB}каждом есть задание.</span></li>
          <li><b>Урок 6 и дальше</b><span>когда сданы задания уроков 1–5 и${NB}пройдена «Подготовка к росту».</span></li>
          <li><b>Урок 11</b><span>со${NB}стартовым доступом и после установочной сессии.</span></li>
          <li><b>Дальше</b><span>по${NB}очереди: следующий урок открывается после задания предыдущего.</span></li>
        </ol></section>
      <section class="card sec"><p class="eyebrow">Почему такая десятка</p>
        <p class="small">1-й урок у${NB}всех один: система ПЭРЛ. Уроки 2–5 закрывают то, что вы отметили в${NB}анкете, начиная с${NB}главного. Уроки 6–10 начинают этап ${p.route.start}, к${NB}которому вас ведёт шаг бизнеса ${p.step}.</p></section>
    </aside>`;
  }

  const app = document.getElementById('app');
  function render() {
    const t = ten();
    const first = head('s1', '1–5', 'Знакомство: уроки 1–5', '<span>Можно смотреть сразу и в любом порядке</span>', true, firstFiveDone() === 5 ? 'is-passed' : 'is-cur');
    const second = head('s2', '6–10', `Начало пути: уроки 6–10`, `<span>По очереди, начало этапа ${P().route.start}</span>`, true, gate6() ? (t.slice(5).every((x) => ui.done.has(x.k)) ? 'is-passed' : 'is-cur') : '');
    app.innerHTML = `${demoBar()}<div class="kab">${side()}<div class="main">${topBar()}
      <main class="content">
        ${profileCard()}
        <div class="split">
          <section class="card path-c" aria-label="Маршрут"><ol class="path">
            ${first}${[1, 2, 3, 4, 5].map(lesson).join('')}
            ${prepBlock()}
            ${gate6Card()}
            ${second}${[6, 7, 8, 9, 10].map(lesson).join('')}
            ${wall11()}
            ${etapBlocks()}
          </ol></section>
          ${aside()}
        </div>
      </main></div></div>${mnav()}${ui.toast ? `<div class="toast" role="status">${esc(ui.toast)}</div>` : ''}`;
  }

  let tt;
  function toast(t) { ui.toast = t; clearTimeout(tt); tt = setTimeout(() => { ui.toast = null; const el = app.querySelector('.toast'); if (el) el.remove(); }, 3200); }
  function scrollTo(id) { requestAnimationFrame(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }); }); }
  const custom = () => { ui.sit = 'custom'; };

  app.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || b.tagName === 'SELECT' || b.tagName === 'TEXTAREA') return;
    const a = b.dataset.act, v = b.dataset.v;
    if (a === 'pid') { ui.pid = v; setSit(ui.sit === 'custom' ? 'fresh' : ui.sit); }
    else if (a === 'row') {
      const pos = +v, k = seq()[pos - 1], s = state(pos);
      if (actionable(s)) { ui.openL = k; ui.answer = ''; render(); scrollTo('l' + pos); return; }
      if (s === 'done') toast('Задание этого урока уже сдано');
      else if (s === 'gate') { toast('Сначала задания уроков 1–5 и подготовка'); scrollTo('gate6'); }
      else if (s === 'paid') toast('Открывается со стартовым доступом');
      else if (s === 'setup') { toast('Сначала установочная сессия'); scrollTo('wall'); }
      else toast(`Откроется после урока ${pos - 1}`);
      return;
    }
    else if (a === 'watch') { ui.watched.add(ui.openL); custom(); }
    else if (a === 'submit') {
      const k = ui.openL; const was6 = gate6();
      ui.done.add(k); ui.watched.add(k); ui.answer = ''; custom();
      ui.openL = defaultOpen(); ui.flash = ui.openL;
      if (!was6 && gate6()) toast('Урок 6 открыт');
      else if (seq().indexOf(k) < 5 && firstFiveDone() === 5 && !prepDone()) toast('Задания 1–5 сданы. Осталась подготовка к росту');
      else toast('Задание сдано');
    }
    else if (a === 'prep') ui.openPrep = !ui.openPrep;
    else if (a === 'toprep') { ui.openPrep = true; render(); scrollTo('sprep'); return; }
    else if (a === 'pi') {
      const was6 = gate6();
      ui.prep[v] = !ui.prep[v];
      const it = PREP.flatMap((s) => s.items).find((i) => i.k === v);
      if (it.n) ui.cnt[v] = ui.prep[v] ? it.n : Math.max(0, it.n - 2);
      custom(); ui.openL = defaultOpen();
      if (!was6 && gate6()) toast('Подготовка пройдена. Урок 6 открыт');
    }
    else if (a === 'et') { ui.openEt.has(v) ? ui.openEt.delete(v) : ui.openEt.add(v); }
    else if (a === 'buy') { ui.access = 'starter'; custom(); ui.openL = defaultOpen(); toast('Стартовый доступ открыт. Запишитесь на установочную'); render(); scrollTo(firstFiveDone() === 5 && ui.done.size >= 10 ? 'wall' : 'sprep'); return; }
    else if (a === 'book') { ui.setup = 'booked'; custom(); toast(`Вы записаны на ${DAY[P().seg]}`); }
    else if (a === 'attend') { ui.setup = 'yes'; custom(); ui.openL = defaultOpen(); toast('Установочная пройдена'); }
    render();
  });
  app.addEventListener('change', (e) => {
    const a = e.target.dataset.act;
    if (a === 'sit') { setSit(e.target.value); render(); }
    if (a === 'access') { ui.access = e.target.value; custom(); ui.openL = defaultOpen(); render(); }
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
