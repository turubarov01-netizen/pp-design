/* Прототип раздела «Финансы» в трекере Фримана. Всё хранится только в браузере. */
(function () {
  const M = window.Model;
  const { PERSONAS, CATS } = window.Seeds;
  const STORE = 'dengi.v7';
  const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  const MONTHS_G = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const MONTHS_L = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'];
  const MONTHS_S = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const TRACKS = { income: 'Личный доход', rev: 'Выручка компании' };
  const SYMBOL = { USD: '$', RUB: '₽', EUR: '€' };
  // Четыре категории источника, как в таблице income_sources на платформе: по ним ПЭРЛ считает долю своего дела
  const INC_CATS = [['own_business', 'Свой бизнес'], ['employment', 'Наёмный труд'], ['investment', 'Инвестиции'], ['other', 'Разовый доход']];
  const incCat = (v) => (INC_CATS.find((x) => x[0] === v) || [])[1] || '';

  const app = document.getElementById('app');
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } })();
  const prefs = {
    persona: 'micro', role: 'member', ...saved.prefs,
  };
  const data = saved.data || {};
  const ui = {
    demoOpen: false, composer: null, draft: null, biz: null, period: null, offer: null, month: null, sort: null, rec: false, recVal: '', toast: null, manage: null, mg: null, ask: false,
  };
  let needleWas = -90;
  let thumbWas = null;

  const d = () => {
    if (!PERSONAS[prefs.persona]) prefs.persona = 'micro';
    if (!data[prefs.persona]) data[prefs.persona] = fresh();
    return data[prefs.persona];
  };
  const fresh = () => ({ cats: CATS.map((k) => ({ ...k })), ...PERSONAS[prefs.persona].make() });
  // Пока идёт проводник, пример компании и его временные настройки на диск не попадают, даже если закрыть вкладку посреди шага
  const save = () => {
    const t = ui.tour;
    const keep = t ? function (k, v) {
      if (this !== t.p) return v;
      if (k === 'businesses') return v.filter((b) => !b.tourDemo);
      return k === 'personalMode' ? t.mode : k === 'bizView' ? t.view : k === 'tab' ? t.tab : v;
    } : undefined;
    try { localStorage.setItem(STORE, JSON.stringify({ prefs, data }, keep)); } catch (e) { /* режим инкогнито */ }
  };
  const uid = () => `x${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Деньги */
  const group = (n) => {
    const neg = n < 0;
    const s = String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '−' : '') + s;
  };
  const wrap = (s, cur) => (cur === 'USD' ? (s.startsWith('−') ? `−$${s.slice(1)}` : `$${s}`) : `${s} ${SYMBOL[cur]}`);
  const money = (v, cur = d().cur) => wrap(group(v), cur);
  const usd = (u, cur = d().cur) => money(u * M.RATES[cur], cur);
  const compactNum = (x) => {
    const a = Math.abs(x); const sign = x < 0 ? '−' : '';
    if (a >= 1e6) return `${sign}${String(Math.round(a / 1e5) / 10).replace('.', ',')} млн`;
    if (a >= 1e4) return `${sign}${Math.round(a / 1e3)} тыс`;
    return group(x);
  };
  const compact = (u, cur = d().cur) => wrap(compactNum(u * M.RATES[cur]), cur);
  const goalText = (v, cur = d().cur) => wrap(v >= 1e6 ? `${String(v / 1e6).replace('.', ',')}\u00a0млн` : group(v), cur);
  const compactBare = (u, cur = d().cur) => compactNum(u * M.RATES[cur]);
  const inDisp = (e) => (e.cur === d().cur ? e.amount : (e.amount / M.RATES[e.cur]) * M.RATES[d().cur]);
  const toUsd = (e) => e.amount / M.RATES[e.cur];
  const pct = (x) => (x == null ? 'нет' : `${x < 0 ? '−' : ''}${Math.abs(Math.round(x * 100))}%`);
  const parseNum = (s) => {
    const v = String(s == null ? '' : s).replace(/\s| /g, '').replace(',', '.').replace('−', '-');
    if (v === '' || v === '-') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  };

  /* Даты */
  const dayOf = (s) => { const dt = M.parse(s); return `${dt.getDate()} ${MONTHS_S[dt.getMonth()]}`; };
  const monthNo = (key) => Number(key.slice(5, 7)) - 1;
  const monthName = (key) => MONTHS[monthNo(key)];
  const curMonth = () => M.monthKey(d().today);
  const viewMonth = () => {
    if (ui.month) return ui.month;
    const now = curMonth(); const prev = M.addMonths(now, -1); const es = d().entries;
    const count = (k) => es.filter((e) => M.monthKey(e.date) === k).length;
    return count(now) < 3 && count(prev) > 0 ? prev : now;
  };
  const dueKey = (p = d()) => M.addMonths(M.monthKey(p.today), -1);

  /* Справочники человека */
  const srcOf = (id) => d().sources.find((x) => x.id === id);
  const catOf = (id) => d().cats.find((x) => x.id === id);
  const activeSrc = () => d().sources.filter((x) => !x.archived && !x.sys);
  const activeCats = () => d().cats.filter((x) => !x.archived);
  const plural = (n, one, few, many) => {
    const a = n % 100; const b = n % 10;
    return `${n} ${a > 10 && a < 20 ? many : b === 1 ? one : b >= 2 && b <= 4 ? few : many}`;
  };

  /* Компании: каждая вносится отдельно, вместе они складываются */
  const companies = () => d().businesses.filter((b) => !b.archived);
  const bizOf = (id) => d().businesses.find((b) => b.id === id);
  const allPeriods = () => M.combine(d().businesses.map((b) => b.periods));
  const curBiz = () => {
    const p = d(); const list = companies();
    if (p.bizView === 'all' && p.businesses.length > 1) return null;
    return list.find((b) => b.id === p.bizView) || (list.length === 1 ? list[0] : null);
  };
  const viewPeriods = () => { const b = curBiz(); return b ? b.periods : allPeriods(); };

  /* Сверка кармана с личными финансами: сколько уже записано от этой компании за месяц.
     Дописка стоит сегодняшним числом, поэтому считается за месяц из ссылки, а не за свою дату */
  const bizSource = (id) => d().sources.find((s) => s.bizId === id);
  const gotFor = (bizId, key) => {
    const src = bizSource(bizId);
    if (!src) return 0;
    return d().entries.filter((e) => e.type === 'income' && e.src === src.id && (e.link ? e.link === key : M.monthKey(e.date) === key)).reduce((a, e) => a + inDisp(e), 0);
  };

  /* Прибор считает то, что выбрал человек: личный доход или выручку всех компаний.
     Пока человек не выбрал сам, при компании считаем выручку, без неё личный доход */
  const trackOf = (p = d()) => p.track || (p.businesses.some((b) => !b.archived) ? 'rev' : 'income');
  const incomeRows = () => {
    const map = new Map();
    d().entries.filter((e) => e.type === 'income').forEach((e) => {
      const key = e.link || M.monthKey(e.date);
      map.set(key, (map.get(key) || 0) + toUsd(e));
    });
    return [...map.entries()].map(([key, income]) => ({ key, income })).sort((a, b) => a.key.localeCompare(b.key));
  };
  const meterData = () => {
    const p = d(); const metric = trackOf(p);
    return { metric, label: TRACKS[metric], stats: metric === 'income' ? M.incomeStats(incomeRows(), p.today) : M.stats(allPeriods(), 'rev') };
  };
  const trackLow = (t) => TRACKS[t].replace(/^./, (c) => c.toLowerCase());

  /* Переход на уровень: заявка куратору, подтверждение, экзамен. Неподтверждённый результат закрывает ведение финансов на 3 месяца */
  const LOCK_MONTHS = 3;
  const locked = (p = d()) => !!p.lockedUntil && p.today < p.lockedUntil;
  const editable = () => prefs.role === 'member' && !locked();
  const lockDate = (today) => {
    const key = M.addMonths(M.monthKey(today), LOCK_MONTHS);
    return `${key}-${M.pad(Math.min(Number(today.slice(8, 10)), M.lastDay(key)))}`;
  };

  /* Прибор */
  const CX = 170; const CY = 166; const R = 136;
  const pt = (t, r = R) => { const a = Math.PI * (1 - t); return [CX + r * Math.cos(a), CY - r * Math.sin(a)]; };
  const arc = (t0, t1) => {
    const [x0, y0] = pt(t0); const [x1, y1] = pt(t1);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  function dial(s, target, top) {
    const clamp = (x) => Math.max(0, Math.min(1, x));
    const factT = clamp(s.fact / target); const planT = clamp(s.forecast / target);
    let ticks = '';
    for (let i = 0; i <= 20; i += 1) {
      const big = i % 5 === 0;
      const [x0, y0] = pt(i / 20, R + 13); const [x1, y1] = pt(i / 20, R + (big ? 22 : 18));
      ticks += `<line class="tick" x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke-width="${big ? 1.6 : 1}"/>`;
    }
    const [lx, ly] = pt(0.5, R + 32);
    return `<svg viewBox="0 0 340 186" role="img" aria-label="Прогноз ${Math.round(planT * 100)} процентов цели уровня">
      <defs><linearGradient id="gFact" gradientUnits="userSpaceOnUse" x1="34" y1="0" x2="306" y2="0"><stop offset="0" stop-color="#2f7bff"/><stop offset="1" stop-color="#7b61ff"/></linearGradient></defs>
      <path class="trackarc" d="${arc(0, 1)}" fill="none" stroke-width="16" stroke-linecap="round"/>
      ${planT > factT ? `<path class="planarc" d="${arc(0, planT)}" fill="none" stroke-width="16" stroke-linecap="round"/>` : ''}
      ${factT > 0.002 ? `<path class="factarc" d="${arc(0, factT)}" fill="none" stroke="url(#gFact)" stroke-width="16" stroke-linecap="round"/>` : ''}
      ${ticks}
      <text x="${lx}" y="${ly + 4}" text-anchor="middle">50%</text>
      <text x="8" y="184">0</text>
      <text x="332" y="184" text-anchor="end">${top}</text>
      <g class="needle" id="needle" style="transform:rotate(${needleWas}deg)" data-to="${(-90 + 180 * planT).toFixed(2)}">
        <line x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - R + 16}"/><circle cx="${CX}" cy="${CY}" r="8"/><circle cx="${CX}" cy="${CY}" r="3"/>
      </g>
    </svg>`;
  }

  // Что под прибором: заявка, её статус или кнопка перехода
  function upBlock(canUp, s) {
    const p = d(); const r = p.request; const mem = prefs.role === 'member';
    const sum = (u) => `<b class="num">${usd(u)}</b>`;
    if (locked(p)) return '';
    if (r && r.status === 'pending') {
      return mem
        ? `<div class="up"><span><b>Заявка у куратора.</b> Результат ${sum(r.factUsd)}, ${trackLow(r.track)}. Пока куратор не ответит, следующий уровень закрыт.</span></div>`
        : `<div class="up"><span><b>Заявка на переход.</b> Участник заявил ${sum(r.factUsd)}, ${trackLow(r.track)}. Попросите подтвердить результат.</span><div class="row"><button class="btn sm" data-act="reqConfirm">Подтвердить</button><button class="btn ghost sm" data-act="reqReject">Не подтвердился</button></div></div>`;
    }
    if (r && r.status === 'confirmed') {
      return mem
        ? `<div class="up"><span><b>Результат подтверждён.</b> Остался экзамен перед людьми, после него откроется уровень ${p.level + 1}.</span></div>`
        : `<div class="up"><span><b>Результат подтверждён.</b> Остался экзамен перед людьми.</span><button class="btn sm" data-act="examPass">Экзамен сдан</button></div>`;
    }
    if (!canUp || !mem) return '';
    if (ui.ask) {
      return `<div class="up ask"><div><b>Подать заявку куратору?</b><p>Куратор получит уведомление и попросит подтвердить результат ${sum(s.fact)}. Если результат не подтвердится, ведение финансов закроется на ${LOCK_MONTHS} месяца. После подтверждения останется экзамен перед людьми.</p></div><div class="row"><button class="btn sm" data-act="askYes">Подать заявку</button><button class="btn ghost sm" data-act="askNo">Проверить цифры</button></div></div>`;
    }
    return `<div class="up"><span>Цель уровня достигнута: ${sum(s.fact)}. Чтобы перейти дальше, подайте заявку куратору.</span><button class="btn sm" data-act="askUp">Подать заявку</button></div>`;
  }

  function meter() {
    const p = d(); const m = meterData(); const s = m.stats;
    const lv = M.LEVELS[p.level - 1];
    const goal = M.levelGoal(p.level, m.metric, p.cur);
    const target = M.levelTarget(p.level, m.metric, p.cur);
    const has = s.n > 0;
    const share = has ? s.forecast / target : 0;
    const months = Math.round(s.months * 10) / 10;
    const monthsTxt = `${String(months).replace('.', ',')} мес`;
    const left = Math.max(0, target - s.fact);
    const canUp = M.canLevelUp(p.level, s.fact, m.metric, p.cur);
    const base = s.closedFact == null ? s.fact : s.closedFact;

    const none = m.metric === 'income' ? 'Запишите первый доход, и стрелка покажет, что выйдет за год' : p.businesses.length ? 'Внесите первый месяц, и стрелка покажет, что выйдет за год' : 'Добавьте компанию, и стрелка покажет, что выйдет за год';
    let read;
    if (!has) read = `<b class="empty">Пока нет данных</b><span>${none}</span>`;
    else if (s.forecast < 0) read = `<b class="num">${usd(s.forecast)}</b><span>${esc(trackLow(m.metric))}: прогноз на год пока ниже нуля</span>`;
    else read = `<b class="num">${usd(s.forecast)}</b><span>${s.weight >= 1 - 1e-9 ? 'за 12 месяцев' : 'прогноз на год'} · ${share > 9.99 ? 'намного выше цели' : `${pct(share)} цели уровня`}</span>`;

    const rows = has ? `
      <div class="lv-row"><dt>Уже сделано</dt><dd class="num">${usd(s.fact)} <span class="mut small">за ${monthsTxt}${s.thisMonth ? ' и текущий' : ''}</span></dd></div>
      <div class="lv-row"><dt>Сейчас в среднем</dt><dd class="num">${usd(s.perMonth)} <span class="mut small">в месяц</span></dd></div>
      <div class="lv-row"><dt>Нужно для цели</dt><dd class="num">${usd(target / 12)} <span class="mut small">в месяц</span></dd></div>` : `
      <div class="lv-row"><dt>Нужно для цели</dt><dd class="num">${usd(target / 12)} <span class="mut small">в месяц</span></dd></div>`;

    let how = '';
    if (has) {
      const whole = Math.abs(s.months - Math.round(s.months)) < 1e-6 ? Math.round(s.months) : null;
      how = s.weight >= 1 - 1e-9
        ? 'Считаем сумму за последние 12 месяцев: это уже факт, а не прогноз.'
        : `Как считаем: ${group(base * M.RATES[p.cur])} за ${whole != null ? `${whole} мес` : monthsTxt} → ${group(s.perMonth * M.RATES[p.cur])} в месяц → × 12.`;
      if (s.thisMonth) how += ' Текущий месяц войдёт в расчёт, когда закончится.';
      if (s.n < 3 && s.weight < 1) how += ' По одному-двум месяцам прогноз пока грубый.';
      if (s.forecast >= target && !canUp) how += ` Темп выше цели. Заявку на переход можно подать, когда сумма станет фактом: осталось ${usd(left)}.`;
    }

    const ladder = M.LEVELS.map((l) => {
      const t = M.levelTarget(l.n, m.metric, p.cur);
      const fill = l.n < p.level ? 1 : l.n === p.level ? Math.max(0, Math.min(1, s.fact / t)) : 0;
      return `<div class="rung ${l.n === p.level ? 'now' : ''}"><i><u style="width:${(fill * 100).toFixed(1)}%"></u></i><b>${l.name}</b><span>${goalText(M.levelGoal(l.n, m.metric, p.cur))}</span></div>`;
    }).join('');

    const pick = prefs.role === 'member' && !p.request && !locked(p);
    const track = pick
      ? `<div class="lv-track"><span>Считаем по</span><div class="seg" role="group" aria-label="По чему считать уровень">${Object.entries(TRACKS).map(([k, t]) => `<button data-act="track" data-v="${k}" aria-pressed="${k === m.metric}">${t}</button>`).join('')}</div></div>`
      : `<div class="lv-track ro">Считаем: ${esc(trackLow(m.metric))}</div>`;
    const source = p.levelSource.replace('{goal}', goalText(M.levelGoal(1, 'income', p.cur)));

    return `<section class="card meter">
      <div class="dial">${dial(s, target, goalText(goal))}<div class="dial-read">${read}</div></div>
      <div>
        ${track}
        <div class="lv-head"><div class="eyebrow">Уровень ${lv.n} из 3</div><h2>${lv.name}</h2></div>
        <div class="lv-sub">Цель уровня за год: личный доход ${goalText(M.levelGoal(p.level, 'income', p.cur))} или выручка компании ${goalText(M.levelGoal(p.level, 'rev', p.cur))}. ${esc(source)}.${m.metric === 'rev' && p.businesses.length > 1 ? ' Считаем все компании вместе.' : ''}</div>
        <dl class="lv-rows">${rows}</dl>
        ${how ? `<p class="how">${how}</p>` : ''}
        <div class="ladder" aria-label="Три уровня развития">${ladder}</div>
      </div>
      ${upBlock(canUp, s)}
    </section>`;
  }

  /* Сводки для переключателя */
  const monthEntries = (key) => d().entries.filter((e) => M.monthKey(e.date) === key);
  const sumType = (list, type) => list.filter((e) => e.type === type).reduce((a, e) => a + inDisp(e), 0);

  /* Тумблер: два положения, выключенного нет */
  function toggle() {
    const p = d(); const biz = p.tab === 'business';
    return `<div class="tg" role="group" aria-label="Раздел финансов">
      <button class="tg-l" data-act="tab" data-v="personal" aria-pressed="${!biz}" tabindex="-1">Личные финансы</button>
      <button class="tg-t" id="tg" role="switch" aria-checked="${biz}" aria-label="Бизнес" data-act="flip" data-pos="${thumbWas || p.tab}"><i></i></button>
      <button class="tg-l" data-act="tab" data-v="business" aria-pressed="${biz}" tabindex="-1">Бизнес</button>
    </div>`;
  }

  const TRACKER_TABS = ['Фокус дня', 'Задачи', 'Финансы', 'Дневник успеха', '1000 целей', 'Зверёк'];
  const tracker = () => `<div class="trk">${TRACKER_TABS.map((l) => `<span class="${l === 'Финансы' ? 'on' : ''}">${l.replace(' успеха', '<u> успеха</u>')}</span>`).join('')}</div>`;

  /* Оболочка кабинета Альянса */
  const ICON = {
    dash: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    route: '<path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>',
    todo: '<rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    cal: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    feed: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9a2 2 0 0 1 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    lib: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    edit: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
  const SIDE = [['dash', 'Дашборд Альянса'], ['route', 'Мой маршрут'], ['todo', 'Трекер Фримана'], ['cal', 'Календарь'], ['feed', 'Лента'], ['msg', 'Сообщения'], ['lib', 'Библиотека'], ['people', 'Члены Альянса']];
  const MOB = [['dash', 'Альянс'], ['todo', 'Трекер'], ['cal', 'Календарь'], ['feed', 'Лента']];
  const side = () => `<aside class="side" aria-label="Меню Альянса">
    <div class="brand"><img src="img/context-alliance.png" alt="" width="34" height="34"><span><b>Freeman's Alliance</b><span>кабинет Альянса</span></span></div>
    ${SIDE.map(([k, l]) => `<div class="nav-i ${k === 'todo' ? 'on' : ''}">${svg(k)}<span>${l}</span></div>`).join('')}
  </aside>`;
  const mnav = () => `<nav class="mnav" aria-label="Нижнее меню">${MOB.map(([k, l]) => `<span class="${k === 'todo' ? 'on' : ''}">${svg(k)}${l}</span>`).join('')}</nav>`;
  const topBar = () => {
    const p = d();
    const who = prefs.role === 'mentor' ? 'Наставник' : PERSONAS[prefs.persona].title;
    return `<header class="top"><h1>Трекер Фримана</h1>${prefs.role === 'member' ? '<button class="help" data-act="tour" aria-label="Как устроен раздел «Финансы»" title="Как устроен раздел">?</button>' : ''}<div class="me"><span class="ava">${esc(who[0])}</span><div><b>${esc(who)}</b><span>Уровень ${p.level} из 3</span></div></div></header>`;
  };

  /* Столбики */
  function bars(rows, sel, act) {
    const max = Math.max(1, ...rows.map((r) => Math.max(r.a, r.b || 0)));
    const solo = rows.every((r) => r.b == null);
    const body = rows.map((r) => {
      const h = Math.max(2, (r.a / max) * 100);
      const inner = r.b == null ? '' : `<u style="height:${r.a > 0 ? Math.max(0, Math.min(100, (r.b / r.a) * 100)) : 0}%"></u>`;
      return `<button class="bar ${solo ? 'solo' : ''} ${r.key === sel ? 'sel' : ''}" ${act ? `data-act="${act}" data-v="${r.key}"` : ''} title="${monthName(r.key)}"><i style="height:${h}%">${inner}</i></button>`;
    }).join('');
    const xs = rows.map((r) => `<span>${MONTHS_S[monthNo(r.key)].slice(0, 1).toUpperCase()}</span>`).join('');
    return `<div class="bars">${body}</div><div class="bars-x">${xs}</div>`;
  }
  const last12 = (end) => { const out = []; for (let i = 11; i >= 0; i -= 1) out.push(M.addMonths(end, -i)); return out; };

  /* Личные финансы */
  function composer(type) {
    const p = d(); const c = ui.draft; const full = p.personalMode === 'full';
    const list = type === 'income' ? activeSrc() : activeCats();
    const kind = type === 'income' ? 'src' : 'cat';
    const adding = ui.mg && ui.mg.from === 'composer';
    const chips = list.map((x) => `<button class="chip" data-act="pick" data-v="${x.id}" aria-pressed="${c.pick === x.id}">${esc(x.name)}</button>`).join('')
      + (adding ? '' : `<button class="chip add" data-act="mgQuick" data-v="${kind}">+ ${type === 'income' ? 'источник' : 'категория'}</button>`);
    const notes = [...new Set(p.entries.filter((e) => e.note).map((e) => e.note))];
    const curChips = ['RUB', 'USD', 'EUR'].map((k) => `<button class="chip" data-act="curPick" data-v="${k}" aria-pressed="${c.cur === k}">${SYMBOL[k]}</button>`).join('');
    return `<div class="compose">
      <div class="compose-row">
        <label class="f"><span>${type === 'income' ? 'Сколько пришло' : 'Сколько потратили'}</span><input class="inp big" id="amt" inputmode="decimal" autocomplete="off" value="${esc(c.amount)}" placeholder="0"></label>
        <div class="chips" role="group" aria-label="Валюта">${curChips}</div>
      </div>
      <div id="fx" class="mut small">${fxLine()}</div>
      <div class="f"><div class="lab"><span>${type === 'income' ? 'Откуда' : 'На что'}${type === 'expense' ? ' <small>можно не выбирать</small>' : ''}</span><button class="link" data-act="manageOpen" data-v="personal">Настроить</button></div><div class="chips" id="pickers">${chips}</div>${adding ? mgForm() : ''}</div>
      <div class="two ${type === 'expense' ? '' : 'solo'}">
        ${type === 'expense' ? `<label class="f"><span>Название</span><input class="inp" id="note" list="notes" autocomplete="off" value="${esc(c.note)}" placeholder="Например, аренда"><datalist id="notes">${notes.map((n) => `<option value="${esc(n)}">`).join('')}</datalist></label>` : ''}
        <label class="f"><span>Дата</span><input class="inp" id="date" type="date" value="${esc(c.date)}"></label>
      </div>
      ${type === 'expense' && full ? `<label class="check"><input type="checkbox" id="rep" ${c.repeat ? 'checked' : ''}> Повторять каждый месяц</label>` : ''}
      <div id="cerr" class="err"></div>
      <div class="row"><button class="btn" data-act="saveEntry">Сохранить</button><button class="btn ghost" data-act="closeComposer">Отмена</button></div>
    </div>`;
  }
  function fxLine() {
    const c = ui.draft; const p = d();
    if (!c || c.cur === p.cur) return '';
    const v = parseNum(c.amount);
    if (v == null || Number.isNaN(v)) return `Запишем сумму как есть и сохраним курс этой даты.`;
    return `≈ ${money((v / M.RATES[c.cur]) * M.RATES[p.cur])} по курсу этой даты. Старые записи при смене валюты не меняются.`;
  }

  function personal() {
    const p = d(); const key = viewMonth(); const full = p.personalMode === 'full';
    const list = monthEntries(key).slice().sort((a, b) => b.date.localeCompare(a.date));
    // При выборе «по личному доходу» спидометр стоит и здесь: доходы записываются в этом разделе
    const level = trackOf(p) === 'income' ? meter() : (prefs.role === 'member' && !p.request && !locked(p) ? `<div class="track-hint"><span>Уровень считается по выручке компании.</span><button class="link" data-act="track" data-v="income">Считать по личному доходу</button></div>` : '');
    const inc = sumType(list, 'income'); const exp = sumType(list, 'expense');
    const prevInc = sumType(monthEntries(M.addMonths(key, -1)), 'income');
    const delta = prevInc > 0 ? (inc - prevInc) / prevInc : null;
    const isMember = editable();
    const series = last12(curMonth()).map((k) => {
      const l = monthEntries(k);
      return full ? { key: k, a: sumType(l, 'income'), b: Math.min(sumType(l, 'expense'), sumType(l, 'income')) } : { key: k, a: sumType(l, 'income') };
    });

    let body;
    if (!p.entries.length) {
      body = `<div class="fig"><small>Доход за ${monthName(key)}</small><b class="num">${money(0)}</b></div>
        <p class="mut" style="margin:8px 0 0">Запишите первое поступление: сумма, источник, готово. Этого достаточно, чтобы видеть рост.</p>`;
    } else if (full) {
      body = `<div class="top-fig wide"><div class="figs">
        <div class="fig"><small>Доход</small><b class="num">${money(inc)}</b></div>
        <div class="fig"><small>Расход</small><b class="num">${money(exp)}</b></div>
        <div class="fig"><small>Осталось</small><b class="num">${money(inc - exp)}</b></div></div>
        <div>${bars(series, key, 'month')}<div class="bar-key"><span><i class="l"></i>доход</span><span><i></i>расход</span></div></div></div>`;
    } else {
      body = `<div class="top-fig"><div class="figs">
        <div class="fig"><small>Доход за ${monthName(key)}</small><b class="num">${money(inc)}</b>${delta != null ? `<em class="num ${delta >= 0 ? 'up-t' : ''}">${delta >= 0 ? '+' : '−'}${Math.abs(Math.round(delta * 100))}% к ${MONTHS_S[monthNo(M.addMonths(key, -1))]}</em>` : ''}</div></div>
        <div>${bars(series, key, 'month')}</div></div>`;
    }

    const srcRows = p.sources.map((s) => ({
      s, v: list.filter((e) => e.type === 'income' && e.src === s.id).reduce((a, e) => a + inDisp(e), 0),
    })).filter((x) => x.v > 0 || (!x.s.archived && !x.s.sys)).sort((a, b) => b.v - a.v)
      .map(({ s, v }) => `<div class="cat"><span>${esc(s.name)}</span><span class="amt num">${money(v)}</span><i><u style="width:${inc > 0 ? (v / inc) * 100 : 0}%"></u></i></div>`).join('');

    const catRows = full ? p.cats.map((k) => ({
      k, v: list.filter((e) => e.type === 'expense' && e.cat === k.id).reduce((a, e) => a + inDisp(e), 0),
    })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v).map(({ k, v }) => `<div class="cat"><span>${esc(k.name)}</span><span class="amt num">${money(v)}</span><i><u style="width:${(v / exp) * 100}%"></u></i></div>`).join('') : '';
    const noCat = list.filter((e) => e.type === 'expense' && e.cat === 'none');
    const noCatSum = noCat.reduce((a, e) => a + inDisp(e), 0);

    const tpl = full && isMember && !ui.composer && (p.templates || []).length ? `<div class="tpl" style="margin-top:10px"><span class="mut small">Частое:</span>${p.templates.map((t) => `<button class="chip" data-act="tpl" data-v="${t.id}">${esc(t.title)} ${money(t.amount, 'RUB')}</button>`).join('')}</div>` : '';

    const actions = isMember ? `<div class="row" style="margin-top:14px">
      ${ui.composer ? '' : `<button class="btn" data-act="open" data-v="income">+ Доход</button>${full ? '<button class="btn ghost" data-act="open" data-v="expense">+ Расход</button><button class="btn ghost" data-act="recOpen">Сверить остаток</button>' : ''}`}
    </div>${tpl}${ui.composer ? composer(ui.composer) : ''}${ui.rec ? reconcile() : ''}` : '';

    const rowsHtml = list.length ? list.map((e) => {
      const name = e.type === 'income' ? (srcOf(e.src) || {}).name || 'Доход' : (e.note || (catOf(e.cat) || {}).name || 'Без категории');
      const tags = [e.link ? `из бизнеса, итоги ${MONTHS_G[monthNo(e.link)]}` : '', e.auto ? 'повтор' : '', e.cur !== p.cur ? `${money(e.amount, e.cur)}` : ''].filter(Boolean).join(' · ');
      const needsSort = e.type === 'expense' && e.cat === 'none';
      return `<div class="it"><span class="d">${dayOf(e.date)}</span><span class="t">${esc(name)}${tags ? `<em>${tags}</em>` : ''}${needsSort && isMember ? ` <button class="link" data-act="sort" data-v="${e.id}">Разобрать</button>` : ''}</span><span class="a num ${e.type === 'income' ? 'in' : ''}">${e.type === 'income' ? '+' : ''}${money(inDisp(e))}</span>${isMember ? `<button class="x" data-act="del" data-v="${e.id}" aria-label="Удалить запись">×</button>` : '<span></span>'}</div>
      ${ui.sort === e.id ? `<div class="sort chips">${activeCats().map((k) => `<button class="chip" data-act="sortTo" data-v="${k.id}">${esc(k.name)}</button>`).join('')}</div>` : ''}`;
    }).join('') : `<p class="mut small" style="margin:6px 0 0">В ${MONTHS_L[monthNo(key)]} записей нет. Это нормально: дописывать пропущенное не нужно.</p>`;

    const cfg = isMember ? '<button class="link" data-act="manageOpen" data-v="personal">Настроить</button>' : '';
    const aside = `${full ? `<section class="card sec"><div class="sec-head"><h2>Расходы по категориям</h2>${cfg}</div>${noCatSum ? `<p class="mut small num" style="margin:-8px 0 8px">Без категории: ${money(noCatSum)}</p>` : ''}${catRows ? `<div class="cats">${catRows}</div>` : '<p class="mut small" style="margin:0">Расходов в этом месяце пока нет.</p>'}</section>` : ''}
      <section class="card sec"><div class="sec-head"><h2>Источники дохода</h2>${cfg}</div>${srcRows ? `<div class="cats">${srcRows}</div>` : '<p class="mut small" style="margin:0">Источников пока нет.</p>'}</section>`;

    return `<div class="stack">
      ${isMember && ui.manage === 'personal' ? manager() : ''}
      ${level}
      <div class="split"><div class="col">
      <section class="card sec">
        <div class="sec-head"><div class="nav"><button data-act="mPrev" aria-label="Предыдущий месяц">‹</button><b>${monthName(key)[0].toUpperCase()}${monthName(key).slice(1)} ${key.slice(0, 4)}</b><button data-act="mNext" aria-label="Следующий месяц" ${key >= curMonth() ? 'disabled' : ''}>›</button></div></div>
        ${body}${actions}
      </section>
      ${p.entries.length ? `<section class="card sec"><div class="sec-head"><h2>Записи</h2>${isMember ? '<button class="link" data-act="csv">Скачать CSV</button>' : ''}</div><div class="list">${rowsHtml}</div></section>` : ''}
      </div><div class="col">${aside}</div></div>
      <div class="stub">Цель, точка А, метрики и аналитика остаются здесь же, как сейчас. В прототипе они не показаны.</div>
    </div>`;
  }

  function reconcile() {
    const p = d(); const mark = p.balance;
    return `<div class="compose">
      <label class="f"><span>Сколько денег у вас сейчас на всех счетах и наличными</span><input class="inp" id="recVal" inputmode="decimal" autocomplete="off" value="${esc(ui.recVal)}" placeholder="${mark ? group(mark.amount) : '0'}"><small>${mark ? `Прошлая сверка ${dayOf(mark.date)}: ${money(mark.amount)}.` : 'Первая сверка: запомним сумму как точку отсчёта.'} Разница станет одной строкой, дописывать траты не нужно.</small></label>
      <div id="recLive" class="mut small">${recLine()}</div>
      <div class="row"><button class="btn" data-act="recSave">Сверить</button><button class="btn ghost" data-act="recClose">Отмена</button></div>
    </div>`;
  }
  function recDiff() {
    const p = d(); const v = parseNum(ui.recVal);
    if (!p.balance || v == null || Number.isNaN(v)) return null;
    const since = p.entries.filter((e) => e.date > p.balance.date);
    return p.balance.amount + sumType(since, 'income') - sumType(since, 'expense') - v;
  }
  function recLine() {
    const x = recDiff();
    if (x == null || Math.round(x) === 0) return x == null ? '' : 'Всё сходится.';
    return x > 0 ? `Неразобранные траты: ${money(x)}.` : `Неразобранный доход: ${money(-x)}.`;
  }

  /* Бизнес */
  const periodOf = (key) => { const b = curBiz(); return b ? b.periods.find((x) => x.key === key && x.kind === 'month') : null; };
  function setPeriod(key) {
    const p = d(); ui.period = key; ui.offer = null;
    const row = periodOf(key); const k = M.RATES[p.cur];
    const val = (v) => (row ? group(v * k) : '');
    ui.biz = { rev: val(row && row.rev), profit: val(row && row.profit), pocket: val(row && row.pocket) };
  }
  function bizCheck() {
    const b = ui.biz;
    const rev = parseNum(b.rev); const profit = parseNum(b.profit); const pocket = parseNum(b.pocket);
    let err = '';
    if ([rev, profit, pocket].some((x) => Number.isNaN(x))) err = 'Проверьте суммы: нужны только цифры.';
    else if (rev != null && rev < 0) err = 'Выручка не может быть меньше нуля.';
    else if (pocket != null && pocket < 0) err = 'Сумма в карман не может быть меньше нуля.';
    else if (rev != null && profit != null && profit > rev) err = 'Прибыль не может быть больше выручки.';
    return { rev, profit, pocket, err };
  }
  function bizLive() {
    const { rev, profit, pocket, err } = bizCheck();
    const parts = [];
    if (!err && rev > 0 && profit != null) parts.push(`Рентабельность <b class="num">${pct(profit / rev)}</b>`);
    if (!err && profit != null && pocket != null) {
      const rest = profit - pocket;
      parts.push(rest >= 0 ? `Осталось в бизнесе <b class="num">${money(rest)}</b>` : `Вывели больше прибыли на <b class="num">${money(-rest)}</b>: это нормально, если брали из накопленного`);
    }
    return { html: parts.map((x) => `<span>${x}</span>`).join(''), err };
  }

  function business() {
    const p = d(); const isMember = editable();
    if (!p.businesses.length) {
      if (!isMember) return `<div class="stack">${meter()}<section class="card sec"><p class="mut" style="margin:0">Компании пока нет.</p></section></div>`;
      return `<div class="stack">${meter()}<section class="card sec">
        <h2>Добавьте свою компанию</h2>
        <p class="mut" style="margin:6px 0 12px;max-width:62ch">Здесь три цифры: выручка, чистая прибыль компании и сколько вы взяли в карман. Полный учёт ведите в своей бухгалтерии или CRM, сюда только итог. Если компаний несколько, добавьте каждую: цифры вносятся отдельно, выручка складывается.</p>
        <div class="row"><input class="inp" id="bizName" maxlength="64" style="max-width:320px" placeholder="Название компании" aria-label="Название компании"><button class="btn" data-act="bizAdd">Добавить</button></div>
        <div id="cerr" class="err" style="margin-top:6px"></div>
      </section></div>`;
    }
    const cur = curBiz();
    const viewed = viewPeriods();
    const due = dueKey();
    if (!ui.period || !ui.biz) setPeriod(due);
    const title = `Итоги ${MONTHS_G[monthNo(ui.period)]}`;
    const filled = !!periodOf(ui.period);
    const live = bizLive();
    const rows = M.rollup(viewed);
    const rows12 = rows.slice(-12);
    const tot = rows12.reduce((a, r) => ({ rev: a.rev + r.rev, profit: a.profit + r.profit, pocket: a.pocket + r.pocket }), { rev: 0, profit: 0, pocket: 0 });
    const compactTable = window.innerWidth < 640;
    const f = (u) => (compactTable ? compactBare(u) : usd(u));
    const series = last12(M.addMonths(curMonth(), -1)).map((k) => {
      const r = rows.find((x) => x.key === k);
      return { key: k, a: r ? Math.max(0, r.rev) : 0, b: r ? Math.max(0, r.profit) : 0 };
    });
    const cov = M.coverage(viewed, p.today);
    const range = ui.range || 'month';
    const groups = M.groupPeriods(viewed, range);
    const latest = groups[groups.length - 1];
    const LIMIT = { month: 12, quarter: 8, half: 6, year: 5 };
    const yy = (g) => (compactTable ? String(g.y).slice(2) : g.y);
    const short = (g) => ({ month: `${MONTHS_S[g.n - 1]} ${String(g.y).slice(2)}`, quarter: `${g.n} кв ${yy(g)}`, half: `${g.n} пол ${yy(g)}`, year: `${g.y}` }[range]);
    const long = (g) => ({ month: `${MONTHS[g.n - 1].replace(/^./, (c) => c.toUpperCase())} ${g.y}`, quarter: `${g.n} квартал ${g.y}`, half: `${g.n} полугодие ${g.y}`, year: `${g.y} год` }[range]);
    const part = (g) => (g.filled < g.size ? `заполнено ${g.filled} из ${g.size} мес` : '');
    const canEdit = isMember && range === 'month' && !!cur;
    // Одна строка на компанию за тот же период, что и сводка выше
    const byCompany = !cur && latest ? p.businesses.map((b) => ({ b, g: M.groupPeriods(b.periods, range).find((x) => x.id === latest.id) })).filter((x) => x.g || !x.b.archived) : [];
    const seg = [['month', 'Месяц'], ['quarter', 'Квартал'], ['half', 'Полгода'], ['year', 'Год']]
      .map(([k, t]) => `<button data-act="range" data-v="${k}" aria-pressed="${range === k}">${t}</button>`).join('');
    const table = rows.length ? `<section class="card sec">
      <div class="sec-head"><h2>Сводный баланс</h2><div class="seg range" role="group" aria-label="Период">${seg}</div></div>
      <div class="sum-head"><b>${long(latest)}</b>${part(latest) ? `<span class="mut small">${part(latest)}</span>` : ''}</div>
      <div class="sum">
        <div class="fig sm"><small>Выручка</small><b class="num">${usd(latest.rev)}</b></div>
        <div class="fig sm"><small>Чистая прибыль</small><b class="num">${usd(latest.profit)}</b></div>
        <div class="fig sm"><small>Рентабельность</small><b class="num">${pct(M.margin(latest.profit, latest.rev))}</b></div>
        <div class="fig sm"><small>В карман</small><b class="num">${usd(latest.pocket)}</b></div>
      </div>
      ${byCompany.length ? `<div class="tw co-t"><table><thead><tr><th>Компания</th><th>Выручка</th><th>Прибыль</th><th>В карман</th></tr></thead><tbody>
      ${byCompany.map(({ b, g }) => `<tr><td>${esc(b.name)}${b.archived ? '<em>архив</em>' : ''}</td>${g ? `<td>${f(g.rev)}</td><td>${f(g.profit)}</td><td>${f(g.pocket)}</td>` : `<td class="co-none" colspan="3">${range === 'month' ? 'Ещё не внесено' : 'Нет цифр за период'}</td>`}</tr>`).join('')}
      </tbody></table></div>` : ''}
      ${range === 'month' ? `${bars(series, ui.period.slice(0, 7), null)}<div class="bar-key"><span><i class="l"></i>выручка</span><span><i></i>прибыль</span></div>` : ''}
      <div class="tw"><table><thead><tr><th>Период</th><th>Выручка</th><th>Прибыль</th><th>${compactTable ? 'Рентаб.' : 'Рентабельность'}</th><th>В карман</th></tr></thead><tbody>
      ${groups.slice().reverse().slice(0, LIMIT[range]).map((g) => `<tr class="${canEdit ? 'go' : ''}" ${canEdit ? `data-act="edit" data-v="${g.key}"` : ''}><td>${short(g)}${g.filled < g.size ? `<em>${g.filled} из ${g.size}</em>` : ''}</td><td>${f(g.rev)}</td><td>${f(g.profit)}</td><td>${pct(M.margin(g.profit, g.rev))}</td><td>${f(g.pocket)}</td></tr>`).join('')}
      </tbody>${range === 'month' ? `<tfoot><tr><td>Итого</td><td>${f(tot.rev)}</td><td>${f(tot.profit)}</td><td>${pct(M.margin(tot.profit, tot.rev))}</td><td>${f(tot.pocket)}</td></tr></tfoot>` : ''}</table></div>
      <div class="mut small" style="margin-top:8px">${compactTable ? `Суммы в ${SYMBOL[p.cur]}. ` : ''}${range === 'month' ? `Заполнено ${cov.filled} из ${cov.expected} мес.` : 'Считаем по календарю и только внесённые месяцы.'}${canEdit ? ' Нажмите на месяц, чтобы исправить цифры.' : isMember && range === 'month' ? ' Чтобы исправить месяц, выберите компанию.' : ''}</div>
    </section>` : '';

    const form = isMember && cur ? `<section class="card sec mg" id="bForm">
      <div class="sec-head" style="margin-bottom:6px">
        <div class="nav"><button data-act="pPrev" aria-label="Раньше">‹</button><b>${title}</b><button data-act="pNext" aria-label="Позже" ${ui.period >= due ? 'disabled' : ''}>›</button></div>
      </div>
      <p class="mut small" style="margin:0 0 14px">Удобнее всего с 1 по 5 число, напомним в Telegram</p>
      <div class="fields three">
        <label class="f"><span>Выручка</span><input class="inp" id="b-rev" inputmode="decimal" autocomplete="off" value="${esc(ui.biz.rev)}" placeholder="0"><small>Все оплаты клиентов, до расходов</small></label>
        <label class="f"><span>Чистая прибыль компании</span><input class="inp" id="b-profit" inputmode="text" autocomplete="off" value="${esc(ui.biz.profit)}" placeholder="0"><small>Сумма, которая осталась после всех расходов в бизнесе. Если в минус, поставьте −</small></label>
        <label class="f"><span>В карман</span><input class="inp" id="b-pocket" inputmode="decimal" autocomplete="off" value="${esc(ui.biz.pocket)}" placeholder="0"><small>Сколько вы вытащили себе на жизнь</small></label>
      </div>
      <div class="live" id="bLive">${live.html}</div>
      <div id="bErr" class="err">${live.err}</div>
      <div class="row" style="margin-top:6px"><button class="btn" data-act="bizSave">${filled ? 'Обновить' : 'Сохранить'}</button><span class="mut small">${esc(cur ? cur.name : '')}. Суммы ${{ RUB: 'в рублях', USD: 'в долларах', EUR: 'в евро' }[p.cur]}</span></div>
      ${ui.offer ? offer() : ''}
    </section>` : '';

    const right = cur ? form : monthCard();
    const body = isMember && table ? `<div class="split biz"><div class="col">${table}</div><div class="col">${right}</div></div>` : `${prefs.role === 'mentor' ? mentorCard() : ''}${isMember || !cur ? right : ''}${table}`;
    return `<div class="stack">${isMember && ui.manage === 'biz' ? manager() : ''}${meter()}${bizPick()}${body}
      <div class="privacy">Цифры бизнеса видите вы, ваш наставник и директор клана.</div></div>`;
  }

  // Переключатель компаний: выручка на стрелке считает все, ниже цифры выбранной
  function bizPick() {
    const p = d(); const cur = curBiz();
    const all = p.businesses.length > 1 ? `<button class="chip" data-act="bizView" data-v="all" aria-pressed="${!cur}">Все компании</button>` : '';
    const list = companies().map((b) => `<button class="chip" data-act="bizView" data-v="${b.id}" aria-pressed="${!!cur && cur.id === b.id}">${esc(b.name)}</button>`).join('');
    const add = editable() ? '<button class="chip add" data-act="mgQuick" data-v="biz">+ Компания</button>' : '';
    return `<div class="chips biz-pick" role="group" aria-label="Компания">${all}${list}${add}</div>`;
  }

  // Когда выбраны все компании, вместо формы видно, кто внёс месяц
  function monthCard() {
    const due = dueKey(); const list = companies(); const isMember = editable();
    const row = (b) => b.periods.find((x) => x.key === due && x.kind === 'month');
    const done = list.filter(row).length;
    return `<section class="card sec"><div class="sec-head" style="margin-bottom:8px"><h2>Итоги ${MONTHS_G[monthNo(due)]}</h2><span class="sub">Внесено ${done} из ${list.length}</span></div>
      ${list.length ? list.map((b) => {
        const r = row(b);
        return `<div class="co"><span class="co-n">${esc(b.name)}<em class="${r ? '' : 'wait'}">${r ? `Чистая прибыль ${usd(r.profit)}` : 'Ещё не внесено'}</em></span>${isMember ? `<button class="btn sm ${r ? 'ghost' : ''}" data-act="bizOpen" data-v="${b.id}">${r ? 'Изменить' : 'Внести'}</button>` : ''}</div>`;
      }).join('') : '<p class="mut small" style="margin:0">Активных компаний нет.</p>'}
    </section>`;
  }

  /* Настройка: источники дохода, категории расходов, компании. Прямо на странице, без всплывающих окон */
  const PH = { src: 'Например, Консультации', cat: 'Например, Путешествия', biz: 'Например, Студия дизайна' };
  function mgForm() {
    const e = ui.mg;
    const cats = `<option value="" ${e.cat ? '' : 'selected'} disabled>Выберите</option>${INC_CATS.map(([k, t]) => `<option value="${k}" ${e.cat === k ? 'selected' : ''}>${t}</option>`).join('')}`;
    const curs = Object.keys(SYMBOL).reverse().map((k) => `<option value="${k}" ${e.cur === k ? 'selected' : ''}>${SYMBOL[k]}</option>`).join('');
    return `<div class="mg-f">
      <label class="f"><span>Название</span><input class="inp" id="mgName" maxlength="64" autocomplete="off" value="${esc(e.name)}" placeholder="${PH[e.kind]}"></label>
      ${e.kind === 'src' ? `<div class="mg-2"><label class="f"><span>Категория</span><select class="inp" id="mgCat">${cats}</select></label><label class="f"><span>Валюта</span><select class="inp" id="mgCur">${curs}</select></label></div>` : ''}
      <div id="mgErr" class="err"></div>
      <div class="row"><button class="btn sm" data-act="mgSave">${e.id === 'new' ? 'Добавить' : 'Сохранить'}</button><button class="btn ghost sm" data-act="mgCancel">Отмена</button></div>
    </div>`;
  }
  // Сколько записей держит пункт: от этого зависит, удалить его или убрать в архив
  function usage(kind, id) {
    const p = d();
    if (kind === 'src') return p.entries.filter((e) => e.src === id).length;
    if (kind === 'cat') return p.entries.filter((e) => e.cat === id).length + (p.repeats || []).filter((r) => r.cat === id).length + (p.templates || []).filter((t) => t.cat === id).length;
    return bizOf(id).periods.length;
  }
  function mgAsk(kind, it, n) {
    const what = { src: 'Источник', cat: 'Категория', biz: 'Компания' }[kind];
    const text = n
      ? { src: `У источника ${plural(n, 'запись', 'записи', 'записей')}. Он уйдёт в архив и пропадёт из выбора, записи и суммы останутся.`, cat: `В категории ${plural(n, 'запись', 'записи', 'записей')}. Она уйдёт в архив и пропадёт из выбора, записи и суммы останутся.`, biz: `У компании внесено ${plural(n, 'месяц', 'месяца', 'месяцев')}. Она уйдёт в архив, а цифры останутся в истории и в расчёте уровня.` }[kind]
      : `${what} без записей, поэтому удалится насовсем. Отменить будет нельзя.`;
    return `<div class="mg-ask"><p><b>${esc(it.name)}.</b> ${text}</p><div class="row"><button class="btn sm ${n ? '' : 'danger'}" data-act="mgDrop">${n ? 'В архив' : 'Удалить'}</button><button class="btn ghost sm" data-act="mgCancel">Отмена</button></div></div>`;
  }
  function mgList(kind, items, addLabel) {
    const e = ui.mg;
    const here = (id) => e && e.kind === kind && e.id === id && !e.from;
    const row = (it) => {
      if (here(it.id)) return e.mode === 'del' ? mgAsk(kind, it, usage(kind, it.id)) : mgForm();
      const buttons = it.locked ? '<span></span><span></span>' : `<button class="ib" data-act="mgEdit" data-v="${kind}:${it.id}" aria-label="Изменить: ${esc(it.name)}">${svg('edit')}</button><button class="ib del" data-act="mgAsk" data-v="${kind}:${it.id}" aria-label="Убрать: ${esc(it.name)}">${svg('trash')}</button>`;
      return `<div class="mg-r"><span class="mg-n"><b>${esc(it.name)}</b><em>${it.sub}</em></span>${buttons}</div>`;
    };
    const live = items.filter((x) => !x.archived); const old = items.filter((x) => x.archived);
    return `${live.map(row).join('') || '<p class="mut small" style="margin:0">Пока пусто.</p>'}
      ${here('new') ? mgForm() : `<button class="mg-add" data-act="mgNew" data-v="${kind}">${addLabel}</button>`}
      ${old.length ? `<div class="mg-arch"><h4>Архив: ${old.length}</h4>${old.map((it) => `<div class="mg-r"><span class="mg-n"><b>${esc(it.name)}</b><em>${it.sub}</em></span><button class="link" data-act="mgBack" data-v="${kind}:${it.id}">Восстановить</button></div>`).join('')}</div>` : ''}`;
  }
  function manager() {
    const p = d();
    const head = (t) => `<div class="sec-head"><h2>${t}</h2><button class="link" data-act="manageClose">Готово</button></div>`;
    if (ui.manage === 'biz') {
      const items = p.businesses.map((b) => {
        const n = b.periods.length;
        return { ...b, sub: n ? `Внесено ${plural(n, 'месяц', 'месяца', 'месяцев')}` : 'Месяцы ещё не внесены' };
      });
      return `<section class="card sec mg" id="mg">${head('Мои компании')}
        <p class="mg-lead">Цифры каждой компании вносятся отдельно, стрелка уровня считает все вместе.</p>
        ${mgList('biz', items, '+ Добавить компанию')}</section>`;
    }
    const full = p.personalMode === 'full';
    const srcItems = p.sources.filter((x) => !x.sys).map((s) => {
      const n = usage('src', s.id);
      return { ...s, locked: !!s.bizId, sub: `${incCat(s.cat) || 'Без категории'} · ${SYMBOL[s.cur] || ''} · ${s.bizId ? 'меняется в разделе «Бизнес»' : n ? plural(n, 'запись', 'записи', 'записей') : 'записей нет'}` };
    });
    const catItems = p.cats.map((k) => {
      const n = usage('cat', k.id);
      return { ...k, sub: n ? plural(n, 'запись', 'записи', 'записей') : 'Записей нет' };
    });
    return `<section class="card sec mg" id="mg">${head(full ? 'Источники и категории' : 'Источники дохода')}
      <div class="mg-cols ${full ? 'two' : ''}">
        <div>${full ? '<h3>Источники дохода</h3>' : ''}<p class="mg-lead">Откуда приходят деньги. По категории источника ПЭРЛ считает долю дохода от своего дела.</p>${mgList('src', srcItems, '+ Добавить источник')}</div>
        ${full ? `<div><h3>Категории расходов</h3><p class="mg-lead">На что уходят деньги. Новое название сразу применится ко всем записям.</p>${mgList('cat', catItems, '+ Добавить категорию')}</div>` : ''}
      </div></section>`;
  }

  function offer() {
    const o = ui.offer; const src = bizSource(o.bizId);
    return `<div class="offer">
      <p style="margin:0"><b>Сверка с личными финансами.</b> За ${monthName(o.key)} в карман <b class="num">${money(o.pocket)}</b>, а в личных от «${esc(src ? src.name : '')}» записано <b class="num">${money(o.got)}</b>. Не хватает <b class="num">${money(o.amount)}</b>. Дописать их сегодняшним числом?</p>
      <input class="inp" id="offerVal" inputmode="decimal" value="${group(o.amount)}" aria-label="Сумма для личных финансов">
      <div class="row"><button class="btn sm" data-act="offerYes">Дописать</button><button class="btn ghost sm" data-act="offerNo">Не сейчас</button></div>
    </div>`;
  }

  function mentorCard() {
    const p = d(); const cur = curBiz(); const viewed = viewPeriods(); const rows = M.rollup(viewed).slice(-12);
    const tot = rows.reduce((a, r) => ({ rev: a.rev + r.rev, profit: a.profit + r.profit, pocket: a.pocket + r.pocket }), { rev: 0, profit: 0, pocket: 0 });
    if (!rows.length) return '';
    const cov = M.coverage(viewed, p.today);
    return `<section class="card sec"><div class="sec-head"><h2>Карточка для встречи: ${esc(cur ? cur.name : 'все компании')}</h2><span class="sub">Заполнено ${cov.filled} из ${cov.expected} мес</span></div>
      <div class="mentor">
        <div class="fig sm"><small>Выручка, ${rows.length} мес</small><b class="num">${usd(tot.rev)}</b></div>
        <div class="fig sm"><small>Прибыль</small><b class="num">${usd(tot.profit)}</b></div>
        <div class="fig sm"><small>Рентабельность</small><b class="num">${pct(M.margin(tot.profit, tot.rev))}</b></div>
        <div class="fig sm"><small>В карман</small><b class="num">${usd(tot.pocket)}</b><em>${pct(tot.profit > 0 ? tot.pocket / tot.profit : null)} прибыли</em></div>
      </div></section>`;
  }

  function demoBar() {
    const p = d();
    const opt = (o, val) => Object.entries(o).map(([k, v]) => `<option value="${k}" ${k === val ? 'selected' : ''}>${v}</option>`).join('');
    const people = Object.fromEntries(Object.entries(PERSONAS).map(([k, v]) => [k, v.title]));
    return `<details class="demo" ${ui.demoOpen ? 'open' : ''} id="demo">
      <summary><span class="demo-tag">Прототип</span><span class="demo-sum">${esc(PERSONAS[prefs.persona].title)}, сегодня ${dayOf(p.today)} ${p.today.slice(0, 4)}</span><span class="demo-more">Настройки</span></summary>
      <div class="demo-body">
        <label>Участник<select data-pref="persona">${opt(people, prefs.persona)}</select></label>
        <label>Смотрю как<select data-pref="role">${opt({ member: 'Участник', mentor: 'Наставник' }, prefs.role)}</select></label>
        <label>Валюта<select data-demo="cur">${opt({ RUB: 'Рубли', USD: 'Доллары', EUR: 'Евро' }, p.cur)}</select></label>
        <button data-act="advance">Месяц вперёд</button>
        <button data-act="reset">Сбросить этого участника</button>
        <div class="demo-note">${esc(PERSONAS[prefs.persona].hint)}. Данные вымышленные и хранятся только в этом браузере. Курс: $1 = ${M.RATES.RUB} ₽, ${M.RATES.EUR} €.</div>
      </div></details>`;
  }

  function finHead() {
    const p = d(); const full = p.personalMode === 'full';
    let right = '';
    const on = (k) => (ui.manage === k ? 'true' : 'false');
    if (p.tab === 'business') {
      if (editable() && p.businesses.length) right = `<button class="btn ghost sm" data-act="manage" data-v="biz" aria-expanded="${on('biz')}">Мои компании: ${companies().length}</button>`;
    } else if (editable()) {
      right = `<div class="seg" role="group" aria-label="Режим учёта">
        <button data-act="mode" data-v="simple" aria-pressed="${!full}">Только доход</button>
        <button data-act="mode" data-v="full" aria-pressed="${full}">Полный учёт</button>
      </div><span class="mut small">${full ? 'Доход, расходы, категории. Вернуться можно в любой момент, записи сохранятся.' : 'Для старта: только сколько пришло и откуда.'}</span>
      <button class="btn ghost sm" data-act="manage" data-v="personal" aria-expanded="${on('personal')}">${full ? 'Источники и категории' : 'Источники дохода'}</button>`;
    }
    return `<div class="fin-head">${toggle()}${right ? `<div class="fin-side">${right}</div>` : ''}</div>`;
  }

  function render() {
    const p = d();
    app.innerHTML = `${demoBar()}<div class="kab">${side()}<div class="main">${topBar()}
      <main class="content">${tracker()}${finHead()}
        ${prefs.role === 'mentor' ? '<p class="note">Вы смотрите кабинет участника: только чтение. Заявку на переход подтверждаете здесь.</p>' : ''}
        ${locked(p) ? `<p class="note lock"><b>Ведение финансов закрыто до ${dayOf(p.lockedUntil)} ${p.lockedUntil.slice(0, 4)}.</b> Результат на переход не подтвердился. Записи видны, новые вносить нельзя.</p>` : ''}
        ${p.tab === 'business' ? business() : personal()}
      </main></div></div>${mnav()}${ui.toast ? `<div class="toast" role="status"><span>${esc(ui.toast.text)}</span>${ui.toast.undo ? '<button data-act="undo">Отменить</button>' : ''}</div>` : ''}`;
    typo(app);
    const n = document.getElementById('needle');
    if (n) requestAnimationFrame(() => requestAnimationFrame(() => { n.style.transform = `rotate(${n.dataset.to}deg)`; needleWas = Number(n.dataset.to); }));
    const tg = document.getElementById('tg');
    if (ui.refocus) { tg.focus({ preventScroll: true }); ui.refocus = false; }
    if (thumbWas !== p.tab) requestAnimationFrame(() => requestAnimationFrame(() => { tg.dataset.pos = p.tab; }));
    thumbWas = p.tab;
    if (ui.composer) { const a = document.getElementById('amt'); if (a && ui.focusAmt) { a.focus({ preventScroll: false }); ui.focusAmt = false; } }
    if (ui.focusMg) { const m = document.getElementById('mgName'); if (m) m.focus({ preventScroll: false }); ui.focusMg = false; }
    if (ui.scrollTo) {
      const el = document.getElementById(ui.scrollTo); ui.scrollTo = null;
      if (el) el.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
    save();
  }

  // Неразрывный пробел после коротких слов, только в тексте
  function typo(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const re = /(^|[\s(«])(в|и|а|к|с|у|о|на|по|за|из|до|от|не|ни|но|для|что|как|при|или|об|во|со)\s/gi;
    while (w.nextNode()) {
      const t = w.currentNode;
      if (t.parentNode.closest('script,style,option,textarea')) continue;
      const v = t.nodeValue.replace(re, (m, a, b) => `${a}${b} `);
      if (v !== t.nodeValue) t.nodeValue = v;
    }
  }

  let toastTimer;
  function toast(text, undo) {
    ui.toast = { text, undo };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { ui.toast = null; const el = document.querySelector('.toast'); if (el) el.remove(); }, 4500);
  }
  function addRepeatsUntil(p) {
    (p.repeats || []).forEach((r) => {
      for (let k = M.addMonths(r.last, 1); k <= M.monthKey(p.today); k = M.addMonths(k, 1)) {
        const date = `${k}-${M.pad(Math.min(r.day, M.lastDay(k)))}`;
        if (date > p.today) break;
        p.entries.push({ id: uid(), type: 'expense', date, amount: r.amount, cur: r.cur, cat: r.cat, note: r.title, auto: true });
        r.last = k;
      }
    });
  }
  function openComposer(type) {
    const p = d();
    ui.composer = type; ui.rec = false; ui.mg = null; ui.focusAmt = true;
    const live = activeSrc();
    const last = p.entries.filter((e) => e.type === 'income' && live.some((s) => s.id === e.src)).slice(-1)[0];
    const pick = type === 'income' ? (last ? last.src : (live[0] || {}).id) : 'none';
    const src = type === 'income' && srcOf(pick);
    ui.draft = { amount: '', note: '', date: p.today, cur: (src && src.cur) || p.cur, repeat: false, pick };
  }

  /* Компания и её строка в личных источниках живут вместе */
  function linkSource(b) {
    const p = d();
    const same = p.sources.find((s) => !s.bizId && !s.sys && s.name.toLowerCase() === b.name.toLowerCase());
    if (same) { same.bizId = b.id; same.cat = 'own_business'; same.archived = false; return same; }
    const src = { id: uid(), name: b.name, cat: 'own_business', cur: p.cur, bizId: b.id };
    p.sources.push(src);
    return src;
  }
  function addCompany(name) {
    const p = d(); const b = { id: uid(), name, periods: [] };
    p.businesses.push(b); linkSource(b);
    p.bizView = b.id; ui.period = null; ui.biz = null; ui.offer = null; ui.manage = null; ui.mg = null; ui.scrollTo = 'bForm';
    toast('Компания добавлена. Внесите итоги месяца');
  }
  const mgItems = (kind) => ({ src: d().sources, cat: d().cats, biz: d().businesses }[kind]);
  const mgTarget = (v) => { const i = v.indexOf(':'); return [v.slice(0, i), v.slice(i + 1)]; };
  const mgFail = (text) => { const el = document.getElementById('mgErr'); if (el) el.textContent = text; return false; };
  function mgStart(kind, id, from) {
    const it = id === 'new' ? null : mgItems(kind).find((x) => x.id === id);
    ui.mg = {
      kind, id, mode: 'edit', from, name: it ? it.name : '', cat: (it && it.cat) || '', cur: (it && it.cur) || (ui.draft && ui.composer ? ui.draft.cur : d().cur),
    };
    ui.focusMg = true;
  }

  const actions = {
    tab(v) { d().tab = v; ui.composer = null; ui.rec = false; ui.manage = null; ui.mg = null; },
    flip() { const p = d(); actions.tab(p.tab === 'business' ? 'personal' : 'business'); ui.refocus = true; },
    mode(v) { d().personalMode = v; ui.composer = null; ui.rec = false; ui.mg = null; if (v === 'simple') toast('Расходы сохранены и скрыты. Вернуть можно в любой момент.'); },
    open(v) { openComposer(v); },
    closeComposer() { ui.composer = null; if (ui.mg && ui.mg.from) ui.mg = null; },
    pick(v) {
      ui.draft.pick = ui.draft.pick === v && ui.composer === 'expense' ? 'none' : v;
      const s = ui.composer === 'income' && srcOf(v);
      if (s && s.cur) ui.draft.cur = s.cur;
    },
    curPick(v) { ui.draft.cur = v; },
    manage(v) { ui.manage = ui.manage === v ? null : v; ui.mg = null; if (ui.manage) ui.scrollTo = 'mg'; },
    manageOpen(v) { ui.manage = v; ui.mg = null; ui.scrollTo = 'mg'; },
    manageClose() { ui.manage = null; ui.mg = null; },
    mgNew(v) { mgStart(v, 'new'); },
    mgQuick(v) {
      if (v === 'biz') { ui.manage = 'biz'; ui.scrollTo = 'mg'; mgStart('biz', 'new'); } else mgStart(v, 'new', 'composer');
    },
    mgEdit(v) { const [k, id] = mgTarget(v); mgStart(k, id); },
    mgAsk(v) { const [k, id] = mgTarget(v); ui.mg = { kind: k, id, mode: 'del' }; },
    mgCancel() { ui.mg = null; },
    mgSave() {
      const p = d(); const e = ui.mg; const name = (e.name || '').trim();
      if (!name) return mgFail('Введите название.');
      const was = e.id === 'new' ? null : mgItems(e.kind).find((x) => x.id === e.id);
      const renamed = !was || was.name.toLowerCase() !== name.toLowerCase();
      const same = renamed && mgItems(e.kind).find((x) => x.id !== e.id && !x.sys && x.name.toLowerCase() === name.toLowerCase());
      if (same) return mgFail(same.archived ? 'Такое название есть в архиве, его можно восстановить.' : 'Такое название уже есть.');
      if (e.kind === 'src' && !e.cat) return mgFail('Выберите категорию: по ней ПЭРЛ считает долю дохода от своего дела.');
      if (e.kind === 'biz') {
        if (e.id === 'new') { addCompany(name); return undefined; }
        const b = bizOf(e.id); b.name = name;
        const linked = p.sources.find((s) => s.bizId === b.id);
        if (linked) linked.name = name;
      } else if (e.id === 'new') {
        const id = uid();
        if (e.kind === 'src') p.sources.push({ id, name, cat: e.cat, cur: e.cur });
        else p.cats.push({ id, name });
        if (e.from === 'composer') { ui.draft.pick = id; if (e.kind === 'src') ui.draft.cur = e.cur; }
      } else {
        const it = mgItems(e.kind).find((x) => x.id === e.id); it.name = name;
        if (e.kind === 'src') { it.cat = e.cat; it.cur = e.cur; }
      }
      ui.mg = null;
      return undefined;
    },
    mgDrop() {
      const p = d(); const { kind, id } = ui.mg; const n = usage(kind, id);
      const it = mgItems(kind).find((x) => x.id === id);
      if (kind === 'biz') {
        const linked = p.sources.find((s) => s.bizId === id);
        if (n) { it.archived = true; if (linked) linked.archived = true; } else {
          p.businesses = p.businesses.filter((b) => b.id !== id);
          if (linked) {
            if (usage('src', linked.id)) delete linked.bizId;
            else p.sources = p.sources.filter((s) => s !== linked);
          }
        }
        if (p.bizView === id) p.bizView = null;
        ui.period = null; ui.biz = null; ui.offer = null;
      } else if (n) it.archived = true;
      else if (kind === 'src') p.sources = p.sources.filter((s) => s.id !== id);
      else p.cats = p.cats.filter((k) => k.id !== id);
      if (ui.draft && ui.draft.pick === id) ui.draft.pick = kind === 'src' ? (activeSrc()[0] || {}).id : 'none';
      ui.mg = null;
    },
    mgBack(v) {
      const [k, id] = mgTarget(v); const it = mgItems(k).find((x) => x.id === id); it.archived = false;
      if (k === 'biz') {
        const linked = d().sources.find((s) => s.bizId === id);
        if (linked) linked.archived = false;
        ui.period = null; ui.biz = null;
      }
    },
    bizView(v) { d().bizView = v; ui.biz = null; ui.period = null; ui.offer = null; },
    bizOpen(v) { d().bizView = v; ui.biz = null; ui.period = null; ui.offer = null; ui.scrollTo = 'bForm'; },
    saveEntry() {
      const p = d(); const c = ui.draft; const v = parseNum(c.amount);
      const fail = (text) => { const e = document.getElementById('cerr'); if (e) e.textContent = text; return false; };
      if (v == null || Number.isNaN(v) || v <= 0) return fail('Введите сумму.');
      const type = ui.composer;
      if (type === 'income' && !c.pick) return fail('Выберите источник.');
      const entry = { id: uid(), type, date: c.date || p.today, amount: v, cur: c.cur };
      if (type === 'income') entry.src = c.pick;
      else { entry.cat = c.pick || 'none'; if (c.note) entry.note = c.note; }
      p.entries.push(entry);
      if (type === 'expense' && c.repeat) {
        const day = Number(entry.date.slice(8, 10));
        p.repeats = p.repeats || [];
        p.repeats.push({ id: uid(), title: c.note || (catOf(entry.cat) || {}).name || 'Расход', cat: entry.cat, amount: v, cur: c.cur, day, last: M.monthKey(entry.date) });
        entry.auto = true;
      }
      ui.month = M.monthKey(entry.date); ui.composer = null; ui.mg = null;
      toast('Записано', entry.id);
    },
    tpl(v) {
      const p = d(); const t = p.templates.find((x) => x.id === v);
      const entry = { id: uid(), type: 'expense', date: p.today, amount: t.amount, cur: 'RUB', cat: t.cat, note: t.title };
      p.entries.push(entry); ui.month = M.monthKey(p.today); toast(`${t.title}: записано`, entry.id);
    },
    undo() { const p = d(); p.entries = p.entries.filter((e) => e.id !== ui.toast.undo); ui.toast = null; },
    del(v) { const p = d(); p.entries = p.entries.filter((e) => e.id !== v); },
    sort(v) { ui.sort = ui.sort === v ? null : v; },
    sortTo(v) { const e = d().entries.find((x) => x.id === ui.sort); if (e) { e.cat = v; delete e.unsorted; } ui.sort = null; },
    month(v) { ui.month = v; },
    mPrev() { ui.month = M.addMonths(viewMonth(), -1); },
    mNext() { ui.month = M.addMonths(viewMonth(), 1); },
    recOpen() { ui.rec = true; ui.composer = null; ui.recVal = ''; },
    recClose() { ui.rec = false; },
    recSave() {
      const p = d(); const v = parseNum(ui.recVal);
      if (v == null || Number.isNaN(v)) return false;
      const x = recDiff();
      if (x != null && Math.round(x) !== 0) {
        if (x > 0) p.entries.push({ id: uid(), type: 'expense', date: p.today, amount: Math.round(x), cur: p.cur, cat: 'none', note: 'Неразобранные траты', unsorted: true });
        else {
          if (!p.sources.some((s) => s.id === 'unsorted')) p.sources.push({ id: 'unsorted', name: 'Неразобранный доход', sys: true });
          p.entries.push({ id: uid(), type: 'income', date: p.today, amount: Math.round(-x), cur: p.cur, src: 'unsorted' });
        }
      }
      p.balance = { date: p.today, amount: v }; ui.rec = false; ui.month = curMonth();
      toast(x == null ? 'Запомнили точку отсчёта' : 'Сверили');
    },
    range(v) { ui.range = v; },
    pPrev() { setPeriod(M.addMonths(ui.period, -1)); },
    pNext() { setPeriod(M.addMonths(ui.period, 1)); },
    edit(v) { setPeriod(v); setTimeout(() => { const f = document.getElementById('bForm'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 0); },
    bizAdd() {
      const el = document.getElementById('bizName'); const name = el && el.value.trim();
      if (!name) { document.getElementById('cerr').textContent = 'Введите название.'; return false; }
      addCompany(name);
      return undefined;
    },
    bizSave() {
      const p = d(); const b = curBiz(); const { rev, profit, pocket, err } = bizCheck();
      if (err || !b) return false;
      if (rev == null || profit == null) { document.getElementById('bErr').textContent = 'Внесите выручку и чистую прибыль компании.'; return false; }
      const k = M.RATES[p.cur]; const key = ui.period;
      const row = { kind: 'month', key, rev: rev / k, profit: profit / k, pocket: (pocket || 0) / k };
      const i = b.periods.findIndex((x) => x.key === key && x.kind === 'month');
      if (i >= 0) b.periods[i] = row; else b.periods.push(row);
      const got = gotFor(b.id, key); const rest = Math.round((pocket || 0) - got);
      setPeriod(key);
      ui.offer = rest >= 1 ? { key, pocket: pocket || 0, got, amount: rest, bizId: b.id } : null;
      toast(pocket > 0 && rest < 1 ? 'Сохранено. С личными финансами сходится' : 'Сохранено');
    },
    offerYes() {
      const p = d(); const el = document.getElementById('offerVal'); const v = parseNum(el && el.value);
      if (v == null || Number.isNaN(v) || v <= 0) return false;
      const { bizId, key } = ui.offer;
      const src = bizSource(bizId) || linkSource(bizOf(bizId));
      const entry = { id: uid(), type: 'income', date: p.today, amount: v, cur: p.cur, src: src.id, link: key };
      p.entries.push(entry);
      ui.offer = null; ui.month = curMonth(); toast('Дописали в личные финансы', entry.id);
    },
    offerNo() { ui.offer = null; },
    tour() { window.DengiTour.open(); return false; },
    track(v) { const p = d(); if (p.request || !TRACKS[v]) return false; p.track = v; ui.ask = false; return undefined; },
    askUp() { ui.ask = true; },
    askNo() { ui.ask = false; },
    askYes() {
      const p = d(); const m = meterData();
      p.request = { level: p.level, track: m.metric, factUsd: m.stats.fact, at: p.today, status: 'pending' };
      ui.ask = false; toast('Заявка ушла куратору');
    },
    reqConfirm() { d().request.status = 'confirmed'; toast('Результат подтверждён'); },
    reqReject() {
      const p = d(); p.request.status = 'rejected'; p.lockedUntil = lockDate(p.today);
      toast(`Ведение финансов закрыто на ${LOCK_MONTHS} месяца`);
    },
    examPass() {
      const p = d(); p.level = Math.min(3, p.level + 1); p.levelSource = 'Предыдущий уровень сделан'; p.request = null; needleWas = -90;
      toast(`Уровень ${p.level}: ${M.LEVELS[p.level - 1].name}`);
    },
    advance() {
      const p = d(); const key = M.addMonths(M.monthKey(p.today), 1);
      p.today = `${key}-${p.today.slice(8, 10)}`; addRepeatsUntil(p);
      if (p.lockedUntil && p.today >= p.lockedUntil) { p.lockedUntil = null; p.request = null; }
      ui.period = null; ui.biz = null; ui.offer = null; ui.month = null;
    },
    reset() {
      data[prefs.persona] = fresh();
      Object.assign(ui, { composer: null, draft: null, biz: null, period: null, offer: null, month: null, sort: null, rec: false, toast: null, manage: null, mg: null, ask: false });
      needleWas = -90;
    },
    csv() {
      const p = d();
      const rows = [['Дата', 'Тип', 'Сумма', 'Валюта', 'Источник или категория', 'Название']].concat(p.entries.map((e) => [
        e.date, e.type === 'income' ? 'Доход' : 'Расход', e.amount, e.cur,
        e.type === 'income' ? (srcOf(e.src) || {}).name : (catOf(e.cat) || { name: 'Без категории' }).name, e.note || '',
      ]));
      const csv = `﻿${rows.map((r) => r.map((c) => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(';')).join('\n')}`;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      a.download = 'lichnye-finansy.csv'; a.click();
      return false;
    },
  };

  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const fn = actions[el.dataset.act];
    if (!fn) return;
    if (fn(el.dataset.v) !== false) render();
  });
  // Стрелки двигают тумблер туда, куда нажали, Space и Enter переключают сами
  document.addEventListener('keydown', (ev) => {
    if (ev.target.id === 'mgName' && (ev.key === 'Enter' || ev.key === 'Escape')) {
      ev.preventDefault();
      const fn = ev.key === 'Enter' ? actions.mgSave : actions.mgCancel;
      if (fn() !== false) render();
      return;
    }
    if (ev.target.id === 'bizName' && ev.key === 'Enter') { ev.preventDefault(); if (actions.bizAdd() !== false) render(); return; }
    if (ev.target.id !== 'tg' || (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight')) return;
    ev.preventDefault();
    const to = ev.key === 'ArrowRight' ? 'business' : 'personal';
    if (d().tab !== to) { actions.tab(to); ui.refocus = true; render(); }
  });
  document.addEventListener('toggle', (ev) => { if (ev.target.id === 'demo') ui.demoOpen = ev.target.open; }, true);

  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (t.dataset.pref) {
      prefs[t.dataset.pref] = t.value;
      if (t.dataset.pref === 'persona' || t.dataset.pref === 'role') {
        Object.assign(ui, { composer: null, biz: null, period: null, offer: null, month: null, sort: null, rec: false, manage: null, mg: null, ask: false });
        needleWas = -90;
        if (t.dataset.pref === 'role' && t.value === 'mentor' && d().businesses.length) d().tab = 'business';
      }
      render();
    } else if (t.dataset.demo === 'cur') {
      d().cur = t.value; ui.biz = null; ui.period = null; ui.offer = null; render();
    } else if (t.id && (t.id.startsWith('b-') || t.id === 'amt' || t.id === 'recVal' || t.id === 'offerVal')) {
      const v = parseNum(t.value);
      if (v != null && !Number.isNaN(v) && Number.isInteger(v)) {
        t.value = group(v);
        if (t.id.startsWith('b-')) ui.biz[t.id.slice(2)] = t.value;
        else if (t.id === 'amt') ui.draft.amount = t.value;
        else if (t.id === 'recVal') ui.recVal = t.value;
      }
    } else if (t.id === 'mgCat' && ui.mg) ui.mg.cat = t.value;
    else if (t.id === 'mgCur' && ui.mg) ui.mg.cur = t.value;
    else if (t.id === 'rep' && ui.draft) ui.draft.repeat = t.checked;
    else if (t.id === 'date' && ui.draft) ui.draft.date = t.value;
  });

  document.addEventListener('input', (ev) => {
    const t = ev.target;
    if (t.id === 'mgName' && ui.mg) ui.mg.name = t.value;
    else if (t.id === 'amt') { ui.draft.amount = t.value; const fx = document.getElementById('fx'); if (fx) fx.textContent = fxLine(); }
    else if (t.id === 'note') {
      ui.draft.note = t.value;
      const prev = d().entries.filter((e) => e.note === t.value && e.type === 'expense').slice(-1)[0];
      if (prev && prev.cat !== 'none') {
        ui.draft.pick = prev.cat;
        document.querySelectorAll('#pickers .chip').forEach((c) => c.setAttribute('aria-pressed', c.dataset.v === prev.cat));
        const a = document.getElementById('amt');
        if (a && !a.value) { a.value = group(prev.amount); ui.draft.amount = a.value; }
      }
    } else if (t.id && t.id.startsWith('b-')) {
      ui.biz[t.id.slice(2)] = t.value;
      const live = bizLive();
      document.getElementById('bLive').innerHTML = live.html;
      document.getElementById('bErr').textContent = live.err;
      t.classList.toggle('bad', !!live.err);
    } else if (t.id === 'recVal') { ui.recVal = t.value; document.getElementById('recLive').textContent = recLine(); }
  });

  let wasPhone = window.innerWidth < 640;
  window.addEventListener('resize', () => { const now = window.innerWidth < 640; if (now !== wasPhone) { wasPhone = now; render(); } });

  window.DengiApp = {
    go(tab) { actions.tab(tab); render(); },
    tab: () => d().tab,
    member: () => prefs.role === 'member',
    /* У всех бизнес начинается пустым, поэтому без компании проводник показывает форму на примере */
    tourStart() {
      const p = d(); const demo = !companies().length;
      ui.tour = { p, mode: p.personalMode, view: p.bizView, tab: p.tab };
      p.personalMode = 'full';
      if (demo) {
        const due = dueKey(p);
        const periods = [[3600, 900, 600], [4200, 1100, 700], [4800, 1300, 800]].map(([rev, profit, pocket], i) => ({ kind: 'month', key: M.addMonths(due, i - 2), rev, profit, pocket }));
        p.businesses.push({ id: 'tour-demo', tourDemo: true, name: 'Пример компании', periods });
        p.bizView = 'tour-demo';
      } else if (!curBiz()) p.bizView = companies()[0].id;
      ui.period = null; ui.biz = null; ui.offer = null; ui.manage = null; ui.mg = null; ui.composer = null; ui.rec = false; ui.ask = false;
      render();
      return {
        demo,
        stop() {
          const t = ui.tour; if (!t) return;
          ui.tour = null;
          t.p.businesses = t.p.businesses.filter((b) => !b.tourDemo);
          t.p.personalMode = t.mode; t.p.bizView = t.view;
          ui.period = null; ui.biz = null; ui.offer = null;
          render();
        },
      };
    },
  };
  render();
})();
