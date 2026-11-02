/* Вымышленные участники для прототипа. Настоящих имён и данных здесь нет. */
(function () {
  const M = window.Model;
  const TODAY = '2026-11-02';
  const rub = (v) => v / M.RATES.RUB;

  const CATS = [
    { id: 'home', name: 'Жильё' }, { id: 'food', name: 'Продукты' }, { id: 'cafe', name: 'Кафе' },
    { id: 'move', name: 'Транспорт' }, { id: 'health', name: 'Здоровье' }, { id: 'family', name: 'Семья' },
    { id: 'subs', name: 'Подписки' }, { id: 'grow', name: 'Развитие' }, { id: 'other', name: 'Прочее' },
  ];

  const inc = (id, date, amount, src, extra) => ({ id, type: 'income', date, amount, cur: 'RUB', src, ...extra });
  const exp = (id, date, amount, cat, note, extra) => ({ id, type: 'expense', date, amount, cur: 'RUB', cat, note, ...extra });

  const microEntries = [];
  const monthsMicro = ['2026-08', '2026-09', '2026-10'];
  monthsMicro.forEach((m, i) => {
    microEntries.push(inc(`i${i}a`, `${m}-06`, [40000, 25000, 45000][i], 'biz', { link: m }));
    microEntries.push(inc(`i${i}b`, `${m}-18`, [30000, 42000, 36000][i], 'consult'));
    microEntries.push(exp(`e${i}a`, `${m}-05`, 32000, 'home', 'Аренда', { auto: true }));
    microEntries.push(exp(`e${i}b`, `${m}-09`, [14200, 12800, 15400][i], 'food', 'Продукты'));
    microEntries.push(exp(`e${i}c`, `${m}-16`, [9800, 11600, 10300][i], 'food', 'Продукты'));
    microEntries.push(exp(`e${i}d`, `${m}-12`, [4200, 6100, 3900][i], 'cafe', 'Кафе'));
    microEntries.push(exp(`e${i}e`, `${m}-20`, [3600, 3200, 4100][i], 'move', 'Такси'));
    microEntries.push(exp(`e${i}f`, `${m}-22`, [2400, 2400, 2400][i], 'subs', 'Подписки'));
  });
  microEntries.push(exp('e9', '2026-10-27', 8500, 'none', 'Неразобранные траты', { unsorted: true }));
  microEntries.push(inc('i9', '2026-11-01', 12000, 'consult'));
  microEntries.push(exp('e10', '2026-11-01', 3400, 'food', 'Продукты'));

  const year = [
    [9300, 1860, 1200], [8400, 1620, 1200], [10800, 2400, 1500], [12600, 2940, 2100], [11700, 2580, 1800], [14100, 3360, 2400],
    [15300, 3720, 2700], [13800, 3030, 2100], [16200, 3900, 3000], [17700, 4170, 3000], [16500, 3540, 2400], [18900, 4440, 3300],
  ];

  const PERSONAS = {
    zero: {
      title: 'С нуля', hint: 'Пустой кабинет: вносите месяц за месяцем и смотрите на стрелку',
      make: () => ({
        cur: 'USD', level: 1, levelSource: 'По анкете: доход до {goal} в год', businesses: [], personalMode: 'simple',
        sources: [{ id: 'main', name: 'Основной доход', cat: 'employment', cur: 'USD' }, { id: 'side', name: 'Подработка', cat: 'other', cur: 'USD' }],
        entries: [], repeats: [], balance: null, today: TODAY, tab: 'business',
      }),
    },
    voice: {
      title: 'Пример из голосового', hint: 'Месяц $2 500, месяц $1 500, цель $36 000',
      make: () => ({
        cur: 'USD', level: 1, levelSource: 'По анкете: доход до {goal} в год',
        businesses: [{
          id: 'b1', name: 'Бизнес из примера',
          periods: [
            { kind: 'month', key: '2026-09', rev: 7000, profit: 2500, pocket: 1500 },
            { kind: 'month', key: '2026-10', rev: 5200, profit: 1500, pocket: 900 },
          ],
        }],
        personalMode: 'simple',
        sources: [{ id: 'biz', name: 'Бизнес из примера', cat: 'own_business', cur: 'USD', bizId: 'b1' }],
        entries: [], repeats: [], balance: null, today: TODAY, tab: 'business',
      }),
    },
    micro: {
      title: 'Онлайн-школа, 7 месяцев', hint: 'Онлайн-школа, рубли, полный личный учёт',
      make: () => {
        const r = [180, 240, 160, 310, 270, 220, 340];
        const p = [25, 40, 15, 55, 45, 30, 60];
        const c = [20, 30, 10, 40, 40, 25, 45];
        return {
          cur: 'RUB', level: 1, levelSource: 'По анкете: доход до {goal} в год',
          businesses: [{
            id: 'b1', name: 'Онлайн-школа рисования',
            periods: r.map((v, i) => ({
              kind: 'month', key: M.addMonths('2026-04', i), rev: rub(v * 1000), profit: rub(p[i] * 1000), pocket: rub(c[i] * 1000),
            })),
          }],
          personalMode: 'full',
          sources: [{ id: 'biz', name: 'Онлайн-школа рисования', cat: 'own_business', cur: 'RUB', bizId: 'b1' }, { id: 'consult', name: 'Консультации', cat: 'own_business', cur: 'RUB' }],
          entries: microEntries,
          repeats: [{ id: 'r1', title: 'Аренда', cat: 'home', amount: 32000, cur: 'RUB', day: 5, last: '2026-10' }],
          templates: [{ id: 't1', title: 'Продукты', cat: 'food', amount: 3000 }, { id: 't2', title: 'Кафе', cat: 'cafe', amount: 1200 }, { id: 't3', title: 'Такси', cat: 'move', amount: 600 }],
          balance: { date: '2026-10-27', amount: 214000 },
          today: TODAY, tab: 'personal',
        };
      },
    },
    group: {
      title: 'Две компании', hint: 'Школа и студия вносятся отдельно, выручка складывается. Кофейня закрыта и лежит в архиве',
      make: () => {
        const rows = (start, list) => list.map(([v, pr, po], i) => ({
          kind: 'month', key: M.addMonths(start, i), rev: rub(v * 1000), profit: rub(pr * 1000), pocket: rub(po * 1000),
        }));
        return {
          cur: 'RUB', level: 1, levelSource: 'По анкете: доход до {goal} в год',
          businesses: [
            { id: 'b1', name: 'Онлайн-школа', periods: rows('2026-05', [[240, 40, 30], [160, 15, 10], [310, 55, 40], [270, 45, 40], [220, 30, 25], [340, 60, 45]]) },
            { id: 'b2', name: 'Студия дизайна', periods: rows('2026-07', [[120, 30, 15], [150, 42, 20], [135, 35, 20]]) },
            { id: 'b3', name: 'Кофейня', archived: true, periods: rows('2026-02', [[90, 5, 0], [80, -6, 0]]) },
          ],
          personalMode: 'simple',
          sources: [
            { id: 's1', name: 'Онлайн-школа', cat: 'own_business', cur: 'RUB', bizId: 'b1' },
            { id: 's2', name: 'Студия дизайна', cat: 'own_business', cur: 'RUB', bizId: 'b2' },
            { id: 's3', name: 'Кофейня', cat: 'own_business', cur: 'RUB', bizId: 'b3', archived: true },
            { id: 's4', name: 'Аренда квартиры', cat: 'investment', cur: 'RUB' },
          ],
          entries: [inc('g1', '2026-10-08', 45000, 's1'), inc('g2', '2026-10-12', 20000, 's2'), inc('g3', '2026-10-15', 28000, 's4')],
          repeats: [], balance: null, today: TODAY, tab: 'business',
        };
      },
    },
    ready: {
      title: 'Готов к переходу', hint: 'За 12 месяцев сделал цель первого уровня',
      make: () => ({
        cur: 'USD', level: 1, levelSource: 'По анкете: доход до {goal} в год',
        businesses: [{ id: 'b1', name: 'Студия ремонта', periods: year.map(([rev, profit, pocket], i) => ({ kind: 'month', key: M.addMonths('2025-11', i), rev, profit, pocket })) }],
        personalMode: 'simple',
        sources: [{ id: 'biz', name: 'Студия ремонта', cat: 'own_business', cur: 'USD', bizId: 'b1' }],
        entries: [], repeats: [], balance: null, today: TODAY, tab: 'business',
      }),
    },
    job: {
      title: 'Работа и подработка', hint: 'Бизнеса нет: стрелка идёт по личному доходу',
      make: () => {
        const entries = [];
        ['2026-07', '2026-08', '2026-09', '2026-10'].forEach((m, i) => {
          entries.push(inc(`s${i}`, `${m}-10`, 120000, 'salary'));
          entries.push(inc(`g${i}`, `${m}-21`, [15000, 22000, 18000, 30000][i], 'gig'));
        });
        return {
          cur: 'RUB', level: 1, levelSource: 'По анкете: своего дела пока нет', businesses: [], personalMode: 'simple',
          sources: [{ id: 'salary', name: 'Зарплата', cat: 'employment', cur: 'RUB' }, { id: 'gig', name: 'Подработка', cat: 'other', cur: 'RUB' }],
          entries, repeats: [], balance: null, today: TODAY, tab: 'personal',
        };
      },
    },
  };

  window.Seeds = { PERSONAS, CATS, TODAY };
})();
