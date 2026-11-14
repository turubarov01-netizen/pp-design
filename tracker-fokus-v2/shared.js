/* Общее состояние трёх вариантов «Фокуса дня» и демо-панель.
   ?goals=1|3  ?mode=morning|evening — переносятся между вариантами. */
(function () {
  const Q = new URLSearchParams(location.search);
  const GOALS = Q.get('goals') === '3' ? 3 : 1;
  const MODE = Q.get('mode') === 'morning' ? 'morning' : 'evening';
  const NB = ' ';

  const ALL_GOALS = [
    { id: 'g1', img: 'img/goal-focus.webp', title: 'Поток Фокуса на' + NB + '40 человек', short: 'Поток Фокуса', done: 6, total: 20,
      steps: ['Собрать список выпускников', 'Записать вводный урок потока', 'Пост-анонс в' + NB + 'канал', 'Собрать 5 отзывов', 'Обновить лендинг потока', 'Созвониться с' + NB + 'тремя выпускниками',
        'Смонтировать урок и' + NB + 'выложить в' + NB + 'школу', 'Разослать приглашение по' + NB + 'базе', 'Провести эфир-знакомство', 'Открыть продажи', 'Набрать первые 10 мест'] },
    { id: 'g2', img: 'img/goal-run.webp', title: 'Полумарафон весной', short: 'Полумарафон', done: 3, total: 16,
      steps: ['Купить кроссовки', 'Пробежать 5 км', 'Составить план на' + NB + '12 недель', 'Пробежать 8 км без остановки', 'Записаться на' + NB + 'забег', 'Длинная 12 км'] },
    { id: 'g3', img: 'img/goal-sea.webp', title: 'Дом у' + NB + 'моря', short: 'Дом у моря', done: 1, total: 24,
      steps: ['Выбрать 3 города', 'Посчитать бюджет', 'Поговорить с' + NB + 'риелтором', 'Съездить посмотреть'] },
  ];

  const S = {
    goalsCount: GOALS, mode: MODE,
    goals: ALL_GOALS.slice(0, GOALS).map(g => ({ ...g, planned: MODE === 'evening' ? g.done : null, doneToday: false })),
    active: 0,
    habits: [
      { id: 'h1', t: 'Зарядка 15' + NB + 'минут', done: true, streak: 9, week: [1, 1, 1, 0, 1, 1, 0] },
      { id: 'h2', t: 'Чтение 20' + NB + 'страниц', done: false, streak: 4, week: [1, 0, 1, 1, 1, 0, 0] },
      { id: 'h3', t: 'Пост в' + NB + 'канал', done: false, streak: 2, week: [1, 0, 1, 0, 1, 0, 0], perWeek: 3 },
    ],
    // квесты дня: задание следующей звезды из открытых уроков маршрута (звёзды и критерии — routeMapHw.ts).
    // В работе до 3 уроков; остальные открытые ждут в очереди по приоритету (добавленное на разборе — первым).
    quests: [
      { id: 'q1', lesson: 'Тест ниши', stage: '1.2', mentor: 'Игорь, разбор 12' + NB + 'ноября', stars: 0, crit: ['10 звонков', '50 звонков', '50 объявлений', 'Есть предварительный интерес', 'Есть оплата'] },
      { id: 'q2', lesson: 'Выбор ниши', stage: '1.1', stars: 1, crit: ['5 ниш из прошлого', '5 ниш из настоящего', '5 ниш из будущего', 'Каждая оценена по пяти критериям', 'Выбраны пять бизнес-идей'] },
      { id: 'q3', lesson: 'Целевая аудитория', stage: '1.1', stars: 2, crit: ['10 страхов', '10 желаний', '10 болей', 'Подробный аватар, конкретный человек', 'Разговор с тремя людьми'] },
      { id: 'q4', lesson: 'Жизнь без страха', stage: 'старт', stars: 0, crit: ['Записан страх', 'Страх конкретный: ситуация, а не тема', 'Заполнено «как не допустить»', 'Заполнено «что сделаю, если случится»', 'Так разобраны три страха'] },
      { id: 'q5', lesson: 'Как добиться успеха. 5 правил', stage: '1.1', stars: 3, crit: ['Разобрано 1 правило', '2 правила', '3 правила', '4 правила', 'Все 5 правил'] },
    ].map(q => ({ ...q, today: 0, off: false })),
    streak: 12, xp: 40, phoenix: 1,
    // пульс: люди рядом по маршруту (тот же этап, отряд, город), серия дней и что сделали сегодня
    pulse: [
      { id: 'p1', n: 'Марина Ковалёва', c: '#B8572F', streak: 21, near: 'этап 1.1, как у' + NB + 'тебя', w: '2 шага к' + NB + 'цели «Запустить свой канал»', cheers: 3 },
      { id: 'p2', n: 'Олег Саватеев', c: '#3E7A5A', streak: 9, near: 'твой отряд', w: 'Сдал «Выбор ниши» на' + NB + '4' + NB + '★', cheers: 1 },
      { id: 'p3', n: 'Анна Литвин', c: '#6B4FA0', streak: 34, near: 'тоже в' + NB + 'Лиссабоне', w: 'Дошла до' + NB + 'середины цели «Книга»', cheers: 6 },
      { id: 'p4', n: 'Дмитрий Орлов', c: '#2F6FA8', streak: 2, near: 'этап 1.1, как у' + NB + 'тебя', w: 'Вернулся после паузы, закрыл все привычки', cheers: 0 },
    ].map(p => ({ ...p, mine: false })),
    cheeredMe: ['Марина', 'Олег'],
  };
  S.goal = () => S.goals[S.active];
  S.stepTitle = (g, i) => g.steps[i] || ('Шаг ' + (i + 1));
  S.left = g => g.total - g.done;
  // день: три дела — шаг к цели, привычки, важные задачи
  S.day = () => {
    const step = S.goals.some(g => g.doneToday) ? 1 : 0;
    const hb = S.habits.filter(h => h.done).length / S.habits.length;
    const tk = S.qDone() / S.QMAX;
    return { step, hb, tk, closed: step + (hb === 1 ? 1 : 0) + (tk === 1 ? 1 : 0), sum: (step + hb + tk) / 3 };
  };
  S.listeners = [];
  S.on = f => S.listeners.push(f);
  S.emit = (why, id) => S.listeners.forEach(f => f(why, id));
  S.plan = (gi, idx) => { const g = S.goals[gi]; g.planned = idx; S.mode = 'evening'; S.emit('plan'); };
  S.doStep = gi => { const g = S.goals[gi]; if (g.doneToday || g.planned == null) return; g.done++; g.doneToday = true; g.planned = null; S.xp += 30; S.emit('step'); };
  S.toggleHabit = id => { const h = S.habits.find(x => x.id === id); h.done = !h.done; h.week[5] = h.done ? 1 : 0; h.streak += h.done ? 1 : -1; S.xp += h.done ? 5 : -5; S.emit('habit'); };
  S.QMAX = 3; S.QSTAR = 3;
  S.qActive = () => S.quests.filter(q => !q.off && q.stars < S.QSTAR).slice(0, S.QMAX);
  S.qWaiting = () => S.quests.filter(q => !q.off && q.stars < S.QSTAR).length - S.qActive().length;
  S.qDone = () => S.quests.filter(q => q.today > 0).length;
  S.questStep = id => { const q = S.quests.find(x => x.id === id); if (q.stars >= S.QSTAR) return; q.stars++; q.today++; S.xp += 5; S.emit('quest', id); };
  S.questOff = (id, off = true) => { S.quests.find(x => x.id === id).off = off; S.emit('quest-off', id); };
  S.cheer = id => { const p = S.pulse.find(x => x.id === id); p.mine = !p.mine; p.cheers += p.mine ? 1 : -1; S.emit('cheer', id); };
  S.setActive = i => { S.active = i; S.emit('goal'); };
  window.FD = S;

  // ---------- демо-панель ----------
  const page = (location.pathname.match(/(\w)\.html$/) || [])[1] || 'a';
  const href = (p, extra) => { const q = new URLSearchParams({ goals: String(GOALS), mode: MODE, ...extra }); return p + '.html?' + q; };
  const bar = document.createElement('div');
  bar.className = 'demo';
  bar.innerHTML = `
    <div class="demo-v">${[['a', 'А · Поход'], ['b', 'Б · Карточки'], ['c', 'В · Кольца']].map(([p, l]) => `<a href="${href(p)}" class="${p === page ? 'on' : ''}">${l}</a>`).join('')}</div>
    <div class="demo-o"><span>Целей</span><a href="${href(page, { goals: '1' })}" class="${GOALS === 1 ? 'on' : ''}">1</a><a href="${href(page, { goals: '3' })}" class="${GOALS === 3 ? 'on' : ''}">3</a></div>
    <div class="demo-o"><a href="${href(page, { mode: 'morning' })}" class="${MODE === 'morning' ? 'on' : ''}">Утро</a><a href="${href(page, { mode: 'evening' })}" class="${MODE === 'evening' ? 'on' : ''}">Вечер</a></div>
    <a class="demo-r" href="${href(page)}" title="Сначала">↺</a>`;
  const css = document.createElement('style');
  css.textContent = `
  .demo{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:500;display:flex;gap:10px;align-items:center;padding:6px;border-radius:16px;background:oklch(0.2 0.03 265 / .92);color:#fff;font:500 13px/1 "Medeo Sans",system-ui,sans-serif;box-shadow:0 14px 40px oklch(0.2 0.05 265 / .35);max-width:calc(100vw - 16px);flex-wrap:wrap;justify-content:center}
  .demo a{color:inherit;text-decoration:none}
  .demo-v,.demo-o{display:flex;gap:2px;padding:3px;border-radius:11px;background:oklch(1 0 0 / .08);align-items:center}
  .demo-o span{padding:0 6px 0 8px;opacity:.55}
  .demo-v a,.demo-o a{padding:8px 11px;border-radius:8px;opacity:.7;white-space:nowrap}
  .demo-v a.on,.demo-o a.on{background:oklch(0.98 0.01 85);color:oklch(0.22 0.12 268);opacity:1;font-weight:650}
  .demo-r{padding:8px 10px;border-radius:9px;background:oklch(1 0 0 / .1)}
  @media (max-width:600px){.demo{bottom:8px;gap:4px;padding:4px}.demo-v a,.demo-o a{padding:7px 8px;font-size:12px}}`;
  document.head.append(css);
  addEventListener('DOMContentLoaded', () => document.body.append(bar));
})();
