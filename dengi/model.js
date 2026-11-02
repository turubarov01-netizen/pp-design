/* Расчёты прототипа «Финансы»: прогноз на год, факт, уровни. Без интерфейса, проверяется test-model.js */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Model = factory();
})(this, function () {
  // Единиц валюты за 1 доллар: таблица currency_rates, 02.11.2026
  const RATES = { USD: 1, RUB: 80.4, EUR: 0.896 };

  // Уровень достигается одним из двух путей: личный доход или выручка компании за год (решение Саши 02.11.2026)
  const LEVELS = [
    { n: 1, name: 'Product-Market Fit', sub: 'Продукт и первые покупки', steps: 'шаги 0–5' },
    { n: 2, name: 'Scaling', sub: 'Система продаж и команда', steps: 'шаги 6–10' },
    { n: 3, name: 'Enterprise', sub: 'Масштабирование', steps: 'шаги 11–15' },
  ];
  // Круглые аналоги в валюте человека, а не пересчёт по курсу: цель не плавает вместе с курсом
  const GOALS = {
    USD: { income: [36000, 120000, 1000000], rev: [120000, 500000, 5000000] },
    RUB: { income: [3000000, 10000000, 80000000], rev: [10000000, 40000000, 400000000] },
    EUR: { income: [36000, 120000, 1000000], rev: [120000, 500000, 5000000] },
  };

  const WEIGHT = { month: 1 / 12, week: 1 / 52 };
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const monthKey = (s) => s.slice(0, 7);
  const addMonths = (key, n) => {
    const [y, m] = key.split('-').map(Number);
    const d = new Date(y, m - 1 + n, 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  };
  const lastDay = (key) => {
    const [y, m] = key.split('-').map(Number);
    return new Date(y, m, 0).getDate();
  };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  // Понедельник недели
  const weekStart = (s) => { const d = parse(s); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return iso(d); };
  // Неделя относится к месяцу своего четверга: так она попадает туда, где у неё больше дней
  const weekMonth = (start) => monthKey(addDays(start, 3));

  const periodEnd = (p) => (p.kind === 'month' ? `${p.key}-${pad(lastDay(p.key))}` : addDays(p.key, 6));

  // Записи за неделю внутри месяца, у которого есть итог, не считаем дважды
  function normalize(periods) {
    const months = new Set(periods.filter((p) => p.kind === 'month').map((p) => p.key));
    return periods.filter((p) => p.kind === 'month' || !months.has(weekMonth(p.key)));
  }

  /* Прогноз на год.
     Сумма за период ÷ долю года, которую период занимает.
     Только месяцы: сумма ÷ число месяцев × 12. Только недели: сумма ÷ число недель × 52.
     Когда данных на год и больше, берём последние 12 месяцев: прогноз равен факту. */
  function stats(periods, metric) {
    const list = normalize(periods).slice().sort((a, b) => periodEnd(b).localeCompare(periodEnd(a)));
    let weight = 0; let fact = 0; let n = 0; const used = [];
    for (const p of list) {
      if (weight >= 1 - 1e-9) break;
      weight += WEIGHT[p.kind];
      fact += Number(p[metric]) || 0;
      n += 1;
      used.push(p);
    }
    if (!n) return { n: 0, weight: 0, months: 0, fact: 0, perMonth: 0, forecast: 0, used };
    const months = weight * 12;
    return { n, weight, months, fact, perMonth: fact / months, forecast: fact / weight, used };
  }

  // Итоги по месяцам: недели складываются в месяц своего четверга
  function rollup(periods) {
    const map = new Map();
    for (const p of normalize(periods)) {
      const key = p.kind === 'month' ? p.key : weekMonth(p.key);
      const row = map.get(key) || { key, rev: 0, profit: 0, pocket: 0, weeks: 0, kind: p.kind };
      row.rev += Number(p.rev) || 0;
      row.profit += Number(p.profit) || 0;
      row.pocket += Number(p.pocket) || 0;
      if (p.kind === 'week') row.weeks += 1;
      map.set(key, row);
    }
    return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
  }

  // Несколько компаний в один ряд: один месяц в разных компаниях складывается
  function combine(lists) {
    const map = new Map();
    lists.flat().forEach((p) => {
      const id = `${p.kind}:${p.key}`;
      const row = map.get(id) || { kind: p.kind, key: p.key, rev: 0, profit: 0, pocket: 0 };
      row.rev += Number(p.rev) || 0;
      row.profit += Number(p.profit) || 0;
      row.pocket += Number(p.pocket) || 0;
      map.set(id, row);
    });
    return [...map.values()];
  }

  const margin = (profit, rev) => (rev > 0 ? profit / rev : null);

  // Сколько месяцев заполнено от первого заполненного до последнего закрытого
  function coverage(periods, today) {
    const rows = rollup(periods);
    if (!rows.length) return { filled: 0, expected: 0, gaps: [] };
    const last = addMonths(monthKey(today), -1);
    const gaps = []; let expected = 0;
    const have = new Set(rows.map((r) => r.key));
    for (let k = rows[0].key; k <= last; k = addMonths(k, 1)) {
      expected += 1;
      if (!have.has(k)) gaps.push(k);
    }
    return { filled: expected - gaps.length, expected, gaps };
  }

  // Календарные группы: месяц, квартал, полгода, год. Сумма по заполненным месяцам, без пересчёта на будущее
  const GROUP_SIZE = { month: 1, quarter: 3, half: 6, year: 12 };
  function groupId(key, range) {
    const [y, m] = key.split('-').map(Number);
    if (range === 'quarter') return { id: `${y}-Q${Math.ceil(m / 3)}`, y, n: Math.ceil(m / 3) };
    if (range === 'half') return { id: `${y}-H${m <= 6 ? 1 : 2}`, y, n: m <= 6 ? 1 : 2 };
    if (range === 'year') return { id: `${y}`, y, n: 1 };
    return { id: key, y, n: m };
  }
  function groupPeriods(periods, range = 'month') {
    const map = new Map();
    for (const r of rollup(periods)) {
      const g = groupId(r.key, range);
      const row = map.get(g.id) || { ...g, range, key: r.key, size: GROUP_SIZE[range], filled: 0, rev: 0, profit: 0, pocket: 0 };
      row.rev += r.rev; row.profit += r.profit; row.pocket += r.pocket; row.filled += 1;
      map.set(g.id, row);
    }
    return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
  }

  /* Личный доход по месяцам. Идущий месяц входит в факт сразу, а в прогноз нет: два первых дня месяца занизили бы темп.
     Окно факта: 12 месяцев вместе с текущим */
  function incomeStats(rows, today) {
    const now = monthKey(today);
    const month = (r) => ({ kind: 'month', key: r.key, income: r.income });
    const closed = rows.filter((r) => r.key < now).map(month);
    const live = rows.find((r) => r.key === now);
    const thisMonth = live ? live.income : 0;
    if (!closed.length) {
      const first = stats(live ? [month(live)] : [], 'income');
      return { ...first, closedFact: first.fact, thisMonth: 0 };
    }
    const base = stats(closed, 'income');
    const from = addMonths(now, -11);
    const fact = rows.filter((r) => r.key >= from && r.key <= now).reduce((a, r) => a + r.income, 0);
    return { ...base, closedFact: base.fact, fact, thisMonth, forecast: Math.max(base.forecast, fact) };
  }

  // Цель уровня в валюте человека
  const levelGoal = (level, metric = 'income', cur = 'USD') => (GOALS[cur] || GOALS.USD)[metric === 'rev' ? 'rev' : 'income'][level - 1];
  // Та же цель в долларах: в них считаются суммы
  const levelTarget = (level, metric = 'income', cur = 'USD') => levelGoal(level, metric, cur) / (GOALS[cur] ? RATES[cur] : 1);
  const canLevelUp = (level, factUsd, metric = 'income', cur = 'USD') => level < LEVELS.length && factUsd * RATES[cur] >= levelGoal(level, metric, cur) - 1e-6;

  // Стартовый уровень по годовой сумме из анкеты, в долларах
  const levelFromYear = (usd, metric = 'income') => (usd >= levelTarget(2, metric) ? 3 : usd >= levelTarget(1, metric) ? 2 : 1);

  return {
    RATES, LEVELS, WEIGHT, iso, parse, pad, monthKey, addMonths, lastDay, addDays, weekStart, weekMonth,
    periodEnd, normalize, stats, incomeStats, rollup, combine, margin, coverage, groupPeriods, GOALS, levelGoal, levelTarget, canLevelUp, levelFromYear,
  };
});
