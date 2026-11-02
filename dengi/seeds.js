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
        cur: 'USD', level: 1, levelSource: 'По анкете: доход до $36 000 в год', hasBiz: false, bizName: '',
        periods: [], personalMode: 'simple',
        sources: [{ id: 'main', name: 'Основной доход', own: true }, { id: 'side', name: 'Подработка', own: true }],
        entries: [], repeats: [], balance: null, moved: {}, today: TODAY, tab: 'business',
      }),
    },
    voice: {
      title: 'Пример из голосового', hint: 'Месяц $2 500, месяц $1 500, цель $36 000',
      make: () => ({
        cur: 'USD', level: 1, levelSource: 'По анкете: доход до $36 000 в год', hasBiz: true, bizName: 'Бизнес из примера',
        periods: [
          { kind: 'month', key: '2026-09', rev: 7000, profit: 2500, pocket: 1500 },
          { kind: 'month', key: '2026-10', rev: 5200, profit: 1500, pocket: 900 },
        ],
        personalMode: 'simple',
        sources: [{ id: 'biz', name: 'Из бизнеса', own: true }],
        entries: [], repeats: [], balance: null, moved: {}, today: TODAY, tab: 'business',
      }),
    },
    micro: {
      title: 'Онлайн-школа, 7 месяцев', hint: 'Онлайн-школа, рубли, полный личный учёт',
      make: () => {
        const r = [180, 240, 160, 310, 270, 220, 340];
        const p = [25, 40, 15, 55, 45, 30, 60];
        const c = [20, 30, 10, 40, 40, 25, 45];
        return {
          cur: 'RUB', level: 1, levelSource: 'По анкете: доход до $36 000 в год', hasBiz: true, bizName: 'Онлайн-школа рисования',
          periods: r.map((v, i) => ({
            kind: 'month', key: M.addMonths('2026-04', i), rev: rub(v * 1000), profit: rub(p[i] * 1000), pocket: rub(c[i] * 1000),
          })),
          personalMode: 'full',
          sources: [{ id: 'biz', name: 'Из бизнеса', own: true }, { id: 'consult', name: 'Консультации', own: true }],
          entries: microEntries,
          repeats: [{ id: 'r1', title: 'Аренда', cat: 'home', amount: 32000, cur: 'RUB', day: 5, last: '2026-10' }],
          templates: [{ id: 't1', title: 'Продукты', cat: 'food', amount: 3000 }, { id: 't2', title: 'Кафе', cat: 'cafe', amount: 1200 }, { id: 't3', title: 'Такси', cat: 'move', amount: 600 }],
          balance: { date: '2026-10-27', amount: 214000 },
          moved: { '2026-08': rub(40000), '2026-09': rub(25000), '2026-10': rub(45000) },
          today: TODAY, tab: 'personal',
        };
      },
    },
    ready: {
      title: 'Готов к переходу', hint: 'За 12 месяцев сделал цель первого уровня',
      make: () => ({
        cur: 'USD', level: 1, levelSource: 'По анкете: доход до $36 000 в год', hasBiz: true, bizName: 'Студия ремонта',
        periods: year.map(([rev, profit, pocket], i) => ({ kind: 'month', key: M.addMonths('2025-11', i), rev, profit, pocket })),
        personalMode: 'simple',
        sources: [{ id: 'biz', name: 'Из бизнеса', own: true }],
        entries: [], repeats: [], balance: null, moved: {}, today: TODAY, tab: 'business',
      }),
    },
    job: {
      title: 'Работа и подработка', hint: 'Бизнеса нет: личные финансы живут отдельно, стрелка ждёт бизнес',
      make: () => {
        const entries = [];
        ['2026-07', '2026-08', '2026-09', '2026-10'].forEach((m, i) => {
          entries.push(inc(`s${i}`, `${m}-10`, 120000, 'salary'));
          entries.push(inc(`g${i}`, `${m}-21`, [15000, 22000, 18000, 30000][i], 'gig'));
        });
        return {
          cur: 'RUB', level: 1, levelSource: 'По анкете: своего дела пока нет', hasBiz: false, bizName: '',
          periods: [], personalMode: 'simple',
          sources: [{ id: 'salary', name: 'Зарплата', own: false }, { id: 'gig', name: 'Подработка', own: true }],
          entries, repeats: [], balance: null, moved: {}, today: TODAY, tab: 'personal',
        };
      },
    },
  };

  window.Seeds = { PERSONAS, CATS, TODAY };
})();
