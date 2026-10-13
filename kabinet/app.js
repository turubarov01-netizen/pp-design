/* Личный кабинет wearefree.club — кликабельный прототип на демо-данных. */
(() => {
"use strict";

/* ---------- иконки ---------- */
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  play: '<path d="M7 4.5v15l12.5-7.5z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  flame: '<path d="M12 22c4.4 0 7-2.9 7-6.6 0-3.7-2.6-5.4-3.9-8.4-.9 1.9-2 2.9-3.6 3.1.1-2.6-.9-5.1-3.1-7.1.2 3.9-4.4 6.1-4.4 11.9C4 19.1 7.6 22 12 22z"/>',
  spark: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  heart: '<path d="M12 20s-7.5-4.6-9.3-9.2A5 5 0 0 1 12 6.9a5 5 0 0 1 9.3 3.9C19.5 15.4 12 20 12 20z"/>',
  file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  send: '<path d="M21 3 10 14M21 3l-6.5 18-4-8-8-4z"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 .5-2.5L8 13l-2.5.5-3-3 8-8z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  tg: '<path d="m21.5 4.5-19 7.3c-.9.4-.9 1.6 0 1.9l4.7 1.6 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.4 4.8 3.6c.6.4 1.4.1 1.5-.6L22.8 5.8c.2-.9-.6-1.6-1.3-1.3zM9 15.2l9-8.1"/>',
};
const ic = (n, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

/* ---------- реестр продуктов: одна таблица, на неё опирается всё ---------- */
const PRODUCTS = {
  ii: { name: "ИИнструменты", kind: "Курс", color: "#f0542a", logo: "img/ii-mark.png",
        about: "Курс: ИИ-инструменты для экспертов, два месяца доступа",
        landing: "https://wearefree.club/iinstrumenti/", live: "https://wearefree.club/campaigns/ii-instrumenty",
        nav: ["Программа", "Уроки", "Задания", "Рейтинг", "Магазин"] },
  pp: { name: "План Продюсера", kind: "Программа", color: "#6d4bd8", logo: "img/context-producer.png",
        about: "Программа на 90 дней с Сашей и Игорем: от точки А к точке Б",
        landing: "https://wearefree.club/plan4", live: "https://wearefree.club/producer-plan",
        nav: ["Главная", "Маршрут", "Встречи", "Домашние задания", "Рюкзак", "Лагерь", "Магазин", "Чат потока"] },
  mesto: { name: "Место притяжения", kind: "Челлендж", color: "#f07a2a", logo: "img/mesto-logo.webp",
        about: "Челлендж про соцсети: знания каждый день и практика",
        landing: "https://wearefree.club/mesto", live: "https://wearefree.club/campaigns",
        nav: ["Сегодня", "Отчёт", "Разборы", "Рейтинг"] },
  fa: { name: "Freeman's Alliance", kind: "Клуб", color: "#c9a227", logo: "img/context-alliance.png",
        about: "Клуб предпринимателей: лента, участники, встречи, трекер и книжный клуб",
        landing: "https://wearefree.club/intro", live: "https://wearefree.club/",
        nav: ["Лента", "Участники", "Трекер", "Дневник роста", "Книжный клуб", "Календарь", "Кланы"] },
  focus: { name: "Фокус", kind: "Мастермайнд", color: "#2f7bff", logo: "img/context-focus.png",
        about: "Мастермайнд для Мечтателей: полгода работы в малой группе",
        landing: "https://wearefree.club/focus-invite", live: "https://wearefree.club/focus-training", nav: [] },
  ts: { name: "Точка Сборки", kind: "Игра", color: "#2e8b6e", letter: "ТС",
        about: "Пятидневная игра: собрать свою точку А и план",
        landing: "https://wearefree.club/tochka-sborki", nav: [] },
  proryv: { name: "Прорыв за 30 дней", kind: "Программа", color: "#1f2a44", letter: "30",
        about: "Тридцатидневная программа Игоря Графа",
        landing: "https://wearefree.club/proryv-30", nav: [] },
};
const CATALOG_ORDER = ["pp", "ii", "mesto", "ts", "proryv", "fa", "focus"];

const SERVICES = [
  { id: "offer", name: "Мой оффер", about: "Соберите оффер за 12 шагов: кому, какой результат, почему вам верят.", url: "https://wearefree.club/my-offer", big: true },
  { id: "niche", name: "Выбор ниши", about: "Подберите нишу под свой опыт и рынок.", url: "https://wearefree.club/vybor-nishi" },
  { id: "kev", name: "Оффер на КЭВ", about: "Оффер для эфира с продажей. Для участников Плана Продюсера.", url: "https://wearefree.club/kev", needs: "pp" },
];

/* ---------- даты: всё считается от сегодняшнего дня ---------- */
const DAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
const DAYS_SHORT = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const today = new Date(); today.setHours(0, 0, 0, 0);
const dAt = (off) => { const d = new Date(today); d.setDate(d.getDate() + off); return d; };
const dm = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
const until = (off) => dm(dAt(off));
const dayTitle = (off) => off === 0 ? "Сегодня" : off === 1 ? "Завтра" : DAYS[dAt(off).getDay()].replace(/^./, c => c.toUpperCase());
const untilStart = (t) => {
  const [h, m] = t.split(":").map(Number); const start = new Date(); start.setHours(h, m, 0, 0);
  const diff = Math.round((start - new Date()) / 60000);
  if (diff <= -90) return "Прошла, запись в Рюкзаке";
  if (diff <= 15) return "Идёт сейчас";
  const hh = Math.floor(diff / 60), mm = diff % 60;
  return "Через " + (hh ? `${hh} ч ` : "") + (mm ? `${mm} мин` : "");
};
const greeting = () => { const h = new Date().getHours(); return h < 5 ? "Доброй ночи" : h < 12 ? "Доброе утро" : h < 18 ? "Добрый день" : "Добрый вечер"; };

/* ---------- демо-люди ---------- */
const PERSONAS = {
  maria: {
    label: "Мария · купила только ИИнструменты",
    name: "Мария", last: "Соколова", initials: "МС", level: "Стартовый доступ", city: "Казань", email: "maria@example.com", phone: "+7 900 000-00-01",
    phoenix: 120, phoenixWeek: 40, streak: 4, heat: "00012120332100".split(""),
    products: [
      { id: "ii", state: "active", until: 54, progress: 0.38, cur: 5, progressLabel: "5 из 13 уроков", next: "Задание к уроку 4 сегодня до 23:59" },
      { id: "fa", state: "trial", trialNote: "Гостевой доступ: лента, участники и одна открытая встреча клуба" },
    ],
    cont: { p: "ii", title: "Урок 5. Тексты для соцсетей с ИИ", meta: "Осталось 12 минут видео и задание", progress: 0.4 },
    feed: [
      { d: 0, t: "10:00", type: "lesson", p: "ii", title: "Открылся урок 5 «Тексты для соцсетей с ИИ»", note: "Новый урок", cta: "Смотреть", done: false },
      { d: 0, t: "23:59", type: "deadline", p: "ii", title: "Сдать задание к уроку 4", note: "Осталось меньше суток", urgent: true, cta: "Сдать" },
      { d: 2, t: "19:00", type: "event", p: "fa", title: "Открытая встреча клуба для гостей", note: "Zoom · по гостевому доступу", cta: "Записаться" },
      { d: 3, t: "10:00", type: "lesson", p: "ii", title: "Откроется урок 6", note: "Напомним в Telegram" },
      { d: 5, t: "23:59", type: "deadline", p: "ii", title: "Задание к уроку 5", note: "Сдать до конца дня" },
    ],
    notifs: [
      { type: "lesson", p: "ii", title: "Открылся урок 5", when: "сегодня, 10:00", unread: true },
      { type: "deadline", p: "ii", title: "До сдачи задания к уроку 4 меньше суток", when: "сегодня, 9:00", unread: true },
      { type: "event", p: "fa", title: "Вас приглашают на открытую встречу клуба", when: "вчера" },
    ],
    path: null,
    badges: { got: ["badge-50pct"], wait: ["badge-100pct", "badge-top3", "badge-5k", "badge-pp"] },
    diplomas: [],
    phHistory: [["Сдано задание к уроку 3", "+20"], ["Сдано задание к уроку 2", "+20"], ["Заполнен профиль", "+50"], ["Первый вход", "+30"]],
    tickets: [
      { id: 1, title: "Не открывается видео урока 3", status: "closed", when: "9 октября", msgs: [
        ["me", "Здравствуйте! Урок 3 не грузится, крутится колесо."],
        ["them", "Здравствуйте, Мария! Обновите страницу и проверьте, что VPN выключен. Если не поможет, пришлите, пожалуйста, скриншот."],
        ["me", "Выключила VPN, всё заработало. Спасибо!"],
        ["them", "Отлично, хорошей учёбы! Закрываю обращение."] ] },
    ],
  },
  olga: {
    label: "Ольга · купила только План Продюсера",
    name: "Ольга", last: "Иванова", initials: "ОИ", level: "Участник Плана Продюсера", city: "Екатеринбург", email: "olga@example.com", phone: "+7 900 000-00-02",
    phoenix: 860, phoenixWeek: 120, streak: 11, lives: 2, heat: "12212312332312".split(""),
    products: [
      { id: "pp", state: "active", until: 40, progress: 0.23, cur: 3, progressLabel: "Неделя 3 из 13", next: "Групповая встреча сегодня в 19:00" },
      { id: "fa", state: "trial", trialNote: "Гостевой доступ: лента, участники и одна открытая встреча клуба" },
    ],
    cont: { p: "pp", title: "Неделя 3. Ключевое задание: собрать оффер", meta: "Урок недели просмотрен, задание не сдано", progress: 0.55 },
    feed: [
      { d: 0, t: "09:00", type: "lesson", p: "pp", title: "Фокус дня отмечен", note: "Выполнено", done: true },
      { d: 0, t: "19:00", type: "meeting", p: "pp", title: "Групповая встреча потока", note: "Zoom · ведут Саша и Игорь", live: true, cta: "Войти" },
      { d: 0, t: "23:59", type: "deadline", p: "pp", title: "Отчёт по фокусу недели", note: "Без отчёта сгорит жизнь", urgent: true, cta: "Сдать" },
      { d: 2, t: "12:00", type: "event", p: "pp", title: "Разбор домашних заданий", note: "Запись появится в Рюкзаке" },
      { d: 4, t: "10:00", type: "lesson", p: "pp", title: "Откроется урок недели 4", note: "Напомним в Telegram" },
      { d: 5, t: "23:59", type: "deadline", p: "pp", title: "Ключевое задание недели 3", note: "Собрать оффер в сервисе «Мой оффер»", cta: "Открыть" },
    ],
    notifs: [
      { type: "meeting", p: "pp", title: "Сегодня в 19:00 групповая встреча", when: "сегодня, 12:00", unread: true },
      { type: "deadline", p: "pp", title: "Отчёт по фокусу недели до 23:59", when: "сегодня, 9:00", unread: true },
      { type: "lesson", p: "pp", title: "Наставник проверил задание недели 2", when: "вчера" },
    ],
    path: { a: ["Точка А", 60000, "сентябрь"], now: ["Сейчас", 95000, "октябрь"], goal: ["Цель потока", 300000, "декабрь"] },
    badges: { got: ["badge-50pct", "badge-pp"], wait: ["badge-100pct", "badge-top3", "badge-5k"] },
    diplomas: [],
    phHistory: [["Сдано задание недели 2", "+100"], ["Фокус дня 7 дней подряд", "+70"], ["Пропущен отчёт недели 1", "−1 жизнь"], ["Сдано задание недели 1", "+100"]],
    tickets: [
      { id: 1, title: "Как перенести встречу в Google Календарь?", status: "open", when: "сегодня", msgs: [
        ["me", "Подскажите, можно ли получать встречи потока себе в Google Календарь?"],
        ["them", "Здравствуйте, Ольга! Да: Профиль → Уведомления → «Календарь». Сейчас пришлю короткую инструкцию с картинками."] ] },
    ],
  },
  andrey: {
    label: "Андрей · купил только Альянс",
    name: "Андрей", last: "Петров", initials: "АП", level: "Бунтарь", city: "Москва", email: "andrey@example.com", phone: "+7 900 000-00-03",
    phoenix: 2450, phoenixWeek: 210, streak: 21, heat: "23323333232333".split(""),
    products: [
      { id: "fa", state: "active", until: 118, progress: null, progressLabel: "Уровень «Бунтарь»", next: "Книжный клуб в среду в 20:00" },
    ],
    cont: { p: "fa", title: "Трекер: отметить привычки за сегодня", meta: "3 из 5 привычек отмечены", progress: 0.6 },
    feed: [
      { d: 0, t: "23:59", type: "lesson", p: "fa", title: "Отметить привычки в трекере", note: "Серия 21 день, не прервите", cta: "Отметить" },
      { d: 1, t: "20:00", type: "meeting", p: "fa", title: "Книжный клуб: обсуждение главы 4", note: "Zoom · 40 участников", cta: "Записаться" },
      { d: 3, t: "19:00", type: "meeting", p: "fa", title: "Встреча клана", note: "Директор клана: Игорь Граф" },
      { d: 5, t: "23:59", type: "deadline", p: "fa", title: "Чекпоинт месяца в ПЭРЛ", note: "Сдать на проверку наставнику", cta: "Открыть" },
    ],
    notifs: [
      { type: "event", p: "fa", title: "Новая публикация в ленте клана", when: "сегодня, 11:20", unread: true },
      { type: "meeting", p: "fa", title: "Завтра книжный клуб в 20:00", when: "вчера" },
    ],
    path: { a: ["Точка А", 150000, "май"], now: ["Сейчас", 410000, "октябрь"], goal: ["Цель года", 1000000, "май"] },
    badges: { got: ["badge-50pct", "badge-100pct", "badge-5k"], wait: ["badge-top3", "badge-pp"] },
    diplomas: [["Точка Сборки", "Сертификат участника, июнь"]],
    phHistory: [["Чекпоинт ПЭРЛ принят", "+300"], ["Привычки 21 день подряд", "+210"], ["Пост в ленте Альянса", "+30"], ["Обмен на мерч", "−500"]],
    tickets: [],
  },
  natalia: {
    label: "Наталья · купила всё сразу",
    name: "Наталья", last: "Кузнецова", initials: "НК", level: "Бунтарь", city: "Санкт-Петербург", email: "natalia@example.com", phone: "+7 900 000-00-04",
    phoenix: 3120, phoenixWeek: 340, streak: 9, lives: 3, heat: "33213321133323".split(""),
    products: [
      { id: "pp", state: "active", until: 62, progress: 0.46, cur: 6, progressLabel: "Неделя 6 из 13", next: "Групповая встреча сегодня в 19:00" },
      { id: "ii", state: "expiring", until: 6, progress: 0.85, cur: 12, progressLabel: "11 из 13 уроков", next: "Доступ закончится через 6 дней" },
      { id: "mesto", state: "active", until: 9, progress: 0.57, cur: 4, progressLabel: "День 4 из 7", next: "Отчёт дня до 23:59" },
      { id: "fa", state: "active", until: 210, progress: null, progressLabel: "Уровень «Бунтарь»", next: "Книжный клуб в среду в 20:00" },
    ],
    cont: { p: "mesto", title: "День 4. Как вести сторис каждый день", meta: "Видео 18 минут и короткий отчёт", progress: 0.2 },
    feed: [
      { d: 0, t: "10:00", type: "lesson", p: "mesto", title: "Открылся день 4 «Сторис каждый день»", note: "Новый урок", cta: "Смотреть" },
      { d: 0, t: "19:00", type: "meeting", p: "pp", title: "Групповая встреча потока", note: "Zoom · ведут Саша и Игорь", live: true, cta: "Войти" },
      { d: 0, t: "23:59", type: "deadline", p: "mesto", title: "Отчёт дня 4", note: "Осталось меньше суток", urgent: true, cta: "Сдать" },
      { d: 1, t: "9:00", type: "access", p: "ii", title: "Через 6 дней закончится доступ к ИИнструментам", note: "Осталось 2 урока", cta: "Продлить" },
      { d: 1, t: "20:00", type: "meeting", p: "fa", title: "Книжный клуб: обсуждение главы 4", note: "Zoom" },
      { d: 2, t: "23:59", type: "deadline", p: "ii", title: "Задание к уроку 11", note: "Сдать до конца дня", cta: "Открыть" },
      { d: 3, t: "12:00", type: "event", p: "pp", title: "Разбор домашних заданий", note: "Запись появится в Рюкзаке" },
      { d: 5, t: "23:59", type: "deadline", p: "pp", title: "Ключевое задание недели 6", note: "Провести 3 разбора", cta: "Открыть" },
    ],
    notifs: [
      { type: "access", p: "ii", title: "Доступ к ИИнструментам закончится через 6 дней", when: "сегодня, 9:00", unread: true },
      { type: "meeting", p: "pp", title: "Сегодня в 19:00 групповая встреча", when: "сегодня, 12:00", unread: true },
      { type: "lesson", p: "mesto", title: "Открылся день 4 «Места притяжения»", when: "сегодня, 10:00", unread: true },
      { type: "event", p: "fa", title: "Вас отметили в посте клана", when: "вчера" },
    ],
    path: { a: ["Точка А", 80000, "июль"], now: ["Сейчас", 240000, "октябрь"], goal: ["Цель потока", 500000, "декабрь"] },
    badges: { got: ["badge-50pct", "badge-100pct", "badge-pp", "badge-5k"], wait: ["badge-top3"] },
    diplomas: [["Точка Сборки", "Сертификат участника, июль"], ["ИИнструменты", "Откроется после последнего урока"]],
    phHistory: [["Отчёт дня 3 «Места притяжения»", "+40"], ["Задание недели 5 Плана Продюсера", "+100"], ["Задание к уроку 10 ИИнструментов", "+20"], ["Чекпоинт ПЭРЛ принят", "+300"]],
    tickets: [
      { id: 1, title: "Счёт для ИП на продление", status: "open", when: "вчера", msgs: [
        ["me", "Добрый день! Нужен счёт на ИП для продления ИИнструментов."],
        ["them", "Здравствуйте, Наталья! Пришлите, пожалуйста, реквизиты ИП, подготовим счёт сегодня."] ] },
      { id: 2, title: "Не пришла ссылка на встречу", status: "closed", when: "2 октября", msgs: [
        ["me", "Не вижу ссылку на встречу ПП."],
        ["them", "Ссылка теперь всегда на главной кабинета в карточке встречи, кнопка «Войти» загорается за 15 минут до начала."] ] },
    ],
  },
};

const FAQ = {
  common: [
    ["Как поменять пароль?", "Профиль → Безопасность → «Сменить пароль». Если забыли старый, выйдите и нажмите «Забыли пароль?» на странице входа."],
    ["Как подключить уведомления в Telegram?", "Профиль → Уведомления → «Подключить Telegram». Бот пришлёт напоминания о встречах, уроках и дедлайнах."],
    ["Где оплата и чеки?", "Мои продукты → карточка продукта → «Оплата и чеки». Там же продление."],
  ],
  ii: [["Сколько длится доступ к ИИнструментам?", "Два месяца с даты оплаты. Дата окончания написана в карточке курса."]],
  pp: [["Что будет, если не сдать отчёт?", "Сгорает одна жизнь. Пока жизни есть, вы в потоке. Сколько их осталось, видно на главной кабинета."]],
  mesto: [["Можно ли догнать пропущенный день?", "Уроки остаются открытыми, отчёт за прошлый день можно сдать позже, но баллов за него будет меньше."]],
  fa: [["Чем гостевой доступ отличается от членства?", "Гость видит ленту и участников и может прийти на одну открытую встречу. Встречи кланов, трекер и книжный клуб открываются с членством."]],
};

/* ---------- состояние ---------- */
const S = {
  get persona() { return localStorage.getItem("cab.persona") || "natalia"; },
  set persona(v) { localStorage.setItem("cab.persona", v); },
  get logged() { return sessionStorage.getItem("cab.logged") === "1"; },
  set logged(v) { sessionStorage.setItem("cab.logged", v ? "1" : "0"); },
  avatar(id) { return localStorage.getItem("cab.av." + id); },
  setAvatar(id, v) { localStorage.setItem("cab.av." + id, v); },
};
let feedTab = "today";
let ticketSel = 0;
let notifOpen = false;
let doneSet = new Set();

const me = () => PERSONAS[S.persona];
const owned = (u) => u.products.map(p => p.id);

/* ---------- вспомогательное ---------- */
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = (n) => n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
const avatarHtml = (u, cls = "avatar") => { const a = S.avatar(S.persona); return `<span class="${cls}">${a ? `<img src="${a}" alt="">` : esc(u.initials)}</span>`; };
const logo = (id, cls = "lg") => { const p = PRODUCTS[id]; return p.logo ? `<span class="${cls}${p.wide ? " wide" : ""}"><img src="${p.logo}" alt=""></span>` : `<span class="${cls}" style="background:${p.color}">${p.letter}</span>`; };
const chip = (id) => `<span class="pchip"><i style="background:${PRODUCTS[id].color}"></i>${esc(PRODUCTS[id].name)}</span>`;
const TYPE_IC = { meeting: "video", deadline: "clock", lesson: "book", access: "lock", event: "cal" };
const STATE_TX = { active: "Активен", expiring: "Заканчивается", trial: "Гостевой доступ", ended: "Закончился" };

/* неразрывные пробелы после коротких слов и перед тире/единицами */
function typo(root) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && /^(SCRIPT|STYLE|TEXTAREA|OPTION)$/.test(n.parentElement.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  const re = /(^|[\s(«])(в|во|и|к|ко|с|со|у|о|об|а|на|по|за|до|из|от|не|ни|же|ли|бы|но|да|что|как|для|при|без|под|над|про|это|ваш|вас|вам|все|всё|его|её|их)\s/gi;
  let n; while ((n = w.nextNode())) {
    let t = n.nodeValue;
    t = t.replace(re, (m, a, b) => a + b + " ").replace(re, (m, a, b) => a + b + " ");
    t = t.replace(/(\d)\s(из|₽|дн|мин|урок|недел|день|дня|дней)/g, "$1 $2").replace(/\s—/g, " —");
    if (t !== n.nodeValue) n.nodeValue = t;
  }
}

/* ---------- оболочка кабинета ---------- */
function navItems(u) {
  const unread = u.notifs.filter(n => n.unread).length;
  const openT = u.tickets.filter(t => t.status === "open").length;
  return [
    ["home", "#/home", "Главная", "home", 0],
    ["products", "#/products", "Мои продукты", "grid", 0],
    ["progress", "#/progress", "Мой рост", "trophy", 0],
    ["support", "#/support", "Поддержка", "chat", openT],
    ["profile", "#/profile", "Профиль", "user", 0],
  ];
}

function shell(active, title, body) {
  const u = me();
  const items = navItems(u);
  const unread = u.notifs.filter(n => n.unread).length;
  return `
  <div class="app">
    <aside class="side" aria-label="Меню кабинета">
      <a class="brand" href="#/home"><img src="img/context-alliance.png" alt=""><span><span class="brand-t">Личный кабинет</span><br><span class="brand-s">wearefree.club</span></span></a>
      ${items.map(([k, h, l, i, c]) => `<a class="nav-item" href="${h}" ${k === active ? 'aria-current="page"' : ""}>${ic(i)}<span>${l}</span>${c ? `<span class="count">${c}</span>` : ""}</a>`).join("")}
      <div class="nav-sep"></div>
      <div class="nav-label">Перейти в продукт</div>
      ${u.products.map(p => `<a class="side-prod" href="#/p/${p.id}"><span class="dot" style="background:${PRODUCTS[p.id].color}"></span>${esc(PRODUCTS[p.id].name)}${p.state === "trial" ? '<span class="small" style="margin-left:auto">гость</span>' : ""}</a>`).join("")}
      <div class="side-foot"><a class="nav-item" href="#/login" data-logout>${ic("logout")}<span>Выйти</span></a></div>
    </aside>
    <div class="main">
      <header class="topbar">
        <h1>${title}</h1>
        <div class="spacer"></div>
        <div class="notif-wrap">
          <button class="icon-btn" id="bell" aria-label="Уведомления" aria-expanded="${notifOpen}">${ic("bell")}${unread ? '<span class="badge"></span>' : ""}</button>
          <div class="notif ${notifOpen ? "open" : ""}" id="notif" role="dialog" aria-label="Уведомления">
            <h4>Уведомления <button id="readall">Прочитать все</button></h4>
            ${u.notifs.map(n => `<a class="nt ${n.unread ? "unread" : ""}" href="#/home"><span class="ic ic-${n.type}">${ic(TYPE_IC[n.type])}</span><span><b>${esc(n.title)}</b><span>${esc(PRODUCTS[n.p].name)} · ${esc(n.when)}</span></span></a>`).join("")}
          </div>
        </div>
        <a class="me-chip" href="#/profile">${avatarHtml(u)}<span><span class="nm">${esc(u.name)} ${esc(u.last)}</span><br><span class="ph"><img src="img/freecoin.png" alt="" width="14" height="14"> ${u.phoenix.toLocaleString("ru-RU")} фениксов</span></span></a>
      </header>
      <main class="content fade-in">${body}</main>
    </div>
    <nav class="mnav" aria-label="Меню кабинета">
      ${items.map(([k, h, l, i, c]) => `<a href="${h}" ${k === active ? 'aria-current="page"' : ""}>${ic(i)}<span>${l === "Мои продукты" ? "Продукты" : l === "Мой рост" ? "Рост" : l}</span>${c ? '<i class="dotc"></i>' : ""}</a>`).join("")}
    </nav>
  </div>`;
}

/* ---------- главная: мой день ---------- */
function feedItem(it, idx) {
  const isDone = it.done || doneSet.has(S.persona + idx);
  const showLive = it.live && it.d === 0;
  const past = showLive && untilStart(it.t).startsWith("Прошла");
  if (past) it = { ...it, cta: "Запись", urgent: false };
  const act = isDone ? `<span class="done-mark" title="Готово">${ic("check")}</span>`
    : it.cta ? `<button class="btn ${it.urgent || (showLive && !past) ? "btn-primary" : "btn-ghost"} btn-sm act" data-done="${idx}">${esc(it.cta)}</button>` : "<span></span>";
  return `<li class="item ${it.urgent && !isDone ? "urgent" : ""} ${isDone ? "done" : ""}">
    <div class="tm">${esc(it.t)}</div>
    <div class="ic ic-${it.type}">${ic(TYPE_IC[it.type])}</div>
    <div class="tx"><b>${esc(it.title)}</b><div class="row">${chip(it.p)}${showLive ? `<span class="live-dot">${untilStart(it.t)}</span>` : ""}<span class="note">${esc(it.note || "")}</span></div></div>
    ${act}
  </li>`;
}

function home() {
  const u = me();
  const now = new Date();
  const c = u.cont;
  const list = u.feed.map((it, i) => ({ ...it, i }));
  const shown = feedTab === "today" ? list.filter(x => x.d === 0) : list;
  const groups = {};
  shown.forEach(x => (groups[x.d] ||= []).push(x));
  const todayCount = list.filter(x => x.d === 0 && !x.done && !doneSet.has(S.persona + x.i)).length;
  const urgentCount = list.filter(x => x.urgent && !doneSet.has(S.persona + x.i)).length;

  const feedHtml = Object.keys(groups).length ? Object.entries(groups).map(([d, arr]) => `
    <div class="day-group"><p class="day-name">${dayTitle(+d)} <span>${dm(dAt(+d))}</span></p>
      <ul class="feed">${arr.map(x => feedItem(x, x.i)).join("")}</ul></div>`).join("")
    : `<div class="feed-empty"><b>На сегодня всё сделано</b>Загляните во вкладку «Неделя», чтобы подготовиться заранее.</div>`;

  const lives = u.lives != null ? `<div class="stat-line"><span class="ic2 wide" style="background:rgba(229,72,77,.1)"><span class="lives">${[0, 1, 2].map(i => `<svg viewBox="0 0 24 24" class="${i < u.lives ? "" : "off"}" stroke="currentColor" stroke-width="1.8">${P.heart}</svg>`).join("")}</span></span><div><div class="v">${u.lives} из 3</div><div class="l">жизни в Плане Продюсера</div></div></div>` : "";

  const body = `
  <div class="greet"><div><p class="date">${DAYS[now.getDay()].replace(/^./, s => s.toUpperCase())}, ${dm(now)}</p><h2 class="h-xl">${greeting()}, ${esc(u.name)}</h2></div>
    <p class="small">${todayCount ? `На сегодня ${todayCount} ${plural(todayCount, "дело", "дела", "дел")}${urgentCount ? `, срочных ${urgentCount}` : ""}` : "На сегодня всё сделано"}</p></div>
  <div class="home" style="margin-top:20px">
    <div class="home-col">
      <section class="continue" aria-label="Продолжить">
        <div>
          <div class="ctx"><span class="eyebrow">Продолжить</span>${chip(c.p)}</div>
          <p class="title">${esc(c.title)}</p>
          <p class="meta">${esc(c.meta)}</p>
          <div class="bar"><div class="progress"><span style="width:${Math.round(c.progress * 100)}%"></span></div></div>
        </div>
        <a class="btn btn-primary" href="#/p/${c.p}">${ic("play")}Продолжить</a>
      </section>
      <section class="panel pad" aria-label="Мой день">
        <div class="sec-head" style="align-items:center">
          <h2 class="h-lg">Мой день</h2>
          <div class="day-tabs" role="tablist">
            <button role="tab" data-tab="today" aria-selected="${feedTab === "today"}">Сегодня</button>
            <button role="tab" data-tab="week" aria-selected="${feedTab === "week"}">Неделя</button>
          </div>
        </div>
        <p class="small" style="margin:-4px 0 14px">Встречи, задания и новые уроки из всех ваших продуктов в одном списке</p>
        ${feedHtml}
      </section>
    </div>
    <div class="home-col aside">
      <section class="panel pad" aria-label="Мои продукты">
        <div class="sec-head"><h2 class="h-md">Мои продукты</h2><a href="#/products">Все</a></div>
        ${u.products.map(p => `<a class="mini-prod" href="#/p/${p.id}">${logo(p.id)}<span><span class="nm">${esc(PRODUCTS[p.id].name)}</span><br><span class="st ${p.state === "expiring" ? "st-warn" : p.state === "trial" ? "st-trial" : ""}">${p.state === "trial" ? "Гостевой доступ" : p.state === "expiring" ? `Осталось ${p.until} ${plural(p.until, "день", "дня", "дней")}` : `До ${until(p.until)}`}</span></span>${ic("chev", "chev")}</a>`).join("")}
      </section>
      <section class="panel pad" aria-label="Мой рост">
        <div class="sec-head"><h2 class="h-md">Мой рост</h2><a href="#/progress">Подробнее</a></div>
        <div class="stat-line"><span class="ic2" style="background:rgba(240,138,40,.12)"><img src="img/freecoin.png" alt=""></span><div><div class="v">${u.phoenix.toLocaleString("ru-RU")}</div><div class="l">фениксов</div></div><span class="tail">+${u.phoenixWeek} за неделю</span></div>
        <div class="stat-line"><span class="ic2" style="background:rgba(229,72,77,.1);color:#e5484d">${ic("flame")}</span><div><div class="v">${u.streak} ${plural(u.streak, "день", "дня", "дней")}</div><div class="l">подряд без пропусков</div></div></div>
        ${lives}
        <div class="heat" aria-label="Активность за 14 дней">${u.heat.map(h => `<i class="l${h}"></i>`).join("")}</div>
        <p class="small" style="margin:6px 0 0">Активность за 14 дней</p>
      </section>
    </div>
  </div>`;
  return shell("home", "Главная", body);
}

/* ---------- мои продукты ---------- */
function prodTabs(active) {
  return `<nav class="tabs" aria-label="Разделы">
    <a href="#/products" ${active === "mine" ? 'aria-current="page"' : ""}>Мои продукты</a>
    <a href="#/products/services" ${active === "svc" ? 'aria-current="page"' : ""}>Сервисы</a>
    <a href="#/products/catalog" ${active === "cat" ? 'aria-current="page"' : ""}>Программы школы</a></nav>`;
}

function products() {
  const u = me();
  const rows = u.products.map(p => {
    const d = PRODUCTS[p.id];
    const st = `<span class="state state-${p.state}">${STATE_TX[p.state]}</span>`;
    const facts = p.state === "trial"
      ? `<span>${ic("spark")}${esc(p.trialNote)}</span>`
      : `<span>${ic("cal")}До ${until(p.until)}</span>${p.next ? `<span>${ic("clock")}${esc(p.next)}</span>` : ""}`;
    const bar = p.progress != null ? `<div class="bar"><div class="progress"><span style="width:${Math.round(p.progress * 100)}%"></span></div><small>${esc(p.progressLabel)}</small></div>` : p.progressLabel ? `<div class="bar small">${esc(p.progressLabel)}</div>` : "";
    const acts = p.state === "trial"
      ? `<a class="btn btn-primary" href="#/p/${p.id}">Посмотреть клуб</a><a class="btn btn-ghost" href="${d.landing}" target="_blank" rel="noopener">Что даёт членство</a>`
      : p.state === "expiring"
      ? `<a class="btn btn-primary" href="#/p/${p.id}">Открыть</a><a class="btn btn-soft" href="${d.landing}" target="_blank" rel="noopener">Продлить</a>`
      : `<a class="btn btn-primary" href="#/p/${p.id}">Открыть</a><button class="btn btn-ghost" type="button">Оплата и чеки</button>`;
    return `<article class="panel prod-row">
      <div class="cover ${d.wide ? "wide" : ""}">${d.logo ? `<img src="${d.logo}" alt="">` : ""}</div>
      <div><div style="display:flex;gap:10px;align-items:center"><span class="kind">${esc(d.kind)}</span>${st}</div><h3>${esc(d.name)}</h3><div class="facts">${facts}</div>${bar}</div>
      <div class="acts">${acts}</div></article>`;
  }).join("");
  const body = `<h2 class="h-xl">Мои продукты</h2><p class="sub">Нажмите «Открыть», чтобы перейти внутрь продукта. Вернуться в кабинет можно кнопкой «В кабинет».</p>
    ${prodTabs("mine")}${rows}`;
  return shell("products", "Мои продукты", body);
}

function services() {
  const u = me();
  const body = `<h2 class="h-xl">Мои продукты</h2><p class="sub">Сервисы школы, которые помогают в работе. Открываются бесплатно.</p>${prodTabs("svc")}
  <div class="svc-grid">${SERVICES.map(s => {
    const ok = !s.needs || owned(u).includes(s.needs);
    const status = s.id === "offer" ? (u.name === "Ольга" ? "Пройдено 7 из 12 шагов" : u.name === "Наталья" || u.name === "Андрей" ? "Оффер собран" : "Не начат") : ok ? "Доступен" : "Откроется с Планом Продюсера";
    return `<a class="panel svc ${s.big ? "big" : ""}" href="${ok ? s.url : PRODUCTS.pp.landing}" target="_blank" rel="noopener">
      <span class="ic2" style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:${ok ? "rgba(47,123,255,.12)" : "rgba(16,24,48,.06)"};color:${ok ? "var(--blue)" : "var(--faint)"}">${ic(ok ? "tool" : "lock")}</span>
      <span class="n">${esc(s.name)}</span><p>${esc(s.about)}</p>
      <span class="st"><span class="num" style="${ok ? "" : "color:var(--faint)"}">${esc(status)}</span>${ic("ext", "chev")}</span></a>`;
  }).join("")}</div>`;
  return shell("products", "Мои продукты", body);
}

function catalog() {
  const u = me();
  const mine = owned(u);
  const items = CATALOG_ORDER.map(id => {
    const d = PRODUCTS[id]; const has = mine.includes(id); const trial = u.products.find(p => p.id === id && p.state === "trial");
    const btn = has && !trial ? `<a class="btn btn-ghost btn-sm" href="#/p/${id}">Уже у вас</a>` : `<a class="btn btn-soft btn-sm" href="${d.landing}" target="_blank" rel="noopener">Подробнее ${ic("ext")}</a>`;
    return `<li class="cat-item">${logo(id)}<div><b>${esc(d.name)}</b><p>${esc(d.about)}</p></div>${btn}</li>`;
  }).join("");
  const body = `<h2 class="h-xl">Мои продукты</h2><p class="sub">Все программы школы. «Подробнее» открывает страницу программы.</p>${prodTabs("cat")}
    <section class="panel pad"><ul class="cat-list">${items}</ul></section>`;
  return shell("products", "Мои продукты", body);
}

/* ---------- мой рост ---------- */
function progress() {
  const u = me();
  const path = u.path ? (() => {
    const { a, now, goal } = u.path;
    const pct = Math.round((now[1] - a[1]) / (goal[1] - a[1]) * 100);
    return `<section class="panel pad"><div class="sec-head"><h2 class="h-lg">Путь к цели</h2><span class="small">Доход в месяц</span></div>
      <div class="path">
        <div class="path-step"><span class="d">${a[0]} · ${a[2]}</span><span class="money">${money(a[1])}</span></div>
        <div class="path-step now"><span class="d">${now[0]} · ${now[2]}</span><span class="money">${money(now[1])}</span><span class="small" style="color:var(--ok);font-weight:650">+${money(now[1] - a[1])} с точки А</span></div>
        <div class="path-step goal" style="padding-bottom:0"><span class="d">${goal[0]} · ${goal[2]}</span><span class="money" style="color:var(--muted)">${money(goal[1])}</span></div>
      </div>
      <div style="margin-top:18px"><div class="progress"><span style="width:${pct}%"></span></div><p class="small" style="margin:6px 0 0">Пройдено ${pct}% пути от точки А до цели</p></div>
      <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" type="button">Обновить доход за месяц</button><a class="btn btn-ghost btn-sm" href="https://wearefree.club/pearl" target="_blank" rel="noopener">Карта ПЭРЛ ${ic("ext")}</a></div></section>`;
  })() : `<section class="panel pad"><h2 class="h-lg">Путь к цели</h2><p class="sub" style="margin-bottom:16px">Запишите, сколько вы зарабатываете сейчас и сколько хотите. Мы будем показывать, как вы двигаетесь от этой точки.</p><button class="btn btn-primary" type="button">${ic("plus")}Заполнить точку А</button></section>`;

  const badges = [...u.badges.got.map(b => [b, true]), ...u.badges.wait.map(b => [b, false])];
  const BN = { "badge-50pct": "Половина пути", "badge-100pct": "Всё сдано", "badge-top3": "Топ-3 потока", "badge-5k": "5 000 фениксов", "badge-pp": "Выпускник ПП" };
  const body = `<h2 class="h-xl">Мой рост</h2><p class="sub">Ваши результаты, фениксы и награды во всех продуктах.</p>
  <div class="ach" style="margin-top:22px">
    <div class="home-col">
      ${path}
      <section class="panel pad"><div class="sec-head"><h2 class="h-lg">Награды</h2><span class="small">${u.badges.got.length} из ${badges.length}</span></div>
        <div class="badges">${badges.map(([b, got]) => `<div class="bdg ${got ? "" : "locked"}"><img src="img/${b}.png" alt="">${BN[b]}</div>`).join("")}</div></section>
      <section class="panel pad"><h2 class="h-lg" style="margin-bottom:8px">Сертификаты и дипломы</h2>
        ${u.diplomas.length ? u.diplomas.map(([t, s]) => { const lk = s.startsWith("Откроется"); return `<div class="dipl"><span class="ic2 ${lk ? "off" : ""}">${ic(lk ? "lock" : "award")}</span><div><b>${esc(t)}</b><div class="small">${esc(s)}</div></div>${lk ? `<span class="locked-note">Ещё не получен</span>` : `<button class="btn btn-ghost btn-sm" style="margin-left:auto" type="button">Скачать</button>`}</div>`; }).join("")
          : `<p class="small" style="margin:0">Сертификат появится здесь, когда вы закончите первую программу.</p>`}</section>
    </div>
    <div class="home-col">
      <section class="panel pad"><div class="stat-line" style="padding-top:0"><span class="ic2" style="background:rgba(240,138,40,.12)"><img src="img/freecoin.png" alt=""></span><div><div class="v">${u.phoenix.toLocaleString("ru-RU")} фениксов</div><div class="l">+${u.phoenixWeek} за неделю</div></div></div>
        <a class="btn btn-ghost btn-sm" style="margin:6px 0 14px;width:100%" href="https://wearefree.club/shop" target="_blank" rel="noopener">Обменять в магазине</a>
        <h3 class="h-md" style="margin-bottom:4px">История</h3>
        <ul class="ph-list">${u.phHistory.map(([t, v]) => `<li><span>${esc(t)}</span><span class="${v.startsWith("+") ? "pl" : "mn"}">${esc(v)}</span></li>`).join("")}</ul></section>
      <section class="panel pad"><h3 class="h-md">Активность</h3><div class="heat">${u.heat.map(h => `<i class="l${h}"></i>`).join("")}</div><p class="small" style="margin:8px 0 0">${u.streak} ${plural(u.streak, "день", "дня", "дней")} подряд. Активный день: урок, задание, отметка в трекере или пост.</p></section>
    </div>
  </div>`;
  return shell("progress", "Мой рост", body);
}

/* ---------- поддержка ---------- */
function support() {
  const u = me();
  const t = u.tickets[ticketSel];
  const faq = [...FAQ.common, ...owned(u).flatMap(id => FAQ[id] || [])];
  const chat = t ? `
    <div class="chat-head"><span class="avatar" style="background:linear-gradient(135deg,#16a36a,#2f7bff)">ЗП</span><div><b>${esc(t.title)}</b><div class="small">Служба заботы · отвечаем в течение часа с 10:00 до 22:00 МСК</div></div></div>
    <div class="msgs">${t.msgs.map(([who, tx]) => `<div class="msg ${who}">${esc(tx)}</div>`).join("")}</div>
    <form class="composer" id="composer"><textarea placeholder="Напишите сообщение" aria-label="Сообщение"></textarea><button class="btn btn-primary" type="submit" aria-label="Отправить">${ic("send")}</button></form>`
    : `<div class="chat-head"><span class="avatar" style="background:linear-gradient(135deg,#16a36a,#2f7bff)">ЗП</span><div><b>Новое обращение</b><div class="small">Служба заботы · отвечаем в течение часа с 10:00 до 22:00 МСК</div></div></div>
    <div class="msgs"><div class="msg them">Здравствуйте, ${esc(u.name)}! Напишите, что случилось. Если вопрос про конкретный урок или встречу, укажите продукт, так ответим быстрее.</div></div>
    <form class="composer" id="composer"><textarea placeholder="Опишите вопрос" aria-label="Сообщение"></textarea><button class="btn btn-primary" type="submit" aria-label="Отправить">${ic("send")}</button></form>`;
  const body = `<h2 class="h-xl">Поддержка</h2><p class="sub">Ваши обращения и ответы в одном месте. Ответ продублируем в Telegram.</p>
  <section class="panel sup" style="margin-top:22px">
    <div class="sup-list" role="tablist">
      <button class="btn btn-primary btn-sm new" id="newT" type="button">${ic("plus")}Новое обращение</button>
      ${u.tickets.map((tk, i) => `<button class="tk" role="tab" data-t="${i}" aria-selected="${i === ticketSel}"><b>${esc(tk.title)}</b><span class="m"><span class="${tk.status === "open" ? "st-open" : "st-closed"}">${tk.status === "open" ? "Ждёт ответа" : "Решено"}</span>${esc(tk.when)}</span></button>`).join("")}
      ${u.tickets.length ? "" : '<p class="small" style="padding:10px">Обращений пока не было.</p>'}
    </div>
    <div class="chat">${chat}</div>
  </section>
  <section class="panel pad faq" style="margin-top:24px"><h2 class="h-lg" style="margin-bottom:6px">Частые вопросы</h2>
    ${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>`;
  return shell("support", "Поддержка", body);
}

/* ---------- профиль ---------- */
function profile() {
  const u = me();
  const body = `<h2 class="h-xl">Профиль</h2><p class="sub">Данные о вас, вход и уведомления.</p>
  <div class="prof" style="margin-top:22px">
    <section class="panel prof-card">
      <div class="big-av">${avatarHtml(u)}<label class="cam" title="Сменить фото">${ic("camera")}<input type="file" accept="image/*" id="avIn" hidden></label></div>
      <h3 class="h-lg">${esc(u.name)} ${esc(u.last)}</h3><p class="small" style="margin:4px 0 0">${esc(u.city)}</p>
      <span class="lvl">${ic("spark")}${esc(u.level)}</span>
      <div style="margin-top:18px;text-align:left">
        <div class="stat-line"><span class="ic2" style="background:rgba(240,138,40,.12)"><img src="img/freecoin.png" alt=""></span><div><div class="v">${u.phoenix.toLocaleString("ru-RU")}</div><div class="l">фениксов</div></div></div>
        <div class="stat-line"><span class="ic2" style="background:rgba(47,123,255,.1);color:var(--blue)">${ic("grid")}</span><div><div class="v">${u.products.filter(p => p.state !== "trial").length}</div><div class="l">${plural(u.products.filter(p => p.state !== "trial").length, "продукт", "продукта", "продуктов")}</div></div></div>
      </div>
    </section>
    <div>
      <form class="panel form-sec" data-form>
        <h3>О себе</h3><p class="small">Это видят наставники и участники клуба.</p>
        <div class="fgrid">
          <div class="field"><label for="f1">Имя</label><input id="f1" value="${esc(u.name)}"></div>
          <div class="field"><label for="f2">Фамилия</label><input id="f2" value="${esc(u.last)}"></div>
          <div class="field"><label for="f3">Город</label><input id="f3" value="${esc(u.city)}"></div>
          <div class="field"><label for="f4">Часовой пояс</label><select id="f4"><option>Москва (UTC+3)</option><option>Екатеринбург (UTC+5)</option><option>Алматы (UTC+5)</option><option>Бали (UTC+8)</option></select><div class="hint">Время встреч показываем по нему</div></div>
          <div class="field full"><label for="f5">Чем вы занимаетесь</label><textarea id="f5" placeholder="Например: психолог, веду консультации и группы"></textarea></div>
        </div>
        <div style="display:flex;align-items:center;gap:14px;margin-top:16px"><button class="btn btn-primary" type="submit">Сохранить</button><span class="saved">${ic("check")}Сохранено</span></div>
      </form>
      <form class="panel form-sec" data-form>
        <h3>Контакты и вход</h3><p class="small">По почте вы входите в кабинет, на неё приходят чеки.</p>
        <div class="fgrid">
          <div class="field"><label for="c1">Почта</label><input id="c1" type="email" value="${esc(u.email)}"></div>
          <div class="field"><label for="c2">Телефон</label><input id="c2" type="tel" value="${esc(u.phone)}"></div>
          <div class="field full"><div class="conn">${ic("check")}<div style="flex:1"><b>Telegram подключён</b><div class="small">@${esc(u.email.split("@")[0])} · через него можно входить без пароля</div></div><button class="btn btn-ghost btn-sm" type="button">Отключить</button></div></div>
        </div>
        <h3 style="margin-top:22px">Сменить пароль</h3>
        <div class="fgrid" style="margin-top:12px">
          <div class="field"><label for="p1">Текущий пароль</label><input id="p1" type="password" autocomplete="current-password"></div>
          <div class="field"><label for="p2">Новый пароль</label><input id="p2" type="password" autocomplete="new-password"><div class="hint">Не короче 8 символов</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:14px;margin-top:16px"><button class="btn btn-primary" type="submit">Сохранить</button><span class="saved">${ic("check")}Сохранено</span></div>
      </form>
      <section class="panel form-sec">
        <h3>Уведомления</h3><p class="small">Что присылать в Telegram и на почту.</p>
        ${[["Встречи", "За день и за 15 минут до начала", true], ["Дедлайны заданий", "За сутки и утром в день сдачи", true], ["Новые уроки", "Когда открывается урок", true], ["Окончание доступа", "За 14 и за 3 дня", true], ["Новости клуба", "Не чаще раза в неделю", false]].map(([t, s, on], i) => `<div class="tg-row"><div class="t"><b>${t}</b><span class="small">${s}</span></div><label class="switch"><input type="checkbox" ${on ? "checked" : ""} aria-label="${t}"><span></span></label></div>`).join("")}
      </section>
    </div>
  </div>`;
  return shell("profile", "Профиль", body);
}

/* ---------- внутри продукта ---------- */
function inside(id) {
  const u = me(); const d = PRODUCTS[id]; const p = u.products.find(x => x.id === id);
  if (!d) return home();
  const nav = d.nav.length ? d.nav : ["Главная"];
  const cur = p && p.cur ? p.cur : 3; const from = Math.max(1, cur - 2);
  const lessons = [0, 1, 2, 3, 4, 5].map(k => from + k).map(n => {
    const cut = cur - 1;
    const st = n <= cut ? "ok" : n === cut + 1 ? "" : "lock";
    return `<li><span class="n ${st}">${st === "ok" ? ic("check") : st === "lock" ? ic("lock") : n}</span><div style="flex:1"><b>${id === "pp" ? `Неделя ${n}` : id === "mesto" ? `День ${n}` : id === "fa" ? ["Лента клуба", "Участники", "Трекер привычек", "Книжный клуб", "Встречи кланов", "Дневник роста"][n - 1] : `Урок ${n}`}</b><div class="small">${st === "ok" ? "Пройдено" : st === "lock" ? (p && p.state === "trial" ? "Откроется с членством" : "Откроется позже") : "Доступно сейчас"}</div></div>${st === "" ? '<button class="btn btn-primary btn-sm" type="button">Открыть</button>' : ""}</li>`;
  }).join("");
  return `
  <div class="inside">
    <aside class="side" aria-label="Меню продукта">
      <a class="back-btn" href="#/home">${ic("arrow")}В кабинет</a>
      <div class="brand" style="padding-bottom:14px">${logo(id, "avatar")}<span><span class="brand-t">${esc(d.name)}</span><br><span class="brand-s">${esc(d.kind)}</span></span></div>
      ${nav.map((n, i) => `<a class="nav-item" href="#/p/${id}" ${i === 0 ? 'aria-current="page"' : ""}>${ic(["home", "book", "cal", "file", "grid", "spark", "tool", "chat"][i % 8])}<span>${esc(n)}</span></a>`).join("")}
    </aside>
    <div class="main">
      <div class="inside-top"><a class="back-btn" href="#/home">${ic("arrow")}В кабинет</a><b style="margin-left:4px">${esc(d.name)}</b></div>
      <main class="content fade-in">
        <div class="inside-note"><b>Здесь откроется текущий кабинет продукта.</b> Слева только навигация этого продукта и кнопка «В кабинет». Меню клуба внутри продукта больше не показывается. Как продукт выглядит сейчас: <a class="link" href="${d.live}" target="_blank" rel="noopener">открыть на wearefree.club</a>.</div>
        <h2 class="h-xl">${esc(d.name)}</h2>
        ${p && p.state === "trial" ? `<p class="sub">Гостевой доступ. Часть разделов открыта, остальные откроются с членством.</p>` : `<p class="sub">${p ? esc(p.progressLabel || "") : ""}</p>`}
        <section class="panel" style="margin-top:20px"><ul class="lesson-list">${lessons}</ul></section>
        ${p && p.state === "trial" ? `<div style="margin-top:18px"><a class="btn btn-primary" href="${d.landing}" target="_blank" rel="noopener">Что даёт членство ${ic("ext")}</a></div>` : ""}
      </main>
    </div>
  </div>`;
}

/* ---------- вход ---------- */
function login() {
  return `
  <div class="login">
    <div class="login-art">
      <div class="prods"><img src="img/context-producer.png" alt=""><img src="img/context-focus.png" alt=""><img src="img/mesto-logo.webp" alt="" style="background:#fff7f0"><img src="img/context-alliance.png" alt=""></div>
      <h2>Всё ваше обучение в одном месте</h2>
      <p>Встречи, задания и уроки из всех программ на одной странице. Ничего не потеряется.</p>
    </div>
    <div class="login-form">
      <form class="login-box" id="loginForm">
        <a class="brand" href="#/login"><img src="img/context-alliance.png" alt=""><span><span class="brand-t">wearefree.club</span><br><span class="brand-s">Школа Саши Турубарова и Игоря Графа</span></span></a>
        <h1>Вход в личный кабинет</h1><p class="sub" style="margin-bottom:22px">Войдите почтой, которую указали при оплате.</p>
        <div class="field"><label for="le">Почта</label><input id="le" type="email" value="${esc(me().email)}" autocomplete="email"></div>
        <div class="field"><label for="lp">Пароль</label><input id="lp" type="password" value="demodemo" autocomplete="current-password"></div>
        <button class="btn btn-primary" type="submit">Войти</button>
        <div class="or">или</div>
        <button class="btn btn-tg" type="submit">${ic("tg")}Войти через Telegram</button>
        <p class="small" style="text-align:center;margin-top:18px"><a class="link" href="#/login">Забыли пароль?</a></p>
      </form>
    </div>
  </div>`;
}

/* ---------- роутер ---------- */
const root = document.getElementById("root");
function render() {
  const h = location.hash.replace(/^#\/?/, "") || (S.logged ? "home" : "login");
  const [a, b] = h.split("/");
  let html;
  if (a === "login") html = login();
  else if (!S.logged && a !== "login") { S.logged = true; html = route(a, b); }
  else html = route(a, b);
  root.innerHTML = html;
  typo(root);
  document.title = (document.querySelector(".topbar h1")?.textContent || "Вход") + " · Личный кабинет";
  bind();
}
function route(a, b) {
  if (a === "products") return b === "services" ? services() : b === "catalog" ? catalog() : products();
  if (a === "progress") return progress();
  if (a === "support") return support();
  if (a === "profile") return profile();
  if (a === "p") return inside(b);
  return home();
}

function bind() {
  root.querySelectorAll("[data-tab]").forEach(el => el.onclick = () => { feedTab = el.dataset.tab; render(); });
  root.querySelectorAll("[data-done]").forEach(el => el.onclick = () => { doneSet.add(S.persona + el.dataset.done); render(); });
  root.querySelectorAll("[data-t]").forEach(el => el.onclick = () => { ticketSel = +el.dataset.t; render(); });
  const nt = document.getElementById("newT"); if (nt) nt.onclick = () => { ticketSel = -1; render(); };
  const bell = document.getElementById("bell");
  if (bell) bell.onclick = (e) => { e.stopPropagation(); notifOpen = !notifOpen; document.getElementById("notif").classList.toggle("open", notifOpen); bell.setAttribute("aria-expanded", notifOpen); };
  const ra = document.getElementById("readall"); if (ra) ra.onclick = (e) => { e.stopPropagation(); me().notifs.forEach(n => n.unread = false); render(); };
  root.querySelectorAll("[data-logout]").forEach(el => el.onclick = () => { S.logged = false; });
  const lf = document.getElementById("loginForm"); if (lf) lf.onsubmit = (e) => { e.preventDefault(); S.logged = true; location.hash = "#/home"; };
  root.querySelectorAll("[data-form]").forEach(f => f.onsubmit = (e) => { e.preventDefault(); const s = f.querySelector(".saved"); s.classList.add("on"); setTimeout(() => s.classList.remove("on"), 1800); });
  const comp = document.getElementById("composer");
  if (comp) comp.onsubmit = (e) => { e.preventDefault(); const ta = comp.querySelector("textarea"); const v = ta.value.trim(); if (!v) return; const u = me();
    if (ticketSel < 0) { u.tickets.unshift({ id: Date.now(), title: v.slice(0, 40), status: "open", when: "сейчас", msgs: [["me", v]] }); ticketSel = 0; }
    else u.tickets[ticketSel].msgs.push(["me", v]);
    render(); };
  const av = document.getElementById("avIn");
  if (av) av.onchange = () => { const f = av.files[0]; if (!f) return; const img = new Image(); const r = new FileReader();
    r.onload = () => { img.onload = () => { const c = document.createElement("canvas"); c.width = c.height = 240; const s = Math.min(img.width, img.height);
      c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 240, 240); S.setAvatar(S.persona, c.toDataURL("image/jpeg", .85)); render(); }; img.src = r.result; }; r.readAsDataURL(f); };
}
document.addEventListener("click", (e) => { if (notifOpen && !e.target.closest(".notif-wrap")) { notifOpen = false; const n = document.getElementById("notif"); if (n) n.classList.remove("open"); } });
addEventListener("hashchange", () => { notifOpen = false; window.scrollTo(0, 0); render(); });

/* ---------- демо-полоса ---------- */
const sel = document.getElementById("persona");
sel.innerHTML = Object.entries(PERSONAS).map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join("");
sel.value = S.persona;
sel.onchange = () => { S.persona = sel.value; ticketSel = 0; feedTab = "today"; render(); };
document.getElementById("toLogin").onclick = () => { S.logged = false; location.hash = "#/login"; };

render();
})();
