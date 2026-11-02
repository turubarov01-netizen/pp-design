/* Расчёты прототипа «Финансы»: прогноз на год, факт, уровни. Без интерфейса, проверяется test-model.js */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Model = factory();
})(this, function () {
  // Единиц валюты за 1 доллар: таблица currency_rates, 02.11.2026
  const RATES = { USD: 1, RUB: 80.4, EUR: 0.896 };

  const LEVELS = [
    { n: 1, name: 'Микробизнес', sub: 'Продукт и первые покупки', steps: 'шаги 0–5', target: 10000 },
    { n: 2, name: 'Средний бизнес', sub: 'Система продаж и команда', steps: 'шаги 6–10', target: 100000 },
    { n: 3, name: 'Крупный бизнес', sub: 'Масштабирование', steps: 'шаги 11–15', target: 1000000 },
  ];

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

  const canLevelUp = (level, fact) => level < LEVELS.length && fact >= LEVELS[level - 1].target;

  // Стартовый уровень по годовой сумме из анкеты, в долларах
  const levelFromYear = (usd) => (usd >= 100000 ? 3 : usd >= 10000 ? 2 : 1);

  return {
    RATES, LEVELS, WEIGHT, iso, parse, pad, monthKey, addMonths, lastDay, addDays, weekStart, weekMonth,
    periodEnd, normalize, stats, rollup, margin, coverage, canLevelUp, levelFromYear,
  };
});
