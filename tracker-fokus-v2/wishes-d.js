/* Вариант Г «Полки + Карта 1000»: сотни-квадратики, полки с номерами и стоимостью, шаги с процентами для любой цели,
   редактирование карточки, карта желаний и обои. ?n=many — сотни целей; ?theme=dark — тёмная тема. Цели и имена вымышленные. */
(function () {
  const Q = new URLSearchParams(location.search);
  const MANY = Q.get('n') === 'many';
  const DARK = ['dark', 'pp'].includes(Q.get('theme'));
  if (DARK) document.documentElement.classList.add('pp');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);

  const nb = s => { let r = String(s); for (let k = 0; k < 2; k++) r = r.replace(/(^|[\s«(])([А-Яа-яЁёA-Za-z0-9]{1,2})\s/g, '$1$2 '); return r.replace(/\s—/g, ' —'); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const T = s => esc(nb(s));

  const CAT = { be: { l: 'Быть', h: 'кем стать' }, do: { l: 'Делать', h: 'что испытать' }, have: { l: 'Иметь', h: 'что получить' } };
  // сферы — из Колеса баланса (SPHERE_NAMES_RU на сайте)
  const SPHERES = ['Мышление', 'Бизнес', 'Любовь', 'Лайфстайл', 'Здоровье', 'Окружение', 'Семья', 'Общество', 'Творчество', 'Капитал'];
  const HORS = ['1 год', '3 года', '5 лет', '10 лет'];
  const CUR = { RUB: { s: '₽', r: 1 }, USD: { s: '$', r: 92, pre: 1 }, EUR: { s: '€', r: 100 } };
  const MAXP = 15, MAXF = 3;

  const IC = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"/></svg>',
    staro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    clap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V10m0-1.5V5a1.5 1.5 0 0 1 3 0v5m0-3.5a1.5 1.5 0 0 1 3 0V12m0-3a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-12.6 4.2L4.2 15a1.6 1.6 0 0 1 2.5-2L7 13.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    wand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 4 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2ZM5 19 16 8"/><path d="m19 13 .7 1.3L21 15l-1.3.7L19 17l-.7-1.3L17 15l1.3-.7L19 13Z"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4m0 0h11l-2 4 2 4H5"/></svg>',
    dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12M7 11l5 5 5-5M5 20h14"/></svg>',
    shuf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h4v4M4 20 20 4M20 16v4h-4M15 15l5 5M4 4l5 5"/></svg>',
  };

  // ---------- деньги ----------
  const fmtN = v => new Intl.NumberFormat('ru-RU').format(v).replace(/\s/g, ' ');
  const money = (v, c = 'RUB') => !v ? '' : CUR[c].pre ? CUR[c].s + fmtN(v) : fmtN(v) + ' ' + CUR[c].s;
  const inRub = g => (g.cost || 0) * CUR[g.cur || 'RUB'].r;
  const short = r => r >= 1e6 ? String(Math.round(r / 1e5) / 10).replace('.', ',') + ' млн ₽' : r >= 1e3 ? fmtN(Math.round(r / 1e3)) + ' тыс. ₽' : r ? fmtN(r) + ' ₽' : '0 ₽';

  // ---------- цели ----------
  // [текст, сфера, срок, стоимость, валюта, картинка]
  const BE = [
    ['Спокойным, когда всё идёт не по плану', 'Мышление', '1 год'], ['Человеком, который держит слово', 'Окружение', '1 год'],
    ['В форме: 12% жира', 'Здоровье', '1 год'], ['Тем, кто говорит «нет» без чувства вины', 'Мышление', '1 год'],
    ['Автором своей книги', 'Творчество', '3 года'], ['Наставником для десяти учеников', 'Общество', '3 года'],
    ['Жаворонком: подъём в 6:30 без будильника', 'Здоровье', '1 год'], ['Свободным от кредитов', 'Капитал', '1 год'],
    ['Хорошим слушателем для близких', 'Любовь', '1 год'], ['Спикером на большой сцене', 'Бизнес', '3 года'],
    ['Без телефона за ужином', 'Семья', '1 год'], ['Уверенным в кадре', 'Бизнес', '1 год'],
    ['Финишёром Ironman 70.3', 'Здоровье', '3 года'], ['Тем, кто звонит родителям каждую неделю', 'Семья', '1 год'],
    ['Предпринимателем с командой из пяти человек', 'Бизнес', '3 года'], ['Свободным в английском', 'Мышление', '3 года'],
    ['Инвестором с понятной стратегией', 'Капитал', '5 лет'], ['Спокойным родителем', 'Семья', '3 года'],
    ['Тем, кто отдыхает без чувства вины', 'Лайфстайл', '1 год'], ['Своим человеком в горах', 'Лайфстайл', '5 лет'],
  ];
  const DO = [
    ['Запустить поток Фокуса на 40 человек', 'Бизнес', '1 год', 0, '', 'img/goal-focus.webp'], ['Пробежать полумарафон весной', 'Здоровье', '1 год', 0, '', 'img/goal-run.webp'],
    ['Увидеть северное сияние в Тромсё', 'Лайфстайл', '1 год', 1800, 'EUR'], ['Прыгнуть с парашютом', 'Лайфстайл', '1 год', 25000],
    ['Пройти Камино де Сантьяго', 'Мышление', '3 года', 2500, 'EUR'], ['Выучить пять песен на гитаре', 'Творчество', '1 год'],
    ['Сплавиться по Катуни на Алтае', 'Лайфстайл', '1 год', 60000], ['Провести эфир на 1000 зрителей', 'Бизнес', '1 год'],
    ['Свозить родителей в Японию', 'Семья', '3 года', 900000], ['Нырнуть с аквалангом в Красном море', 'Лайфстайл', '1 год', 800, 'USD'],
    ['Прочитать 24 книги за год', 'Мышление', '1 год'], ['Встретить рассвет на Эльбрусе', 'Здоровье', '3 года', 120000],
    ['Написать и издать книгу', 'Творчество', '3 года'], ['Проехать Грузию на машине', 'Лайфстайл', '1 год', 150000],
    ['Послушать оперу в Ла Скала', 'Творчество', '3 года', 2000, 'EUR'], ['Провести месяц на Бали всей семьёй', 'Семья', '3 года', 7000, 'USD'],
    ['Научиться готовить настоящую пасту', 'Лайфстайл', '1 год'], ['Собрать встречу выпускников школы', 'Окружение', '1 год'],
  ];
  const HAVE = [
    ['Дом у моря', 'Капитал', '10 лет', 45000000, '', 'img/goal-sea.webp'], ['Подушку на 12 месяцев жизни', 'Капитал', '3 года', 2400000],
    ['Пассивный доход 300 000 ₽ в месяц', 'Капитал', '5 лет'], ['Студию для съёмок', 'Бизнес', '3 года', 1500000],
    ['Библиотеку на 500 книг', 'Мышление', '5 лет', 400000], ['Велосипед для триатлона', 'Здоровье', '1 год', 350000],
    ['Квартиру без ипотеки', 'Капитал', '5 лет', 18000000], ['Кабинет с видом на парк', 'Бизнес', '3 года'],
    ['Корги по имени Бублик', 'Семья', '1 год', 120000], ['Капитал 10 млн ₽', 'Капитал', '5 лет'],
    ['MacBook Pro для монтажа', 'Бизнес', '1 год', 3200, 'USD'], ['Кофемашину как в кофейне', 'Лайфстайл', '1 год', 90000],
    ['Гардероб из 30 любимых вещей', 'Лайфстайл', '1 год', 200000], ['Дачу с баней', 'Семья', '5 лет', 6000000],
  ];
  const STEPS = {
    'Запустить поток Фокуса на 40 человек': [['Собрать список выпускников', 5], ['Записать вводный урок потока', 10], ['Пост-анонс в канал', 5], ['Собрать 5 отзывов', 10], ['Обновить лендинг потока', 10], ['Созвониться с тремя выпускниками', 10], ['Разослать приглашение по базе', 15], ['Провести эфир-знакомство', 15], ['Открыть продажи', 20, 1]],
    'Пробежать полумарафон весной': [['Купить кроссовки', 5], ['Пробежать 5 км', 10], ['Составить план на 12 недель', 5], ['Пробежать 10 км без остановки', 20], ['Записаться на забег', 10], ['Длинная 18 км', 25], ['Пробежать полумарафон', 25, 1]],
    'Дом у моря': [['Выбрать три города', 5], ['Посчитать бюджет', 5], ['Поговорить с риелтором', 5], ['Съездить посмотреть', 10], ['Купить дом', 75, 1]],
    'Выучить пять песен на гитаре': [['Найти преподавателя', 10], ['Первая песня', 20], ['Вторая песня', 20], ['Третья песня', 15], ['Четвёртая песня', 15], ['Пятая песня целиком', 20, 1]],
  };
  const SUGG = ['Найти человека, который это уже сделал', 'Посчитать деньги и время', 'Сделать первый маленький шаг', 'Назначить дату'];

  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const mk = (cat, r) => ({ cat, t: r[0], sph: r[1], hor: r[2], cost: r[3] || 0, cur: r[4] || 'RUB', img: r[5] || null, st: 'list', focus: false, steps: [], secret: false });

  let list;
  if (!MANY) {
    list = [mk('do', DO[0]), mk('be', BE[0]), mk('have', HAVE[0]), mk('do', DO[1]), mk('be', BE[2]), mk('do', DO[2]), mk('do', DO[10]), mk('have', HAVE[1]), mk('be', BE[4]), mk('do', DO[5])];
  } else {
    const places = ['в Киото', 'в Исландии', 'в Патагонии', 'в Марокко', 'в Норвегии', 'в Лиссабоне', 'в Стамбуле', 'в Нью-Йорке', 'в Перу', 'во Вьетнаме', 'в Шотландии', 'на Байкале', 'на Камчатке', 'в Новой Зеландии', 'в Тбилиси', 'в Ереване', 'в Риме', 'в Барселоне', 'в Праге', 'в Вене', 'в Кейптауне', 'в Мексике', 'в Сеуле', 'в Сингапуре', 'в Каппадокии', 'в Доломитах', 'в Карелии', 'в Калининграде', 'в Самарканде', 'в Андалусии', 'в Провансе', 'в Тоскане', 'в Черногории', 'на Санторини', 'на Мальдивах', 'на Кубе', 'на Шри-Ланке', 'на Алтае', 'в Териберке', 'в Иордании'];
    const doT = ['Побывать {p}', 'Встретить рассвет {p}', 'Провести неделю {p}', 'Встретить Новый год {p}', 'Отметить день рождения {p}'];
    const skills = ['играть на фортепиано', 'кататься на сноуборде', 'стоять на сапе', 'рисовать акварелью', 'говорить по-испански', 'снимать на плёнку', 'водить яхту', 'печь хлеб на закваске', 'танцевать сальсу', 'медитировать каждый день', 'стоять на голове', 'плавать баттерфляем', 'летать на параплане', 'играть в шахматы на 1800', 'шить себе одежду'];
    const things = ['Электросамокат', 'Палатку для походов', 'Беговые часы', 'Рояль в гостиной', 'Квадрокоптер', 'Проектор для домашнего кино', 'Электрогитару', 'Абонемент в бассейн на год', 'Кресло для работы', 'Телескоп', 'Акции на 1 млн ₽', 'Фотоаппарат Fujifilm', 'Кожаный рюкзак', 'Набор ножей шефа', 'Чемодан на колёсах'];
    const habits = ['встаёт раньше всех', 'читает каждый вечер', 'ложится до 23:00', 'благодарит каждый день', 'ведёт дневник', 'бегает по утрам', 'не опаздывает', 'умеет просить о помощи', 'тренируется три раза в неделю', 'учит новое каждый месяц', 'не ест сахар', 'отвечает на письма в тот же день'];
    const gen = [];
    places.forEach(p => doT.forEach(t => gen.push(['do', [t.replace('{p}', p), 'Лайфстайл', pick(['1 год', '3 года', '5 лет']), Math.round(rnd() * 40) * 10000]])));
    skills.forEach(s => gen.push(['do', ['Научиться ' + s, pick(['Творчество', 'Мышление']), pick(['1 год', '3 года'])]]));
    things.forEach(s => { gen.push(['have', [s, pick(['Бизнес', 'Лайфстайл', 'Капитал']), '1 год', Math.round(rnd() * 30 + 1) * 10000]]); gen.push(['have', ['Подарить родителям ' + s.toLowerCase(), 'Семья', '3 года']]); });
    habits.forEach(h => gen.push(['be', ['Человеком, который ' + h, pick(['Здоровье', 'Мышление']), '1 год']]));
    for (let i = gen.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [gen[i], gen[j]] = [gen[j], gen[i]]; }
    list = [...BE.map(r => mk('be', r)), ...DO.map(r => mk('do', r)), ...HAVE.map(r => mk('have', r))];
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    const gm = gen.map(([c, r]) => mk(c, r)); list = [...list.slice(0, 30), ...gm.slice(0, 180), ...list.slice(30), ...gm.slice(180)];
  }
  let uid = 0;
  list.forEach((g, i) => { g.id = 'g' + uid++; g.made = (i < list.length * .6 ? 'весной 2025' : i < list.length * .9 ? 'летом 2026' : 'в ноябре'); });
  const byText = t => list.find(g => g.t === t);
  const toWork = (t, doneN, focus) => { const g = byText(t); if (!g) return; g.st = 'work'; g.focus = !!focus; g.steps = (STEPS[t] || []).map(([s, w, fin], i) => ({ t: s, w, fin: !!fin, done: i < doneN })); };
  const toDone = (g, d) => { if (!g) return; g.st = 'done'; g.doneAt = d; g.focus = false; };
  toWork('Запустить поток Фокуса на 40 человек', 6, true); toWork('Пробежать полумарафон весной', 3, true); toWork('Выучить пять песен на гитаре', 2);
  toDone(byText('Прочитать 24 книги за год'), '3 ноября');
  if (MANY) {
    toWork('Дом у моря', 2);
    [['Прыгнуть с парашютом', '12 марта'], ['Проехать Грузию на машине', '2 мая'], ['Научиться готовить настоящую пасту', '9 января'], ['MacBook Pro для монтажа', '14 февраля'], ['Кофемашину как в кофейне', '30 июня'], ['Собрать встречу выпускников школы', '18 сентября'], ['Корги по имени Бублик', '1 октября']].forEach(([t, d]) => toDone(byText(t), d));
    let k = 0;
    for (let i = 0; i < list.length && k < 24; i += 7) { const g = list[i]; if (g.st === 'list') { toDone(g, Math.floor(rnd() * 27 + 1) + ' ' + pick(MONTHS)); k++; } }
    // ещё несколько целей разбиты на шаги, но не в фокусе
    ['Свободным в английском', 'Студию для съёмок', 'Пройти Камино де Сантьяго'].forEach((t, i) => { const g = byText(t); if (!g) return; g.st = 'work'; g.steps = [{ t: 'Разобраться, с чего начать', w: 10, done: true, fin: false }, { t: 'Посчитать деньги и время', w: 10, done: i < 2, fin: false }, { t: 'Сделать первый маленький шаг', w: 20, done: i < 1, fin: false }, { t: 'Цель исполнена', w: 60, done: false, fin: true }]; });
  }

  // ---------- состояние ----------
  const live = () => list.filter(g => !g.gone);
  const num = g => live().indexOf(g) + 1;
  const work = () => live().filter(g => g.st === 'work');
  const focusN = () => work().filter(g => g.focus).length;
  const done = () => live().filter(g => g.st === 'done');
  const pct = g => g.steps.some(s => s.fin && s.done) ? 100 : Math.min(100, g.steps.filter(s => s.done).reduce((a, s) => a + s.w, 0));
  const nextStep = g => g.steps.find(s => !s.done && !s.fin) || g.steps.find(s => !s.done);
  const ls = []; const emit = (why, id) => ls.forEach(f => f(why, id));

  function add(t, cat) {
    const g = mk(cat, [t, '', '1 год']); g.id = 'g' + uid++; g.made = 'сегодня'; g.fresh = Date.now(); list.push(g);
    setTimeout(() => { if (g.fresh) { g.fresh = 0; emit('unfresh', g.id); } }, 12000);
    emit('add', g.id); return g;
  }
  function split(g) {
    if (g.st !== 'work' && work().length >= MAXP) { toast(nb('В работе уже ' + MAXP + ' целей. Исполни одну или убери из работы, чтобы разбить новую')); return false; }
    g.st = 'work'; emit('split', g.id); return true;
  }
  function setFocus(g) {
    if (!g.focus && focusN() >= MAXF) { toast(nb('В фокусе дня уже ' + MAXF + ' цели. Убери одну, чтобы поставить эту')); return; }
    if (!g.focus && g.st !== 'work' && !split(g)) return;
    g.focus = !g.focus; emit('focus', g.id); toast(g.focus ? nb('Цель в фокусе дня: её шаги придут в Фокус дня') : 'Убрано из фокуса дня');
  }
  function stepDone(g) {
    const s = nextStep(g); if (!s) return;
    s.done = true; if (pct(g) >= 100) finish(g); else { emit('step', g.id); toast(nb('Шаг сделан, +' + s.w + '% к цели')); }
  }
  function finish(g) { g.st = 'done'; g.focus = false; g.doneAt = '19 ноября'; g.steps.forEach(s => s.done = true); emit('done', g.id); celebrate(g); }
  function unfinish(g) { g.st = g.steps.length ? 'work' : 'list'; g.doneAt = null; g.steps.forEach(s => s.done = false); emit('undone', g.id); }
  function release(g) { g.st = 'list'; g.focus = false; emit('release', g.id); toast('Цель убрана из работы. Шаги сохранены'); }
  function remove(g) { g.gone = true; closeSheet(); emit('remove', g.id); toast('Цель удалена', () => { g.gone = false; emit('restore', g.id); }); }
  const GEN = { do: ['img/focus-flag.webp', 'img/goal-run.webp'], be: ['img/focus-happy.webp', 'img/focus-joy.webp'], have: ['img/goal-sea.webp', 'img/focus-cup.webp'] };
  function genImg(g, el, cb) { if (el) el.classList.add('gen'); setTimeout(() => { if (el) el.classList.remove('gen'); cb(GEN[g.cat][(num(g) || 1) % 2]); }, RM ? 0 : 1400); }

  // ---------- праздник ----------
  const cele = document.createElement('div'); cele.className = 'cele'; document.body.append(cele);
  function celebrate(g) {
    cele.innerHTML = `<div class="box"><div class="conf"></div><img src="img/focus-joy.webp" alt=""><h2>Исполнено!</h2><div class="gt">${T(g.t)}</div><p>${nb(done().length + '-я исполненная цель из 1000. Её клетка на карте стала золотой.')}</p><div class="acts"><button class="btn soft" data-share>Рассказать в ленте</button><button class="btn pri" data-close>Ура, дальше</button></div></div>`;
    const conf = cele.querySelector('.conf');
    if (!RM) for (let i = 0; i < 40; i++) { const c = document.createElement('i'); c.style.left = Math.random() * 100 + '%'; c.style.background = ['#F0D080', '#CCA830', '#E8774A', '#7C5BD1', '#3C9C8E'][i % 5]; c.style.animationDelay = Math.random() * .4 + 's'; conf.append(c); }
    requestAnimationFrame(() => cele.classList.add('on')); closeSheet();
  }
  cele.addEventListener('click', e => {
    if (e.target.closest('[data-share]')) { toast('Опубликовано в ленте «Исполняется прямо сейчас»'); addFeed(); }
    if (e.target === cele || e.target.closest('[data-close],[data-share]')) cele.classList.remove('on');
  });

  // ---------- тост ----------
  const tst = document.createElement('div'); tst.id = 'toast'; tst.setAttribute('role', 'status'); document.body.append(tst);
  let tt;
  function toast(msg, undo) {
    tst.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button>Вернуть</button>' : ''}`;
    if (undo) tst.querySelector('button').onclick = () => { undo(); tst.classList.remove('on'); };
    tst.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => tst.classList.remove('on'), 3600);
  }

  // ---------- шторка цели: просмотр и редактирование ----------
  const scrim = document.createElement('div'); scrim.className = 'scrim';
  const sheet = document.createElement('aside'); sheet.className = 'sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
  document.body.append(scrim, sheet);
  let cur = null, draft = null;
  const letter = g => esc((g.t.replace(/^[^А-Яа-яЁёA-Za-z0-9]+/, '')[0] || '•'));
  const coverHTML = (g, cls = '', img = g.img) => `<div class="cover c-${g.cat} ${cls}">${img ? `<img src="${img}" alt="">` : `<span class="lt">${letter(g)}</span>`}${g.sph ? `<span class="sp">${esc(g.sph)}</span>` : ''}</div>`;
  const upBtn = (label, cls) => `<label class="${cls}">${IC.up}<span>${label}</span><input type="file" accept="image/*" data-up hidden></label>`;

  function viewHTML(g) {
    const n = num(g), p = pct(g);
    let mid = '', acts = '';
    if (g.st === 'list') {
      mid = `<div class="way"><p>${nb('Как идти к этой цели')}</p>
        <button class="opt" data-a="split"><b>${IC.flag}Разбить на шаги</b><small>${nb('Цель перейдёт в работу, прогресс считается в процентах. В работе ' + work().length + ' из ' + MAXP + '.')}</small></button>
        <button class="opt g" data-a="finish"><b>${IC.cup}Уже исполнено</b><small>${nb('Клетка на карте станет золотой')}</small></button></div>`;
    } else if (g.st === 'work') {
      const sum = g.steps.filter(s => !s.fin).reduce((a, s) => a + s.w, 0);
      const fin = g.steps.find(s => s.fin);
      mid = `<div class="prog"><div class="lbl"><span>${g.steps.length ? 'Пройдено' : nb('Шагов пока нет')}</span><b>${p}%</b></div><div class="bar"><b style="width:${p}%"></b></div></div>
        <ul class="st2">${g.steps.map((s, i) => `<li class="${s.done ? 'on' : ''} ${s.fin ? 'fin' : ''}"><button class="ck" data-a="ck" data-i="${i}" aria-label="${s.done ? 'Снять отметку' : 'Отметить шаг'}" aria-pressed="${s.done}"></button><span class="tx">${T(s.t)}</span>${s.fin ? `<span class="fl">${IC.flag}финиш</span>` : `<span class="wt"><button data-a="w-" data-i="${i}" aria-label="Меньше процентов">−</button><b>${s.w}%</b><button data-a="w+" data-i="${i}" aria-label="Больше процентов">+</button></span>`}${s.done ? '' : `<button class="rm" data-a="rm" data-i="${i}" aria-label="Удалить шаг">${IC.x}</button>`}</li>`).join('')}</ul>
        <form class="addst" data-addst><input placeholder="${g.steps.length ? 'Ещё шаг…' : 'Первый шаг к цели…'}" aria-label="Новый шаг"><button class="btn soft" aria-label="Добавить шаг">${IC.plus}</button></form>
        ${g.steps.length < 3 ? `<div class="sug">${SUGG.filter(s => !g.steps.some(x => x.t === s)).map(s => `<button data-a="sug">${T(s)}</button>`).join('')}</div>` : ''}
        <p class="note">${nb(fin ? 'Шаги дают ' + sum + '%, финиш — ещё ' + fin.w + '%. Отметишь финиш, и цель исполнена целиком.' : 'Каждый шаг даёт свой процент. Отметь шаг флажком «финиш», если он закрывает цель целиком.')}${!fin && g.steps.length ? ` <button class="link" data-a="mkfin">Сделать последний шаг финишем</button>` : ''}</p>`;
      acts = `<button class="btn ${g.focus ? 'gold on' : 'soft'}" data-a="focus" aria-pressed="${g.focus}">${g.focus ? IC.star : IC.staro}${g.focus ? 'В фокусе дня' : 'В фокус дня'}</button>${g.steps.length ? `<button class="btn pri" data-a="step">${IC.check}Шаг сделан</button>` : ''}<button class="btn gold" data-a="finish">${IC.cup}Исполнено</button>`;
    } else {
      mid = `<div class="won">${IC.cup}<span>Исполнено ${esc(g.doneAt)}<small>${nb('Цель №' + n + ' в списке. Записана ' + g.made + '.')}</small></span></div>`;
      acts = `<button class="btn soft" data-a="share">Рассказать в ленте</button>`;
    }
    const facts = [['Сфера', g.sph || '—'], ['Срок', g.hor], ['Стоимость', g.cost ? money(g.cost, g.cur) + (g.cur !== 'RUB' ? ' · ≈ ' + short(inRub(g)) : '') : '<button class="link" data-a="edit">указать</button>'], ['Записана', g.made]];
    return `<div class="cvw">${coverHTML(g, 'cv')}<div class="cvact">${upBtn(g.img ? 'Заменить фото' : 'Загрузить фото', 'cb')}<button class="cb" data-a="gen">${IC.wand}<span>Сгенерировать</span></button></div></div>
      <button class="x" data-a="close" aria-label="Закрыть">${IC.x}</button>
      <div class="bd"><div class="sh-h"><span class="no">№ ${n}</span><span class="pill c-${g.cat}"><i></i>${CAT[g.cat].l}</span>${g.secret ? `<span class="tag">${IC.lock}видна только тебе</span>` : ''}<button class="ed" data-a="edit">${IC.pen}Изменить</button></div>
      <h2>${T(g.t)}</h2>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v.startsWith('<') ? v : esc(v)}</dd></div>`).join('')}</dl>
      ${mid}${acts ? `<div class="acts">${acts}</div>` : ''}
      <div class="low"><button class="link" data-a="secret">${g.secret ? 'Сделать видимой' : 'Сделать секретной'}</button>${g.st === 'work' ? '<button class="link" data-a="release">Убрать из работы</button>' : g.st === 'done' ? '<button class="link" data-a="undone">Вернуть в работу</button>' : ''}<button class="link red" data-a="del">Удалить</button></div></div>`;
  }
  function editHTML(g) {
    const d = draft;
    return `<div class="cvw">${coverHTML({ ...g, cat: d.cat, sph: d.sph }, 'cv', d.img)}</div><button class="x" data-a="close" aria-label="Закрыть">${IC.x}</button>
      <form class="bd ef" data-ef novalidate><div class="sh-h"><span class="no">№ ${num(g)}</span><b class="ttl">Редактирование</b></div>
      <label class="fld"><span>Формулировка</span><textarea name="t" rows="2" required>${esc(d.t)}</textarea></label>
      <div class="fld"><span>Категория</span><div class="seg" role="group" aria-label="Категория">${Object.entries(CAT).map(([k, v]) => `<button type="button" class="c-${k}" data-ecat="${k}" aria-pressed="${d.cat === k}"><i></i>${v.l}</button>`).join('')}</div></div>
      <div class="two"><label class="fld"><span>Сфера</span><select name="sph"><option value="">Без сферы</option>${SPHERES.map(s => `<option ${s === d.sph ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
      <label class="fld"><span>Срок</span><select name="hor">${HORS.map(h => `<option ${h === d.hor ? 'selected' : ''}>${h}</option>`).join('')}</select></label></div>
      <div class="fld"><span>Стоимость</span><div class="mny"><input name="cost" inputmode="numeric" autocomplete="off" placeholder="Например, 180 000" value="${d.cost ? fmtN(d.cost) : ''}"><select name="cur" aria-label="Валюта">${Object.entries(CUR).map(([k, c]) => `<option value="${k}" ${k === d.cur ? 'selected' : ''}>${c.s}</option>`).join('')}</select></div><small>${nb('Пусто, если цель не про деньги. Стоимость попадёт в общую сумму желаний.')}</small></div>
      <div class="fld"><span>Картинка</span><div class="imgrow">${upBtn(d.img ? 'Заменить фото' : 'Загрузить фото', 'btn soft')}<button type="button" class="btn soft" data-a="gen">${IC.wand}Сгенерировать</button>${d.img ? '<button type="button" class="link red" data-a="noimg">Убрать</button>' : ''}</div></div>
      <div class="acts"><button type="button" class="btn soft" data-a="cancel">Отмена</button><button class="btn pri">Сохранить</button></div></form>`;
  }
  const render1 = () => { const g = list.find(x => x.id === cur); if (!g) return; const y = sheet.querySelector('.bd')?.scrollTop || 0; sheet.innerHTML = draft ? editHTML(g) : viewHTML(g); const bd = sheet.querySelector('.bd'); if (bd) bd.scrollTop = y; };
  function openSheet(id, edit) {
    cur = id; const g = list.find(x => x.id === id); if (g.fresh) { g.fresh = 0; emit('unfresh', id); }
    draft = edit ? { t: g.t, cat: g.cat, sph: g.sph, hor: g.hor, cost: g.cost, cur: g.cur, img: g.img } : null;
    render1(); scrim.classList.add('on'); sheet.classList.add('on'); sheet.querySelector('.x').focus({ preventScroll: true });
  }
  function closeSheet() { scrim.classList.remove('on'); sheet.classList.remove('on'); cur = null; draft = null; }
  scrim.onclick = closeSheet;
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeSheet(); cele.classList.remove('on'); closeWp(); } });
  function readDraft() { const f = sheet.querySelector('[data-ef]'); if (!f || !draft) return; draft.t = f.t.value; draft.sph = f.sph.value; draft.hor = f.hor.value; draft.cost = +f.cost.value.replace(/\D/g, '') || 0; draft.cur = f.cur.value; }
  sheet.addEventListener('click', e => {
    const b = e.target.closest('[data-a],[data-ecat]'); if (!b || !cur) return;
    const g = list.find(x => x.id === cur), a = b.dataset.a, i = +b.dataset.i;
    if (b.dataset.ecat) { readDraft(); draft.cat = b.dataset.ecat; render1(); return; }
    if (a === 'close') closeSheet();
    if (a === 'edit') openSheet(g.id, true);
    if (a === 'cancel') { draft = null; render1(); }
    if (a === 'noimg') { readDraft(); draft.img = null; render1(); }
    if (a === 'gen') { if (draft) { readDraft(); genImg({ ...g, cat: draft.cat }, sheet.querySelector('.cv'), img => { if (!draft) return; draft.img = img; render1(); }); } else genImg(g, sheet.querySelector('.cv'), img => { g.img = img; emit('img', g.id); }); }
    if (a === 'split') { if (split(g)) setTimeout(() => sheet.querySelector('.addst input')?.focus(), 50); }
    if (a === 'finish') finish(g);
    if (a === 'focus') setFocus(g);
    if (a === 'step') stepDone(g);
    if (a === 'ck') { const s = g.steps[i]; s.done = !s.done; if (s.done && pct(g) >= 100) finish(g); else emit('step', g.id); }
    if (a === 'w-' || a === 'w+') { const s = g.steps[i], st = s.w >= 10 ? 5 : 1; s.w = Math.max(1, Math.min(100, s.w + (a === 'w+' ? st : -st))); emit('step', g.id); }
    if (a === 'rm') { g.steps.splice(i, 1); emit('step', g.id); }
    if (a === 'sug') { addStep(g, b.textContent); }
    if (a === 'mkfin') { const s = g.steps[g.steps.length - 1]; s.fin = true; emit('step', g.id); }
    if (a === 'release') release(g);
    if (a === 'undone') unfinish(g);
    if (a === 'secret') { g.secret = !g.secret; emit('secret', g.id); }
    if (a === 'share') { toast('Опубликовано в ленте «Исполняется прямо сейчас»'); addFeed(); }
    if (a === 'del') remove(g);
  });
  function addStep(g, t) { const fi = g.steps.findIndex(s => s.fin); const s = { t, w: 10, done: false, fin: false }; if (fi >= 0) g.steps.splice(fi, 0, s); else g.steps.push(s); emit('step', g.id); }
  sheet.addEventListener('submit', e => {
    e.preventDefault(); const g = list.find(x => x.id === cur); if (!g) return;
    if (e.target.matches('[data-addst]')) { const inp = e.target.querySelector('input'); const t = inp.value.trim(); if (!t) return; addStep(g, t[0].toUpperCase() + t.slice(1)); setTimeout(() => sheet.querySelector('.addst input')?.focus(), 0); return; }
    if (e.target.matches('[data-ef]')) {
      readDraft(); const t = draft.t.trim(); if (!t) { e.target.t.focus(); toast('Сформулируй цель, хотя бы пару слов'); return; }
      Object.assign(g, draft, { t }); draft = null; emit('edit', g.id); toast('Сохранено');
    }
  });
  sheet.addEventListener('input', e => { if (e.target.name === 'cost') { const v = e.target.value.replace(/\D/g, ''); e.target.value = v ? fmtN(+v) : ''; } });
  sheet.addEventListener('change', e => {
    if (!e.target.matches('[data-up]')) return; const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = () => { const g = list.find(x => x.id === cur); if (!g) return; if (draft) { readDraft(); draft.img = r.result; render1(); } else { g.img = r.result; emit('img', g.id); toast('Фото поставлено'); } }; r.readAsDataURL(file);
  });
  ls.push((why, id) => { if (cur && cur === id && !['done', 'remove'].includes(why)) render1(); });

  // ---------- лента участников ----------
  const FEED = [
    { n: 'Марина Ковалёва', c: '#B8572F', w: 'исполнила', g: 'Прыгнуть с парашютом', when: '2 часа назад', ch: 12, done: true },
    { n: 'Анна Литвин', c: '#6B4FA0', w: 'исполнила', g: 'Квартиру у парка без ипотеки', when: 'вчера', ch: 31, done: true, img: 'img/goal-sea.webp' },
    { n: 'Олег Саватеев', c: '#3E7A5A', w: 'разбил на шаги', g: 'Выучить испанский до B2', when: 'сегодня', ch: 2 },
    { n: 'Ирина Белова', c: '#2F6FA8', w: 'прошла 60% пути к цели', g: 'Своя пекарня', when: '2 дня назад', ch: 7 },
    { n: 'Дмитрий Орлов', c: '#8A6A2E', w: 'записал 25 новых целей', g: '', when: '3 дня назад', ch: 4 },
  ].map(f => ({ ...f, mine: false }));
  function renderFeed() { const el = $('#feed'); if (el) el.innerHTML = FEED.map((f, i) => `<div class="fi glass ${f.done ? 'done-ev' : ''}"><span class="av" style="background:${f.c}">${f.n[0]}</span><div><p><b>${esc(f.n)}</b> ${nb(f.w)}${f.g ? ' <q>' + T(f.g) + '</q>' : ''}</p><div class="when">${f.when}</div></div>${f.img ? `<div class="ph"><img src="${f.img}" alt=""></div>` : ''}<button class="cheer ${f.mine ? 'on' : ''}" data-i="${i}" aria-pressed="${f.mine}">${IC.clap}${f.mine ? 'Поддержано' : 'Поддержать'} · ${f.ch}</button></div>`).join(''); }
  function addFeed() { const d = done().slice(-1)[0]; if (!d) return; FEED.unshift({ n: 'Ты', c: '#1E2A6E', w: '· исполнено', g: d.t, when: 'только что', ch: 0, done: true, mine: false }); renderFeed(); }
  document.addEventListener('click', e => { const b = e.target.closest('.cheer'); if (!b) return; const f = FEED[+b.dataset.i]; f.mine = !f.mine; f.ch += f.mine ? 1 : -1; renderFeed(); });

  // ---------- страница ----------
  let view = 'list', selH = null, fH = null, q = '', fS = '', sort = 'new', shelfN = { be: 6, do: 6, have: 6 }, workAll = false, wallAll = false, bTab = 'all', bN = 40, bSeed = 0;
  const curH = () => Math.min(9, Math.floor(live().length / 100));

  function renderTop() {
    const L = live(), open = L.filter(g => g.st !== 'done'), d = done();
    const wish = open.reduce((a, g) => a + inRub(g), 0), got = d.reduce((a, g) => a + inRub(g), 0);
    $('#lead').textContent = nb('Записывай всё, что хочешь. Любую цель можно разбить на шаги или сразу отметить исполненной.');
    $('#big').innerHTML = `${L.length}<em> / 1000</em>`;
    $('#sums').innerHTML = `<div class="sm"><b>${short(wish)}</b><span>${nb('на такую сумму твои желания')}</span></div><div class="sm g"><b>${d.length}</b><span>${nb('исполнено' + (got ? ', на ' + short(got) : ''))}</span></div><div class="sm"><b>${work().length}<em>/${MAXP}</em></b><span>в работе</span></div>`;
  }
  function renderMap() {
    const L = live(), total = L.length, h0 = selH == null ? curH() : selH;
    $('#hs').innerHTML = Array.from({ length: 10 }, (_, h) => {
      let mini = '', cnt = 0, dn = 0;
      for (let k = 0; k < 100; k++) { const g = L[h * 100 + k]; if (g) cnt++; if (g?.st === 'done') dn++; mini += `<i class="${!g ? '' : g.st === 'done' ? 'd' : g.st === 'work' ? 'w' : 'g'}"></i>`; }
      return `<button class="hu ${!cnt ? 'nil' : ''}" data-h="${h}" aria-pressed="${h === h0}" aria-label="Цели ${h * 100 + 1}–${h * 100 + 100}: записано ${cnt}, исполнено ${dn}"><div class="mini">${mini}</div><small>${h * 100 + 1}–${h * 100 + 100}</small></button>`;
    }).join('');
    let cells = '', cnt = 0, dn = 0;
    for (let k = 0; k < 100; k++) {
      const n = h0 * 100 + k + 1, g = L[n - 1];
      if (g) { cnt++; if (g.st === 'done') dn++; }
      if (!g) cells += n === total + 1 ? `<button class="cl next" data-focuscap aria-label="Записать цель №${n}">${n}</button>` : `<span class="cl e"></span>`;
      else cells += `<button class="cl c-${g.cat} ${g.st === 'done' ? 'done' : g.st === 'work' ? 'work' : 'g'} ${g.fresh ? 'fresh' : ''}" data-open="${g.id}" data-tip="${g.id}" aria-label="№${n} ${esc(g.t)}">${g.st === 'done' ? IC.cup : g.focus ? IC.star : ''}</button>`;
    }
    $('#grid').innerHTML = cells;
    $('#hhT').textContent = `Цели ${h0 * 100 + 1}–${h0 * 100 + 100}`;
    $('#hhS').textContent = cnt ? `записано ${cnt}, исполнено ${dn}` : 'пока пусто';
    document.querySelector(".map").classList.toggle("open", selH != null);
    $("#hhF").hidden = !cnt; $('#hhF').textContent = fH === h0 ? 'Показать все цели' : 'Показать эти цели списком';
    tip(null);
  }
  function tip(g) {
    const el = $('#tip');
    if (!g) { el.innerHTML = `<span class="hint">${nb('Наведи на клетку, чтобы увидеть цель. Нажми, чтобы открыть.')}</span>`; return; }
    el.innerHTML = `<span class="no c-${g.cat}">№${num(g)}</span><b>${T(g.t)}</b><em>${g.st === 'done' ? 'исполнено ' + esc(g.doneAt) : g.st === 'work' ? pct(g) + '%' : g.cost ? money(g.cost, g.cur) : ''}</em>`;
  }
  function wcard(g) {
    const p = pct(g), s = nextStep(g);
    return `<article class="wk ${g.focus ? 'f' : ''}" data-open="${g.id}"><div class="wh"><span class="no">№${num(g)}</span>${g.focus ? `<span class="fb">${IC.star}в фокусе дня</span>` : ''}<button class="fs" data-fs="${g.id}" aria-pressed="${g.focus}" aria-label="${g.focus ? 'Убрать из фокуса дня' : 'Поставить в фокус дня'}">${g.focus ? IC.star : IC.staro}</button></div>
      <h4>${T(g.t)}</h4><div class="pb"><i style="width:${p}%"></i></div><div class="pr"><b>${p}%</b><span>${s ? nb(s.fin ? 'Остался финиш: ' + s.t.toLowerCase() : 'Дальше: ' + s.t) : nb('Шагов пока нет')}</span></div>
      ${g.steps.length ? `<button class="btn" data-step="${g.id}">${IC.check}Шаг сделан</button>` : `<button class="btn" data-open="${g.id}">${IC.plus}Добавить шаги</button>`}</article>`;
  }
  function renderWork() {
    const W = work().sort((a, b) => b.focus - a.focus), shown = workAll ? W : W.slice(0, 6);
    $('#work').innerHTML = `<div class="sec-h"><h3>В работе</h3><span class="n">${W.length}/${MAXP}</span><p>${nb('В фокусе дня ' + focusN() + ' из ' + MAXF + ': их шаги приходят в Фокус дня. Звёздочкой ставишь и убираешь.')}</p></div>
      <div class="wl">${shown.map(wcard).join('')}${W.length < MAXP && shown.length === W.length ? `<div class="wk slot"><b>${MAXP - W.length}</b>${nb('мест свободно. Открой любую цель и разбей её на шаги')}</div>` : ''}</div>
      ${W.length > 6 ? `<button class="more" data-wall-w>${workAll ? 'Свернуть' : 'Показать все ' + W.length}</button>` : ''}`;
  }
  const match = g => (!q || g.t.toLowerCase().includes(q)) && (!fS || g.sph === fS) && (fH == null || Math.floor((num(g) - 1) / 100) === fH);
  const sorters = { new: (a, b) => num(b) - num(a), num: (a, b) => num(a) - num(b), cost_desc: (a, b) => inRub(b) - inRub(a), cost_asc: (a, b) => (inRub(a) || 1e15) - (inRub(b) || 1e15) };
  function row(g) {
    const n = num(g), p = g.st === 'work' ? pct(g) : null;
    return `<button class="rw c-${g.cat} ${g.fresh ? 'fresh' : ''} ${g.st === 'work' ? 'w' : ''}" data-open="${g.id}" id="r-${g.id}"><span class="no">${n}</span>
      <span class="tx"><b>${T(g.t)}</b><span class="mt">${g.fresh ? '<span class="nw">Новое желание</span>' : ''}${p != null ? `<span class="pg"><i style="--p:${p}%"></i>${p}%</span>${g.focus ? `<span class="fz">${IC.star}фокус</span>` : ''}` : ''}${g.sph ? `<span>${esc(g.sph)}</span>` : ''}<span>${esc(g.hor)}</span>${g.secret ? `<span class="lk">${IC.lock}</span>` : ''}</span></span>
      <span class="cs">${g.cost ? money(g.cost, g.cur) : ''}</span></button>`;
  }
  function renderShelves() {
    const L = live().filter(g => g.st !== 'done');
    $('#sph').innerHTML = `<button data-s="" aria-pressed="${!fS}">Все сферы</button>` + SPHERES.map(s => `<button data-s="${s}" aria-pressed="${fS === s}">${s}</button>`).join('');
    $('#hchip').innerHTML = fH != null ? `<button class="hc" data-hclear>Цели ${fH * 100 + 1}–${fH * 100 + 100} ${IC.x}</button>` : '';
    let any = 0;
    $('#shelves').innerHTML = Object.entries(CAT).map(([k, c]) => {
      const all = L.filter(g => g.cat === k), it = all.filter(match).sort((a, b) => (b.fresh || 0) - (a.fresh || 0) || sorters[sort](a, b));
      any += it.length; const sum = it.reduce((a, g) => a + inRub(g), 0), shown = it.slice(0, shelfN[k]);
      return `<section class="shelf glass c-${k}" id="sh-${k}"><div class="shh"><span class="dot">${c.l[0]}</span><div><h4>${c.l}</h4><small>${c.h}</small></div><span class="n">${it.length}</span>${sum ? `<span class="sum">${nb('на ' + short(sum))}</span>` : ''}</div>
        <div class="rows">${shown.map(row).join('') || `<div class="empty">${nb(all.length ? 'По этому фильтру целей нет.' : 'Пока пусто. Запиши первую цель «' + c.l + '» в строке сверху.')}</div>`}</div>
        ${it.length > shown.length ? `<button class="more" data-more="${k}">Показать ещё ${Math.min(20, it.length - shown.length)} · осталось ${it.length - shown.length}</button>` : shelfN[k] > 6 && it.length > 6 ? `<button class="more" data-less="${k}">Свернуть</button>` : ''}</section>`;
    }).join('');
  }
  function renderWall() {
    const D = done().slice().reverse(), shown = wallAll ? D : D.slice(0, 6);
    $('#wall').innerHTML = `<div class="wsh"><span class="ic">${IC.cup}</span><div><h4>Стена исполненного</h4><small>${nb('Каждая — золотая клетка на карте')}</small></div><span class="n">${D.length}</span></div>
      ${D.length ? `<div class="tro">${shown.map(g => `<button class="tp" data-open="${g.id}"><span class="d">${IC.cup}№${num(g)} · ${esc(g.doneAt)}</span><b>${T(g.t)}</b></button>`).join('')}</div>${D.length > 6 ? `<button class="more" data-wall-d>${wallAll ? 'Свернуть' : 'Показать все ' + D.length}</button>` : ''}` : `<p class="none">${nb('Первая исполненная цель станет праздником.')}</p>`}`;
  }

  // ---------- карта желаний (картинками) ----------
  function bShuffle(a) { let s = bSeed * 9301 + 49297; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; const x = a.slice(); if (bSeed) for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }
  function boardItems() { const L = live().filter(g => bTab === 'all' ? true : bTab === 'done' ? g.st === 'done' : g.cat === bTab && g.st !== 'done'); return bShuffle(L.slice().sort((a, b) => (!!b.img - !!a.img) || (b.st === 'work') - (a.st === 'work'))); }
  function renderBoard() {
    const L = live(), cnt = { all: L.length, done: done().length, be: 0, do: 0, have: 0 }; L.forEach(g => { if (g.st !== 'done') cnt[g.cat]++; });
    $('#btabs').innerHTML = [['all', 'Все'], ['be', 'Быть'], ['do', 'Делать'], ['have', 'Иметь'], ['done', 'Исполнено']].map(([k, l]) => `<button data-bt="${k}" aria-selected="${k === bTab}">${l}<em>${cnt[k]}</em></button>`).join('');
    const it = boardItems(), shown = it.slice(0, bN);
    $('#board').innerHTML = shown.map((g, i) => `<button class="bt ${g.img ? 'im' : ''} ${g.st === 'done' ? 'dn' : ''} ${g.img && i % 3 === 0 ? 'wd' : ''}" data-open="${g.id}">${coverHTML(g)}<span class="sh"></span><span class="no">№${num(g)}</span>${g.st === 'done' ? `<span class="bd2 d">${IC.cup}исполнено</span>` : g.st === 'work' ? `<span class="bd2 w">${pct(g)}%</span>` : ''}<b>${T(g.t)}</b></button>`).join('') || `<p class="none">Здесь пока пусто.</p>`;
    $('#bmore').innerHTML = it.length > shown.length ? `<button class="more" data-bmore>Показать ещё · осталось ${it.length - shown.length}</button>` : '';
  }

  // ---------- обои ----------
  const wp = document.createElement('div'); wp.className = 'wp'; wp.setAttribute('role', 'dialog'); wp.setAttribute('aria-modal', 'true'); wp.setAttribute('aria-label', 'Обои с желаниями');
  document.body.append(wp);
  let wpFmt = innerWidth < 760 ? 'phone' : 'desk';
  function openWp() {
    wp.innerHTML = `<div class="wbox"><div class="wtop"><h3>Обои с желаниями</h3><button class="x2" data-wx aria-label="Закрыть">${IC.x}</button></div>
      <div class="seg" role="group" aria-label="Формат"><button type="button" data-wf="phone" aria-pressed="${wpFmt === 'phone'}">На телефон</button><button type="button" data-wf="desk" aria-pressed="${wpFmt === 'desk'}">На компьютер</button></div>
      <div class="cvs"><canvas id="wpc"></canvas></div><p class="note">${nb('Первыми идут цели с картинками и те, что в работе. «Перемешать» — другой набор.')}</p>
      <div class="acts"><button class="btn soft" data-wsh>${IC.shuf}Перемешать</button><button class="btn pri" data-wdl>${IC.dl}Скачать картинкой</button></div></div>`;
    wp.classList.add('on'); drawWp();
  }
  function closeWp() { wp.classList.remove('on'); }
  const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const CATC = { be: ['#6E3FB0', '#3B1E6E'], do: ['#E0703A', '#8A3418'], have: ['#1F8C86', '#0D4A47'] };
  function wrapText(c, t, maxW, maxL) { const words = t.split(' '), lines = []; let ln = ''; for (const w of words) { const s = ln ? ln + ' ' + w : w; if (c.measureText(s).width > maxW && ln) { lines.push(ln); ln = w; } else ln = s; } if (ln) lines.push(ln); if (lines.length > maxL) { lines.length = maxL; lines[maxL - 1] = lines[maxL - 1].replace(/\s?\S*$/, '') + '…'; } return lines; }
  async function drawWp() {
    const cv = $('#wpc'); if (!cv) return;
    const ph = wpFmt === 'phone', W = ph ? 1080 : 1920, H = ph ? 1920 : 1080, cols = ph ? 3 : 5, rows = ph ? 5 : 3;
    cv.width = W; cv.height = H; cv.className = ph ? 'ph' : 'dk';
    const c = cv.getContext('2d');
    await Promise.all([document.fonts.load('400 80px Bebas'), document.fonts.load('700 30px "Medeo Sans"')]);
    const items = boardItems().filter(g => bTab === 'all' ? true : true).slice(0, cols * rows);
    const imgs = await Promise.all(items.map(g => g.img ? loadImg(g.img) : null));
    const bg = c.createLinearGradient(0, 0, W * .4, H); bg.addColorStop(0, '#1B2563'); bg.addColorStop(1, '#0A0F2E'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    const glow = c.createRadialGradient(W * .85, H * .05, 0, W * .85, H * .05, W * .7); glow.addColorStop(0, 'rgba(240,208,128,.28)'); glow.addColorStop(1, 'rgba(240,208,128,0)'); c.fillStyle = glow; c.fillRect(0, 0, W, H);
    const pad = ph ? 64 : 72, top = ph ? 300 : 190;
    c.fillStyle = '#F0D080'; c.font = `400 ${ph ? 120 : 110}px Bebas`; c.textBaseline = 'alphabetic'; c.fillText('МОИ 1000 ЦЕЛЕЙ', pad, ph ? 200 : 125);
    c.fillStyle = 'rgba(255,255,255,.72)'; c.font = `600 ${ph ? 34 : 30}px "Medeo Sans"`; c.fillText(`${live().length} желаний · ${done().length} исполнено · 2026`, pad, ph ? 256 : 165);
    const gap = ph ? 22 : 24, cw = (W - pad * 2 - gap * (cols - 1)) / cols, ch = (H - top - pad - gap * (rows - 1)) / rows;
    items.forEach((g, i) => {
      const x = pad + (i % cols) * (cw + gap), y = top + Math.floor(i / cols) * (ch + gap), im = imgs[i];
      c.save(); rr(c, x, y, cw, ch, 26); c.clip();
      if (im) { const s = Math.max(cw / im.width, ch / im.height), iw = im.width * s, ih = im.height * s; c.drawImage(im, x + (cw - iw) / 2, y + (ch - ih) / 2, iw, ih); }
      else { const gr = c.createLinearGradient(x, y, x + cw, y + ch); gr.addColorStop(0, CATC[g.cat][0]); gr.addColorStop(1, CATC[g.cat][1]); c.fillStyle = gr; c.fillRect(x, y, cw, ch); c.fillStyle = 'rgba(255,255,255,.14)'; c.font = `400 ${ch * .9}px Bebas`; c.fillText(g.t.replace(/^[^А-Яа-яЁёA-Za-z0-9]+/, '')[0] || '', x + cw * .52, y + ch * 1.08); }
      const sh = c.createLinearGradient(0, y + ch * .35, 0, y + ch); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.72)'); c.fillStyle = sh; c.fillRect(x, y, cw, ch);
      c.fillStyle = '#fff'; const fs = ph ? 30 : 26; c.font = `700 ${fs}px "Medeo Sans"`;
      const lines = wrapText(c, g.t, cw - 36, 3); lines.forEach((l, k) => c.fillText(l, x + 18, y + ch - 20 - (lines.length - 1 - k) * fs * 1.2));
      c.restore();
      if (g.st === 'done') { c.strokeStyle = '#F0D080'; c.lineWidth = 6; rr(c, x + 3, y + 3, cw - 6, ch - 6, 24); c.stroke(); c.fillStyle = '#F0D080'; rr(c, x + 14, y + 14, ph ? 170 : 150, 40, 20); c.fill(); c.fillStyle = '#1A1406'; c.font = `700 ${ph ? 22 : 20}px "Medeo Sans"`; c.fillText('ИСПОЛНЕНО', x + 30, y + 41); }
    });
    c.fillStyle = 'rgba(255,255,255,.4)'; c.font = `600 ${ph ? 24 : 20}px "Medeo Sans"`; c.fillText('wearefree.club · 1000 целей', pad, H - pad / 2 + 4);
  }
  wp.addEventListener('click', e => {
    if (e.target === wp || e.target.closest('[data-wx]')) closeWp();
    const f = e.target.closest('[data-wf]'); if (f) { wpFmt = f.dataset.wf; wp.querySelectorAll('[data-wf]').forEach(b => b.setAttribute('aria-pressed', String(b === f))); drawWp(); }
    if (e.target.closest('[data-wsh]')) { bSeed++; drawWp(); if (view === 'board') renderBoard(); }
    if (e.target.closest('[data-wdl]')) { $('#wpc').toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `karta-zhelaniy-${wpFmt === 'phone' ? 'telefon' : 'komputer'}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); toast('Картинка скачана. Поставь её на обои'); }); }
  });

  // ---------- сборка ----------
  function render() {
    renderTop();
    document.querySelectorAll('[data-v]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.v === view)));
    $('#vList').hidden = view !== 'list'; $('#vBoard').hidden = view !== 'board';
    if (view === 'list') { renderMap(); renderWork(); renderShelves(); renderWall(); } else renderBoard();
  }
  ls.push((why, id) => {
    if (why === 'add') { view = 'list'; q = ''; fS = ''; fH = null; selH = null; const s = $('#q'); if (s) s.value = ''; }
    render();
    if (why === 'add') { const r = $('#r-' + id); if (r) { const b = r.getBoundingClientRect(); if (b.top < 0 || b.bottom > innerHeight) r.scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' }); } }
  });

  // быстрая запись
  function guess(t) { const s = t.trim().toLowerCase(); if (/^(быть|стать|человеком|тем,|той,|спокойн|уверенн|свободн)/.test(s)) return 'be'; if (/^(иметь|купить|свой |своя |своё |свою |дом|квартир|машин|капитал)/.test(s)) return 'have'; return 'do'; }
  function bindCap() {
    const f = $('#cap'), inp = f.querySelector('input'), btn = f.querySelector('.add'), seg = f.querySelectorAll('.seg button');
    let manual = false, cat = 'do';
    const setCat = c => { cat = c; seg.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === c))); };
    setCat('do');
    inp.addEventListener('input', () => { btn.disabled = !inp.value.trim(); if (!manual && inp.value.trim()) setCat(guess(inp.value)); });
    seg.forEach(b => b.onclick = () => { manual = true; setCat(b.dataset.cat); inp.focus(); });
    f.addEventListener('submit', e => { e.preventDefault(); const t = inp.value.trim(); if (!t) return; const g = add(t[0].toUpperCase() + t.slice(1), cat); inp.value = ''; btn.disabled = true; manual = false; toast(nb('Желание №' + num(g) + ' записано в «' + CAT[cat].l + '». Нажми на него, чтобы добавить стоимость и картинку')); });
  }
  $('#capHost').innerHTML = `<form class="cap glass" id="cap"><input placeholder="Новая цель или желание…" autocomplete="off" aria-label="Новая цель"><div class="seg" role="group" aria-label="Категория">${Object.entries(CAT).map(([k, v]) => `<button type="button" class="c-${k}" data-cat="${k}"><i></i>${v.l}</button>`).join('')}</div><button class="add" disabled>${IC.plus}<span>Записать</span></button></form>`;
  $('#sicon').innerHTML = IC.search;

  document.addEventListener('click', e => {
    if (e.target.closest('.sheet,.wp,.cele')) return;
    const t = e.target;
    const v = t.closest('[data-v]'); if (v) { view = v.dataset.v; render(); return; }
    const h = t.closest('[data-h]'); if (h) { const n = +h.dataset.h; selH = n; fH = fH === n ? null : n; render(); return; }
    if (t.closest('#hhF')) { const h0 = selH == null ? curH() : selH; fH = fH === h0 ? null : h0; renderMap(); renderShelves(); $('#tools').scrollIntoView({ block: 'start', behavior: RM ? 'auto' : 'smooth' }); return; }
    if (t.closest('[data-hclear]')) { fH = null; renderMap(); renderShelves(); return; }
    if (t.closest('[data-focuscap]')) { const i = $('#cap input'); i.focus(); $('#cap').classList.remove('flash'); void $('#cap').offsetWidth; $('#cap').classList.add('flash'); return; }
    const s = t.closest('[data-s]'); if (s) { fS = s.dataset.s; renderShelves(); return; }
    const m = t.closest('[data-more]'); if (m) { shelfN[m.dataset.more] += 20; renderShelves(); return; }
    const l = t.closest('[data-less]'); if (l) { shelfN[l.dataset.less] = 6; renderShelves(); $('#sh-' + l.dataset.less).scrollIntoView({ block: 'start' }); return; }
    if (t.closest('[data-wall-w]')) { workAll = !workAll; renderWork(); return; }
    if (t.closest('[data-wall-d]')) { wallAll = !wallAll; renderWall(); return; }
    const bt = t.closest('[data-bt]'); if (bt) { bTab = bt.dataset.bt; bN = 40; renderBoard(); return; }
    if (t.closest('[data-bmore]')) { bN += 40; renderBoard(); return; }
    if (t.closest('[data-bsh]')) { bSeed++; renderBoard(); return; }
    if (t.closest('[data-wp]')) { openWp(); return; }
    const fs = t.closest('[data-fs]'); if (fs) { setFocus(list.find(g => g.id === fs.dataset.fs)); return; }
    const st = t.closest('[data-step]'); if (st) { stepDone(list.find(g => g.id === st.dataset.step)); return; }
    const o = t.closest('[data-open]'); if (o) openSheet(o.dataset.open);
  });
  const grid = $('#grid');
  grid.addEventListener('pointerover', e => { const c = e.target.closest('[data-tip]'); if (c) tip(list.find(g => g.id === c.dataset.tip)); });
  grid.addEventListener('focusin', e => { const c = e.target.closest('[data-tip]'); if (c) tip(list.find(g => g.id === c.dataset.tip)); });
  grid.addEventListener('pointerleave', () => tip(null));
  $('#q').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); renderShelves(); });
  $('#sort').addEventListener('change', e => { sort = e.target.value; renderShelves(); });

  // демо-панель
  const href = (p, extra = {}) => { const qq = new URLSearchParams(); const n = 'n' in extra ? extra.n : (MANY ? 'many' : ''); const th = 'theme' in extra ? extra.theme : (DARK ? 'dark' : ''); if (n) qq.set('n', n); if (th) qq.set('theme', th); const s = qq.toString(); return 'wishes-' + p + '.html' + (s ? '?' + s : ''); };
  const bar = document.createElement('nav'); bar.className = 'demo'; bar.setAttribute('aria-label', 'Варианты прототипа');
  bar.innerHTML = `<div>${[['a', 'А'], ['b', 'Б'], ['c', 'В'], ['d', 'Г · Полки + Карта'], ['e', 'Д']].map(([p, l]) => `<a href="${href(p)}" class="${p === 'd' ? 'on' : ''}">${l}</a>`).join('')}</div>
    <div><a href="${href('d', { n: '' })}" class="${!MANY ? 'on' : ''}">10 целей</a><a href="${href('d', { n: 'many' })}" class="${MANY ? 'on' : ''}">Сотни</a></div>
    <div><a href="${href('d', { theme: '' })}" class="${!DARK ? 'on' : ''}">Светлая</a><a href="${href('d', { theme: 'dark' })}" class="${DARK ? 'on' : ''}">Тёмная</a></div>`;
  document.body.append(bar);

  bindCap(); renderFeed(); render();
})();
