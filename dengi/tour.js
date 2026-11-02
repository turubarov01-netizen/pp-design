/* Фрими-проводник по разделу «Финансы». Та же механика и те же картинки, что в туре кабинета платформы
   (KabinetTour.tsx, TourGuide.tsx): подсветка блока, карточка шага, Фрими показывает флажком на блок. */
(function () {
  const DONE = 'dengi.tour';
  const GUIDE = {
    base: 'img/frimi',
    charH: 950,
    stand: { w: 1507, h: 1165, ax: 721.2, ay: 1069 },
    hang: { w: 835, h: 1189, ax: 219.5, ay: 8 },
    extent: {
      g00: [0.998, 0.001, 0.427, 0.668], g01: [0.998, 0.001, 0.428, 0.667], g02: [1.001, 0.002, 0.475, 0.612],
      g03: [1.023, 0.003, 0.43, 0.628], g04: [1.113, 0.003, 0.561, 0.612], g05: [1.1, 0, 0.432, 0.673],
      g06: [0.962, 0.002, 0.75, 0.523], g07: [1.015, 0.003, 0.423, 0.816], g08: [0.997, 0.04, 0.611, 0.59],
      g09: [1.012, 0.092, 0.428, 0.649], g10: [0, 1.232, 0.219, 0.637], g11: [1.017, 0.064, 0.497, 0.652],
      g12: [1.025, 0.001, 0.458, 0.644], g13: [1.1, -0.02, 0.412, 0.705], g14: [0.995, 0.002, 0.451, 0.633],
      g15: [0.995, 0.002, 0.485, 0.683], g16: [1.041, 0.003, 0.485, 0.67],
    },
  };
  const POSES = Object.keys(GUIDE.extent);
  const FRAME = 14; // рамка подсветки 8 px и ещё 6 px до флажка
  const SINK = 0.45; // сколько роста спрятано за карточкой на телефоне

  const field = (id) => () => { const x = document.getElementById(id); return x && x.closest('.f'); };

  /* Шаг без блока на экране выпадает сам. Шаг с tap ждёт, пока человек сам нажмёт на подсвеченное */
  const STEPS = [
    { id: 'toggle', tab: 'personal', sel: '.tg', title: 'Два раздела', text: 'Слева **личные финансы**, справа **бизнес**. Они считаются отдельно: личный доход на стрелку уровня не влияет. Начнём с личных.' },
    { id: 'mode', tab: 'personal', sel: '.fin-side .seg', title: 'Простой или полный учёт', text: '**Только доход**, если нужно просто видеть, сколько пришло. **Полный учёт**, если хотите вести личную бухгалтерию и понимать, куда уходят деньги.' },
    { id: 'income', tab: 'personal', sel: '[data-act="open"][data-v="income"]', title: 'Записать доход', text: 'Пришли деньги: нажмите сюда, укажите сумму и откуда они. Этого достаточно.' },
    { id: 'expense', tab: 'personal', sel: '[data-act="open"][data-v="expense"]', title: 'Записать расход', text: 'Потратили: нажмите сюда, укажите сумму и название. Категорию можно выбрать сразу или разобрать потом.' },
    { id: 'cats', tab: 'personal', sel: '.fin-side [data-act="manage"]', title: 'Категории и источники', text: 'Здесь добавляются и меняются категории расходов и источники дохода. Запись без категории разбирается кнопкой **Разобрать**.' },
    { id: 'analytics', tab: 'personal', find: () => document.querySelector('.bars') || document.querySelector('.split .col:last-child .card'), title: 'Аналитика', text: 'Столбики показывают доход и расход по месяцам. Нажмите на месяц, и вы увидите его записи и расходы по категориям.' },
    { id: 'flip', tab: 'personal', sel: '.tg', tap: '#tg', title: 'Теперь бизнес', text: '**Нажмите на переключатель**, чтобы перейти в бизнес.' },
    { id: 'monthly', tab: 'business', sel: '#bForm .sec-head', demo: 'Пока это пример: цифры в нём не сохранятся.', title: 'Бизнес раз в месяц', text: 'Итоги вносятся **раз в месяц**. Так вы научитесь считать рентабельность и разделять прибыль компании и свои личные доходы.' },
    { id: 'rev', tab: 'business', find: field('b-rev'), title: 'Выручка', text: 'Общий оборот компании: сколько всего продаж получилось сделать за месяц, до всех расходов.' },
    { id: 'profit', tab: 'business', find: field('b-profit'), title: 'Чистая прибыль компании', text: 'Сколько осталось в компании после всех расходов. Это ваша маржа с бизнеса: часть можно реинвестировать, часть оставить на балансе.' },
    { id: 'pocket', tab: 'business', find: field('b-pocket'), title: 'В карман', text: 'Деньги, которые вы забрали и уже тратите на жизнь. Если их больше, чем записано в личных финансах, я покажу разницу и предложу дописать её одной кнопкой.' },
    { id: 'companies', tab: 'business', sel: '.biz-pick', title: 'Компании', text: 'Чтобы добавить компанию, нажмите **+ Компания**. Если их несколько, цифры вносятся по каждой отдельно, стрелка складывает всё вместе.' },
    { id: 'months', tab: 'business', sel: '#bForm .nav', title: 'Другие месяцы', text: 'Стрелками листайте месяцы. Любой прошлый месяц можно открыть и исправить.' },
    { id: 'table', tab: 'business', sel: '.sum-head', head: '.sum', find: () => { const x = document.querySelector('.sum-head'); return x && x.closest('.card'); }, title: 'Сводный баланс', text: 'Месяц, квартал, полгода и год: выручка, прибыль, рентабельность и карман. Ошиблись в прошлом месяце? **Нажмите на него** в таблице и исправьте.' },
    { id: 'meter', tab: 'business', sel: '.meter', head: '.dial', title: 'Спидометр', text: 'Стрелка показывает, сколько **чистой прибыли** выйдет за год при таком темпе. Считаем с первого месяца, который вы внесёте.' },
  ];

  const ST = {
    phase: 'closed', steps: [], i: 0, was: null, back: null, rect: null, raf: 0, stable: 0, shown: false, timers: [], run: null, busy: false,
  };
  let layer = null;
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nb = (t) => t.replace(/(^|[\s«( *])([а-яёА-ЯЁa-zA-Z]{1,2}|\d+)\s/g, '$1$2 ').replace(/(^|[\s«( *])([а-яёА-ЯЁa-zA-Z]{1,2}|\d+)\s/g, '$1$2 ');
  const rich = (t) => esc(nb(t)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  const visible = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  function targetEl(st) {
    const el = st.find ? st.find() : [...document.querySelectorAll(st.sel)].find(visible);
    if (!visible(el)) return null;
    if (st.head && el.getBoundingClientRect().height > innerHeight * 0.5) {
      const h = document.querySelector(st.head);
      if (visible(h)) return h;
    }
    return el;
  }
  /* Блок встаёт под шапкой, чтобы под ним поместилась карточка и Фрими */
  function bringIn(el) {
    const r = el.getBoundingClientRect();
    const want = innerWidth <= 700 ? 84 : Math.max(84, (innerHeight - r.height) / 2 - 90);
    window.scrollTo({ top: Math.max(0, window.scrollY + r.top - want), behavior: reduce() ? 'auto' : 'smooth' });
  }
  const clear = () => { ST.timers.forEach(clearTimeout); ST.timers = []; };
  const later = (ms, f) => ST.timers.push(setTimeout(f, reduce() ? 0 : ms));

  /* Поза по направлению от груди Фрими на цель: одна из восьми сторон */
  function poseAt(t, x, chest) {
    const tx = Math.min(Math.max(x, t.x + 12), t.x + t.w - 12);
    const ty = Math.min(Math.max(chest, t.y + 8), t.y + t.h - 8);
    const a = (Math.atan2(ty - chest, tx - x) * 180) / Math.PI;
    if (a >= -22.5 && a < 22.5) return 'g07';
    if (a >= -67.5 && a < -22.5) return 'g05';
    if (a >= -112.5 && a < -67.5) return 'g03';
    if (a >= -157.5 && a < -112.5) return 'g04';
    if (a >= 22.5 && a < 90) return 'g09';
    if (a >= 90 && a < 157.5) return 'g08';
    return 'g06';
  }
  const overlap = (a, b) => (Math.min(a.x + a.w, b.x + b.w) > Math.max(a.x, b.x) ? Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)) : 0);

  /* Где стоит Фрими: рядом с карточкой на компьютере, выглядывает из-за неё на телефоне */
  function place(mode, target, box) {
    const wide = innerWidth > 700; const vw = innerWidth;
    if (mode === 'step' && target) {
      const frame = { x: target.x - FRAME, y: target.y - FRAME, w: target.w + FRAME * 2, h: target.h + FRAME * 2 };
      if (wide) {
        const h = 150;
        for (const side of ['right', 'left']) {
          const x = side === 'right' ? box.x + box.w + 24 + h * 0.42 : box.x - 24 - h * 0.42;
          const y = box.y + box.h;
          const pose = poseAt(target, x, y - h * 0.62);
          const [up, , l, r] = GUIDE.extent[pose];
          const full = { x: x - l * h, y: y - up * h, w: (l + r) * h, h: up * h };
          if (full.x < 4 || full.x + full.w > vw - 4 || full.y < 4) continue;
          if (overlap(full, frame) > 0) continue;
          return { x, y, h, pose, behind: false, sink: 0 };
        }
        return null;
      }
      const above = target.y + target.h <= box.y;
      const roof = above ? target.y + target.h + FRAME : 4;
      const room = box.y - roof;
      const x = box.x + box.w - 62;
      const want = poseAt(target, x, box.y - 30);
      const first = want === 'g08' || want === 'g09' ? 'g00' : want;
      for (const pose of [first, 'g00']) {
        const [up, , , r] = GUIDE.extent[pose];
        const h = Math.min(84, room / (up - SINK));
        if (h < 62 || x + r * h > vw - 2) continue;
        return { x, y: box.y + SINK * h, h, pose, behind: true, sink: SINK * h };
      }
      if (!above) {
        const h = 84; const [, down] = GUIDE.extent.g10;
        const x2 = box.x + box.w - 70; const y2 = box.y + box.h - 6;
        if (overlap({ x: x2 - 0.2 * h, y: y2, w: 1.08 * h, h: down * h }, frame) === 0) return { x: x2, y: y2, h, pose: 'g10', behind: true, sink: 0 };
      }
      return null;
    }
    const fin = mode === 'finale';
    const pose = mode === 'bye' ? 'g14' : fin ? 'g12' : 'g16';
    if (wide) { const h = 150; return { x: fin ? box.x + box.w + 24 + h * 0.42 : box.x - 24 - h * 0.42, y: box.y + box.h, h, pose, behind: false, sink: 0 }; }
    const h = mode === 'intro' ? 96 : 84;
    return { x: box.x + box.w - 66, y: box.y + h * 0.42, h, pose, behind: true, sink: h * 0.42 };
  }

  function guideHtml(pl) {
    const size = innerWidth > 700 ? 'd' : 'm';
    const s = pl.h / GUIDE.charH;
    const imgs = POSES.map((n) => {
      const g = n === 'g10' ? GUIDE.hang : GUIDE.stand;
      return `<img class="iit-g-img${n === pl.pose ? ' on' : ''}" data-pose="${n}" src="${GUIDE.base}/${n}-${size}.webp" alt="" draggable="false" decoding="async" style="width:${g.w * s}px;height:${g.h * s}px;left:${-g.ax * s}px;top:${-g.ay * s}px">`;
    }).join('');
    return `<div class="iit-g${pl.behind ? ' behind' : ''}" style="left:${pl.x}px;top:${pl.y}px" aria-hidden="true"><div class="iit-g-in ${pl.behind ? 'rise' : 'hop'}" style="--rise:${Math.round(pl.sink + 10)}px">${imgs}</div></div>`;
  }
  function setPose(n) {
    if (!layer) return;
    layer.querySelectorAll('.iit-g-img').forEach((im) => im.classList.toggle('on', im.dataset.pose === n));
  }
  function showGuide(pl) {
    if (!layer) return;
    const old = layer.querySelector('.iit-g');
    if (old) old.remove();
    if (!pl || (innerWidth <= 700 && innerHeight < 620)) return;
    const box = layer.querySelector('.iit-tip, .iit-sheet');
    const html = guideHtml(pl);
    if (pl.behind && box) box.insertAdjacentHTML('beforebegin', html); else layer.insertAdjacentHTML('beforeend', html);
  }
  function blink() {
    if (!layer) return;
    later(3000 + Math.random() * 2000, () => {
      const on = layer && layer.querySelector('.iit-g-img.on');
      if (on && on.dataset.pose === 'g00') { setPose('g01'); later(130, () => { setPose('g00'); blink(); }); } else blink();
    });
  }

  /* Лист вступления и напутствия */
  function sheet(mode) {
    const intro = mode === 'intro';
    layer.innerHTML = `<div class="iit-full"></div><div class="iit-sheet" role="dialog" aria-modal="true" aria-labelledby="ft-title" tabindex="-1">
      <span class="iit-ey">${intro ? 'Финансы' : 'Готово'}</span>
      <h2 id="ft-title">${intro ? 'Как устроен раздел' : esc(nb(ST.run && ST.run.demo ? 'Добавьте компанию и внесите итоги месяца' : 'Начните с итогов прошлого месяца'))}</h2>
      <p>${esc(nb(intro ? 'Я Фрими, ваш вожатый. Покажу, как вести личные деньги, как раз в месяц подводить итоги бизнеса и где смотреть аналитику.' : 'Проводника можно открыть снова: кнопка со знаком вопроса вверху страницы.'))}</p>
      <button type="button" class="iit-next" data-t="next">${intro ? 'Показать' : 'Понятно'}</button>
      <button type="button" class="iit-skip" data-t="${intro ? 'bye' : 'back'}">${intro ? 'Разберусь сам' : 'Назад'}</button>
    </div>`;
    const el = layer.querySelector('.iit-sheet');
    el.focus({ preventScroll: true });
    const r = el.getBoundingClientRect();
    showGuide(place(mode, null, { x: r.x, y: r.y, w: r.width, h: r.height }));
    if (intro) later(1500, () => setPose('g02'));
  }

  /* Шаг */
  function layout(r) {
    const tip = layer.querySelector('.iit-tip'); const hole = layer.querySelector('.iit-hole');
    const arrow = layer.querySelector('.iit-arrow');
    const vw = innerWidth; const vh = innerHeight; const wide = vw > 700; const pad = 8; const tw = 420;
    const tipH = tip.offsetHeight;
    let gap = vw <= 700 && vh >= 620 ? 44 : 0;
    const fits = (g) => r.y + r.h + pad + 18 + g + tipH < vh - 8;
    if (gap && !fits(gap) && fits(0)) gap = 0; // лучше карточка под блоком без Фрими, чем поверх блока
    const below = fits(gap);
    const top = below ? r.y + r.h + pad + 16 + gap : Math.max(8, r.y - pad - 16 - gap - tipH);
    const left = wide ? Math.min(Math.max(16, r.x + r.w / 2 - tw / 2), vw - tw - 16) : null;
    Object.assign(hole.style, { left: `${r.x - pad}px`, top: `${r.y - pad}px`, width: `${r.w + pad * 2}px`, height: `${r.h + pad * 2}px` });
    tip.style.top = `${top}px`;
    const tap = layer.querySelector('.iit-tap');
    if (tap) Object.assign(tap.style, { left: `${r.x - pad}px`, top: `${r.y - pad}px`, width: `${r.w + pad * 2}px`, height: `${r.h + pad * 2}px` });
    Object.assign(tip.style, wide ? { left: `${left}px`, right: 'auto', margin: '0', width: `${tw}px` } : { left: '', right: '', margin: '', width: '' });
    const ax = Math.min(Math.max(r.x + r.w / 2, 40), vw - 40);
    Object.assign(arrow.style, { left: `${ax - 7}px`, top: `${below ? top - 7 : top + tipH - 7}px` });
    arrow.classList.toggle('up', !below);
    const tipW = wide ? tw : Math.min(vw - 32, 440);
    return { x: wide ? left : (vw - tipW) / 2, y: top, w: tipW, h: tipH };
  }
  function track() {
    cancelAnimationFrame(ST.raf);
    let last = ''; let stillSince = performance.now();
    const tick = () => {
      if (ST.phase !== 'step' || !layer) return;
      const st = ST.steps[ST.i]; const el = targetEl(st);
      if (el) {
        const b = el.getBoundingClientRect();
        const r = { x: b.left, y: b.top, w: b.width, h: b.height };
        const key = [r.x, r.y, r.w, r.h, innerWidth, innerHeight].map(Math.round).join();
        const now = performance.now();
        if (key !== last) {
          last = key; stillSince = now;
          const box = layout(r); ST.rect = r; ST.box = box;
          if (ST.shown) { ST.shown = false; showGuide(null); }
        } else if (!ST.shown && now - stillSince > 120) {
          ST.shown = true; showGuide(place('step', ST.rect, ST.box));
        }
      }
      ST.raf = requestAnimationFrame(tick);
    };
    tick();
  }
  function step(i) {
    clear();
    ST.phase = 'step'; ST.i = i; ST.shown = false;
    const st = ST.steps[i];
    if (window.DengiApp.tab() !== st.tab) window.DengiApp.go(st.tab);
    const n = ST.steps.length;
    const note = st.demo && ST.run && ST.run.demo ? ` ${st.demo}` : '';
    const main = st.tap ? '<span class="iit-wait">Жду нажатия</span>' : '<button type="button" class="iit-next" data-t="next">Далее →</button>';
    layer.innerHTML = `<div class="iit-hole"></div>${st.tap ? '<button type="button" class="iit-tap" data-t="tap" aria-label="Перейти в бизнес"></button>' : ''}<div class="iit-arrow"></div>
      <div class="iit-tip" role="dialog" aria-modal="true" aria-labelledby="ft-title" tabindex="-1">
        <div class="iit-ey"><span>Раздел «Финансы»</span><span class="iit-ey-r">${i + 1} / ${n}<button type="button" class="iit-x" data-t="bye" aria-label="Закрыть проводник">×</button></span></div>
        <h3 id="ft-title">${esc(nb(st.title))}</h3>
        <p>${rich(st.text + note)}</p>
        <div class="iit-seg" style="grid-template-columns:repeat(${n},1fr)" aria-hidden="true">${ST.steps.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
        <div class="iit-act"><button type="button" class="iit-skip" data-t="${i ? 'back' : 'bye'}">${i ? 'Назад' : 'Пропустить'}</button>${main}</div>
      </div>`;
    const tip = layer.querySelector('.iit-tip');
    const el = targetEl(st);
    if (el) bringIn(el);
    (layer.querySelector('.iit-tap') || tip).focus({ preventScroll: true });
    track();
    blink();
  }
  const go = {
    next() {
      if (ST.phase === 'intro') return step(0);
      if (ST.phase === 'step') {
        if (ST.steps[ST.i].tap) return go.tap();
        if (ST.i + 1 < ST.steps.length) return step(ST.i + 1);
        clear(); cancelAnimationFrame(ST.raf); ST.phase = 'finale'; return sheet('finale');
      }
      return close();
    },
    /* Настоящий щелчок по тумблеру: человек видит, как он переключается, и только потом идёт дальше */
    tap() {
      const st = ST.steps[ST.i];
      if (ST.phase !== 'step' || !st.tap || ST.busy) return;
      ST.busy = true;
      const t = document.querySelector(st.tap);
      if (t) t.click();
      later(520, () => { ST.busy = false; step(ST.i + 1); });
    },
    back() {
      if (ST.busy) return undefined;
      if (ST.phase === 'finale') return step(ST.steps.length - 1);
      if (ST.phase === 'step' && ST.i > 0) return step(ST.i - 1);
      return undefined;
    },
    bye() {
      clear();
      if (reduce()) return close();
      setPose('g14');
      return later(550, close);
    },
  };

  function open() {
    if (layer || !window.DengiApp.member()) return;
    ST.was = window.DengiApp.tab(); ST.back = document.activeElement; ST.busy = false;
    ST.run = window.DengiApp.tourStart();
    // Оставляем только шаги, блоки которых есть у этого человека
    ST.steps = STEPS.filter((st) => {
      if (window.DengiApp.tab() !== st.tab) window.DengiApp.go(st.tab);
      return !!targetEl(st);
    });
    if (window.DengiApp.tab() !== ST.was) window.DengiApp.go(ST.was);
    layer = document.createElement('div');
    layer.className = 'iit-layer kab-tour';
    layer.dataset.kabTour = '';
    document.body.appendChild(layer);
    ST.phase = 'intro';
    sheet('intro');
  }
  function close() {
    clear(); cancelAnimationFrame(ST.raf);
    try { localStorage.setItem(DONE, '1'); } catch (e) { /* режим инкогнито */ }
    ST.phase = 'closed';
    if (layer) layer.remove();
    layer = null;
    if (ST.was && window.DengiApp.tab() !== ST.was) window.DengiApp.go(ST.was);
    if (ST.run) { ST.run.stop(); ST.run = null; }
    ST.busy = false;
    window.scrollTo({ top: 0 });
    if (ST.back && ST.back.focus) ST.back.focus({ preventScroll: true });
  }

  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-t]');
    if (b && layer && layer.contains(b)) go[b.dataset.t]();
  });
  document.addEventListener('keydown', (ev) => {
    if (!layer) return;
    if (ev.key === 'Escape') { ev.preventDefault(); close(); } else if (ev.key === 'ArrowRight') { ev.preventDefault(); go.next(); } else if (ev.key === 'ArrowLeft') { ev.preventDefault(); go.back(); } else if (ev.key === 'Tab') {
      const f = [...layer.querySelectorAll('.iit-tap, .iit-tip button, .iit-sheet button')];
      if (!f.length) return;
      const first = f[0]; const last = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); } else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', () => {
    if (!layer) return;
    if (ST.phase === 'intro' || ST.phase === 'finale') { clear(); sheet(ST.phase); }
  });

  window.DengiTour = { open, close };
  let seen = false;
  try { seen = localStorage.getItem(DONE) === '1'; } catch (e) { seen = true; }
  if (!seen) open();
})();
