/* Общее состояние трёх вариантов вкладки «1000 целей», шторка цели, праздник, лента участников, демо-панель.
   ?n=many — список на несколько сотен целей; ?theme=dark — тёмная тема. Имена и цели вымышленные. */
(function () {
  const Q = new URLSearchParams(location.search);
  const MANY = Q.get('n') === 'many';
  const DARK = ['dark', 'pp'].includes(Q.get('theme'));
  if (DARK) document.documentElement.classList.add('pp');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // неразрывный пробел после коротких слов и перед тире
  const nb = s => { let r = String(s); for (let k = 0; k < 2; k++) r = r.replace(/(^|[\s«(])([А-Яа-яЁёA-Za-z0-9]{1,2})\s/g, '$1$2 '); return r.replace(/\s—/g, ' —'); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const T = s => esc(nb(s));

  const CAT = {
    be: { l: 'Быть', h: 'кем стать' },
    do: { l: 'Делать', h: 'что испытать' },
    have: { l: 'Иметь', h: 'что получить' },
  };
  const IC = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    clap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V10m0-1.5V5a1.5 1.5 0 0 1 3 0v5m0-3.5a1.5 1.5 0 0 1 3 0V12m0-3a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-12.6 4.2L4.2 15a1.6 1.6 0 0 1 2.5-2L7 13.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    wand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 4 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2ZM5 19 16 8"/><path d="m19 13 .7 1.3L21 15l-1.3.7L19 17l-.7-1.3L17 15l1.3-.7L19 13Z"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  };

  // ---------- цели ----------
  // [текст, сфера Колеса баланса, срок, стоимость, картинка]
  const BE = [
    ['Спокойным, когда всё идёт не по плану', 'Развитие', '1 год'], ['Человеком, который держит слово', 'Окружение', '1 год'],
    ['В форме: 12% жира', 'Здоровье', '1 год'], ['Тем, кто говорит «нет» без чувства вины', 'Развитие', '1 год'],
    ['Автором своей книги', 'Дело', '3 года'], ['Наставником для десяти учеников', 'Дело', '3 года'],
    ['Жаворонком: подъём в 6:30 без будильника', 'Здоровье', '1 год'], ['Свободным от кредитов', 'Деньги', '1 год'],
    ['Хорошим слушателем для близких', 'Отношения', '1 год'], ['Спикером на большой сцене', 'Дело', '3 года'],
    ['Без телефона за ужином', 'Семья', '1 год'], ['Уверенным в кадре', 'Дело', '1 год'],
    ['Финишёром Ironman 70.3', 'Здоровье', '3 года'], ['Тем, кто звонит родителям каждую неделю', 'Семья', '1 год'],
    ['Предпринимателем с командой из пяти человек', 'Дело', '3 года'], ['Свободным в английском', 'Развитие', '3 года'],
    ['Инвестором с понятной стратегией', 'Деньги', '5 лет'], ['Спокойным родителем', 'Семья', '3 года'],
    ['Тем, кто отдыхает без чувства вины', 'Отдых', '1 год'], ['Своим человеком в горах', 'Отдых', '5 лет'],
  ];
  const DO = [
    ['Запустить поток Фокуса на 40 человек', 'Дело', '1 год', 0, 'img/goal-focus.webp'], ['Пробежать полумарафон весной', 'Здоровье', '1 год', 0, 'img/goal-run.webp'],
    ['Увидеть северное сияние в Тромсё', 'Отдых', '1 год', 180000], ['Прыгнуть с парашютом', 'Отдых', '1 год', 25000],
    ['Пройти Камино де Сантьяго', 'Развитие', '3 года', 250000], ['Выучить пять песен на гитаре', 'Развитие', '1 год'],
    ['Сплавиться по Катуни на Алтае', 'Отдых', '1 год', 60000], ['Провести эфир на 1000 зрителей', 'Дело', '1 год'],
    ['Свозить родителей в Японию', 'Семья', '3 года', 900000], ['Нырнуть с аквалангом в Красном море', 'Отдых', '1 год', 70000],
    ['Прочитать 24 книги за год', 'Развитие', '1 год'], ['Встретить рассвет на Эльбрусе', 'Здоровье', '3 года', 120000],
    ['Написать и издать книгу', 'Дело', '3 года'], ['Проехать Грузию на машине', 'Отдых', '1 год', 150000],
    ['Послушать оперу в Ла Скала', 'Отдых', '3 года', 200000], ['Провести месяц на Бали всей семьёй', 'Семья', '3 года', 700000],
    ['Научиться готовить настоящую пасту', 'Развитие', '1 год'], ['Собрать встречу выпускников школы', 'Окружение', '1 год'],
  ];
  const HAVE = [
    ['Дом у моря', 'Деньги', '10 лет', 45000000, 'img/goal-sea.webp'], ['Подушку на 12 месяцев жизни', 'Деньги', '3 года', 2400000],
    ['Пассивный доход 300 000 ₽ в месяц', 'Деньги', '5 лет'], ['Студию для съёмок', 'Дело', '3 года', 1500000],
    ['Библиотеку на 500 книг', 'Развитие', '5 лет', 400000], ['Велосипед для триатлона', 'Здоровье', '1 год', 350000],
    ['Квартиру без ипотеки', 'Деньги', '5 лет', 18000000], ['Кабинет с видом на парк', 'Дело', '3 года'],
    ['Корги по имени Бублик', 'Семья', '1 год', 120000], ['Капитал 10 млн ₽', 'Деньги', '5 лет'],
    ['MacBook Pro для монтажа', 'Дело', '1 год', 280000], ['Кофемашину как в кофейне', 'Отдых', '1 год', 90000],
    ['Гардероб из 30 любимых вещей', 'Развитие', '1 год', 200000], ['Дачу с баней', 'Семья', '5 лет', 6000000],
  ];
  const STEPS = {
    'Запустить поток Фокуса на 40 человек': ['Собрать список выпускников', 'Записать вводный урок потока', 'Пост-анонс в канал', 'Собрать 5 отзывов', 'Обновить лендинг потока', 'Созвониться с тремя выпускниками', 'Смонтировать урок и выложить в школу', 'Разослать приглашение по базе', 'Провести эфир-знакомство', 'Открыть продажи'],
    'Пробежать полумарафон весной': ['Купить кроссовки', 'Пробежать 5 км', 'Составить план на 12 недель', 'Пробежать 8 км без остановки', 'Записаться на забег', 'Длинная 12 км'],
    'Дом у моря': ['Выбрать 3 города', 'Посчитать бюджет', 'Поговорить с риелтором', 'Съездить посмотреть'],
  };
  const GENERIC_STEPS = ['Разбить цель на шаги', 'Найти человека, который это уже сделал', 'Посчитать, сколько нужно денег и времени', 'Сделать первый маленький шаг', 'Назначить дату'];

  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  const mk = (cat, row) => ({ cat, t: row[0], sph: row[1], hor: row[2], cost: row[3] || 0, img: row[4] || null, st: 'list', sd: 0, sn: 0, secret: false });
  let list;
  if (!MANY) {
    list = [mk('do', DO[0]), mk('be', BE[0]), mk('have', HAVE[0]), mk('do', DO[1]), mk('be', BE[2]), mk('do', DO[2]), mk('do', DO[10]), mk('have', HAVE[1]), mk('be', BE[4]), mk('do', DO[3])];
  } else {
    // несколько сотен целей: свой список плюс то, что люди обычно вставляют пачкой
    const places = ['в Киото', 'в Исландии', 'в Патагонии', 'в Марокко', 'в Норвегии', 'в Лиссабоне', 'в Стамбуле', 'в Нью-Йорке', 'в Перу', 'во Вьетнаме', 'в Шотландии', 'на Байкале', 'на Камчатке', 'в Новой Зеландии', 'в Тбилиси', 'в Ереване', 'в Риме', 'в Барселоне', 'в Праге', 'в Вене', 'в Кейптауне', 'в Мексике', 'в Сеуле', 'в Сингапуре', 'в Каппадокии', 'в Доломитах', 'в Карелии', 'в Калининграде', 'в Самарканде', 'в Андалусии', 'в Провансе', 'в Тоскане', 'в Черногории', 'на Санторини', 'на Мальдивах', 'на Кубе', 'на Шри-Ланке', 'на Алтае', 'в Териберке', 'в Иордании'];
    const doT = ['Побывать {p}', 'Встретить рассвет {p}', 'Провести неделю {p}', 'Встретить Новый год {p}', 'Отметить день рождения {p}'];
    const skills = ['играть на фортепиано', 'кататься на сноуборде', 'стоять на сапе', 'рисовать акварелью', 'говорить по-испански', 'снимать на плёнку', 'водить яхту', 'печь хлеб на закваске', 'танцевать сальсу', 'медитировать каждый день', 'стоять на голове', 'плавать баттерфляем', 'летать на параплане', 'играть в шахматы на 1800', 'шить себе одежду'];
    const things = ['Электросамокат', 'Палатку для походов', 'Беговые часы', 'Рояль в гостиной', 'Квадрокоптер', 'Проектор для домашнего кино', 'Электрогитару', 'Абонемент в бассейн на год', 'Кресло для работы', 'Телескоп', 'Акции на 1 млн ₽', 'Фотоаппарат Fujifilm', 'Кожаный рюкзак', 'Набор ножей шефа', 'Чемодан на колёсах'];
    const habits = ['встаёт раньше всех', 'читает каждый вечер', 'ложится до 23:00', 'благодарит каждый день', 'ведёт дневник', 'бегает по утрам', 'не опаздывает', 'умеет просить о помощи', 'тренируется три раза в неделю', 'учит новое каждый месяц', 'не ест сахар', 'отвечает на письма в тот же день'];
    const gen = [];
    places.forEach(p => doT.forEach(t => gen.push(['do', [t.replace('{p}', p), 'Отдых', pick(['1 год', '3 года', '5 лет']), Math.round(rnd() * 40) * 10000]])));
    skills.forEach(s => gen.push(['do', ['Научиться ' + s, 'Развитие', pick(['1 год', '3 года'])]]));
    things.forEach(s => { gen.push(['have', [s, pick(['Дело', 'Отдых', 'Деньги']), '1 год', Math.round(rnd() * 30 + 1) * 10000]]); gen.push(['have', ['Подарить родителям ' + s.toLowerCase(), 'Семья', '3 года']]); });
    habits.forEach(h => gen.push(['be', ['Человеком, который ' + h, pick(['Здоровье', 'Развитие']), '1 год']]));
    for (let i = gen.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [gen[i], gen[j]] = [gen[j], gen[i]]; }
    list = [...BE.map(r => mk('be', r)), ...DO.map(r => mk('do', r)), ...HAVE.map(r => mk('have', r))];
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    const gm = gen.map(([c, r]) => mk(c, r)); list = [...list.slice(0, 30), ...gm.slice(0, 180), ...list.slice(30), ...gm.slice(180)];
  }
  list.forEach((g, i) => { g.id = 'g' + i; g.n = i + 1; g.made = (i < list.length * .6 ? 'весной 2025' : i < list.length * .9 ? 'летом 2026' : 'в ноябре'); });
  const byText = t => list.find(g => g.t === t);
  const work = (t, sd) => { const g = byText(t); if (!g) return; g.st = 'work'; g.steps = STEPS[t] || GENERIC_STEPS; g.sd = sd; g.sn = Math.max(g.steps.length, { 'Запустить поток Фокуса на 40 человек': 20, 'Пробежать полумарафон весной': 16, 'Дом у моря': 24 }[t] || g.steps.length); };
  const done = (g, d) => { if (!g) return; g.st = 'done'; g.doneAt = d; };
  work('Запустить поток Фокуса на 40 человек', 6); work('Пробежать полумарафон весной', 3);
  done(byText('Прочитать 24 книги за год'), '3 ноября');
  if (MANY) {
    work('Дом у моря', 1);
    [['Прыгнуть с парашютом', '12 марта'], ['Проехать Грузию на машине', '2 мая'], ['Научиться готовить настоящую пасту', '9 января'], ['Выучить пять песен на гитаре', '21 августа'], ['MacBook Pro для монтажа', '14 февраля'], ['Кофемашину как в кофейне', '30 июня'], ['Собрать встречу выпускников школы', '18 сентября'], ['Корги по имени Бублик', '1 октября']].forEach(([t, d]) => done(byText(t), d));
    // остальные исполненные среди старых целей
    let k = 0;
    for (let i = 0; i < list.length && k < 23; i += 7) { const g = list[i]; if (g.st === 'list') { done(g, Math.floor(rnd() * 27 + 1) + ' ' + pick(MONTHS)); k++; } }
  }

  const S = {
    MANY, MAXW: 3, goals: list, CAT,
    get: id => list.find(g => g.id === id),
    live: () => list.filter(g => !g.gone),
    work: () => list.filter(g => !g.gone && g.st === 'work'),
    done: () => list.filter(g => !g.gone && g.st === 'done'),
    open: c => list.filter(g => !g.gone && g.st === 'list' && (!c || g.cat === c)),
    total: () => list.filter(g => !g.gone).length,
    listeners: [],
  };
  S.on = f => S.listeners.push(f);
  S.emit = (why, id) => S.listeners.forEach(f => f(why, id));
  S.add = (t, cat) => { const g = mk(cat, [t, 'Не выбрана', '1 год']); g.id = 'g' + list.length; g.n = S.total() + 1; g.made = 'сегодня'; g.fresh = true; list.push(g); S.emit('add', g.id); return g; };
  S.take = id => {
    const g = S.get(id);
    if (S.work().length >= S.MAXW) { toast(nb('В работе уже ' + S.MAXW + ' цели. Исполни одну или отпусти, чтобы взять новую')); return false; }
    g.st = 'work'; g.steps = g.steps || STEPS[g.t] || GENERIC_STEPS; g.sn = g.sn || g.steps.length; g.sd = g.sd || 0;
    S.emit('take', id); toast(nb('«' + g.t + '» в работе. Шаги появятся в Фокусе дня')); return true;
  };
  S.release = id => { S.get(id).st = 'list'; S.emit('release', id); };
  S.step = id => { const g = S.get(id); g.sd = Math.min(g.sn, g.sd + 1); if (g.sd >= g.sn) S.finish(id); else S.emit('step', id); };
  S.finish = id => { const g = S.get(id); g.st = 'done'; g.doneAt = '19 ноября'; S.emit('done', id); celebrate(g); };
  S.unfinish = id => { const g = S.get(id); g.st = 'list'; g.doneAt = null; S.emit('undone', id); };
  S.remove = id => { const g = S.get(id); g.gone = true; S.emit('remove', id); toast('Цель удалена', () => { g.gone = false; S.emit('restore', id); }); };
  S.secret = id => { const g = S.get(id); g.secret = !g.secret; S.emit('secret', id); };
  S.setImg = (id, img) => { S.get(id).img = img; S.emit('img', id); };
  S.genImg = (id, el) => {
    if (el) el.classList.add('gen');
    setTimeout(() => { const g = S.get(id); S.setImg(id, { do: ['img/focus-flag.webp', 'img/goal-run.webp'], be: ['img/focus-happy.webp', 'img/focus-joy.webp'], have: ['img/goal-sea.webp', 'img/focus-cup.webp'] }[g.cat][g.n % 2]); }, RM ? 0 : 1400);
  };
  S.rub = v => v ? new Intl.NumberFormat('ru-RU').format(v) + ' ₽' : '';
  S.pct = g => Math.round(g.sd / g.sn * 100);

  // ---------- праздник ----------
  const cele = document.createElement('div');
  cele.className = 'cele';
  document.body.append(cele);
  function celebrate(g) {
    const n = S.done().length;
    cele.innerHTML = `<div class="box"><div class="conf"></div><img src="img/focus-joy.webp" alt=""><h2>Исполнено!</h2><div class="gt">${T(g.t)}</div><p>${nb(n + '-я исполненная цель из 1000. Она переедет на стену исполненного.')}</p><div class="acts"><button class="btn soft" data-share>Рассказать в ленте</button><button class="btn pri" data-close>Ура, дальше</button></div></div>`;
    const conf = cele.querySelector('.conf');
    if (!RM) for (let i = 0; i < 40; i++) { const c = document.createElement('i'); c.style.left = Math.random() * 100 + '%'; c.style.background = ['#F0D080', '#CCA830', '#E8774A', '#7C5BD1', '#3C9C8E'][i % 5]; c.style.animationDelay = Math.random() * .4 + 's'; conf.append(c); }
    requestAnimationFrame(() => cele.classList.add('on'));
    closeSheet();
  }
  cele.addEventListener('click', e => {
    if (e.target.closest('[data-share]')) { toast('Опубликовано в ленте «Исполняется прямо сейчас»'); addFeed(); }
    if (e.target === cele || e.target.closest('[data-close],[data-share]')) cele.classList.remove('on');
  });

  // ---------- тост ----------
  const tst = document.createElement('div');
  tst.id = 'toast'; tst.setAttribute('role', 'status');
  document.body.append(tst);
  let tt;
  function toast(msg, undo) {
    tst.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button>Вернуть</button>' : ''}`;
    if (undo) tst.querySelector('button').onclick = () => { undo(); tst.classList.remove('on'); };
    tst.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => tst.classList.remove('on'), 3600);
  }

  // ---------- шторка цели ----------
  const scrim = document.createElement('div'); scrim.className = 'scrim';
  const sheet = document.createElement('aside'); sheet.className = 'sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
  document.body.append(scrim, sheet);
  let cur = null;
  const coverHTML = (g, cls = '') => `<div class="cover c-${g.cat} ${cls}">${g.img ? `<img src="${g.img}" alt="">` : `<span class="lt">${esc(g.t.replace(/^[^А-Яа-яЁёA-Za-z0-9]+/, '')[0] || '•')}</span>`}<span class="sp">${esc(g.sph)}</span></div>`;
  function sheetHTML(g) {
    let mid = '', acts = '';
    if (g.st === 'work') {
      const steps = g.steps.slice(0, 6).map((s, i) => `<li class="${i < g.sd ? 'on' : i === g.sd ? 'nx' : ''}"><i></i><span>${T(s)}</span></li>`).join('');
      mid = `<div class="prog"><div class="lbl"><span>Шаг ${g.sd} из ${g.sn}</span><span>${S.pct(g)}%</span></div><div class="bar"><b style="width:${S.pct(g)}%"></b></div><ul class="steps">${steps}</ul></div>`;
      acts = `<button class="btn pri" data-a="step">${IC.check}Шаг сделан</button><button class="btn gold" data-a="finish">${IC.cup}Исполнено</button>`;
    } else if (g.st === 'done') {
      mid = `<div class="won">${IC.cup}<span>Исполнено ${esc(g.doneAt)}<small>Цель №${g.n} в списке. Записана ${esc(g.made)}.</small></span></div>`;
      acts = `<button class="btn soft" data-a="share">Рассказать в ленте</button>`;
    } else {
      acts = `<button class="btn pri" data-a="take">${IC.star}Взять в работу</button><button class="btn gold" data-a="finish">${IC.cup}Уже исполнено</button>`;
      mid = `<p class="note">${nb('В работе ' + S.work().length + ' из ' + S.MAXW + '. Цель в работе получает шаги, и они приходят в Фокус дня.')}</p>`;
    }
    const facts = [['Сфера', g.sph], ['Срок', g.hor], ['Стоимость', S.rub(g.cost) || 'не указана'], ['Записана', g.made]];
    return `${coverHTML(g, 'cv')}<button class="x" data-a="close" aria-label="Закрыть">${IC.x}</button>
      <div class="bd"><span class="pill c-${g.cat}"><i></i>${CAT[g.cat].l}</span>${g.secret ? ' <span class="tag">' + IC.lock + 'видна только тебе</span>' : ''}<h2>${T(g.t)}</h2>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      ${mid}<div class="acts">${acts}</div>
      <div class="low">${g.img ? '' : `<button class="link" data-a="img">Сгенерировать картинку</button>`}<button class="link" data-a="secret">${g.secret ? 'Сделать видимой' : 'Сделать секретной'}</button>${g.st === 'work' ? '<button class="link" data-a="release">Отпустить</button>' : g.st === 'done' ? '<button class="link" data-a="undone">Вернуть в список</button>' : ''}<button class="link red" data-a="del">Удалить</button></div></div>`;
  }
  function openSheet(id) { cur = id; sheet.innerHTML = sheetHTML(S.get(id)); scrim.classList.add('on'); sheet.classList.add('on'); sheet.querySelector('.x').focus({ preventScroll: true }); }
  function closeSheet() { scrim.classList.remove('on'); sheet.classList.remove('on'); cur = null; }
  scrim.onclick = closeSheet;
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeSheet(); cele.classList.remove('on'); } });
  sheet.addEventListener('click', e => {
    const a = e.target.closest('[data-a]')?.dataset.a; if (!a || !cur) return;
    const id = cur;
    if (a === 'close') closeSheet();
    if (a === 'take') S.take(id);
    if (a === 'step') S.step(id);
    if (a === 'finish') S.finish(id);
    if (a === 'release') S.release(id);
    if (a === 'undone') S.unfinish(id);
    if (a === 'secret') S.secret(id);
    if (a === 'share') { toast('Опубликовано в ленте «Исполняется прямо сейчас»'); addFeed(); }
    if (a === 'del') { closeSheet(); S.remove(id); }
    if (a === 'img') S.genImg(id, sheet.querySelector('.cv'));
  });
  S.on((why, id) => { if (cur && cur === id && why !== 'done' && why !== 'remove') sheet.innerHTML = sheetHTML(S.get(id)); });

  // ---------- лента участников ----------
  const FEED = [
    { n: 'Марина Ковалёва', c: '#B8572F', w: 'исполнила', g: 'Прыгнуть с парашютом', when: '2 часа назад', ch: 12, done: true },
    { n: 'Анна Литвин', c: '#6B4FA0', w: 'исполнила', g: 'Квартиру у парка без ипотеки', when: 'вчера', ch: 31, done: true, img: 'img/goal-sea.webp' },
    { n: 'Олег Саватеев', c: '#3E7A5A', w: 'взял в работу', g: 'Выучить испанский до B2', when: 'сегодня', ch: 2 },
    { n: 'Ирина Белова', c: '#2F6FA8', w: 'сделала 10-й шаг к цели', g: 'Своя пекарня', when: '2 дня назад', ch: 7 },
    { n: 'Дмитрий Орлов', c: '#8A6A2E', w: 'записал 25 новых целей', g: '', when: '3 дня назад', ch: 4 },
  ].map(f => ({ ...f, mine: false }));
  function feedHTML() {
    return FEED.map((f, i) => `<div class="fi glass ${f.done ? 'done-ev' : ''}"><span class="av" style="background:${f.c}">${f.n[0]}</span><div><p><b>${esc(f.n)}</b> ${nb(f.w)}${f.g ? ' <q>' + T(f.g) + '</q>' : ''}</p><div class="when">${f.when}</div></div>${f.img ? `<div class="ph"><img src="${f.img}" alt=""></div>` : ''}<button class="cheer ${f.mine ? 'on' : ''}" data-i="${i}" aria-pressed="${f.mine}">${IC.clap}${f.mine ? 'Поддержано' : 'Поддержать'} · ${f.ch}</button></div>`).join('');
  }
  function renderFeed() { const el = document.getElementById('feed'); if (el) el.innerHTML = feedHTML(); }
  function addFeed() { const d = S.done().slice(-1)[0]; if (!d) return; FEED.unshift({ n: 'Ты', c: '#1E2A6E', w: '· исполнено', g: d.t, when: 'только что', ch: 0, done: true, mine: false, me: true }); renderFeed(); }
  document.addEventListener('click', e => { const b = e.target.closest('.cheer'); if (!b) return; const f = FEED[+b.dataset.i]; f.mine = !f.mine; f.ch += f.mine ? 1 : -1; renderFeed(); });

  // ---------- быстрая запись ----------
  function guess(t) {
    const s = t.trim().toLowerCase();
    if (/^(быть|стать|человеком|тем,|той,|спокойн|уверенн|свободн)/.test(s)) return 'be';
    if (/^(иметь|купить|свой |своя |своё |свою |дом|квартир|машин|капитал)/.test(s)) return 'have';
    return 'do';
  }
  function bindCap() {
    const f = document.getElementById('cap'); if (!f) return;
    const inp = f.querySelector('input'), btn = f.querySelector('.add'), seg = f.querySelectorAll('.seg button');
    let manual = false, cat = 'do';
    const setCat = c => { cat = c; seg.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === c))); };
    setCat('do');
    inp.addEventListener('input', () => { btn.disabled = !inp.value.trim(); if (!manual && inp.value.trim()) setCat(guess(inp.value)); });
    seg.forEach(b => b.onclick = () => { manual = true; setCat(b.dataset.cat); inp.focus(); });
    f.addEventListener('submit', e => { e.preventDefault(); const t = inp.value.trim(); if (!t) return; const g = S.add(t[0].toUpperCase() + t.slice(1), cat); inp.value = ''; btn.disabled = true; manual = false; toast(nb('Цель №' + g.n + ' записана в «' + CAT[cat].l + '»')); });
  }
  const capHTML = (ph = 'Новая цель или желание…') => `<form class="cap glass" id="cap"><input placeholder="${ph}" autocomplete="off" aria-label="Новая цель"><div class="seg" role="group" aria-label="Категория">${Object.entries(CAT).map(([k, v]) => `<button type="button" class="c-${k}" data-cat="${k}"><i></i>${v.l}</button>`).join('')}</div><button class="add" disabled>${IC.plus}<span>Записать</span></button></form>`;

  // ---------- демо-панель ----------
  const page = (location.pathname.match(/wishes-(\w)\.html$/) || [])[1] || 'a';
  const href = (p, extra = {}) => { const q = new URLSearchParams(); const n = 'n' in extra ? extra.n : (MANY ? 'many' : ''); const th = 'theme' in extra ? extra.theme : (DARK ? 'dark' : ''); if (n) q.set('n', n); if (th) q.set('theme', th); const s = q.toString(); return 'wishes-' + p + '.html' + (s ? '?' + s : ''); };
  function demo() {
    const bar = document.createElement('nav'); bar.className = 'demo'; bar.setAttribute('aria-label', 'Варианты прототипа');
    bar.innerHTML = `<div>${[['a', 'А · Полки'], ['b', 'Б · Карта 1000'], ['c', 'В · Лента']].map(([p, l]) => `<a href="${href(p)}" class="${p === page ? 'on' : ''}">${l}</a>`).join('')}</div>
      <div><a href="${href(page, { n: '' })}" class="${!MANY ? 'on' : ''}">10 целей</a><a href="${href(page, { n: 'many' })}" class="${MANY ? 'on' : ''}">Сотни</a></div>
      <div><a href="${href(page, { theme: '' })}" class="${!DARK ? 'on' : ''}">Светлая</a><a href="${href(page, { theme: 'dark' })}" class="${DARK ? 'on' : ''}">Тёмная</a></div>`;
    document.body.append(bar);
  }

  window.WI = { S, nb, esc, T, CAT, IC, RM, openSheet, closeSheet, toast, coverHTML, capHTML, bindCap, renderFeed, celebrate };
  document.addEventListener('DOMContentLoaded', () => { demo(); renderFeed(); bindCap(); });
})();
