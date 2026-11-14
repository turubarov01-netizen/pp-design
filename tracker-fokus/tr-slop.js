/* Трекер Фримана, вкладка «Фокус дня»: лестница шагов как в демо дашборда.
   Шаг из ?step=N, правки накапливаются: на шаге N действуют шаги 1..N. */
(function () {
  const Q = new URLSearchParams(location.search);
  const MAX = 8;
  const STEP = Math.max(0, Math.min(MAX, parseInt(Q.get('step') || '0', 10) || 0));
  const html = document.documentElement;
  for (let i = 1; i <= STEP; i++) html.classList.add('s' + i);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, inner) => { const e = document.createElement(tag); if (cls) e.className = cls; if (inner != null) e.innerHTML = inner; return e; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const STEPS = [
    ['Как есть', 'Вкладка как на сайте сейчас: собрана по коду FocusTab и FocusHero.'],
    ['Лучшие практики', 'Одна шкала шрифтов, один стиль карточек без полос и серых шапок, одна главная кнопка «Сделал шаг».'],
    ['Иерархия', 'Сверху план дня, под ним то, что считается в день: привычки, потом задачи. Пульс справа, история РАД в конце. Награды в одной строке с «Днём в разгоне».'],
    ['Кнопки-награды', 'Кнопки поднимаются при наведении. «Сделал шаг» и «Записать РАД» показывают выигрыш, значок летит.'],
    ['Матовое стекло', 'Карточки полупрозрачные поверх пейзажа, внутри одна плитка для вложенных блоков.'],
    ['Ничего не свёрнуто', 'Шаги цели, история РАД и выполненные задачи видны сразу. Задача раскрывается на месте, видимость в «Пульсе» выбирается одной кнопкой.'],
    ['Вкладки', 'У вкладок значки и счётчик, полоса держится сверху. На телефоне вкладки в одну строку со свайпом вместо сетки 3×2.'],
    ['Быстрые действия', 'Поиск с ⌘K: отметить шаг, записать РАД, добавить задачу или привычку, перейти на вкладку. Нажмите ⌘K или на поиск.'],
    ['Оживление', 'При открытии дорога прорисовывается, полосы дня и пульс месяца растут, опыт досчитывается.'],
  ];

  const I = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/></svg>',
    task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>',
    coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1.2 1.6 2.5 2 2.5.9 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5v1.5M12 16v1.5"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM8 7h7"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/></svg>',
    paw: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="9" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17" cy="9" r="2"/><path d="M12 11.5c-3 0-5.5 3.2-5.5 5.4 0 1.6 1.3 2.4 2.8 2.1 1-.2 1.8-.6 2.7-.6s1.7.4 2.7.6c1.5.3 2.8-.5 2.8-2.1 0-2.2-2.5-5.4-5.5-5.4z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    go: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    rep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
  };

  // ---------- шаг 0: данные, которые на сайте рисует React ----------
  // Пульс месяца: 30 дней ноября, сегодня 14-е
  const pulse = $('#pulse');
  const moved = [1, 2, 3, 5, 6, 8, 9, 10, 12, 13], part = [4, 7, 11];
  for (let d = 1; d <= 30; d++) {
    const b = el('i');
    const mv = moved.includes(d), pt = part.includes(d);
    b.className = mv ? 'mv' : pt ? 'pt' : '';
    if (d > 14) b.classList.add('fu');
    b.style.height = mv ? '100%' : pt ? '45%' : '14%';
    b.title = d + ' ноября';
    pulse.append(b);
  }
  // Дорога: 9 точек по пути, 4 пройдено, пятая — сегодняшний шаг
  const road = $('#road'), path = road.querySelector('path');
  const L = path.getTotalLength();
  const dots = [];
  for (let k = 0; k < 9; k++) {
    const p = path.getPointAtLength(L * k / 8);
    const d = el('span', 'dot' + (k < 4 ? ' done' : k === 4 ? ' now' : ''));
    d.style.left = p.x + '%'; d.style.top = p.y + '%';
    road.append(d); dots.push(d);
  }
  const pNow = path.getPointAtLength(L * 4 / 8), pEnd = path.getPointAtLength(L);
  const flag = el('img'); flag.src = 'img/focus-flag.webp'; flag.alt = ''; flag.style.left = `calc(${pNow.x}% - 29px)`; flag.style.top = `calc(${pNow.y}% - 66px)`;
  const cup = el('img'); cup.src = 'img/focus-cup.webp'; cup.alt = ''; cup.style.left = `calc(${pEnd.x}% - 40px)`; cup.style.top = `calc(${pEnd.y}% - 6px)`;
  road.append(flag, cup);

  // «Все шаги цели» и «Показать разборы» работают и на шаге 0
  const ws = $('#ws');
  ws.innerHTML = `<p class="ws-k">Шаги цели · 6 из&nbsp;20 сделано</p>
    <div class="ws-l">
      <div class="ws-r done"><span class="cb on">${I.check}</span><span>Собрать список выпускников</span></div>
      <div class="ws-r done"><span class="cb on">${I.check}</span><span>Записать вводный урок потока</span></div>
      <div class="ws-r now"><span class="cb">${I.check}</span><span>Созвониться с&nbsp;тремя выпускниками и&nbsp;собрать отзывы</span><span class="badge pr">В&nbsp;плане</span></div>
      <div class="ws-r"><span class="cb">${I.check}</span><span>Смонтировать урок и&nbsp;выложить в&nbsp;школу</span></div>
      <div class="ws-r"><span class="cb">${I.check}</span><span>Пост-анонс потока в&nbsp;канал</span></div>
      <div class="ws-r"><span class="cb">${I.check}</span><span>Разослать приглашение по&nbsp;базе</span></div>
    </div>
    <button class="ws-add">${I.plus}Добавить шаг</button>`;
  $('#allsteps').addEventListener('click', () => html.classList.toggle('ws-open'));
  $('#radt').addEventListener('click', () => html.classList.toggle('rad-open'));
  $$('.x-tg').forEach(b => b.addEventListener('click', () => html.classList.toggle('td-open')));

  // ---------- шаг 2: иерархия ----------
  if (STEP >= 2) {
    const colL = $('#colL'), colR = $('#colR');
    colL.prepend($('#c-habits'));            // привычки считаются в день — выше задач
    colR.append($('#c-rad'));                // история — в конец
    const run = $('#run'), rew = $('.rew');  // награды в одной строке с «Днём в разгоне»
    const g = run.querySelector('.g');
    const xp = el('span', 'sl-xp', rew.innerHTML); g.append(xp); rew.remove();
  }

  // ---------- шаг 3: кнопки-награды ----------
  function win(btn, a, b, icon) {
    if (!btn) return;
    btn.classList.add('sl-win');
    btn.innerHTML = `<span class="sl-ico">${icon}</span><span class="sl-lbl"><span class="sl-a">${a}</span><span class="sl-b">${b}</span></span>`;
  }
  if (STEP >= 3) {
    win($('#a-done'), 'Сделал шаг', 'Ещё шаг, и&nbsp;до&nbsp;цели 12', I.flag);
    win($('#a-rad'), 'Записать РАД', 'Разбор дня за&nbsp;2 минуты', I.pen);
    const ab = $('#a-pick'); if (ab) ab.innerHTML = `${I.rep}Выбрать шаг`;
  }

  // ---------- шаг 5: ничего не свёрнуто ----------
  if (STEP >= 5) {
    html.classList.add('ws-open', 'rad-open', 'td-open');
    $('#allsteps').remove();
    // шаги цели — своей карточкой первой в левой колонке, как «Над чем работаю сегодня» на сайте
    const card = el('section', 'sc', `<header><i></i><div><p class="lb">Шаги цели «Поток Фокуса на&nbsp;40 человек»</p><p class="hn">Сделано 6 из&nbsp;20</p></div></header><div class="bd"></div>`);
    card.querySelector('.bd').append(ws); $('#colL').prepend(card);
    const r = $('#c-tasks .row');
    if (r) {
      r.classList.add('open');
      r.querySelector('.more').innerHTML = `<p>От&nbsp;Игоря Графа · срок сегодня</p><p>Пройтись по&nbsp;сценарию субботнего эфира: блок про отзывы и&nbsp;финал. Правки голосом или текстом в&nbsp;чат.</p><div class="more-a"><button class="sl-q">${I.check}Сделано</button><button class="sl-q gh">Перенести на&nbsp;завтра</button></div>`;
    }
  }

  // ---------- шаг 6: вкладки ----------
  if (STEP >= 6) {
    const IC = { focus: I.target, tasks: I.task, growth: I.coin, diary: I.book, wishes: I.star, zveryok: I.paw };
    $$('.tab').forEach(t => { const s = t.querySelector('.ti'); if (s) s.innerHTML = IC[t.dataset.t] || ''; });
  }

  // ---------- шаг 7: быстрые действия ⌘K ----------
  if (STEP >= 7) {
    const ph = $('.ph');
    const k = el('button', 'sl-k', `${I.search}<span>Действие или поиск</span><kbd>⌘K</kbd>`);
    ph.append(k);
    const ACTS = [
      ['Сегодня', [[I.flag, 'Отметить шаг 7 сделанным', 'Enter'], [I.pen, 'Записать РАД', 'R'], [I.plus, 'Добавить задачу', 'N'], [I.plus, 'Добавить привычку', 'H']]],
      ['Перейти', [[I.task, 'Задачи', ''], [I.coin, 'Финансы', ''], [I.book, 'Дневник успеха', ''], [I.star, '1000 целей', ''], [I.paw, 'Зверёк', '']]],
    ];
    const pal = el('div', 'sl-pal', `<div class="sl-pw"><div class="sl-pi">${I.search}<input placeholder="Что сделать?" aria-label="Что сделать?"><kbd>esc</kbd></div>
      ${ACTS.map(([g, a]) => `<p class="sl-pg">${g}</p>${a.map(([ic, t, kb], i) => `<button class="sl-pa${g === 'Сегодня' && !i ? ' on' : ''}">${ic}<span>${t}</span>${kb ? `<kbd>${kb}</kbd>` : ''}</button>`).join('')}`).join('')}</div>`);
    document.body.append(pal);
    const open = () => { pal.classList.add('on'); setTimeout(() => pal.querySelector('input').focus(), 30); };
    const close = () => pal.classList.remove('on');
    k.addEventListener('click', open);
    pal.addEventListener('click', e => { if (e.target === pal) close(); });
    addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.classList.contains('on') ? close() : open(); }
      if (e.key === 'Escape') close();
    });
    pal.querySelector('input').addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      $$('.sl-pa', pal).forEach(b => { b.style.display = !q || b.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    });
    if (Q.has('pal')) open();
  }

  // ---------- шаг 8: оживление при открытии ----------
  if (STEP >= 8 && !reduce) {
    const ease = 'cubic-bezier(.22,1,.36,1)';
    path.style.strokeDasharray = 'none';
    const len = 400; path.setAttribute('pathLength', len);
    path.animate([{ strokeDasharray: `0 ${len}` }, { strokeDasharray: `${len} 0` }], { duration: 1100, easing: ease, fill: 'backwards' })
      .finished.then(() => { path.style.strokeDasharray = ''; });
    dots.forEach((d, i) => d.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 380, delay: 120 + i * 110, easing: ease, fill: 'backwards' }));
    [flag, cup].forEach((m, i) => m.animate([{ transform: 'translateY(12px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: 700 + i * 500, easing: ease, fill: 'backwards' }));
    $$('.bar em').forEach((b, i) => b.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 900, delay: 250 + i * 140, easing: ease, fill: 'backwards' }));
    $$('#pulse i').forEach((b, i) => b.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 600, delay: 200 + i * 22, easing: ease, fill: 'backwards' }));
    $$('.wk span.on').forEach((b, i) => b.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 320, delay: 300 + i * 40, easing: ease, fill: 'backwards' }));
    // опыт досчитывается
    const xpNode = [...document.querySelectorAll('.sl-xp span, .rew span')].find(s => /XP/.test(s.textContent));
    if (xpNode) {
      const svg = xpNode.querySelector('svg')?.outerHTML || '';
      const t0 = performance.now();
      const tick = now => { const p = Math.min(1, (now - t0) / 1000); const v = Math.round(40 * (1 - Math.pow(1 - p, 4))); xpNode.innerHTML = `${svg}+${v} XP сегодня`; if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }
  }

  // ---------- панель шагов ----------
  const bar = el('div', 'sl-steps');
  const href = n => { const q = new URLSearchParams(location.search); q.set('step', n); q.delete('pal'); return '?' + q.toString(); };
  bar.innerHTML = `
    <div class="sl-nums">${STEPS.map((s, i) => `<a href="${href(i)}" class="${i === STEP ? 'on' : i < STEP ? 'done' : ''}" title="${s[0]}">${i}</a>`).join('')}</div>
    <div class="sl-cap"><b>${STEP}. ${STEPS[STEP][0]}</b><span>${STEPS[STEP][1]}</span></div>
    <div class="sl-arr"><a href="${href(STEP - 1)}" class="${STEP === 0 ? 'off' : ''}" aria-label="Назад">←</a><a href="${href(STEP + 1)}" class="${STEP === MAX ? 'off' : ''}" aria-label="Дальше">→</a></div>`;
  document.body.append(bar);
  addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input')) return;
    if (e.key === 'ArrowRight' && STEP < MAX) location.href = href(STEP + 1);
    if (e.key === 'ArrowLeft' && STEP > 0) location.href = href(STEP - 1);
  });
})();
