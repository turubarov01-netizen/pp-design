/* Прототип раздела «Финансы» в трекере Фримана. Всё хранится только в браузере. */
(function () {
  const M = window.Model;
  const { PERSONAS, CATS } = window.Seeds;
  const STORE = 'dengi.v3';
  const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  const MONTHS_G = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const MONTHS_L = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'];
  const MONTHS_S = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const METRICS = { profit: 'Чистая прибыль', rev: 'Оборот', pocket: 'Деньги в кармане' };
  const SYMBOL = { USD: '$', RUB: '₽', EUR: '€' };

  const app = document.getElementById('app');
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } })();
  const prefs = {
    persona: 'micro', theme: 'dark', switcher: 'cards', metric: 'profit', role: 'member', ...saved.prefs,
  };
  const data = saved.data || {};
  const ui = {
    demoOpen: false, composer: null, draft: null, biz: null, period: null, offer: null, month: null, sort: null, rec: false, recVal: '', toast: null, addSrc: false,
  };
  let needleWas = -90;

  const d = () => {
    if (!PERSONAS[prefs.persona]) prefs.persona = 'micro';
    if (!data[prefs.persona]) data[prefs.persona] = PERSONAS[prefs.persona].make();
    return data[prefs.persona];
  };
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify({ prefs, data })); } catch (e) { /* режим инкогнито */ } };
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
  const goalUsd = (t) => (t >= 1e6 ? `$${t / 1e6}\u00a0млн` : `$${group(t)}`);
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

  /* Прибор считает только бизнес: личные финансы на него не влияют */
  const meterData = () => ({ periods: d().periods, metric: prefs.metric, label: METRICS[prefs.metric] });

  /* Прибор */
  const CX = 170; const CY = 166; const R = 136;
  const pt = (t, r = R) => { const a = Math.PI * (1 - t); return [CX + r * Math.cos(a), CY - r * Math.sin(a)]; };
  const arc = (t0, t1) => {
    const [x0, y0] = pt(t0); const [x1, y1] = pt(t1);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  function dial(s, target) {
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
      <path class="trackarc" d="${arc(0, 1)}" fill="none" stroke-width="16" stroke-linecap="round"/>
      ${planT > factT ? `<path class="planarc" d="${arc(0, planT)}" fill="none" stroke-width="16" stroke-linecap="round"/>` : ''}
      ${factT > 0.002 ? `<path class="factarc" d="${arc(0, factT)}" fill="none" stroke-width="16" stroke-linecap="round"/>` : ''}
      ${ticks}
      <text x="${lx}" y="${ly + 4}" text-anchor="middle">50%</text>
      <text x="8" y="184">0</text>
      <text x="332" y="184" text-anchor="end">${compact(target)}</text>
      <g class="needle" id="needle" style="transform:rotate(${needleWas}deg)" data-to="${(-90 + 180 * planT).toFixed(2)}">
        <line x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - R + 26}"/><circle cx="${CX}" cy="${CY}" r="7"/>
      </g>
    </svg>`;
  }

  function meter() {
    const p = d(); const m = meterData();
    const lv = M.LEVELS[p.level - 1];
    const target = M.levelTarget(p.level, m.metric);
    const s = M.stats(m.periods, m.metric);
    const has = s.n > 0;
    const share = has ? s.forecast / target : 0;
    const months = Math.round(s.months * 10) / 10;
    const monthsTxt = `${String(months).replace('.', ',')} мес`;
    const left = Math.max(0, target - s.fact);
    const canUp = M.canLevelUp(p.level, s.fact, m.metric);

    let read;
    if (!has) read = `<b class="empty">Пока нет данных</b><span>${p.hasBiz ? 'Внесите первый месяц, и стрелка покажет, что выйдет за год' : 'Добавьте бизнес, и стрелка покажет, что выйдет за год'}</span>`;
    else if (s.forecast < 0) read = `<b class="num">${usd(s.forecast)}</b><span>${esc(m.label.toLowerCase())}: прогноз на год пока ниже нуля</span>`;
    else read = `<b class="num">${usd(s.forecast)}</b><span>${s.weight >= 1 - 1e-9 ? 'за 12 месяцев' : 'прогноз на год'} · ${pct(share)} цели уровня</span>`;

    const rows = has ? `
      <div class="lv-row"><dt>Уже сделано</dt><dd class="num">${usd(s.fact)} <span class="mut small">за ${monthsTxt}</span></dd></div>
      <div class="lv-row"><dt>Сейчас в среднем</dt><dd class="num">${usd(s.perMonth)} <span class="mut small">в месяц</span></dd></div>
      <div class="lv-row"><dt>Нужно для цели</dt><dd class="num">${usd(target / 12)} <span class="mut small">в месяц</span></dd></div>` : `
      <div class="lv-row"><dt>Нужно для цели</dt><dd class="num">${usd(target / 12)} <span class="mut small">в месяц</span></dd></div>`;

    let how = '';
    if (has) {
      const whole = Math.abs(s.months - Math.round(s.months)) < 1e-6 ? Math.round(s.months) : null;
      how = s.weight >= 1 - 1e-9
        ? 'Считаем сумму за последние 12 месяцев: это уже факт, а не прогноз.'
        : `Как считаем: ${group(s.fact * M.RATES[p.cur])} за ${whole != null ? `${whole} мес` : monthsTxt} → ${group(s.perMonth * M.RATES[p.cur])} в месяц → × 12.`;
      if (s.n < 3 && s.weight < 1) how += ' По одному-двум месяцам прогноз пока грубый.';
      if (s.forecast >= target && !canUp) how += ` Темп выше цели. Уровень засчитаем, когда сумма станет фактом: осталось ${usd(left)}.`;
    }

    const ladder = M.LEVELS.map((l) => {
      const t = M.levelTarget(l.n, m.metric);
      const fill = l.n < p.level ? 1 : l.n === p.level ? Math.max(0, Math.min(1, s.fact / t)) : 0;
      return `<div class="rung ${l.n === p.level ? 'now' : ''}"><i><u style="width:${(fill * 100).toFixed(1)}%"></u></i><span>${goalUsd(t)}</span></div>`;
    }).join('');

    return `<section class="card meter">
      <div class="dial">${dial(s, target)}<div class="dial-read">${read}</div></div>
      <div>
        <div class="lv-head"><h2>Уровень ${lv.n} из 3: ${lv.name}</h2><span class="mut small">${lv.sub}</span></div>
        <div class="mut small" style="margin-top:2px">${esc(m.label)} за год: цель ${goalUsd(target)}${p.cur === 'USD' ? '' : ` (около ${compact(target)})`}. ${esc(p.levelSource)}.</div>
        <dl class="lv-rows">${rows}</dl>
        ${how ? `<p class="how">${how}</p>` : ''}
        <div class="ladder" aria-label="Три уровня развития">${ladder}</div>
      </div>
      ${canUp && prefs.role === 'member' ? `<div class="up"><span>Цель уровня сделана: <b class="num">${usd(s.fact)}</b> за последние ${monthsTxt}.</span><button class="btn sm" data-act="levelup">Перейти на уровень ${p.level + 1}</button></div>` : ''}
    </section>`;
  }

  /* Сводки для переключателя */
  const monthEntries = (key) => d().entries.filter((e) => M.monthKey(e.date) === key);
  const sumType = (list, type) => list.filter((e) => e.type === type).reduce((a, e) => a + inDisp(e), 0);
  const lastBiz = () => { const rows = M.rollup(d().periods); return rows[rows.length - 1] || null; };

  function pairCards() {
    const p = d(); const key = viewMonth();
    const inc = sumType(monthEntries(key), 'income');
    const last = lastBiz();
    return `<div class="pair" role="group" aria-label="Раздел финансов">
      <button data-act="tab" data-v="personal" aria-pressed="${p.tab === 'personal'}"><small>Личные финансы</small><b class="num">${money(inc)}</b><em>доход, ${monthName(key)}</em></button>
      <button data-act="tab" data-v="business" aria-pressed="${p.tab === 'business'}"><small>Бизнес</small>${last ? `<b class="num">${usd(last.profit)}</b><em>прибыль, ${monthName(last.key)}</em>` : `<b>${p.hasBiz ? 'Нет данных' : 'Добавить'}</b><em>${p.hasBiz ? 'внесите первый месяц' : 'оборот, прибыль, в карман'}</em>`}</button>
    </div>`;
  }
  const segSwitch = () => {
    const p = d();
    return `<div class="seg big" role="group" aria-label="Раздел финансов">
      <button data-act="tab" data-v="personal" aria-pressed="${p.tab === 'personal'}">Личные финансы</button>
      <button data-act="tab" data-v="business" aria-pressed="${p.tab === 'business'}">Бизнес</button></div>`;
  };

  function tracker() {
    const p = d();
    const two = prefs.switcher === 'tabs';
    const items = [['Фокус дня'], ['Задачи']];
    if (two) items.push(['Личные финансы', 'personal'], ['Бизнес', 'business']);
    else items.push(['Финансы', 'on']);
    items.push(['Дневник успеха'], ['1000 целей'], ['Зверёк']);
    const html = items.map(([l, v]) => {
      if (v === 'on') return `<span class="on">${l}</span>`;
      if (v) return `<button class="${p.tab === v ? 'on' : ''}" data-act="tab" data-v="${v}">${l}</button>`;
      return `<span>${l}</span>`;
    }).join('');
    return `<h1>Трекер Фримана</h1><div class="trk ${two ? 'seven' : ''}">${html}</div>`;
  }

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
    const chips = type === 'income'
      ? p.sources.map((s) => `<button class="chip" data-act="pick" data-v="${s.id}" aria-pressed="${c.pick === s.id}">${esc(s.name)}</button>`).join('')
        + (ui.addSrc ? `<input class="inp" id="newSrc" style="max-width:190px;min-height:38px;font-size:14px" placeholder="Название источника" aria-label="Название источника"><button class="chip" data-act="srcSave">Добавить</button>` : '<button class="chip add" data-act="srcAdd">+ источник</button>')
      : CATS.map((k) => `<button class="chip" data-act="pick" data-v="${k.id}" aria-pressed="${c.pick === k.id}">${k.name}</button>`).join('');
    const notes = [...new Set(p.entries.filter((e) => e.note).map((e) => e.note))];
    const curChips = ['RUB', 'USD', 'EUR'].map((k) => `<button class="chip" data-act="curPick" data-v="${k}" aria-pressed="${c.cur === k}">${SYMBOL[k]}</button>`).join('');
    return `<div class="compose">
      <div class="compose-row">
        <label class="f"><span>${type === 'income' ? 'Сколько пришло' : 'Сколько потратили'}</span><input class="inp big" id="amt" inputmode="decimal" autocomplete="off" value="${esc(c.amount)}" placeholder="0"></label>
        <div class="chips" role="group" aria-label="Валюта">${curChips}</div>
      </div>
      <div id="fx" class="mut small">${fxLine()}</div>
      <div class="f"><span>${type === 'income' ? 'Откуда' : 'На что'}${type === 'expense' ? ' <small style="display:inline;font-weight:400">можно не выбирать</small>' : ''}</span><div class="chips" id="pickers">${chips}</div></div>
      <div class="row" style="align-items:flex-start">
        ${type === 'expense' ? `<label class="f" style="flex:1;min-width:190px"><span>Название</span><input class="inp" id="note" list="notes" autocomplete="off" value="${esc(c.note)}" placeholder="Например, аренда"><datalist id="notes">${notes.map((n) => `<option value="${esc(n)}">`).join('')}</datalist></label>` : ''}
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
    const inc = sumType(list, 'income'); const exp = sumType(list, 'expense');
    const prevInc = sumType(monthEntries(M.addMonths(key, -1)), 'income');
    const delta = prevInc > 0 ? (inc - prevInc) / prevInc : null;
    const isMember = prefs.role === 'member';
    const series = last12(curMonth()).map((k) => {
      const l = monthEntries(k);
      return full ? { key: k, a: sumType(l, 'income'), b: Math.min(sumType(l, 'expense'), sumType(l, 'income')) } : { key: k, a: sumType(l, 'income') };
    });

    let body;
    if (!p.entries.length) {
      body = `<div class="fig"><small>Доход за ${monthName(key)}</small><b class="num">${money(0)}</b></div>
        <p class="mut" style="margin:8px 0 0">Запишите первое поступление: сумма, источник, готово. Этого достаточно, чтобы видеть рост.</p>`;
    } else if (full) {
      body = `<div class="top"><div class="figs">
        <div class="fig"><small>Доход за ${monthName(key)}</small><b class="num">${money(inc)}</b></div>
        <div class="fig"><small>Расход</small><b class="num">${money(exp)}</b></div>
        <div class="fig"><small>Осталось</small><b class="num">${money(inc - exp)}</b></div></div>
        <div>${bars(series, key, 'month')}<div class="bar-key"><span><i class="l"></i>доход</span><span><i></i>расход</span></div></div></div>`;
    } else {
      body = `<div class="top"><div class="figs">
        <div class="fig"><small>Доход за ${monthName(key)}</small><b class="num">${money(inc)}</b>${delta != null ? `<em class="num">${delta >= 0 ? '+' : '−'}${Math.abs(Math.round(delta * 100))}% к ${MONTHS_S[monthNo(M.addMonths(key, -1))]}</em>` : ''}</div></div>
        <div>${bars(series, key, 'month')}</div></div>`;
    }

    const srcRows = !full && inc > 0 ? p.sources.map((s) => {
      const v = list.filter((e) => e.type === 'income' && e.src === s.id).reduce((a, e) => a + inDisp(e), 0);
      return v ? `<div class="cat"><span>${esc(s.name)}</span><span class="amt num">${money(v)}</span><i><u style="width:${(v / inc) * 100}%"></u></i></div>` : '';
    }).join('') : '';

    const catRows = full ? CATS.map((k) => ({
      k, v: list.filter((e) => e.type === 'expense' && e.cat === k.id).reduce((a, e) => a + inDisp(e), 0),
    })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v).map(({ k, v }) => `<div class="cat"><span>${k.name}</span><span class="amt num">${money(v)}</span><i><u style="width:${(v / exp) * 100}%"></u></i></div>`).join('') : '';
    const noCat = list.filter((e) => e.type === 'expense' && e.cat === 'none');
    const noCatSum = noCat.reduce((a, e) => a + inDisp(e), 0);

    const tpl = full && isMember && !ui.composer && (p.templates || []).length ? `<div class="tpl" style="margin-top:10px"><span class="mut small">Частое:</span>${p.templates.map((t) => `<button class="chip" data-act="tpl" data-v="${t.id}">${esc(t.title)} ${money(t.amount, 'RUB')}</button>`).join('')}</div>` : '';

    const actions = isMember ? `<div class="row" style="margin-top:14px">
      ${ui.composer ? '' : `<button class="btn" data-act="open" data-v="income">+ Доход</button>${full ? '<button class="btn ghost" data-act="open" data-v="expense">+ Расход</button><button class="btn ghost" data-act="recOpen">Сверить остаток</button>' : ''}`}
    </div>${tpl}${ui.composer ? composer(ui.composer) : ''}${ui.rec ? reconcile() : ''}` : '';

    const rowsHtml = list.length ? list.map((e) => {
      const name = e.type === 'income' ? (p.sources.find((s) => s.id === e.src) || {}).name || 'Доход' : (e.note || (CATS.find((k) => k.id === e.cat) || {}).name || 'Без категории');
      const tags = [e.link && e.src !== 'biz' ? 'из бизнеса' : '', e.auto ? 'повтор' : '', e.cur !== p.cur ? `${money(e.amount, e.cur)}` : ''].filter(Boolean).join(' · ');
      const needsSort = e.type === 'expense' && e.cat === 'none';
      return `<div class="it"><span class="d">${dayOf(e.date)}</span><span class="t">${esc(name)}${tags ? `<em>${tags}</em>` : ''}${needsSort && isMember ? ` <button class="link" data-act="sort" data-v="${e.id}">Разобрать</button>` : ''}</span><span class="a num">${e.type === 'income' ? '+' : ''}${money(inDisp(e))}</span>${isMember ? `<button class="x" data-act="del" data-v="${e.id}" aria-label="Удалить запись">×</button>` : '<span></span>'}</div>
      ${ui.sort === e.id ? `<div class="sort chips">${CATS.map((k) => `<button class="chip" data-act="sortTo" data-v="${k.id}">${k.name}</button>`).join('')}</div>` : ''}`;
    }).join('') : `<p class="mut small" style="margin:6px 0 0">В ${MONTHS_L[monthNo(key)]} записей нет. Это нормально: дописывать пропущенное не нужно.</p>`;

    return `<div class="stack">
      ${isMember ? `<div class="row" style="justify-content:space-between">
        <div class="seg" role="group" aria-label="Режим учёта">
          <button data-act="mode" data-v="simple" aria-pressed="${!full}">Только доход</button>
          <button data-act="mode" data-v="full" aria-pressed="${full}">Полный учёт</button>
        </div>
        <span class="mut small">${full ? 'Доход, расходы, категории. Вернуться можно в любой момент, записи сохранятся.' : 'Рекомендуем для старта: только сколько пришло и откуда.'}</span>
      </div>` : ''}
      <section class="card sec">
        <div class="sec-head"><div class="nav"><button data-act="mPrev" aria-label="Предыдущий месяц">‹</button><b>${monthName(key)[0].toUpperCase()}${monthName(key).slice(1)} ${key.slice(0, 4)}</b><button data-act="mNext" aria-label="Следующий месяц" ${key >= curMonth() ? 'disabled' : ''}>›</button></div></div>
        ${body}${actions}
      </section>
      ${full ? `<section class="card sec"><div class="sec-head"><h2>Расходы по категориям</h2>${noCatSum ? `<span class="sub num">Без категории: ${money(noCatSum)}</span>` : ''}</div>${catRows ? `<div class="cats">${catRows}</div>` : '<p class="mut small" style="margin:0">Расходов в этом месяце пока нет.</p>'}</section>` : ''}
      ${srcRows ? `<section class="card sec"><div class="sec-head"><h2>Источники дохода</h2></div><div class="cats">${srcRows}</div></section>` : ''}
      ${p.entries.length ? `<section class="card sec"><div class="sec-head"><h2>Записи</h2>${isMember ? '<button class="link" data-act="csv">Скачать CSV</button>' : ''}</div><div class="list">${rowsHtml}</div></section>` : ''}
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
  const periodOf = (key) => d().periods.find((x) => x.key === key && x.kind === 'month');
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
    else if (rev != null && rev < 0) err = 'Оборот не может быть меньше нуля.';
    else if (pocket != null && pocket < 0) err = 'Сумма в карман не может быть меньше нуля.';
    else if (rev != null && profit != null && profit > rev) err = 'Прибыль не может быть больше оборота.';
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
    const p = d(); const isMember = prefs.role === 'member';
    if (!p.hasBiz) {
      if (!isMember) return `<div class="stack">${meter()}<section class="card sec"><p class="mut" style="margin:0">Участник пока не добавил бизнес.</p></section></div>`;
      return `<div class="stack">${meter()}<section class="card sec">
        <h2>Добавьте свой бизнес</h2>
        <p class="mut" style="margin:6px 0 12px;max-width:62ch">Здесь три цифры: оборот, чистая прибыль и деньги в кармане. Полный учёт ведите в своей бухгалтерии или CRM, сюда только итог.</p>
        <div class="row"><input class="inp" id="bizName" style="max-width:320px" placeholder="Название бизнеса" aria-label="Название бизнеса"><button class="btn" data-act="bizAdd">Добавить</button></div>
        <div id="cerr" class="err" style="margin-top:6px"></div>
      </section></div>`;
    }
    const due = dueKey();
    if (!ui.period || !ui.biz) setPeriod(due);
    const title = `Итоги ${MONTHS_G[monthNo(ui.period)]}`;
    const filled = !!periodOf(ui.period);
    const live = bizLive();
    const rows = M.rollup(p.periods);
    const rows12 = rows.slice(-12);
    const tot = rows12.reduce((a, r) => ({ rev: a.rev + r.rev, profit: a.profit + r.profit, pocket: a.pocket + r.pocket }), { rev: 0, profit: 0, pocket: 0 });
    const compactTable = window.innerWidth < 640;
    const f = (u) => (compactTable ? compactBare(u) : usd(u));
    const series = last12(M.addMonths(curMonth(), -1)).map((k) => {
      const r = rows.find((x) => x.key === k);
      return { key: k, a: r ? Math.max(0, r.rev) : 0, b: r ? Math.max(0, r.profit) : 0 };
    });
    const cov = M.coverage(p.periods, p.today);
    const range = ui.range || 'month';
    const groups = M.groupPeriods(p.periods, range);
    const latest = groups[groups.length - 1];
    const LIMIT = { month: 12, quarter: 8, half: 6, year: 5 };
    const yy = (g) => (compactTable ? String(g.y).slice(2) : g.y);
    const short = (g) => ({ month: `${MONTHS_S[g.n - 1]} ${String(g.y).slice(2)}`, quarter: `${g.n} кв ${yy(g)}`, half: `${g.n} пол ${yy(g)}`, year: `${g.y}` }[range]);
    const long = (g) => ({ month: `${MONTHS[g.n - 1].replace(/^./, (c) => c.toUpperCase())} ${g.y}`, quarter: `${g.n} квартал ${g.y}`, half: `${g.n} полугодие ${g.y}`, year: `${g.y} год` }[range]);
    const part = (g) => (g.filled < g.size ? `заполнено ${g.filled} из ${g.size} мес` : '');
    const canEdit = isMember && range === 'month';
    const seg = [['month', 'Месяц'], ['quarter', 'Квартал'], ['half', 'Полгода'], ['year', 'Год']]
      .map(([k, t]) => `<button data-act="range" data-v="${k}" aria-pressed="${range === k}">${t}</button>`).join('');
    const table = rows.length ? `<section class="card sec">
      <div class="sec-head"><h2>Сводный баланс</h2><div class="seg range" role="group" aria-label="Период">${seg}</div></div>
      <div class="sum-head"><b>${long(latest)}</b>${part(latest) ? `<span class="mut small">${part(latest)}</span>` : ''}</div>
      <div class="sum">
        <div class="fig sm"><small>Оборот</small><b class="num">${usd(latest.rev)}</b></div>
        <div class="fig sm"><small>Чистая прибыль</small><b class="num">${usd(latest.profit)}</b></div>
        <div class="fig sm"><small>Рентабельность</small><b class="num">${pct(M.margin(latest.profit, latest.rev))}</b></div>
        <div class="fig sm"><small>В карман</small><b class="num">${usd(latest.pocket)}</b></div>
      </div>
      ${range === 'month' ? `${bars(series, ui.period.slice(0, 7), null)}<div class="bar-key"><span><i class="l"></i>оборот</span><span><i></i>прибыль</span></div>` : ''}
      <div class="tw"><table><thead><tr><th>Период</th><th>Оборот</th><th>Прибыль</th><th>${compactTable ? 'Рентаб.' : 'Рентабельность'}</th><th>В карман</th></tr></thead><tbody>
      ${groups.slice().reverse().slice(0, LIMIT[range]).map((g) => `<tr class="${canEdit ? 'go' : ''}" ${canEdit ? `data-act="edit" data-v="${g.key}"` : ''}><td>${short(g)}${g.filled < g.size ? `<em>${g.filled} из ${g.size}</em>` : ''}</td><td>${f(g.rev)}</td><td>${f(g.profit)}</td><td>${pct(M.margin(g.profit, g.rev))}</td><td>${f(g.pocket)}</td></tr>`).join('')}
      </tbody>${range === 'month' ? `<tfoot><tr><td>Итого</td><td>${f(tot.rev)}</td><td>${f(tot.profit)}</td><td>${pct(M.margin(tot.profit, tot.rev))}</td><td>${f(tot.pocket)}</td></tr></tfoot>` : ''}</table></div>
      <div class="mut small" style="margin-top:8px">${compactTable ? `Суммы в ${SYMBOL[p.cur]}. ` : ''}${range === 'month' ? `Заполнено ${cov.filled} из ${cov.expected} мес.` : 'Считаем по календарю и только внесённые месяцы.'}</div>
    </section>` : '';

    const form = isMember ? `<section class="card sec" id="bForm">
      <div class="sec-head">
        <div><h2>${esc(p.bizName)}</h2></div>
      </div>
      <div class="sec-head" style="margin-bottom:10px">
        <div class="nav"><button data-act="pPrev" aria-label="Раньше">‹</button><b>${title}</b><button data-act="pNext" aria-label="Позже" ${ui.period >= due ? 'disabled' : ''}>›</button></div>
        <span class="sub">Удобнее всего с 1 по 5 число, напомним в Telegram</span>
      </div>
      <div class="fields">
        <label class="f"><span>Оборот</span><input class="inp" id="b-rev" inputmode="decimal" autocomplete="off" value="${esc(ui.biz.rev)}" placeholder="0"><small>Все оплаты клиентов, до расходов</small></label>
        <label class="f"><span>Чистая прибыль</span><input class="inp" id="b-profit" inputmode="text" autocomplete="off" value="${esc(ui.biz.profit)}" placeholder="0"><small>Что осталось после всех расходов. Если в минус, поставьте −</small></label>
        <label class="f"><span>В карман</span><input class="inp" id="b-pocket" inputmode="decimal" autocomplete="off" value="${esc(ui.biz.pocket)}" placeholder="0"><small>Сколько вывели себе лично</small></label>
      </div>
      <div class="live" id="bLive">${live.html}</div>
      <div id="bErr" class="err">${live.err}</div>
      <div class="row" style="margin-top:6px"><button class="btn" data-act="bizSave">${filled ? 'Обновить' : 'Сохранить'}</button><span class="mut small">В ${SYMBOL[p.cur]}. Остальной учёт ведите в своей бухгалтерии.</span></div>
      ${ui.offer ? offer() : ''}
    </section>` : '';

    return `<div class="stack">${meter()}${isMember ? '' : mentorCard()}${form}${table}
      <div class="privacy">Цифры бизнеса видите вы, ваш наставник и директор клана.</div></div>`;
  }

  function offer() {
    const o = ui.offer;
    return `<div class="offer">
      <p style="margin:0">Вы вывели себе <b class="num">${money(o.amount)}</b>. Записать в личные финансы как доход? Если выводили частями, поправьте сумму.</p>
      <input class="inp" id="offerVal" inputmode="decimal" value="${group(o.amount)}" aria-label="Сумма для личных финансов">
      <button class="btn sm" data-act="offerYes">Записать</button>
      <button class="btn ghost sm" data-act="offerNo">Не сейчас</button>
    </div>`;
  }

  function mentorCard() {
    const p = d(); const rows = M.rollup(p.periods).slice(-12);
    const tot = rows.reduce((a, r) => ({ rev: a.rev + r.rev, profit: a.profit + r.profit, pocket: a.pocket + r.pocket }), { rev: 0, profit: 0, pocket: 0 });
    if (!rows.length) return '';
    const cov = M.coverage(p.periods, p.today);
    return `<section class="card sec"><div class="sec-head"><h2>Карточка для встречи: ${esc(p.bizName)}</h2><span class="sub">Заполнено ${cov.filled} из ${cov.expected} мес</span></div>
      <div class="mentor">
        <div class="fig sm"><small>Оборот, ${rows.length} мес</small><b class="num">${usd(tot.rev)}</b></div>
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
        <label>Переключатель<select data-pref="switcher">${opt({ cards: 'А. Две карточки с цифрами', seg: 'Б. Простой переключатель', tabs: 'В. Две вкладки в трекере' }, prefs.switcher)}</select></label>
        <label>Стрелка считает<select data-pref="metric">${opt({ profit: 'Чистую прибыль', rev: 'Оборот', pocket: 'Деньги в кармане' }, prefs.metric)}</select></label>
        <label>Валюта<select data-demo="cur">${opt({ RUB: 'Рубли', USD: 'Доллары', EUR: 'Евро' }, p.cur)}</select></label>
        <label>Тема<select data-pref="theme">${opt({ dark: 'Тёмная', light: 'Светлая' }, prefs.theme)}</select></label>
        <button data-act="advance">Месяц вперёд</button>
        <button data-act="reset">Сбросить этого участника</button>
        <div class="demo-note">${esc(PERSONAS[prefs.persona].hint)}. Данные вымышленные и хранятся только в этом браузере. Курс: $1 = ${M.RATES.RUB} ₽, ${M.RATES.EUR} €.</div>
      </div></details>`;
  }

  function render() {
    const p = d();
    document.documentElement.classList.toggle('dark', prefs.theme === 'dark');
    const sw = prefs.switcher === 'cards' ? pairCards() : prefs.switcher === 'seg' ? segSwitch() : '';
    app.innerHTML = `${demoBar()}<main class="page">${tracker()}
      ${prefs.role === 'mentor' || sw ? `<div class="stack">${prefs.role === 'mentor' ? '<p class="mut small" style="margin:0">Вы смотрите кабинет участника: только чтение.</p>' : ''}${sw}</div>` : ''}
      ${p.tab === 'business' ? business() : personal()}
    </main>${ui.toast ? `<div class="toast" role="status"><span>${esc(ui.toast.text)}</span>${ui.toast.undo ? '<button data-act="undo">Отменить</button>' : ''}</div>` : ''}`;
    typo(app);
    const n = document.getElementById('needle');
    if (n) requestAnimationFrame(() => requestAnimationFrame(() => { n.style.transform = `rotate(${n.dataset.to}deg)`; needleWas = Number(n.dataset.to); }));
    if (ui.composer) { const a = document.getElementById('amt'); if (a && ui.focusAmt) { a.focus({ preventScroll: false }); ui.focusAmt = false; } }
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
    ui.composer = type; ui.rec = false; ui.addSrc = false; ui.focusAmt = true;
    const lastSrc = p.entries.filter((e) => e.type === 'income').slice(-1)[0];
    ui.draft = {
      amount: '', note: '', date: p.today, cur: p.cur === 'USD' ? 'USD' : p.cur, repeat: false,
      pick: type === 'income' ? (lastSrc ? lastSrc.src : (p.sources[0] || {}).id) : 'none',
    };
  }

  const actions = {
    tab(v) { d().tab = v; ui.composer = null; ui.rec = false; },
    mode(v) { d().personalMode = v; ui.composer = null; ui.rec = false; if (v === 'simple') toast('Расходы сохранены и скрыты. Вернуть можно в любой момент.'); },
    open(v) { openComposer(v); },
    closeComposer() { ui.composer = null; },
    pick(v) { ui.draft.pick = ui.draft.pick === v && ui.composer === 'expense' ? 'none' : v; },
    curPick(v) { ui.draft.cur = v; },
    srcAdd() { ui.addSrc = true; },
    srcSave() {
      const el = document.getElementById('newSrc'); const name = el && el.value.trim();
      if (!name) return;
      const id = uid(); d().sources.push({ id, name, own: true }); ui.draft.pick = id; ui.addSrc = false;
    },
    saveEntry() {
      const p = d(); const c = ui.draft; const v = parseNum(c.amount);
      if (v == null || Number.isNaN(v) || v <= 0) { const e = document.getElementById('cerr'); if (e) e.textContent = 'Введите сумму.'; return false; }
      const type = ui.composer;
      const entry = { id: uid(), type, date: c.date || p.today, amount: v, cur: c.cur };
      if (type === 'income') entry.src = c.pick;
      else { entry.cat = c.pick || 'none'; if (c.note) entry.note = c.note; }
      p.entries.push(entry);
      if (type === 'expense' && c.repeat) {
        const day = Number(entry.date.slice(8, 10));
        p.repeats = p.repeats || [];
        p.repeats.push({ id: uid(), title: c.note || (CATS.find((k) => k.id === entry.cat) || {}).name || 'Расход', cat: entry.cat, amount: v, cur: c.cur, day, last: M.monthKey(entry.date) });
        entry.auto = true;
      }
      ui.month = M.monthKey(entry.date); ui.composer = null;
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
          if (!p.sources.some((s) => s.id === 'unsorted')) p.sources.push({ id: 'unsorted', name: 'Неразобранный доход', own: false });
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
      const p = d(); const el = document.getElementById('bizName'); const name = el && el.value.trim();
      if (!name) { document.getElementById('cerr').textContent = 'Введите название.'; return false; }
      p.hasBiz = true; p.bizName = name; if (!p.sources.some((s) => s.id === 'biz')) p.sources.unshift({ id: 'biz', name: 'Из бизнеса', own: true });
      ui.period = null; ui.biz = null;
    },
    bizSave() {
      const p = d(); const { rev, profit, pocket, err } = bizCheck();
      if (err) return false;
      if (rev == null && profit == null && pocket == null) { document.getElementById('bErr').textContent = 'Внесите хотя бы одну цифру.'; return false; }
      const k = M.RATES[p.cur]; const key = ui.period;
      const row = { kind: 'month', key, rev: (rev || 0) / k, profit: (profit || 0) / k, pocket: (pocket || 0) / k };
      const i = p.periods.findIndex((x) => x.key === key && x.kind === 'month');
      if (i >= 0) p.periods[i] = row; else p.periods.push(row);
      const moved = (p.moved || {})[key] || 0;
      const rest = (row.pocket - moved) * k;
      const keep = key;
      setPeriod(keep);
      ui.offer = rest >= 1 ? { key, amount: rest } : null;
      toast('Сохранено');
    },
    offerYes() {
      const p = d(); const el = document.getElementById('offerVal'); const v = parseNum(el && el.value);
      if (v == null || Number.isNaN(v) || v <= 0) return false;
      if (!p.sources.some((s) => s.id === 'biz')) p.sources.unshift({ id: 'biz', name: 'Из бизнеса', own: true });
      const entry = { id: uid(), type: 'income', date: p.today, amount: v, cur: p.cur, src: 'biz', link: ui.offer.key };
      p.entries.push(entry);
      p.moved = p.moved || {}; p.moved[ui.offer.key] = (p.moved[ui.offer.key] || 0) + v / M.RATES[p.cur];
      ui.offer = null; ui.month = curMonth(); toast('Записали в личные финансы', entry.id);
    },
    offerNo() { ui.offer = null; },
    levelup() {
      const p = d(); p.level = Math.min(3, p.level + 1); p.levelSource = 'Предыдущий уровень сделан'; needleWas = -90;
      toast(`Уровень ${p.level}: ${M.LEVELS[p.level - 1].name}`);
    },
    advance() {
      const p = d(); const key = M.addMonths(M.monthKey(p.today), 1);
      p.today = `${key}-${p.today.slice(8, 10)}`; addRepeatsUntil(p);
      ui.period = null; ui.biz = null; ui.offer = null; ui.month = null;
    },
    reset() {
      data[prefs.persona] = PERSONAS[prefs.persona].make();
      Object.assign(ui, { composer: null, draft: null, biz: null, period: null, offer: null, month: null, sort: null, rec: false, toast: null });
      needleWas = -90;
    },
    csv() {
      const p = d();
      const rows = [['Дата', 'Тип', 'Сумма', 'Валюта', 'Источник или категория', 'Название']].concat(p.entries.map((e) => [
        e.date, e.type === 'income' ? 'Доход' : 'Расход', e.amount, e.cur,
        e.type === 'income' ? (p.sources.find((s) => s.id === e.src) || {}).name : (CATS.find((k) => k.id === e.cat) || { name: 'Без категории' }).name, e.note || '',
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
  document.addEventListener('toggle', (ev) => { if (ev.target.id === 'demo') ui.demoOpen = ev.target.open; }, true);

  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (t.dataset.pref) {
      prefs[t.dataset.pref] = t.value;
      if (t.dataset.pref === 'persona' || t.dataset.pref === 'role') {
        Object.assign(ui, { composer: null, biz: null, period: null, offer: null, month: null, sort: null, rec: false });
        needleWas = -90;
        if (t.dataset.pref === 'role' && t.value === 'mentor' && d().hasBiz) d().tab = 'business';
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
    } else if (t.id === 'rep' && ui.draft) ui.draft.repeat = t.checked;
    else if (t.id === 'date' && ui.draft) ui.draft.date = t.value;
  });

  document.addEventListener('input', (ev) => {
    const t = ev.target;
    if (t.id === 'amt') { ui.draft.amount = t.value; const fx = document.getElementById('fx'); if (fx) fx.textContent = fxLine(); }
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

  render();
})();
