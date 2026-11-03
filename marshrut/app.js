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
  R.stages.forEach((st, si) => {
    st.ls.forEach((l, i) => {
      const base = st.n == null ? 0 : (st.n + 1) * 1000;
      FLAT.push(Object.assign({}, l, { si, g: FLAT.length + 1, w: base + (i + 1) * 10 }));
    });
  });
  const TOTAL = FLAT.length;
  const pick = (g) => FLAT[g - 1];

  const SCEN = {
    fresh: { label: 'Сразу после диагностики', done: 0, watched: false, access: 'free' },
    mid: { label: 'Урок 4: видео посмотрено, задание не сдано', done: 3, watched: true, access: 'free' },
    wall: { label: '10 бесплатных уроков пройдены', done: 10, watched: false, access: 'free' },
    start: { label: 'Стартовый доступ, урок 15', done: 14, watched: false, access: 'starter' },
    club: { label: 'Клуб, урок 15', done: 14, watched: false, access: 'club' },
  };
  const ACCESS = { free: 'Бесплатно', starter: 'Стартовый доступ', club: 'Клуб' };

  const ui = { scen: 'mid', done: 3, watched: true, access: 'free', weights: false, answer: '', open: null, flash: 0, toast: null, hint: 0 };

  const state = (g) => {
    if (g <= ui.done) return 'done';
    if (ui.access === 'free' && g > FREE) return 'paid';
    return g === ui.done + 1 ? 'now' : 'next';
  };
  const cur = () => (ui.done < TOTAL ? pick(ui.done + 1) : null);

  function defaultOpen() {
    const c = cur();
    const si = c ? c.si : R.stages.length - 1;
    const s = new Set([si]);
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
  };
  const svg = (k, cls) => `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

  const SIDE = [['dash', 'Дашборд Альянса'], ['route', 'Мой маршрут'], ['todo', 'Трекер Фримана'], ['cal', 'Календарь'], ['feed', 'Лента'], ['msg', 'Сообщения'], ['lib', 'Библиотека'], ['people', 'Члены Альянса']];
  const MOB = [['dash', 'Альянс'], ['route', 'Маршрут'], ['todo', 'Трекер'], ['lib', 'Библиотека']];
  const side = () => `<aside class="side" aria-label="Меню Альянса">
    <div class="brand"><img src="img/context-alliance.png" alt="" width="34" height="34"><span><b>Freeman's Alliance</b><span>кабинет Альянса</span></span></div>
    ${SIDE.map(([k, l]) => `<div class="nav-i ${k === 'route' ? 'on' : ''}">${svg(k)}<span>${l}</span></div>`).join('')}
  </aside>`;
  const mnav = () => `<nav class="mnav" aria-label="Нижнее меню">${MOB.map(([k, l]) => `<span class="${k === 'route' ? 'on' : ''}">${svg(k)}${l}</span>`).join('')}</nav>`;
  const lvl = () => R.levels[R.person.level];
  const topBar = () => `<header class="top"><h1>Мой маршрут</h1><div class="me"><span class="ava">${esc(R.person.name[0])}</span><div><b>${esc(R.person.name)}</b><span>${esc(ACCESS[ui.access])}</span></div></div></header>`;

  function demoBar() {
    const opts = (o, v) => Object.entries(o).map(([k, l]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${esc(typeof l === 'string' ? l : l.label)}</option>`).join('');
    return `<details class="demo"><summary><span class="demo-tag">Прототип</span><span class="demo-sum">Вымышленный участник. ${esc(SCEN[ui.scen] ? SCEN[ui.scen].label : 'Свой сценарий')}. ${esc(ACCESS[ui.access])}</span><span class="demo-more">Ситуации</span></summary>
      <div class="demo-body">
        <label>Ситуация<select data-act="scen">${opts(SCEN, ui.scen)}${ui.scen === 'custom' ? '<option value="custom" selected>Свой сценарий</option>' : ''}</select></label>
        <label>Доступ<select data-act="access">${opts(ACCESS, ui.access)}</select></label>
        <label class="chk-l"><input type="checkbox" data-act="weights" ${ui.weights ? 'checked' : ''}> Показать вес урока</label>
        <p class="demo-note">Урок открывается по очереди: посмотреть видео, затем записать результат задания. Проверка куратора не задерживает. Вес урока задаёт порядок: тысячи — шаг бизнеса, остаток — место внутри шага.</p>
      </div></details>`;
  }

  /* Шапка маршрута */
  function hero() {
    const c = cur();
    const stc = c ? R.stages[c.si] : null;
    const paidWall = c && state(c.g) === 'paid';
    let eyebrow = 'Где вы сейчас', h, sub, cta;
    if (!c) {
      h = 'Маршрут пройден';
      sub = `Все ${lessonsWord(TOTAL)} позади. Новые уроки по вашим шагам появятся здесь.`;
    } else if (paidWall) {
      h = 'Бесплатная часть пройдена';
      sub = `Вы прошли ${lessonsWord(FREE)}. Ещё ${lessonsWord(TOTAL - FREE)} этого маршрута откроются со стартовым доступом.`;
      cta = `<button class="btn" data-act="buy">Открыть весь маршрут</button>`;
    } else {
      h = stc.n == null ? 'Старт маршрута' : `Шаг ${stc.n}. ${esc(stc.title)}`;
      sub = `Урок ${c.g} из ${TOTAL}. Следующий откроется, когда вы посмотрите этот и запишете результат задания.`;
      cta = `<button class="btn" data-act="go">${svg('play', 'ic-f')}Продолжить урок ${c.g}</button>`;
    }
    const segs = R.stages.map((st, si) => {
      const ls = FLAT.filter((l) => l.si === si);
      const done = ls.filter((l) => l.g <= ui.done).length;
      const pct = ls.length ? Math.round((done / ls.length) * 100) : (c && c.si > si ? 100 : 0);
      const isCur = c && c.si === si;
      const label = st.n == null ? 'Старт' : `Шаг ${st.n}. ${st.title}`;
      return `<button class="seg-i ${isCur ? 'cur' : ''} ${ls.length ? '' : 'empty'}" style="flex-grow:${Math.max(1, ls.length)}" data-act="jump" data-v="${si}" title="${esc(label)}" aria-label="${esc(label)}: ${done} из ${ls.length}"><i><u style="width:${pct}%"></u></i></button>`;
    }).join('');
    const stepNo = !c ? 'Маршрут пройден' : stc.n == null ? 'Старт, до шагов бизнеса' : `Шаг бизнеса ${stc.n}${NB}из${NB}15`;
    return `<section class="card hero">
      <div class="hero-t">
        <p class="eyebrow">${eyebrow}</p>
        <h2>${h}</h2>
        <p class="hero-sub">${sub}</p>
      </div>
      <div class="hero-a">${cta || ''}</div>
      <div class="hero-p">
        <div class="segs" role="group" aria-label="Этапы маршрута">${segs}</div>
        <div class="segs-x"><span class="num">Пройдено <b>${ui.done}${NB}из${NB}${TOTAL}</b></span><span>${stepNo}</span></div>
      </div>
    </section>`;
  }

  /* Строка урока */
  function lessonRow(l) {
    const s = state(l.g);
    const kind = l.p ? 'pers' : 'biz';
    const tag = l.p ? `<span class="tag pers">Личный рост</span>` : '';
    const w = ui.weights ? `<span class="wt num">вес ${l.w}</span>` : '';
    let node;
    if (s === 'done') node = svg('check');
    else if (s === 'paid') node = svg('lock');
    else node = `<span class="num">${l.g}</span>`;
    const meta = s === 'done' ? `Результат записан` : s === 'paid' ? `${l.m}${NB}мин · со стартовым доступом` : s === 'next' && l.g === ui.done + 2 ? `${l.m}${NB}мин · откроется после урока ${l.g - 1}` : `${l.m}${NB}мин`;
    if (s === 'now') return nowCard(l, kind, tag, w);
    return `<li class="ls is-${s} ${kind}" id="l${l.g}">
      <span class="nd">${node}</span>
      <button class="ls-b" data-act="row" data-v="${l.g}"><span class="ls-t">${esc(l.t)}</span><span class="ls-m">${tag}<span>${meta}</span>${w}</span></button>
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
    const step2 = `<li class="${watched ? 'todo' : 'wait'}">
        <span class="chk-n">2</span>
        <div class="chk-b"><b>Задание</b><span>${esc(task)}</span>
          ${watched ? `<label class="ans"><span class="vh">Ваш результат</span><textarea data-act="answer" rows="3" placeholder="Ваш результат">${esc(ui.answer)}</textarea></label>
          <div class="ans-a"><button class="btn sm" data-act="submit" ${ui.answer.trim().length < 3 ? 'disabled' : ''}>Записать результат</button><span class="small mut">Куратор посмотрит позже. Ждать проверки не нужно.</span></div>` : `<span class="wait-n">Откроется после просмотра</span>`}
        </div>
      </li>`;
    return `<li class="ls is-now ${kind} ${ui.flash === l.g ? 'enter' : ''}" id="l${l.g}">
      <span class="nd"><span class="num">${l.g}</span></span>
      <div class="now">
        <div class="now-h"><p class="eyebrow">Сейчас · урок ${l.g}</p><h3>${esc(l.t)}</h3><div class="ls-m">${tag}${w}</div></div>
        <ol class="chk">${step1}${step2}</ol>
      </div>
    </li>`;
  }

  function wall() {
    const rest = TOTAL - FREE;
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
    const done = ls.filter((l) => l.g <= ui.done).length;
    const c = cur();
    const passed = ls.length ? done === ls.length : (c ? c.si > si : true);
    const isCur = c && c.si === si;
    const allPaid = ls.length && ls.every((l) => state(l.g) === 'paid');
    const open = ui.open.has(si);
    const mins = ls.reduce((a, l) => a + l.m, 0);
    const time = mins >= 60 ? `${Math.floor(mins / 60)}${NB}ч${mins % 60 ? ` ${mins % 60}${NB}мин` : ''}` : `${mins}${NB}мин`;
    let meta;
    if (!ls.length) meta = 'Уроки шага готовятся';
    else if (passed) meta = 'Пройден';
    else if (done) meta = `${done} из ${ls.length} · ${time}`;
    else meta = `${lessonsWord(ls.length)} · ${time}`;
    const chips = [];
    if (ui.access === 'club' && isCur && st.n != null) chips.push('<span class="tag club">Разбор шага в клубе</span>');
    if (allPaid) chips.push(`<span class="tag lock">${svg('lock')}Стартовый доступ</span>`);
    const badge = passed && ls.length ? svg('check') : st.n == null ? svg('flag') : `<span class="num">${st.n}</span>`;
    const head = `<li class="st ${passed ? 'is-passed' : ''} ${isCur ? 'is-cur' : ''}" id="s${si}">
      <span class="nd sq">${badge}</span>
      <button class="st-b" data-act="stage" data-v="${si}" aria-expanded="${open}" ${ls.length ? '' : 'disabled'}>
        <span class="st-t">${st.n == null ? '' : `<span class="st-k">Шаг ${st.n}</span>`}${esc(st.title)}</span>
        <span class="st-m"><span>${meta}</span>${chips.join('')}</span>
        ${ls.length ? svg('chev', 'chev') : ''}
      </button>
    </li>`;
    let body = '';
    if (open && ls.length) {
      body = ls.map((l) => lessonRow(l) + (ui.access === 'free' && l.g === FREE && ui.done <= FREE ? wall() : '')).join('');
    } else if (!open && ui.access === 'free' && ls.some((l) => l.g === FREE) && ui.done <= FREE) {
      body = wall();
    }
    return head + body;
  }

  function aside() {
    const L = lvl();
    const rungs = R.levels.map((x, i) => `<div class="rung ${i === R.person.level ? 'cur' : ''} ${i < R.person.level ? 'past' : ''}"><i></i><b>${x.t}</b></div>`).join('');
    const acc = ui.access === 'free'
      ? `<p class="eyebrow">Доступ</p><h3>Бесплатно: ${lessonsWord(FREE)}</h3><p class="small mut">Маршрут виден целиком. Уроки с 11-го откроются со стартовым доступом.</p><div class="mini"><i><u style="width:${Math.min(100, (Math.min(ui.done, FREE) / FREE) * 100)}%"></u></i><span class="num">${Math.min(ui.done, FREE)} из ${FREE}</span></div><button class="btn wide" data-act="buy">Открыть весь маршрут</button>`
      : ui.access === 'starter'
        ? `<p class="eyebrow">Доступ</p><h3>Стартовый доступ</h3><p class="small mut">Открыты все ${lessonsWord(TOTAL)} маршрута, по порядку.</p><button class="btn soft wide" data-act="club">Что добавляет клуб</button>`
        : `<p class="eyebrow">Доступ</p><h3>Клуб</h3><p class="small mut">Все уроки маршрута и разборы шагов с наставником.</p>`;
    return `<aside class="col">
      <section class="card sec"><p class="eyebrow">Личный рост</p><h3>${L.t}</h3><p class="small mut">По доходу: ${esc(R.person.income)}. Уроки личного роста стоят внутри шагов бизнеса и отмечены фиолетовым.</p><div class="ladder">${rungs}</div></section>
      <section class="card sec">${acc}</section>
      <section class="card sec legend"><p class="eyebrow">Как открываются уроки</p>
        <ul>
          <li><span class="nd mini-nd is-done">${svg('check')}</span><span>Пройден: видео посмотрено, результат записан</span></li>
          <li><span class="nd mini-nd is-now"><span class="num">9</span></span><span>Сейчас: посмотрите урок и запишите результат задания</span></li>
          <li><span class="nd mini-nd is-next"><span class="num">10</span></span><span>Откроется сразу после предыдущего</span></li>
          <li><span class="nd mini-nd is-paid">${svg('lock')}</span><span>Откроется со стартовым доступом</span></li>
        </ul>
      </section>
    </aside>`;
  }

  const app = document.getElementById('app');
  function render() {
    if (!ui.open) ui.open = defaultOpen();
    const path = R.stages.map(stageBlock).join('');
    app.innerHTML = `${demoBar()}<div class="kab">${side()}<div class="main">${topBar()}
      <main class="content">
        ${hero()}
        <div class="split">
          <section class="card path-c" aria-label="Уроки маршрута"><ol class="path">${path}</ol></section>
          ${aside()}
        </div>
      </main></div></div>${mnav()}${ui.toast ? `<div class="toast" role="status">${esc(ui.toast)}</div>` : ''}`;
    const d = app.querySelector('.demo');
    if (d && ui.demoOpen) d.open = true;
  }

  let tt;
  function toast(t) { ui.toast = t; clearTimeout(tt); tt = setTimeout(() => { ui.toast = null; const el = app.querySelector('.toast'); if (el) el.remove(); }, 3200); }
  function scrollTo(id, block) { requestAnimationFrame(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: block || 'center' }); }); }
  function setScen(k) { const s = SCEN[k]; if (!s) return; Object.assign(ui, { scen: k, done: s.done, watched: s.watched, access: s.access, answer: '', flash: 0 }); ui.open = defaultOpen(); }

  app.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || b.tagName === 'SELECT' || b.tagName === 'TEXTAREA' || b.tagName === 'INPUT') return;
    const a = b.dataset.act, v = b.dataset.v;
    const c = cur();
    if (a === 'go') { if (c) { ui.open.add(c.si); render(); scrollTo(`l${c.g}`); } return; }
    if (a === 'jump') { ui.open.add(+v); render(); scrollTo(`s${v}`, 'start'); return; }
    if (a === 'stage') { const i = +v; ui.open.has(i) ? ui.open.delete(i) : ui.open.add(i); render(); return; }
    if (a === 'watch') { if (!ui.watched) { ui.watched = true; toast('Видео отмечено как просмотренное. Теперь задание.'); } else toast('В прототипе видео нет: на платформе здесь откроется плеер.'); render(); return; }
    if (a === 'submit') {
      if (!c || ui.answer.trim().length < 3) return;
      ui.done += 1; ui.watched = false; ui.answer = ''; ui.scen = 'custom';
      const n = cur();
      if (!n) { ui.flash = 0; toast('Результат записан. Маршрут пройден.'); render(); scrollTo('app', 'start'); return; }
      if (state(n.g) === 'paid') { ui.flash = 0; toast('Результат записан. Бесплатная часть маршрута пройдена.'); ui.open = defaultOpen(); render(); scrollTo('wall'); return; }
      ui.flash = n.g; ui.open.add(n.si); toast(`Результат записан. Открыт урок ${n.g}.`);
      render(); scrollTo(`l${n.g}`); return;
    }
    if (a === 'buy') { ui.access = 'starter'; ui.scen = 'custom'; toast('Прототип: стартовый доступ включён, оплаты здесь нет.'); render(); return; }
    if (a === 'club') { toast('Клуб добавляет к урокам разборы шагов. Переключите доступ на «Клуб» в панели сверху.'); render(); return; }
    if (a === 'row') {
      const l = pick(+v); const s = state(l.g);
      if (s === 'next') toast(`Откроется, когда будет записан результат урока ${l.g - 1}.`);
      else if (s === 'paid') { toast('Этот урок откроется со стартовым доступом.'); }
      else if (s === 'done') toast('Урок пройден. На платформе здесь откроется урок и ваш записанный результат.');
      render(); return;
    }
  });
  app.addEventListener('input', (e) => {
    if (e.target.dataset.act === 'answer') {
      ui.answer = e.target.value;
      const btn = app.querySelector('[data-act="submit"]');
      if (btn) btn.disabled = ui.answer.trim().length < 3;
    }
  });
  app.addEventListener('change', (e) => {
    const a = e.target.dataset.act;
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
