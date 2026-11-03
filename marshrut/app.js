(function () {
  'use strict';
  const R = window.ROUTE;
  const FREE = 10;
  const NB = ' ';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
  const lessonsWord = (n) => `${n}${NB}${plural(n, 'урок', 'урока', 'уроков')}`;
  const DEF_TASK = 'Запишите главный вывод из урока и одно действие, которое сделаете на этой неделе.';

  /* Линейка: каждый урок получает сквозной номер и вес */
  const FLAT = [];
  /* Вымышленные номера уроков в библиотеке: в маршруте показываем их, а не 1, 2, 3 (Игорь 03.11.2026) */
  const LIB = [118, 33, 133, 154, 25, 42, 97, 13, 67, 144, 167, 9, 121, 75, 58, 51, 116, 143, 153, 157, 5, 165, 168, 162, 128, 124, 108, 106, 38, 64, 30, 117, 52, 21, 12, 28, 99, 26, 16];
  let libI = 0;
  R.stages.forEach((st, si) => {
    st.ls.forEach((l, i) => {
      const base = si * 1000;
      const orig = l.dup ? FLAT.find((x) => !x.dup && x.t === l.dup) : null;
      if (l.dup && !orig) throw new Error('нет урока ' + l.dup);
      const src = orig ? { t: orig.t, m: orig.m, p: orig.p, task: orig.task, mt: orig.mt } : l;
      FLAT.push(Object.assign({}, src, { si, g: FLAT.length + 1, n: orig ? orig.n : LIB[libI++], w: base + (i + 1) * 10, dup: orig || null }));
    });
  });
  const pick = (g) => FLAT[g - 1];
  /* Этап по номеру шага и первый шаг этапа/уровня в порядке маршрута */
  const etapOf = (n) => (n == null ? null : R.etapy.find((e) => e.steps.includes(n)));
  const etapOfSt = (st) => (st.et ? R.etapy.find((e) => e.k === st.et) : etapOf(st.n));
  const lvOf = (n) => (n == null ? null : R.biz.find((b) => n >= b.from && n <= b.to));
  const firstIdx = (pred) => R.stages.findIndex((s) => s.n != null && pred(s.n));
  const etapRange = (lv) => { const es = R.etapy.filter((e) => e.lv === lv); return `<span class="nw">${es[0].k}–${es[es.length - 1].k}</span>`; };
  const MONTHS = ['Август', 'Сентябрь', 'Октябрь'];
  const START_STEP = { 1: 0, 2: 6, 3: 11 }; // Саша 03.11: маршрут начинается с первого шага уровня; пропущенные шаги может назначить наставник

  const ONB_A = { year: 2000000, label: 'около 2 млн ₽' };
  const ONB_B = { year: 9000000, label: 'около 9 млн ₽' };
  const inc = (a) => ({ mode: 'income', inc: a });
  const bz = (rev, gross, net) => ({ mode: 'biz', rev, gross, net });
  const SCEN = {
    fresh: { label: 'Новый участник: подготовка не пройдена', done: 0, watched: false, access: 'free', profile: false, pa: null, booked: false, onb: ONB_A },
    mid: { label: 'Урок 4: видео посмотрено, задание не сдано', done: 3, watched: true, access: 'free', profile: true, pa: inc([110000, 120000, 130000]), booked: false, onb: ONB_A },
    wall: { label: '10 бесплатных уроков пройдены', done: 10, watched: false, access: 'free', profile: true, pa: inc([140000, 145000, 150000]), booked: false, onb: ONB_A },
    start: { label: 'Стартовый доступ, урок 15', done: 14, watched: false, access: 'starter', profile: true, pa: inc([170000, 180000, 190000]), booked: true, onb: ONB_A },
    club: { label: 'Клуб, урок 15', done: 14, watched: false, access: 'club', profile: true, pa: inc([170000, 180000, 190000]), booked: true, onb: ONB_A },
    ent: { label: 'Бизнес на уровне Enterprise: маршрут с этапа 3.1', done: 3, watched: false, access: 'starter', profile: true, pa: bz([3600000, 3800000, 4000000], [2100000, 2200000, 2300000], [900000, 950000, 1000000]), booked: true, onb: ONB_B },
    scaling: { label: 'Бизнес на уровне Scaling: маршрут с этапа 2.1', done: 2, watched: false, access: 'starter', profile: true, pa: bz([1100000, 1200000, 1300000], [650000, 700000, 750000], [330000, 350000, 370000]), booked: false, onb: ONB_B },
  };
  const ACCESS = { free: 'Бесплатно', starter: 'Стартовый доступ', club: 'Клуб' };

  const ui = { scen: 'mid', done: 3, watched: true, access: 'free', weights: false, answer: '', open: null, flash: 0, toast: null, profile: true, pa: null, booked: false, editPA: false, form: null };

  /* Точка А: доходы за последние три месяца. От неё — спидометр, уровень и место старта */
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  function metrics() {
    const p = ui.pa;
    if (!p) { const o = ui.onb; if (!o) return null; const pm = o.year / 12; return { metric: 'income', pm, year: o.year, fact: 0, pocket: pm, src: 'onb' }; }
    if (p.mode === 'income') { const pm = avg(p.inc); return { metric: 'income', pm, year: pm * 12, fact: pm * 3, pocket: pm }; }
    const pm = avg(p.rev); return { metric: 'rev', pm, year: pm * 12, fact: pm * 3, pocket: avg(p.net), gross: avg(p.gross) };
  }
  const levelNow = () => { const m = metrics(); if (!m) return null; return R.biz.find((b) => m.year < b[m.metric]) || R.biz[R.biz.length - 1]; };
  const startStep = () => { const L = levelNow(); return L ? START_STEP[L.n] : 0; };
  const skipped = (l) => { const n = R.stages[l.si].n; return n != null && n < startStep(); };
  /* Уровни выше текущего закрыты целиком (Игорь 03.11.2026) */
  const lvCur = () => (levelNow() || R.biz[0]).n;
  const future = (l) => { const b = lvOf(R.stages[l.si].n); return !!b && b.n > lvCur(); };
  /* Повтор урока: если исходный урок уже в маршруте человека, повтор не проходится второй раз */
  const covered = (l) => !!l.dup && !skipped(l.dup) && !future(l.dup);
  const route = () => FLAT.filter((l) => !skipped(l) && !future(l) && !covered(l));
  const pos = (l) => route().indexOf(l) + 1;
  const total = () => route().length;
  const prepDone = () => ui.profile && !!ui.pa;

  const state = (l) => {
    if (skipped(l)) return 'skip';
    if (covered(l)) return state(l.dup) === 'done' ? 'done' : 'dup';
    const p = pos(l);
    if (p <= ui.done) return 'done';
    if (ui.access === 'free' && p > FREE) return 'paid';
    if (p === ui.done + 1) return prepDone() ? 'now' : 'wait';
    return 'next';
  };
  const cur = () => (prepDone() && ui.done < total() ? route()[ui.done] : null);

  function defaultOpen() {
    const s = new Set();
    if (!prepDone() || (ui.pa && !ui.booked)) s.add('prep');
    const c = cur() || route()[Math.min(ui.done, total() - 1)];
    const si = c ? c.si : R.stages.length - 1;
    s.add(si);
    if (si + 1 < R.stages.length) s.add(si + 1);
    return s;
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
    flag: '<path d="M4 22V4"/><path d="M4 4h13l-2 4 2 4H4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    skip: '<path d="M5 12h14"/>',
  };
  const svg = (k, cls) => `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

  const SIDE = [['dash', 'Дашборд Альянса'], ['route', 'Мой маршрут'], ['todo', 'Трекер Фримана'], ['cal', 'Календарь'], ['feed', 'Лента'], ['msg', 'Сообщения'], ['lib', 'Библиотека'], ['people', 'Члены Альянса']];
  const MOB = [['dash', 'Альянс'], ['route', 'Маршрут'], ['todo', 'Трекер'], ['lib', 'Библиотека']];
  const side = () => `<aside class="side" aria-label="Меню Альянса">
    <div class="brand"><img src="img/context-alliance.png" alt="" width="34" height="34"><span><b>Freeman's Alliance</b><span>кабинет Альянса</span></span></div>
    ${SIDE.map(([k, l]) => `<div class="nav-i ${k === 'route' ? 'on' : ''}">${svg(k)}<span>${l}</span></div>`).join('')}
  </aside>`;
  const mnav = () => `<nav class="mnav" aria-label="Нижнее меню">${MOB.map(([k, l]) => `<span class="${k === 'route' ? 'on' : ''}">${svg(k)}${l}</span>`).join('')}</nav>`;
  const persLevel = () => { const m = metrics(); if (!m) return null; const v = m.pocket; return v < 50000 ? 0 : v < 300000 ? 1 : v < 800000 ? 2 : 3; };
  const topBar = () => `<header class="top"><h1>Мой маршрут</h1><div class="me"><span class="ava">${esc(R.person.name[0])}</span><div><b>${esc(R.person.name)}</b><span>${esc(ACCESS[ui.access])}</span></div></div></header>`;

  function demoBar() {
    const opts = (o, v) => Object.entries(o).map(([k, l]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${esc(typeof l === 'string' ? l : l.label)}</option>`).join('');
    return `<details class="demo"><summary><span class="demo-tag">Прототип</span><span class="demo-sum">Вымышленный участник. ${esc(SCEN[ui.scen] ? SCEN[ui.scen].label : 'Свой сценарий')}. ${esc(ACCESS[ui.access])}</span><span class="demo-more">Ситуации</span></summary>
      <div class="demo-body">
        <label>Ситуация<select data-act="scen">${opts(SCEN, ui.scen)}${ui.scen === 'custom' ? '<option value="custom" selected>Свой сценарий</option>' : ''}</select></label>
        <label>Доступ<select data-act="access">${opts(ACCESS, ui.access)}</select></label>
        <label class="chk-l"><input type="checkbox" data-act="weights" ${ui.weights ? 'checked' : ''}> Показать вес урока</label>
        <p class="demo-note">Урок открывается по очереди: посмотреть видео, затем записать результат задания. Проверка куратора не задерживает. Вес урока задаёт порядок: тысячи — место шага в маршруте, остаток — место урока внутри шага.</p>
      </div></details>`;
  }


  /* Спидометр уровня бизнеса — как в «Финансах» трекера */
  const money = (v) => `${Math.round(v).toLocaleString('ru-RU').replace(/\s/g, NB)}${NB}₽`;
  const short = (v) => v >= 1e6 ? `${String(+(v / 1e6).toFixed(1)).replace('.', ',')}${NB}млн` : `${Math.round(v / 1000)}${NB}тыс`;
  const CX = 170, CY = 166, RR = 136;
  const pt = (t, r = RR) => { const a = Math.PI * (1 - t); return [CX + r * Math.cos(a), CY - r * Math.sin(a)]; };
  const arc = (t0, t1) => { const [x0, y0] = pt(t0), [x1, y1] = pt(t1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${RR} ${RR} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
  let needleWas = -90;
  function dial(fact, plan, target, top) {
    const cl = (x) => Math.max(0, Math.min(1, x));
    const fT = cl(fact / target), pT = cl(plan / target);
    let ticks = '';
    for (let i = 0; i <= 20; i += 1) { const big = i % 5 === 0; const [x0, y0] = pt(i / 20, RR + 13), [x1, y1] = pt(i / 20, RR + (big ? 22 : 18)); ticks += `<line class="tick" x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke-width="${big ? 1.6 : 1}"/>`; }
    const [lx, ly] = pt(0.5, RR + 32);
    return `<svg viewBox="0 0 340 186" role="img" aria-label="Прогноз ${Math.round(pT * 100)} процентов цели уровня">
      <defs><linearGradient id="gFact" gradientUnits="userSpaceOnUse" x1="34" y1="0" x2="306" y2="0"><stop offset="0" stop-color="#2f7bff"/><stop offset="1" stop-color="#7b61ff"/></linearGradient></defs>
      <path class="trackarc" d="${arc(0, 1)}" fill="none" stroke-width="16" stroke-linecap="round"/>
      ${pT > fT ? `<path class="planarc" d="${arc(0, pT)}" fill="none" stroke-width="16" stroke-linecap="round"/>` : ''}
      ${fT > 0.002 ? `<path d="${arc(0, fT)}" fill="none" stroke="url(#gFact)" stroke-width="16" stroke-linecap="round"/>` : ''}
      ${ticks}
      <text x="${lx}" y="${ly + 4}" text-anchor="middle">50%</text><text x="8" y="184">0</text><text x="332" y="184" text-anchor="end">${top}</text>
      <g class="needle" id="needle" style="transform:rotate(${needleWas}deg)" data-to="${(-90 + 180 * pT).toFixed(2)}"><line x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - RR + 16}"/><circle cx="${CX}" cy="${CY}" r="8"/><circle cx="${CX}" cy="${CY}" r="3"/></g>
    </svg>`;
  }
  const bizOf = (stepN) => R.biz.find((b) => stepN >= b.from && stepN <= b.to) || R.biz[0];
  function bizCard() {
    const m = metrics(); const L = levelNow() || R.biz[0];
    const rungsOf = (fill) => R.biz.map((b) => `<div class="brung ${m && b.n === L.n ? 'cur' : ''}"><i><u style="width:${(fill(b) * 100).toFixed(1)}%"></u></i><b>${b.name}</b><span>${m && b.n === L.n ? `${short(m.year)} из ${short(b[m.metric])}${NB}₽ за год` : `${m.metric === 'income' ? 'доход' : 'выручка'} ${short(b[m.metric])}${NB}₽ за год`}</span></div>`).join('');
    const target = L[m.metric]; const share = Math.round((m.year / target) * 100);
    const what = m.metric === 'income' ? 'личный доход' : 'выручка компании';
    const onb = m.src === 'onb';
    return `<section class="card bizlv">
      <div class="dial">${dial(m.fact, m.year, target, short(target))}<div class="dial-read"><b class="num">${onb ? '≈' + NB : ''}${money(m.year)}</b><span>${onb ? 'по анкете онбординга' : 'прогноз на год'} · ${share}% цели уровня</span></div></div>
      <div class="biz-t">
        <p class="eyebrow">Уровень бизнеса ${L.n} из 3</p>
        <h2>${L.name}</h2>
        <p class="biz-sub">${L.sub}. <span class="nw">Этапы маршрута ${etapRange(L.n)}</span>. Цель уровня за год: личный доход ${money(L.income)} или выручка компании ${money(L.rev)}.</p>
        <dl class="lv-rows">
          <div class="lv-row"><dt>${m.metric === 'income' ? 'Личный доход' : 'Выручка'} в среднем</dt><dd class="num">${onb ? '≈' + NB : ''}${money(m.pm)} <span class="mut small">в месяц</span></dd></div>
          ${m.metric === 'rev' ? `<div class="lv-row"><dt>Чистыми в карман</dt><dd class="num">${money(m.pocket)} <span class="mut small">в месяц</span></dd></div>` : ''}
          <div class="lv-row"><dt>Нужно для цели</dt><dd class="num">${money(target / 12)} <span class="mut small">в месяц</span></dd></div>
        </dl>
        ${onb ? `<div class="biz-fix"><p>Пока это ориентир из анкеты онбординга: годовой доход ${esc(ui.onb.label)}. Исправьте его реальными цифрами за последние три месяца, и уровень пересчитается.</p><button class="btn sm" data-act="goPA">${svg('chart')}Заполнить Точку А</button><p class="fix-sub">Можно заполнить и за весь последний год: в <a href="https://turubarov01-netizen.github.io/pp-design/dengi/" target="_blank" rel="noopener">«Финансах» трекера Фримана</a>.</p></div>` : `<p class="biz-src">Посчитано по Точке А: ${what} за ${MONTHS[0].toLowerCase()}–${MONTHS[2].toLowerCase()}. Куратор уточнит уровень на установочной сессии.</p>`}
        <p class="biz-why">Задания маршрута и есть путь к этой цели. Делаете их, растёт бизнес, и стрелка идёт вправо. Дальше цифры берутся из «Финансов» в трекере.</p>
        <div class="bladder" aria-label="Три уровня бизнеса">${rungsOf((b) => (b.n < L.n ? 1 : b.n === L.n ? Math.min(1, m.year / target) : 0))}</div>
      </div>
    </section>`;
  }

  /* Шапка маршрута */
  function hero() {
    const T = total(); const c = cur(); const stc = c ? R.stages[c.si] : null;
    const nxt = route()[ui.done];
    const paidWall = prepDone() && nxt && state(nxt) === 'paid';
    let h, sub, cta = '';
    if (!prepDone()) {
      h = 'Подготовка к росту';
      sub = 'Заполните профиль и Точку А: реальные доходы за последние три месяца. Сейчас спидометр и маршрут построены по анкете онбординга, Точка А их уточнит. После неё откроется первый урок.';
      cta = `<button class="btn" data-act="goPrep">Продолжить подготовку</button>`;
    } else if (!nxt) {
      h = 'Маршрут пройден';
      sub = `Все ${lessonsWord(T)} позади. Новые уроки по вашим шагам появятся здесь.`;
    } else if (paidWall) {
      h = 'Бесплатная часть пройдена';
      sub = `Вы прошли ${lessonsWord(FREE)}. Ещё ${lessonsWord(T - FREE)} этого маршрута откроются со стартовым доступом.`;
      cta = `<button class="btn" data-act="buy">Открыть весь маршрут</button>`;
    } else {
      h = stc.n == null ? 'Старт маршрута' : `Этап ${etapOfSt(stc).k}. ${esc(etapOfSt(stc).name)}`;
      sub = `Урок ${pos(c)} из ${T}. Следующий откроется, когда вы посмотрите этот и запишете результат задания.`;
      if (stc.n != null && !stc.rep) sub = `Шаг ${stc.n}. ${esc(stc.title)}. ` + sub;
      if (startStep() > 0) { const L0 = levelNow(); const prev = R.biz.filter((b) => b.n < L0.n).map((b) => etapRange(b.n)).join(', '); sub += ` По Точке А маршрут идёт с этапа ${etapOf(startStep()).k}: этапы ${prev} наставник может попросить пройти, если увидит в них недоработки.`; }
      cta = `<button class="btn" data-act="go">${svg('play', 'ic-f')}Продолжить урок №${c.n}</button>`;
    }
    const segs = R.stages.map((st, si) => {
      const ls = FLAT.filter((l) => l.si === si);
      const skip = ls.length && ls.every(skipped);
      const done = ls.filter((l) => state(l) === 'done').length;
      const pct = skip ? 0 : ls.length ? Math.round((done / ls.length) * 100) : (c && c.si > si ? 100 : 0);
      const isCur = c && c.si === si;
      if (st.n != null && lvOf(st.n).n > lvCur()) return '';
      const label = st.n == null ? 'Старт' : st.rep ? `Этап ${etapOfSt(st).k}. ${st.title}` : `Этап ${etapOf(st.n).k}, шаг ${st.n}. ${st.title}`;
      return `<button class="seg-i ${isCur ? 'cur' : ''} ${ls.length ? '' : 'empty'} ${skip ? 'skip' : ''}" style="flex-grow:${Math.max(1, ls.length)}" data-act="jump" data-v="${si}" title="${esc(label)}" aria-label="${esc(label)}${skip ? ', по решению наставника' : `: ${done} из ${ls.length}`}"><i><u style="width:${pct}%"></u></i></button>`;
    }).join('');
    const stepNo = !prepDone() ? 'Подготовка' : !nxt ? 'Маршрут пройден' : stc && stc.n != null ? `Этап ${etapOfSt(stc).k}${NB}из${NB}9` : 'Старт, до этапов бизнеса';
    return `<section class="card hero">
      <div class="hero-t">
        <p class="eyebrow">Где вы сейчас</p>
        <h2>${h}</h2>
        <p class="hero-sub">${sub}</p>
      </div>
      <div class="hero-a">${cta}</div>
      <div class="hero-p">
        <div class="segs" role="group" aria-label="Этапы маршрута">${segs}</div>
        <div class="segs-x"><span class="num">Пройдено <b>${ui.done}${NB}из${NB}${T}</b></span><span>${stepNo}</span></div>
      </div>
    </section>`;
  }

  /* Подготовка к росту: профиль, Точка А, установочная сессия */
  function paForm() {
    const f = ui.form;
    const field = (k, i, lab) => `<label class="pa-f"><span>${lab}</span><span class="pa-in"><input inputmode="numeric" data-act="pa" data-k="${k}" data-i="${i}" value="${esc(f[k][i])}" placeholder="0" autocomplete="off"><em>₽</em></span></label>`;
    const body = f.mode === 'income'
      ? `<div class="pa-grid three">${MONTHS.map((mn, i) => field('inc', i, mn)).join('')}</div><p class="small mut pa-note">Личный доход за месяц до налогов.</p>`
      : `<div class="pa-biz"><div class="pa-row pa-hd"><span></span><span>Выручка</span><span>Валовая прибыль</span><span>Чистыми в карман</span></div>${MONTHS.map((mn, i) => `<div class="pa-row"><b>${mn}</b>${field('rev', i, 'Выручка')}${field('gross', i, 'Валовая прибыль')}${field('net', i, 'Чистыми в карман')}</div>`).join('')}</div>`;
    return `<div class="pa">
      <div class="seg" role="group" aria-label="Что считаем"><button data-act="paMode" data-v="income" aria-pressed="${f.mode === 'income'}">Личный доход</button><button data-act="paMode" data-v="biz" aria-pressed="${f.mode === 'biz'}">Доходы бизнеса</button></div>
      ${body}
      <div class="ans-a"><button class="btn sm" data-act="paSave" ${paValid() ? '' : 'disabled'}>Сохранить Точку А</button><span class="small mut">Уровень потом уточнит куратор на установочной сессии.</span></div>
      <p class="fix-sub pa-year">Можно заполнить и за весь последний год: в <a href="https://turubarov01-netizen.github.io/pp-design/dengi/" target="_blank" rel="noopener">«Финансах» трекера Фримана</a>.</p>
    </div>`;
  }
  const num = (v) => Number(String(v).replace(/[^\d]/g, ''));
  const paKeys = () => (ui.form.mode === 'income' ? ['inc'] : ['rev', 'gross', 'net']);
  const paValid = () => paKeys().every((k) => ui.form[k].every((v) => String(v).replace(/[^\d]/g, '') !== ''));
  function prepBlock() {
    const open = ui.open.has('prep');
    const pa = ui.pa && !ui.editPA;
    const m = metrics();
    const items = [];
    // 1. Профиль и Telegram
    items.push(ui.profile
      ? `<li class="ls is-done prep"><span class="nd">${svg('check')}</span><div class="ls-b static"><span class="ls-t">Профиль и Telegram</span><span class="ls-m"><span>Готово</span></span></div></li>`
      : `<li class="ls is-now prep" id="p1"><span class="nd">${svg('user')}</span><div class="now"><div class="now-h"><p class="eyebrow">Подготовка · шаг 1</p><h3>Профиль и Telegram</h3></div><p class="now-p">Имя, фото и Telegram, чтобы куратор и бот Альянса могли написать вам о встрече и новых уроках.</p><button class="btn sm" data-act="profile">Заполнить профиль</button></div></li>`);
    // 2. Точка А
    if (pa) {
      const what = m.metric === 'income' ? `Личный доход ${short(m.pm)}${NB}₽ в месяц` : `Выручка ${short(m.pm)}${NB}₽, чистыми ${short(m.pocket)}${NB}₽ в месяц`;
      items.push(`<li class="ls is-done prep"><span class="nd">${svg('check')}</span><div class="ls-b static"><span class="ls-t">Точка А: доходы за три месяца</span><span class="ls-m"><span>${what}</span><button class="link" data-act="editPA">Изменить</button></span></div></li>`);
    } else if (!ui.profile) {
      items.push(`<li class="ls is-next prep"><span class="nd">${svg('chart')}</span><div class="ls-b static"><span class="ls-t">Точка А: доходы за три месяца</span><span class="ls-m"><span>Откроется после профиля</span></span></div></li>`);
    } else {
      if (!ui.form) ui.form = { mode: 'income', inc: ['', '', ''], rev: ['', '', ''], gross: ['', '', ''], net: ['', '', ''] };
      items.push(`<li class="ls is-now prep" id="p2"><span class="nd">${svg('chart')}</span><div class="now"><div class="now-h"><p class="eyebrow">Подготовка · шаг 2</p><h3>Точка А: доходы за последние три месяца</h3></div><p class="now-p">От этих цифр строится спидометр и маршрут: уровень бизнеса, цель на год и шаг, с которого вы начнёте.</p>${paForm()}</div></li>`);
    }
    // 3. Установочная сессия
    const sess = 'Куратор проверит Точку А: верно ли посчитан уровень, нужны ли дополнительные шаги, и поможет выстроить стратегию.';
    if (ui.booked) items.push(`<li class="ls is-done prep"><span class="nd">${svg('check')}</span><div class="ls-b static"><span class="ls-t">Установочная сессия с куратором</span><span class="ls-m"><span>Вы записаны. Ссылка придёт в Telegram</span></span></div></li>`);
    else if (!pa) items.push(`<li class="ls is-next prep"><span class="nd">${svg('cal')}</span><div class="ls-b static"><span class="ls-t">Установочная сессия с куратором</span><span class="ls-m"><span>Запись откроется после Точки А</span></span></div></li>`);
    else if (ui.access === 'free') items.push(`<li class="ls is-paid prep" id="p3"><span class="nd">${svg('lock')}</span><div class="opt"><b>Установочная сессия с куратором</b><p>${sess}</p><p class="opt-lock">${svg('lock')}Запись открывается со стартовым доступом, от $20. Бесплатные уроки маршрута доступны и без неё.</p><button class="btn sm" data-act="buy">Повысить доступ</button></div></li>`);
    else items.push(`<li class="ls is-now prep opt-li" id="p3"><span class="nd">${svg('cal')}</span><div class="opt"><b>Установочная сессия с куратором</b><p>${sess}</p><button class="btn sm" data-act="book">Записаться на установочную</button></div></li>`);
    const doneN = [ui.profile, !!ui.pa, ui.booked].filter(Boolean).length;
    const passed = prepDone() && ui.booked;
    const meta = passed ? 'Готово' : prepDone() ? 'Осталось записаться на установочную сессию' : `${doneN} из 3 · сначала профиль и Точка А`;
    const head = `<li class="st ${passed ? 'is-passed' : ''} ${!prepDone() ? 'is-cur' : ''}" id="sprep">
      <span class="nd sq">${passed ? svg('check') : svg('user')}</span>
      <button class="st-b" data-act="stage" data-v="prep" aria-expanded="${open}"><span class="st-t">Подготовка к росту</span><span class="st-m"><span>${meta}</span></span>${svg('chev', 'chev')}</button>
    </li>`;
    return head + (open ? items.join('') : '');
  }

  /* Строка урока */
  function lessonRow(l) {
    const s = state(l); const p = pos(l);
    const kind = l.p ? 'pers' : 'biz';
    const tag = l.p ? `<span class="tag pers">Личный рост</span>` : '';
    const w = ui.weights ? `<span class="wt num">вес ${l.w}</span>` : '';
    let node;
    if (s === 'done') node = svg('check');
    else if (s === 'paid') node = svg('lock');
    else if (s === 'skip') node = svg('skip');
    else if (s === 'dup') node = svg('flag');
    else node = `<span class="num">${p}</span>`;
    const meta = s === 'done' ? `Результат у наставника` : s === 'paid' ? `${l.m}${NB}мин · со стартовым доступом` : s === 'skip' ? `${l.m}${NB}мин · по решению наставника` : s === 'dup' ? `${l.m}${NB}мин · откроется в этапе ${etapOfSt(R.stages[l.dup.si]).k}` : s === 'wait' ? `${l.m}${NB}мин · откроется после Точки А` : s === 'next' && p === ui.done + 2 ? `${l.m}${NB}мин · откроется после урока №${route()[p - 2].n}` : `${l.m}${NB}мин`;
    if (s === 'now') return nowCard(l, kind, tag, w);
    return `<li class="ls is-${s} ${kind}" id="l${l.g}">
      <span class="nd">${node}</span>
      <button class="ls-b" data-act="row" data-v="${l.g}"><span class="ls-t">${esc(l.t)}</span><span class="ls-m"><span class="lib">Урок №${l.n}</span>${tag}<span>${meta}</span>${w}</span></button>
    </li>`;
  }

  function nowCard(l, kind, tag, w) {
    const watched = ui.watched;
    const task = l.task || DEF_TASK;
    const step1 = `<li class="${watched ? 'ok' : 'todo'}">
        <span class="chk-n">${watched ? svg('check') : '1'}</span>
        <div class="chk-b"><b>Посмотреть урок</b><span>${watched ? 'Видео просмотрено' : `${l.m}${NB}мин`}</span></div>
        ${watched ? '<button class="btn soft sm" data-act="watch">Пересмотреть</button>' : `<button class="btn sm" data-act="watch">${svg('play', 'ic-f')}Смотреть</button>`}
      </li>`;
    const mt = l.mt || 'Цифра результата';
    const step2 = `<li class="${watched ? 'todo' : 'wait'}">
        <span class="chk-n">2</span>
        <div class="chk-b"><b>Результат наставнику</b><span>${esc(task)}</span>
          ${watched ? `<div class="ans-grid">
            <label class="ans-f"><span>${esc(mt)}</span><input data-act="metric" inputmode="decimal" value="${esc(ui.metric || '')}" placeholder="0" autocomplete="off"></label>
            <label class="ans"><span class="ans-l">Что сделали и главный инсайт</span><textarea data-act="answer" rows="3" placeholder="Что получилось, что поняли">${esc(ui.answer)}</textarea></label>
          </div>
          <div class="ans-a"><button class="btn sm" data-act="submit" ${ui.answer.trim().length < 3 ? 'disabled' : ''}>Отправить наставнику</button><span class="small mut">Сохранится в вашей карточке развития бизнеса. Наставник откроет её перед созвоном, ждать проверки не нужно.</span></div>` : `<span class="wait-n">Откроется после просмотра</span>`}
        </div>
      </li>`;
    return `<li class="ls is-now ${kind} ${ui.flash === l.g ? 'enter' : ''}" id="l${l.g}">
      <span class="nd"><span class="num">${pos(l)}</span></span>
      <div class="now">
        <div class="now-h"><p class="eyebrow">Сейчас · урок ${pos(l)} маршрута</p><h3>${esc(l.t)}</h3><div class="ls-m"><span class="lib">Урок №${l.n}</span>${tag}${w}</div></div>
        <ol class="chk">${step1}${step2}</ol>
      </div>
    </li>`;
  }

  function wall() {
    const rest = total() - FREE;
    return `<li class="wall" id="wall">
      <span class="nd">${svg('lock')}</span>
      <div class="wall-b">
        <h3>Дальше ${lessonsWord(rest)} со стартовым доступом</h3>
        <p>Первые ${lessonsWord(FREE)} открыты бесплатно. Стартовый доступ открывает весь маршрут, уроки идут в том же порядке. В клубе к ним добавляются разборы шагов.</p>
        <button class="btn" data-act="buy">Открыть весь маршрут</button>
      </div>
    </li>`;
  }

  function stageBlock(st, si) {
    const ls = FLAT.filter((l) => l.si === si);
    const c = cur();
    const skip = ls.length > 0 && ls.every(skipped);
    const done = ls.filter((l) => state(l) === 'done').length;
    const passed = !skip && (ls.length ? done === ls.length : (c ? c.si > si : prepDone() && ui.done >= total()));
    const isCur = c && c.si === si;
    const allPaid = ls.length && ls.every((l) => state(l) === 'paid');
    const open = ui.open.has(si);
    const mins = ls.reduce((a, l) => a + l.m, 0);
    const time = mins >= 60 ? `${Math.floor(mins / 60)}${NB}ч${mins % 60 ? ` ${mins % 60}${NB}мин` : ''}` : `${mins}${NB}мин`;
    let meta;
    if (!ls.length) meta = 'Уроки шага готовятся';
    else if (skip) meta = 'Наставник может попросить пройти этот шаг';
    else if (passed) meta = 'Пройден';
    else if (done) meta = `${done} из ${ls.length} · ${time}`;
    else meta = `${lessonsWord(ls.length)} · ${time}`;
    const chips = [];
    if (ui.access === 'club' && isCur && st.n != null) chips.push('<span class="tag club">Разбор шага в клубе</span>');
    if (allPaid) chips.push(`<span class="tag lock">${svg('lock')}Стартовый доступ</span>`);
    const badge = passed && ls.length ? svg('check') : st.n == null ? svg('flag') : st.rep ? svg('play') : `<span class="num">${st.n}</span>`;
    const head = `<li class="st ${passed ? 'is-passed' : ''} ${isCur ? 'is-cur' : ''} ${skip ? 'is-skip' : ''}" id="s${si}">
      <span class="nd sq">${badge}</span>
      <button class="st-b" data-act="stage" data-v="${si}" aria-expanded="${open}" ${ls.length ? '' : 'disabled'}>
        <span class="st-t">${st.n == null || st.rep ? '' : `<span class="st-k">Шаг ${st.n}</span>`}${esc(st.title)}</span>
        <span class="st-m"><span>${meta}</span>${chips.join('')}</span>
        ${ls.length ? svg('chev', 'chev') : ''}
      </button>
    </li>`;
    const showWall = ui.access === 'free' && ui.done <= FREE && total() > FREE;
    const hasWall = ls.some((l) => !skipped(l) && pos(l) === FREE);
    let body = '';
    if (open && ls.length) body = ls.map((l) => lessonRow(l) + (showWall && !skipped(l) && pos(l) === FREE ? wall() : '')).join('');
    else if (!open && showWall && hasWall) body = wall();
    const lv0 = lvOf(st.n); const lv = lv0 && firstIdx((n) => n >= lv0.from && n <= lv0.to) === si ? lv0 : null;
    const et = etapOfSt(st); const etFirst = et && R.stages.findIndex((x) => x.n != null && etapOfSt(x) === et) === si;
    const L = levelNow();
    /* Уровень целиком ниже старта: свёрнут в одну полосу, шаги раскрываются по кнопке (Игорь 03.11.2026) */
    const own = R.biz.find((b) => st.n != null && st.n >= b.from && st.n <= b.to);
    const lvSkipped = own && own.to < startStep();
    const lvOpen = own && ui.open.has('lv' + own.n);
    const band = !lv ? '' : lvSkipped
      ? `<li class="lvl past"><span class="nd lv-nd">${lv.n}</span><div class="lvl-b"><b>Уровень ${lv.n} · ${lv.name}</b><span>Ваш бизнес уже выше этого уровня по Точке А. Наставник может назначить любой из этапов ${etapRange(lv.n)}.</span><button class="lvl-t" data-act="stage" data-v="lv${lv.n}" aria-expanded="${!!lvOpen}">${lvOpen ? 'Свернуть этапы' : 'Показать этапы'}${svg('chev', 'chev')}</button></div></li>`
      : `<li class="lvl ${L && L.n === lv.n ? 'cur' : ''}"><span class="nd lv-nd">${lv.n}</span><div class="lvl-b"><b>Уровень ${lv.n} · ${lv.name}</b><span>Этапы ${etapRange(lv.n)} · цель за год: доход ${short(lv.income)}${NB}₽ или выручка ${short(lv.rev)}${NB}₽</span></div></li>`;
    if (lvSkipped && !lvOpen) return band;
    if (own && own.n > lvCur()) return lv ? `<li class="lvl future"><span class="nd lv-nd">${lv.n}</span><div class="lvl-b"><b>${svg('lock')}Уровень ${lv.n} · ${lv.name}</b><span>Этапы ${etapRange(lv.n)} · цель за год: доход ${short(lv.income)}${NB}₽ или выручка ${short(lv.rev)}${NB}₽</span><span>Откроется, когда бизнес выйдет на этот уровень.</span></div></li>` : '';
    const etapHead = (e) => {
      const sis = R.stages.map((x, i) => (x.n != null && etapOfSt(x) === e ? i : -1)).filter((i) => i >= 0);
      const els = FLAT.filter((l) => sis.includes(l.si));
      const eSkip = els.length > 0 && els.every(skipped);
      const eDone = !eSkip && els.length > 0 && els.every((l) => state(l) === 'done');
      const eCur = c && sis.includes(c.si);
      const sub = e.sub ? `<ol class="etap-s">${e.sub.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>` : '';
            return `<li class="etap ${eDone ? 'is-done' : ''} ${eCur ? 'is-cur' : ''} ${eSkip ? 'is-skip' : ''}"><span class="nd et-nd">${eDone ? svg('check') : e.k}</span><div class="etap-b"><p class="etap-k">Этап ${e.k}</p><h3>${esc(e.name)}</h3><p class="etap-r"><b>Этап готов, когда:</b> ${esc(e.res[0].toLowerCase() + e.res.slice(1))}</p>${sub}</div></li>`;
    };
    let etap = '';
    if (etFirst) {
      /* Этап без своих шагов (3.1) ставим перед следующим этапом того же уровня */
      const pre = []; for (let j = R.etapy.indexOf(et) - 1; j >= 0 && R.etapy[j].lv === et.lv && !R.stages.some((x) => x.n != null && etapOfSt(x) === R.etapy[j]); j -= 1) pre.unshift(R.etapy[j]);
      etap = pre.map(etapHead).join('') + etapHead(et);
    }
    return band + etap + head + body;
  }

  function aside() {
    const pl = persLevel(); const m = metrics(); const T = total();
    const rungs = R.levels.map((x, i) => `<div class="rung ${i === pl ? 'cur' : ''} ${pl != null && i < pl ? 'past' : ''}"><i></i><b>${x.t}</b></div>`).join('');
    const acc = ui.access === 'free'
      ? `<p class="eyebrow">Доступ</p><h3>Бесплатно: ${lessonsWord(FREE)}</h3><p class="small mut">Маршрут виден целиком. Уроки с 11-го откроются со стартовым доступом.</p><div class="mini"><i><u style="width:${Math.min(100, (Math.min(ui.done, FREE) / FREE) * 100)}%"></u></i><span class="num">${Math.min(ui.done, FREE)} из ${FREE}</span></div><button class="btn wide" data-act="buy">Открыть весь маршрут</button>`
      : ui.access === 'starter'
        ? `<p class="eyebrow">Доступ</p><h3>Стартовый доступ</h3><p class="small mut">Открыты все ${lessonsWord(T)} маршрута, по порядку.</p><button class="btn soft wide" data-act="club">Что добавляет клуб</button>`
        : `<p class="eyebrow">Доступ</p><h3>Клуб</h3><p class="small mut">Все уроки маршрута и разборы шагов с наставником.</p>`;
    return `<aside class="col">
      <section class="card sec"><p class="eyebrow">Личный рост</p><h3>${pl == null ? 'Определится по Точке А' : R.levels[pl].t}</h3><p class="small mut">${m ? `По доходу в карман: ${short(m.pocket)}${NB}₽ в месяц. ` : ''}Уроки личного роста стоят внутри шагов бизнеса и отмечены фиолетовым.</p><div class="ladder">${rungs}</div></section>
      <section class="card sec">${acc}</section>
      <section class="card sec legend"><p class="eyebrow">Как открываются уроки</p>
        <ul>
          <li><span class="nd mini-nd is-done">${svg('check')}</span><span>Пройден: видео посмотрено, результат у наставника</span></li>
          <li><span class="nd mini-nd is-now"><span class="num">9</span></span><span>Сейчас: посмотрите урок и отправьте результат наставнику</span></li>
          <li><span class="nd mini-nd is-next"><span class="num">10</span></span><span>Откроется сразу после предыдущего</span></li>
          <li><span class="nd mini-nd is-paid">${svg('lock')}</span><span>Откроется со стартовым доступом</span></li>
        </ul>
      </section>
    </aside>`;
  }

  const app = document.getElementById('app');
  function render() {
    if (!ui.open) ui.open = defaultOpen();
    const path = prepBlock() + R.stages.map(stageBlock).join('');
    app.innerHTML = `${demoBar()}<div class="kab">${side()}<div class="main">${topBar()}
      <main class="content">
        ${bizCard()}
        ${hero()}
        <div class="split">
          <section class="card path-c" aria-label="Уроки маршрута"><ol class="path">${path}</ol></section>
          ${aside()}
        </div>
      </main></div></div>${mnav()}${ui.toast ? `<div class="toast" role="status">${esc(ui.toast)}</div>` : ''}`;
    const d = app.querySelector('.demo');
    if (d && ui.demoOpen) d.open = true;
    const n = document.getElementById('needle');
    if (n) requestAnimationFrame(() => requestAnimationFrame(() => { n.style.transform = `rotate(${n.dataset.to}deg)`; needleWas = Number(n.dataset.to); }));
  }

  let tt;
  function toast(t) { ui.toast = t; clearTimeout(tt); tt = setTimeout(() => { ui.toast = null; const el = app.querySelector('.toast'); if (el) el.remove(); }, 3200); }
  function scrollTo(id, block) { requestAnimationFrame(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: block || 'center' }); }); }
  function setScen(k) { const s = SCEN[k]; if (!s) return; needleWas = -90; Object.assign(ui, { scen: k, done: s.done, watched: s.watched, access: s.access, profile: s.profile, pa: s.pa, onb: s.onb, booked: s.booked, editPA: false, form: null, answer: '', metric: '', flash: 0 }); ui.open = defaultOpen(); }

  app.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || b.tagName === 'SELECT' || b.tagName === 'TEXTAREA' || b.tagName === 'INPUT') return;
    const a = b.dataset.act, v = b.dataset.v;
    const c = cur();
    if (a === 'go') { if (c) { ui.open.add(c.si); render(); scrollTo(`l${c.g}`); } return; }
    if (a === 'goPrep' || a === 'goPA') { ui.open.add('prep'); render(); scrollTo(!ui.profile ? 'p1' : 'p2'); return; }
    if (a === 'profile') { ui.profile = true; ui.scen = 'custom'; toast('Профиль заполнен. Теперь Точка А.'); render(); scrollTo('p2'); return; }
    if (a === 'paMode') { ui.form.mode = v; render(); return; }
    if (a === 'editPA') {
      const p = ui.pa; ui.editPA = true;
      const fm = (x) => (x == null || x === '' ? '' : Number(x).toLocaleString('ru-RU')); const e3 = ['', '', '']; ui.form = { mode: p.mode, inc: (p.inc || e3).map(fm), rev: (p.rev || e3).map(fm), gross: (p.gross || e3).map(fm), net: (p.net || e3).map(fm) };
      ui.open.add('prep'); render(); scrollTo('p2'); return;
    }
    if (a === 'paSave') {
      if (!paValid()) return;
      const f = ui.form; const g = (k) => f[k].map(num);
      const before = startStep();
      ui.pa = f.mode === 'income' ? { mode: 'income', inc: g('inc') } : { mode: 'biz', rev: g('rev'), gross: g('gross'), net: g('net') };
      ui.editPA = false; ui.scen = 'custom'; needleWas = -90;
      const L = levelNow(); const st = startStep();
      if (st !== before) ui.done = Math.min(ui.done, route().filter((l) => R.stages[l.si].n == null).length);
      ui.open = defaultOpen();
      toast(st > 0 ? `Точка А записана. Уровень ${L.name}: маршрут начнётся с этапа ${etapOf(st).k}. Куратор уточнит на установочной.` : `Точка А записана. Уровень ${L.name}, открыт первый урок.`);
      render(); scrollTo('app', 'start'); return;
    }
    if (a === 'book') { ui.booked = true; ui.scen = 'custom'; toast('Вы записаны на установочную сессию. Ссылка придёт в Telegram.'); render(); return; }
    if (a === 'jump') { ui.open.add(+v); render(); scrollTo(`s${v}`, 'start'); return; }
    if (a === 'stage') { const i = v === 'prep' || String(v).startsWith('lv') ? v : +v; ui.open.has(i) ? ui.open.delete(i) : ui.open.add(i); render(); return; }
    if (a === 'watch') { if (!ui.watched) { ui.watched = true; toast('Видео отмечено как просмотренное. Теперь задание.'); } else toast('В прототипе видео нет: на платформе здесь откроется плеер.'); render(); return; }
    if (a === 'submit') {
      if (!c || ui.answer.trim().length < 3) return;
      ui.done += 1; ui.watched = false; ui.answer = ''; ui.metric = ''; ui.scen = 'custom';
      const n = cur();
      if (!n) { ui.flash = 0; toast('Результат у наставника. Маршрут пройден.'); render(); scrollTo('app', 'start'); return; }
      if (state(n) === 'paid') { ui.flash = 0; toast('Результат у наставника. Бесплатная часть маршрута пройдена.'); ui.open = defaultOpen(); render(); scrollTo('wall'); return; }
      ui.flash = n.g; ui.open.add(n.si); toast(`Результат у наставника. Открыт урок №${n.n}.`);
      render(); scrollTo(`l${n.g}`); return;
    }
    if (a === 'buy') { ui.access = 'starter'; ui.scen = 'custom'; toast('Прототип: стартовый доступ включён, оплаты здесь нет.'); render(); return; }
    if (a === 'club') { toast('Клуб добавляет к урокам разборы шагов. Переключите доступ на «Клуб» в панели сверху.'); render(); return; }
    if (a === 'row') {
      const l = pick(+v); const s = state(l);
      if (s === 'next') toast(`Откроется, когда результат урока №${route()[pos(l) - 2].n}.`);
      else if (s === 'wait') toast('Первый урок откроется после Точки А.');
      else if (s === 'skip') toast('Этот шаг наставник может назначить вам, если увидит в нём недоработки.');
      else if (s === 'paid') { toast('Этот урок откроется со стартовым доступом.'); }
      else if (s === 'done') toast('Урок пройден. На платформе здесь откроется урок и ваш записанный результат.');
      render(); return;
    }
  });
  app.addEventListener('input', (e) => {
    if (e.target.dataset.act === 'pa') {
      const t = e.target; const digits = t.value.replace(/[^\d]/g, '');
      t.value = digits ? Number(digits).toLocaleString('ru-RU') : '';
      ui.form[t.dataset.k][+t.dataset.i] = t.value;
      const btn = app.querySelector('[data-act="paSave"]'); if (btn) btn.disabled = !paValid();
      return;
    }
    if (e.target.dataset.act === 'metric') { ui.metric = e.target.value; return; }
    if (e.target.dataset.act === 'answer') {
      ui.answer = e.target.value;
      const btn = app.querySelector('[data-act="submit"]');
      if (btn) btn.disabled = ui.answer.trim().length < 3;
    }
  });
  app.addEventListener('change', (e) => {
    const a = e.target.dataset.act;
    if (!['scen', 'access', 'weights'].includes(a)) return;
    ui.demoOpen = true;
    if (a === 'scen') setScen(e.target.value);
    else if (a === 'access') { ui.access = e.target.value; ui.scen = 'custom'; ui.open = defaultOpen(); }
    else if (a === 'weights') ui.weights = e.target.checked;
    render();
  });
  app.addEventListener('toggle', (e) => { if (e.target.classList && e.target.classList.contains('demo')) ui.demoOpen = e.target.open; }, true);

  setScen('mid');
  render();
})();
