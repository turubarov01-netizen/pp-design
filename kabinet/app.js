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
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/>',
  task: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 12l2 2 4-4"/>',
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
/* таймер дедлайна, как карточка срока в «Плане Продюсера» (LessonDeadlineCard) */
const WEEK_MS = 7 * 864e5, HOT_MS = 12 * 36e5;
const WDS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const dlAt = (it) => { const [h, m] = it.t.split(":").map(Number); const d = dAt(it.d); d.setHours(h, m, 59, 0); return d.getTime(); };
const pad2 = (n) => String(n).padStart(2, "0");
const fmtTick = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400); return `${d > 0 ? d + "\u00a0д " : ""}${pad2(Math.floor(s % 86400 / 3600))}:${pad2(Math.floor(s % 3600 / 60))}:${pad2(s % 60)}`; };
const untilTxt = (it) => { const d = dAt(it.d); return `до ${WDS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}, ${it.t}`; };
const RING_C = 2 * Math.PI * 21;
const ringDash = (ms) => `${(Math.max(0, Math.min(1, ms / WEEK_MS)) * RING_C).toFixed(1)} ${RING_C.toFixed(1)}`;
const dlKind = (it) => /ключев/i.test(it.title) ? ["Ключевое задание", "star"] : /отч[её]т/i.test(it.title) ? ["Отчёт", "task"] : ["Срок задания", "task"];
const dlPen = (it) => it.p === "pp" ? "−1 жизнь, если не сдать" : "";
const tickCountdowns = () => document.querySelectorAll("[data-dl]").forEach(el => { const ms = +el.dataset.dl - Date.now(); el.querySelector(".dl-t").textContent = ms > 0 ? fmtTick(ms) : "Срок прошёл"; el.querySelector(".dl-l").hidden = ms <= 0; const r = el.querySelector(".dl-arc"); if (r) r.setAttribute("stroke-dasharray", ringDash(ms)); el.classList.toggle("hot", ms < HOT_MS); });
setInterval(tickCountdowns, 1000);
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

/* ---------- дополнительные данные: то, что уже есть на платформе ---------- */
const SUP_CATS = ["Техническая проблема", "Оплата и подписка", "Обучение и контент", "Аккаунт", "Предложение", "Другое"];
const ST_SUP = { new: ["Новый", "st-new"], open: ["В работе", "st-work"], pending: ["Ожидание", "st-wait"], answered: ["Есть ответ", "st-ans"], resolved: ["Решено", "st-ok"], closed: ["Закрыт", "st-off"] };
const RECEIPT = "📩 Мы получили ваше обращение. Пока ждёте ответа, опишите задачу как можно подробнее и приложите скриншот, так мы разберёмся быстрее.";

PERSONAS.maria.tickets = [
  { num: 1482, title: "Не открывается видео урока 3", cat: "Техническая проблема", p: "ii", status: "resolved", when: "9 октября", rated: 5, msgs: [
    ["system", RECEIPT, "12:04"], ["me", "Здравствуйте! Урок 3 не грузится, крутится колесо.", "12:04", { img: true }],
    ["ai", "Похоже на блокировку видеоплеера. Отключите VPN и обновите страницу. Если не поможет, агент ответит в ближайшее время.", "12:05"],
    ["me", "Выключила VPN, всё заработало. Спасибо!", "12:11"], ["agent", "Отлично, хорошей учёбы!", "12:20"]] },
];
PERSONAS.olga.tickets = [
  { num: 1517, title: "Как получать встречи в Google Календарь?", cat: "Обучение и контент", p: "pp", status: "answered", when: "сегодня", unread: 1, msgs: [
    ["system", RECEIPT, "10:12"], ["me", "Подскажите, можно ли получать встречи потока себе в Google Календарь?", "10:12"],
    ["agent", "Здравствуйте, Ольга! Да: Профиль → Уведомления → «Календарь в телефоне», нажмите «Создать ссылку» и выберите Google.", "10:31"]] },
  { num: 1460, title: "Голосовое из Telegram", cat: "Другое", p: "pp", status: "closed", when: "3 октября", msgs: [
    ["system", RECEIPT, "18:40"], ["me", "", "18:40", { voice: "0:24" }], ["agent", "Перенесли вас в отряд «Восход», ссылка на чат уже в разделе ПП.", "19:02"]] },
];
PERSONAS.andrey.tickets = [];
PERSONAS.natalia.tickets = [
  { num: 1521, title: "Счёт для ИП на продление", cat: "Оплата и подписка", p: "ii", status: "open", when: "вчера", msgs: [
    ["system", RECEIPT, "16:02"], ["me", "Добрый день! Нужен счёт на ИП для продления ИИнструментов.", "16:02"],
    ["agent", "Здравствуйте, Наталья! Пришлите, пожалуйста, реквизиты ИП, подготовим счёт сегодня.", "16:20"]] },
  { num: 1433, title: "Не пришла ссылка на встречу", cat: "Обучение и контент", p: "pp", status: "closed", when: "2 октября", msgs: [
    ["system", RECEIPT, "18:41"], ["me", "Не вижу ссылку на встречу ПП.", "18:41"],
    ["agent", "Ссылка теперь всегда на главной кабинета в карточке встречи, кнопка «Войти» загорается за 15 минут до начала.", "18:50"]] },
];

const EXTRA = {
  maria:   { callsign: null, birth: "14.03.1981", tgUser: "", karma: 40, rank: 812, xp: [120, 500], rep: "Новичок", friends: 3, followers: 5, recs: 0, member: "Стартовый доступ", memberFrom: "покупка ИИнструментов", memberUntil: 54, pointA: null, record: null,
             bases: ["Казань"], biz: [], skills: ["Психология", "Консультирование"], invoices: [],
             pays: [["ИИнструменты, 2 месяца", "9 900 ₽", 6, "Карта •• 4421"]] },
  olga:    { callsign: "Ласточка", birth: "02.11.1979", tgUser: "olga_iv", karma: 180, rank: 241, xp: [860, 1000], rep: "Активист", friends: 12, followers: 18, recs: 2, member: "Стартовый доступ", memberFrom: "покупка Плана Продюсера", memberUntil: 40, pointA: 60000, record: 110000,
             bases: ["Екатеринбург"], biz: [["Психолог-консультант", "Частная практика", "Семейная психология", "с 2016"]], skills: ["Семейная терапия", "Группы", "Вебинары"],
             invoices: [["План Продюсера, VIP-разбор", "14 990 ₽", 5]], pays: [["План Продюсера, 1 месяц", "14 990 ₽", 50, "СБП"]] },
  andrey:  { callsign: "Север", birth: "21.07.1988", tgUser: "andrey_p", karma: 940, rank: 37, xp: [2450, 3000], rep: "Евангелист", friends: 46, followers: 120, recs: 7, member: "Бунтарь", memberFrom: "годовое членство", memberUntil: 118, pointA: 150000, record: 520000,
             bases: ["Москва", "Дубай"], biz: [["Маркетинговое агентство", "ООО «Север»", "Маркетинг для экспертов", "с 2019"]], skills: ["Таргет", "Воронки", "Продажи", "Команда"], invoices: [],
             pays: [["Членство «Бунтарь», год", "100 000 ₽", 247, "Карта •• 0917"]] },
  natalia: { callsign: "Нева", birth: "08.05.1985", tgUser: "natalia_k", karma: 610, rank: 64, xp: [3120, 4000], rep: "Активист", friends: 28, followers: 54, recs: 4, member: "Бунтарь", memberFrom: "годовое членство", memberUntil: 210, pointA: 80000, record: 260000,
             bases: ["Санкт-Петербург", "Тбилиси"], biz: [["Нутрициолог", "ИП Кузнецова", "Питание для женщин 40+", "с 2020"]], skills: ["Нутрициология", "Марафоны", "Сторис"], invoices: [],
             pays: [["План Продюсера, 1 месяц", "14 990 ₽", 28, "Карта •• 1188"], ["Место притяжения", "4 990 ₽", 3, "СБП"], ["ИИнструменты, 2 месяца", "9 900 ₽", 54, "Карта •• 1188"], ["Членство «Бунтарь», год", "100 000 ₽", 155, "Карта •• 1188"]] },
};
const ex = () => EXTRA[S.persona];

/* ---------- состояние ---------- */
const S = {
  get persona() { return localStorage.getItem("cab.persona") || "natalia"; },
  set persona(v) { localStorage.setItem("cab.persona", v); },
  get logged() { return sessionStorage.getItem("cab.logged") === "1"; },
  set logged(v) { sessionStorage.setItem("cab.logged", v ? "1" : "0"); },
  get theme() { return localStorage.getItem("cab.theme") || "dark"; },
  set theme(v) { localStorage.setItem("cab.theme", v); },
  avatar(id) { return localStorage.getItem("cab.av." + id); },
  setAvatar(id, v) { localStorage.setItem("cab.av." + id, v); },
};
let feedTab = "today";
let ticketSel = 0;
let notifOpen = false;
let profTab = "about", growTab = "path", loginMode = "login";
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
const pmark = (id, badge) => { const P_ = PRODUCTS[id]; return `<div class="pmark">${P_.logo ? `<img src="${P_.logo}" alt="">` : `<span class="pm-l" style="background:${P_.color}">${esc(P_.letter || "")}</span>`}${badge ? `<span class="pm-b">${ic(badge)}</span>` : ""}</div>`; };
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
  const unread = u.notifs.filter(n => n.unread).length + actUnread();
  const openT = u.tickets.reduce((s, t) => s + (t.unread || 0), 0);
  return [
    ["home", "#/home", "Главная", "home", 0],
    ["products", "#/products", "Мои продукты", "grid", 0],
    ["services", "#/services", "Сервисы", "tool", 0],
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
            <a class="nt-all" href="#/activity">Отклики: лайки, комментарии, друзья${actUnread() ? ` · ${actUnread()} новых` : ""}</a>
          </div>
        </div>
        <a class="me-chip" href="#/profile">${avatarHtml(u)}<span><span class="nm">${esc(u.name)} ${esc(u.last)}</span><br><span class="ph"><img src="img/freecoin.png" alt="" width="14" height="14"> ${u.phoenix.toLocaleString("ru-RU")} фениксов</span></span></a>
      </header>
      <main class="content fade-in">${body}</main>
    </div>
    <nav class="mnav" aria-label="Меню кабинета">
      ${items.filter(x => x[0] !== "services").map(([k, h, l, i, c]) => `<a href="${h}" ${k === active || (k === "products" && active === "services") ? 'aria-current="page"' : ""}>${ic(i)}<span>${l === "Мои продукты" ? "Продукты" : l === "Мой рост" ? "Рост" : l}</span>${c ? '<i class="dotc"></i>' : ""}</a>`).join("")}
    </nav>
  </div>`;
}

/* ---------- главная: мой день ---------- */
function deadlineItem(it, idx) {
  const at = dlAt(it), ms = at - Date.now(), [kind, kic] = dlKind(it), pen = dlPen(it), hot = ms < HOT_MS;
  const note = pen || /^(Осталось меньше суток|Сдать до конца дня)$/.test(it.note || "") ? "" : it.note;
  return `<li class="item dl brand ${hot ? "hot" : ""}" data-dl="${at}" style="--pc:${PRODUCTS[it.p].color}">
    <div class="tm">${esc(it.t)}</div>
    <div class="dl-ring" aria-hidden="true"><svg viewBox="0 0 48 48"><circle class="trk" cx="24" cy="24" r="21"/><circle class="dl-arc" cx="24" cy="24" r="21" stroke-dasharray="${ringDash(ms)}"/></svg>${ic(kic)}</div>
    <span class="dl-kind">${kind}</span>
    <div class="dl-left" role="timer" aria-label="До срока"><span class="dl-t">${ms > 0 ? fmtTick(ms) : "Срок прошёл"}</span><span class="dl-l">осталось</span></div>
    <div class="tx"><b>${esc(it.title)}</b>
      <div class="row">${chip(it.p)}<span class="note">Сдать ${untilTxt(it)}</span></div>
      ${pen ? `<span class="dl-pen">${ic("heart")}${pen}</span>` : note ? `<span class="note dl-note">${esc(note)}</span>` : ""}</div>
    ${it.cta ? `<button class="btn ${hot ? "btn-primary" : "btn-ghost"} btn-sm act" data-done="${idx}">${esc(it.cta)}</button>` : ""}
  </li>`;
}
function feedItem(it, idx) {
  if (it.type === "deadline" && !(it.done || doneSet.has(S.persona + idx))) return deadlineItem(it, idx);
  const isDone = it.done || doneSet.has(S.persona + idx);
  const showLive = it.live && it.d === 0;
  const past = showLive && untilStart(it.t).startsWith("Прошла");
  if (past) it = { ...it, cta: "Запись", urgent: false };
  const showCd = it.type === "deadline" && !isDone;
  const note = showCd && /^(Осталось меньше суток|Сдать до конца дня)$/.test(it.note || "") ? "" : it.note;
  const act = isDone ? `<span class="done-mark" title="Готово">${ic("check")}</span>`
    : it.cta ? `<button class="btn ${it.urgent || (showLive && !past) ? "btn-primary" : "btn-ghost"} btn-sm act" data-done="${idx}">${esc(it.cta)}</button>` : "<span></span>";
  return `<li class="item brand ${it.urgent && !isDone ? "urgent" : ""} ${isDone ? "done" : ""}" style="--pc:${PRODUCTS[it.p].color}">
    <div class="tm">${esc(it.t)}</div>
    ${pmark(it.p, TYPE_IC[it.type])}
    <div class="tx"><b>${esc(it.title)}</b><div class="row">${chip(it.p)}${showLive ? `<span class="live-dot">${untilStart(it.t)}</span>` : ""}${note ? `<span class="note">${esc(note)}</span>` : ""}</div></div>
    ${act}
  </li>`;
}

function home() {
  const u = me();
  const now = new Date();
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
      ${actPanel()}
      ${setupBlock("home")}
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

/* ---------- настройка профиля (вместо 3 еженедельных напоминаний) ---------- */
// Те же проверки, что в базе: профиль = имя, фамилия, город, телефон, Telegram; активная цель Зверька; непустой список желаний.
const SETUP = {
  maria: { miss: ["Telegram"], zveryok: false, wish: false },
  olga: { miss: [], zveryok: false, wish: true },
  andrey: { miss: [], zveryok: true, wish: true },
  natalia: { miss: [], zveryok: true, wish: true },
};
const setupHidden = new Set();
function setupSteps() {
  const s = SETUP[S.persona]; if (!s) return [];
  return [
    { ok: !s.miss.length, t: "Заполнить профиль", h: s.miss.length ? `Не хватает: ${s.miss.join(", ")}` : "Готово", href: "#/profile" },
    { ok: s.zveryok, t: "Поставить цель Зверька", h: s.zveryok ? "Готово" : "Цель для мотивации на ближайшие недели", href: "https://wearefree.club/zveryok", ext: true },
    { ok: s.wish, t: "Добавить желание в список", h: s.wish ? "Готово" : "То, к чему вы стремитесь", href: "https://wearefree.club/wishlist", ext: true },
  ];
}
function setupBlock(where) {
  const st = setupSteps(); const done = st.filter(x => x.ok).length;
  if (!st.length || done === st.length || (where === "home" && setupHidden.has(S.persona))) return "";
  const body = `<div class="setup-top"><span class="small">${done} из ${st.length}</span><div class="progress"><span style="width:${Math.round(done / st.length * 100)}%"></span></div></div>
    <ul class="setup">${st.map(x => x.ok
      ? `<li class="ok"><span class="sc">${ic("check")}</span><span><b>${x.t}</b></span></li>`
      : `<li><a href="${x.href}" ${x.ext ? 'target="_blank" rel="noopener"' : ""}><span class="sc"></span><span><b>${x.t}</b><span class="small">${esc(x.h)}</span></span>${ic(x.ext ? "ext" : "chev", "chev")}</a></li>`).join("")}</ul>`;
  return where === "home"
    ? `<section class="panel pad" aria-label="Настройка профиля"><div class="sec-head"><h2 class="h-md">Закончите настройку <span class="is-new">новое</span></h2><button class="link-btn" data-setup-hide>Скрыть</button></div>${body}</section>`
    : `<div class="setup-card"><p class="setup-h">Закончите настройку <span class="is-new">новое</span></p>${body}</div>`;
}

/* ---------- отклики (бывшая страница /activity) ---------- */
// k: like | comment | reply | friend | diary. d — сколько дней назад.
const ACT = {
  maria: [
    { k: "comment", who: ["Светлана М."], obj: "Ваш ответ к уроку 3", p: "ii", text: "Сохранила ваш промпт для постов, спасибо! А вы его потом правите руками?", d: 0, t: "09:40", unread: true },
    { k: "like", who: ["Ирина С.", "Олег Р.", "Елена В."], more: 2, obj: "Ваш ответ к уроку 3", p: "ii", d: 0, t: "08:15", unread: true },
    { k: "friend", who: ["Елена В."], obj: "Тоже проходит ИИнструменты", p: "fa", d: 1, t: "21:02" },
    { k: "like", who: ["Дмитрий П."], obj: "Ваш инсайт к уроку 2", p: "ii", d: 3, t: "14:30" },
  ],
  olga: [
    { k: "reply", who: ["Ирина С."], obj: "Пост «Как я нашла первых клиентов»", p: "fa", text: "Да, через разборы в сторис. Напишите мне, расскажу подробнее", d: 0, t: "11:05", unread: true },
    { k: "like", who: ["Марина Л.", "Дмитрий П.", "Артём Н.", "Елена В."], more: 5, obj: "Ваш инсайт к неделе 3", p: "pp", d: 0, t: "10:20", unread: true },
    { k: "diary", who: ["Марина Л."], obj: "Просит доступ к вашему дневнику успеха", p: "fa", d: 1, t: "18:44", unread: true },
    { k: "like", who: ["Олег Р.", "Светлана М."], obj: "Ваша цель «Поездка в Грузию»", p: "fa", d: 2, t: "12:10" },
    { k: "comment", who: ["Артём Н."], obj: "Ваш ответ к ключевому заданию недели 2", p: "pp", text: "Сильный оффер. Я бы ещё добавил срок результата", d: 4, t: "16:00" },
  ],
  andrey: [
    { k: "like", who: ["Ирина С.", "Олег Р.", "Марина Л.", "Елена В."], more: 8, obj: "Ваш пост «Три ошибки в первом запуске»", p: "fa", d: 0, t: "12:30", unread: true },
    { k: "comment", who: ["Дмитрий П."], obj: "Ваш пост «Три ошибки в первом запуске»", p: "fa", text: "Про вторую ошибку прямо в точку. Сам так потерял месяц", d: 0, t: "12:02", unread: true },
    { k: "friend", who: ["Артём Н."], obj: "Из вашего клана", p: "fa", d: 1, t: "20:15", unread: true },
    { k: "friend", who: ["Светлана М."], obj: "Была с вами на книжном клубе", p: "fa", d: 2, t: "09:00" },
    { k: "like", who: ["Елена В."], obj: "Ваша рецензия на книгу «Атомные привычки»", p: "fa", d: 5, t: "19:20" },
  ],
  natalia: [
    { k: "comment", who: ["Ирина С."], obj: "Ваш отчёт дня 3 в «Месте притяжения»", p: "mesto", text: "Классная идея со сторис-опросом, заберу себе", d: 0, t: "10:50", unread: true },
    { k: "like", who: ["Марина Л.", "Олег Р.", "Дмитрий П."], more: 3, obj: "Ваш инсайт к неделе 6", p: "pp", d: 0, t: "09:30", unread: true },
    { k: "friend", who: ["Елена В."], obj: "Тоже в Плане Продюсера", p: "fa", d: 0, t: "08:05", unread: true },
    { k: "like", who: ["Артём Н.", "Светлана М."], obj: "Ваш ответ к уроку 11", p: "ii", d: 1, t: "17:40" },
    { k: "reply", who: ["Олег Р."], obj: "Пост в ленте клана", p: "fa", text: "Спасибо! Пришлю шаблон в личку", d: 2, t: "13:15" },
    { k: "like", who: ["Ирина С."], obj: "Ваша цель «Студия в центре»", p: "fa", d: 6, t: "11:00" },
  ],
};
let actTab = "all", actReply = -1;
const ACT_KIND = { like: ["heart", "Лайки"], comment: ["chat", "Комментарии"], reply: ["chat", "Комментарии"], friend: ["user", "Друзья"], diary: ["lock", "Друзья"] };
const AV_COL = ["#2f7bff", "#7b61ff", "#f08a28", "#16a37a", "#e5484d", "#0aa2c0", "#c2410c"];
const initials = (n) => n[0].toUpperCase();
const avCol = (n) => AV_COL[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % AV_COL.length];
const avStack = (names, more = 0, max = 3) => `<span class="av-stack">${names.slice(0, max).map(n => `<i style="background:${avCol(n)}" title="${esc(n)}">${esc(initials(n))}</i>`).join("")}${more + Math.max(0, names.length - max) ? `<i class="more">+${more + Math.max(0, names.length - max)}</i>` : ""}</span>`;
const actList = () => ACT[S.persona] || [];
const actUnread = () => actList().filter(a => a.unread).length;
const actWho = (a) => { const n = a.who.length + (a.more || 0); return a.k === "like" ? (n === 1 ? a.who[0] : `${a.who.slice(0, 2).join(", ")}${n > 2 ? ` и ещё ${n - 2}` : ""}`) : a.who[0]; };
const actHead = (a) => a.k === "like" ? a.obj : a.k === "comment" ? "Новый комментарий" : a.k === "reply" ? "Ответ на ваш комментарий" : a.k === "friend" ? "Заявка в друзья" : "Запрос доступа к дневнику успеха";
const actSub = (a) => a.k === "like" ? `${a.who.length + (a.more || 0)} ${plural(a.who.length + (a.more || 0), "лайк", "лайка", "лайков")} · ${actWho(a)}` : a.k === "reply" || a.k === "comment" ? `${a.who[0]} · ${a.obj}` : `${a.who[0]} · ${a.obj}`;
const actWhen = (a) => `${a.d === 0 ? "сегодня" : a.d === 1 ? "вчера" : dm(dAt(-a.d))}, ${a.t}`;

function actRow(a, i, compact) {
  const [icn] = ACT_KIND[a.k];
  let act = "";
  if (!compact) {
    if (a.done) act = `<p class="act-done">${ic("check")}${esc(a.done)}</p>`;
    else if (a.k === "comment" || a.k === "reply") act = actReply === i
      ? `<form class="act-reply" data-areply="${i}"><input type="text" placeholder="Ваш ответ" aria-label="Ваш ответ" autofocus><button class="btn btn-primary btn-sm">Отправить</button><button type="button" class="btn btn-ghost btn-sm" data-acancel>Отмена</button></form>`
      : `<div class="act-btns"><button class="btn btn-ghost btn-sm" data-aopen="${i}">${ic("chat")}Ответить</button><span class="is-new">новое</span></div>`;
    else if (a.k === "friend") act = `<div class="act-btns"><button class="btn btn-primary btn-sm" data-ado="${i}" data-msg="Теперь вы друзья">Принять</button><button class="btn btn-ghost btn-sm" data-ado="${i}" data-msg="Заявка отклонена">Отклонить</button><span class="is-new">новое</span></div>`;
    else if (a.k === "diary") act = `<div class="act-btns"><button class="btn btn-primary btn-sm" data-ado="${i}" data-msg="Доступ к дневнику открыт">Открыть доступ</button><button class="btn btn-ghost btn-sm" data-ado="${i}" data-msg="Вы отказали в доступе">Отказать</button><span class="is-new">новое</span></div>`;
  }
  return `<li class="act ${a.unread ? "unread" : ""} ${compact ? "compact" : ""}">
    <span class="act-ic act-${a.k}">${ic(icn)}</span>
    <div class="act-tx">
      <b>${esc(actHead(a))}</b>
      <div class="act-meta">${a.k === "like" && !compact ? avStack(a.who, a.more) : ""}<span>${esc(actSub(a))}</span></div>
      ${a.text ? `<p class="act-quote"><span>${esc(a.text)}</span></p>` : ""}
      ${act}
    </div>
    <div class="act-side">${compact ? "" : chip(a.p)}<span class="small">${esc(actWhen(a))}</span></div>
  </li>`;
}

function actPanel() {
  const L = actList(); if (!L.length) return "";
  const week = L.filter(a => a.d <= 7);
  const likes = week.filter(a => a.k === "like").reduce((s, a) => s + a.who.length + (a.more || 0), 0);
  const coms = week.filter(a => a.k === "comment" || a.k === "reply").length;
  const fr = week.filter(a => a.k === "friend" || a.k === "diary").length;
  const people = [...new Set(week.flatMap(a => a.who))];
  const un = actUnread();
  return `<section class="panel pad" aria-label="Отклики">
    <div class="sec-head"><h2 class="h-md">Отклики${un ? ` <span class="count-pill">${un}</span>` : ""}</h2><a href="#/activity">Все</a></div>
    <div class="act-sum">${avStack(people, 0, 3)}<div><div class="v">${likes} ${plural(likes, "лайк", "лайка", "лайков")}${coms ? `, ${coms} ${plural(coms, "комментарий", "комментария", "комментариев")}` : ""}</div><div class="l">за неделю${fr ? ` · ${fr} ${plural(fr, "заявка ждёт", "заявки ждут", "заявок ждут")} ответа` : ""}</div></div></div>
    <ul class="acts">${L.slice(0, 2).map((a, i) => actRow(a, i, true)).join("")}</ul>
  </section>`;
}

function activity() {
  const L = actList().map((a, i) => ({ ...a, i }));
  const groups = { all: L, com: L.filter(a => a.k === "comment" || a.k === "reply"), like: L.filter(a => a.k === "like"), fr: L.filter(a => a.k === "friend" || a.k === "diary") };
  const shown = groups[actTab] || L;
  const byDay = {}; shown.forEach(a => (byDay[a.d === 0 ? "Сегодня" : a.d === 1 ? "Вчера" : "Раньше"] ||= []).push(a));
  const tab = (k, l) => `<button role="tab" data-atab="${k}" aria-selected="${actTab === k}">${l}${groups[k].length ? ` <span class="n">${groups[k].length}</span>` : ""}</button>`;
  const body = `
  <a class="back-btn act-back" href="#/home">${ic("arrow")}На главную</a>
  <div class="page-head"><div><h2 class="h-xl">Отклики</h2><p class="sub">Лайки, комментарии и заявки на ваши посты, ответы и цели во всех продуктах.</p></div>
    ${actUnread() ? `<button class="btn btn-ghost btn-sm" id="actRead">Прочитать все</button>` : ""}</div>
  <section class="panel pad" style="margin-top:20px">
    <div class="day-tabs act-tabs" role="tablist">${tab("all", "Все")}${tab("com", "Комментарии")}${tab("like", "Лайки")}${tab("fr", "Друзья")}</div>
    ${shown.length ? Object.entries(byDay).map(([d, arr]) => `<p class="day-name" style="margin-top:18px">${d}</p><ul class="acts">${arr.map(a => actRow(a, a.i)).join("")}</ul>`).join("")
      : `<div class="feed-empty"><b>Пока пусто</b>Здесь появятся отклики на ваши посты, ответы в уроках и цели.</div>`}
  </section>`;
  return shell("home", "Отклики", body);
}

/* ---------- мои продукты ---------- */
function prodTabs(active) {
  return `<nav class="tabs" aria-label="Разделы">
    <a href="#/products" ${active === "mine" ? 'aria-current="page"' : ""}>Мои продукты</a>
    <a class="m-only" href="#/services" ${active === "svc" ? 'aria-current="page"' : ""}>Сервисы</a>
    <a href="#/products/pay" ${active === "pay" ? 'aria-current="page"' : ""}>Покупки и оплаты</a>
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
      : `<a class="btn btn-primary" href="#/p/${p.id}">Открыть</a><a class="btn btn-ghost" href="#/products/pay">Оплата и чеки</a>`;
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
  const body = `<h2 class="h-xl">Сервисы</h2><p class="sub">Сервисы школы, которые помогают в работе. Открываются бесплатно.</p><div class="m-only">${prodTabs("svc")}</div><div class="d-gap"></div>
  <div class="svc-grid">${SERVICES.map(s => {
    const ok = !s.needs || owned(u).includes(s.needs);
    const status = s.id === "offer" ? (u.name === "Ольга" ? "Пройдено 7 из 12 шагов" : u.name === "Наталья" || u.name === "Андрей" ? "Оффер собран" : "Не начат") : ok ? "Доступен" : "Откроется с Планом Продюсера";
    return `<a class="panel svc ${s.big ? "big" : ""}" href="${ok ? s.url : PRODUCTS.pp.landing}" target="_blank" rel="noopener">
      <span class="ic2" style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:${ok ? "rgba(47,123,255,.12)" : "rgba(16,24,48,.06)"};color:${ok ? "var(--blue)" : "var(--faint)"}">${ic(ok ? "tool" : "lock")}</span>
      <span class="n">${esc(s.name)}</span><p>${esc(s.about)}</p>
      <span class="st"><span class="num" style="${ok ? "" : "color:var(--faint)"}">${esc(status)}</span>${ic("ext", "chev")}</span></a>`;
  }).join("")}</div>`;
  return shell("services", "Сервисы", body);
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

function purchases() {
  const u = me(); const e = ex();
  const act = u.products.filter(p => p.state !== "trial");
  const body = `<h2 class="h-xl">Мои продукты</h2><p class="sub">Доступы, членство, счета и оплаты.</p>${prodTabs("pay")}
  ${e.invoices.length ? e.invoices.map(([t, s, d]) => `<section class="panel pad invoice"><div><span class="eyebrow">Вам выставлен счёт</span><b>${esc(t)}</b><span class="small">${esc(s)} · оплатить до ${until(d)}</span></div><button class="btn btn-primary" type="button">Оплатить счёт</button></section>`).join("") : ""}
  <section class="panel pad" style="margin-bottom:18px"><div class="sec-head"><h2 class="h-md">Членство в клубе</h2><a href="https://wearefree.club/upgrade" target="_blank" rel="noopener">Уровни</a></div>
    <div class="tg-row acc" style="border:0;padding-top:0"><div class="t"><b>${esc(e.member)}</b><span class="small">Откуда: ${esc(e.memberFrom)} · до ${until(e.memberUntil)} · осталось ${e.memberUntil} ${plural(e.memberUntil, "день", "дня", "дней")}</span></div><a class="btn btn-soft btn-sm" href="https://wearefree.club/upgrade" target="_blank" rel="noopener">Продлить</a></div></section>
  <section class="panel pad" style="margin-bottom:18px"><h2 class="h-md" style="margin-bottom:8px">Активные доступы</h2>
    ${act.map(p => `<div class="tg-row acc"><div class="t"><b>${esc(PRODUCTS[p.id].name)}</b><span class="small">${esc(PRODUCTS[p.id].kind)} · доступ до ${until(p.until)}</span></div><span class="${p.until <= 14 ? "st-warn" : "small"}" style="font-size:13px">осталось ${p.until} ${plural(p.until, "день", "дня", "дней")}</span></div>`).join("")}</section>
  <section class="panel pad"><div class="sec-head"><h2 class="h-md">История оплат</h2><span class="is-new">новое</span></div>
    <ul class="ph-list">${e.pays.map(([t, s, d, how]) => `<li><span><b style="font-weight:600">${esc(t)}</b><br><span class="small">${dm(dAt(-d))} · ${esc(how)}</span></span><span style="display:flex;gap:10px;align-items:center"><b style="font-variant-numeric:tabular-nums">${esc(s)}</b><button class="btn btn-ghost btn-sm" type="button">Чек</button></span></li>`).join("")}</ul></section>`;
  return shell("products", "Мои продукты", body);
}

/* ---------- мой рост ---------- */
function progress() {
  const u = me(); const e = ex();
  const tab = growTab;
  const tabs = [["path", "Путь"], ["phoenix", "Фениксы"], ["rep", "Репутация"], ["awards", "Награды"]];
  let pane = "";
  if (tab === "path") {
    const p = u.path;
    pane = p ? (() => {
      const { a, now, goal } = p; const pct = Math.round((now[1] - a[1]) / (goal[1] - a[1]) * 100); const growth = Math.round((now[1] / a[1] - 1) * 100);
      return `<section class="panel pad"><div class="sec-head"><h2 class="h-lg">Путь к цели</h2><span class="small">Доход в месяц</span></div>
        <div class="grow3"><div><span class="small">Точка А · ${a[2]}</span><b>${money(a[1])}</b><span class="tagx">зафиксировано</span></div><div><span class="small">Сейчас, среднее за 3 месяца</span><b>${money(now[1])}</b><span class="tagx ok">+${growth}%</span></div><div><span class="small">Рекордный месяц</span><b>${money(e.record)}</b></div></div>
        <div style="margin-top:18px"><div class="progress"><span style="width:${pct}%"></span></div><p class="small" style="margin:6px 0 0">${pct}% пути от точки А до цели ${money(goal[1])} (${goal[0].toLowerCase()}, ${goal[2]})</p></div>
        <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" type="button">Внести доход за месяц</button><button class="btn btn-ghost btn-sm" type="button">Запросить исправление точки А</button><button class="btn btn-ghost btn-sm" type="button">История точки А</button></div>
        <div class="tg-row" style="margin-top:16px"><div class="t"><b>Показывать суммы дохода в клубе</b><span class="small">Если выключить, другие увидят только процент роста</span></div><label class="switch"><input type="checkbox" checked aria-label="Показывать суммы"><span></span></label></div></section>
        <section class="panel pad" style="margin-top:20px"><div class="sec-head"><h2 class="h-lg">П.Э.Р.Л.</h2><a href="https://wearefree.club/pearl" target="_blank" rel="noopener">Открыть карту</a></div>
          <p class="small" style="margin:0 0 10px">Путь уровня «${esc(e.member)}» · уровень ${e.member === "Бунтарь" ? 3 : 2} из 8</p>
          <div class="grow3"><div><span class="small">Обязательные</span><b>${e.member === "Бунтарь" ? "7 из 9" : "2 из 9"}</b></div><div><span class="small">Задания</span><b>${e.member === "Бунтарь" ? "12" : "3"}</b></div><div><span class="small">Получено фениксов</span><b>${e.member === "Бунтарь" ? "1 400" : "150"}</b></div></div></section>`;
    })() : `<section class="panel pad"><h2 class="h-lg">Путь к цели</h2><p class="sub" style="margin-bottom:16px">Запишите, сколько вы зарабатываете сейчас. Это ваша точка А: от неё будем показывать рост. Фиксируется один раз.</p><button class="btn btn-primary" type="button">${ic("plus")}Указать точку А</button></section>`;
  }
  if (tab === "phoenix") pane = `
    <section class="panel pad"><div class="ph-top"><img src="img/freecoin.png" alt="" width="44" height="44"><div><div class="v" style="font-size:24px;font-weight:800">${u.phoenix.toLocaleString("ru-RU")} фениксов</div><span class="small">≈ ${u.phoenix.toLocaleString("ru-RU")} ₽ · +${u.phoenixWeek} за неделю</span></div></div>
      <div class="ph-acts"><button class="btn btn-primary btn-sm" type="button">Пополнить</button><button class="btn btn-ghost btn-sm" type="button">Перевести участнику</button><a class="btn btn-ghost btn-sm" href="https://wearefree.club/shop" target="_blank" rel="noopener">Магазин ${ic("ext")}</a></div>
      <div class="ph-note"><span>Скоро начислим: кэшбэк 10% за покупку, через 7 дней</span><b>+${Math.round(u.phoenixWeek / 2)}</b></div>
      <div class="ph-note warn"><span>1-го числа спишется 1% баланса. Чтобы не терять, тратьте или переводите фениксы</span><b>−${Math.round(u.phoenix / 100)}</b></div></section>
    <section class="panel pad" style="margin-top:20px"><h2 class="h-md" style="margin-bottom:6px">История</h2>
      <ul class="ph-list">${u.phHistory.map(([t, v]) => `<li><span>${esc(t)}</span><span class="${v.startsWith("+") ? "pl" : "mn"}">${esc(v)}</span></li>`).join("")}</ul></section>`;
  if (tab === "rep") pane = `
    <section class="panel pad"><div class="grow3">
      <div><span class="small">Карма</span><b>${e.karma}</b><span class="tagx">ранг #${e.rank}</span></div>
      <div><span class="small">Опыт</span><b>${e.xp[0].toLocaleString("ru-RU")} XP</b><div class="progress" style="margin-top:8px"><span style="width:${Math.round(e.xp[0] / e.xp[1] * 100)}%"></span></div></div>
      <div><span class="small">Репутация</span><b>${esc(e.rep)}</b><span class="tagx">Новичок → Архонт</span></div></div>
      <div class="grow3" style="margin-top:14px"><div><span class="small">Друзья</span><b>${e.friends}</b></div><div><span class="small">Подписчики</span><b>${e.followers}</b></div><div><span class="small">Рекомендации</span><b>+${e.recs}</b></div></div>
      <a class="btn btn-ghost btn-sm" style="margin-top:16px" href="https://wearefree.club/members?tab=rating" target="_blank" rel="noopener">Рейтинг участников ${ic("ext")}</a></section>`;
  if (tab === "awards") {
    const badges = [...u.badges.got.map(b => [b, true]), ...u.badges.wait.map(b => [b, false])];
    const BN = { "badge-50pct": "Половина пути", "badge-100pct": "Всё сдано", "badge-top3": "Топ-3 потока", "badge-5k": "5 000 фениксов", "badge-pp": "Выпускник ПП" };
    pane = `<section class="panel pad"><div class="sec-head"><h2 class="h-lg">Значки</h2><span class="small">${u.badges.got.length} из ${badges.length}</span></div>
        <div class="badges">${badges.map(([b, got]) => `<div class="bdg ${got ? "" : "locked"}"><img src="img/${b}.png" alt="">${BN[b]}</div>`).join("")}</div></section>
      <section class="panel pad" style="margin-top:20px"><h2 class="h-lg" style="margin-bottom:8px">Программы</h2>
        ${u.products.filter(p => p.state !== "trial").map(p => `<div class="tg-row"><div class="t"><b>${esc(PRODUCTS[p.id].name)}</b><span class="small">${esc(p.progressLabel || "")}</span></div><span class="state state-active">В процессе</span></div>`).join("")}
        ${u.diplomas.filter(d => !d[1].startsWith("Откроется")).map(d => `<div class="tg-row"><div class="t"><b>${esc(d[0])}</b><span class="small">${esc(d[1])}</span></div><span class="state state-ended">Завершил</span></div>`).join("")}</section>
      <section class="panel pad" style="margin-top:20px"><div class="sec-head"><h2 class="h-lg">Сертификаты и дипломы</h2><span class="is-new">новое</span></div>
        ${u.diplomas.length ? u.diplomas.map(([t, s]) => { const lk = s.startsWith("Откроется"); return `<div class="dipl"><span class="ic2 ${lk ? "off" : ""}">${ic(lk ? "lock" : "award")}</span><div><b>${esc(t)}</b><div class="small">${esc(s)}</div></div>${lk ? `<span class="locked-note">Ещё не получен</span>` : `<button class="btn btn-ghost btn-sm" style="margin-left:auto" type="button">Скачать</button>`}</div>`; }).join("")
          : `<p class="small" style="margin:0">Сертификат появится здесь, когда вы закончите первую программу.</p>`}</section>`;
  }
  const body = `<h2 class="h-xl">Мой рост</h2><p class="sub">Результаты, фениксы, репутация и награды во всех продуктах.</p>
    <nav class="tabs" aria-label="Разделы">${tabs.map(([k, l]) => `<a href="#/progress/${k}" ${k === tab ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>${pane}`;
  return shell("progress", "Мой рост", body);
}

/* ---------- поддержка ---------- */
function support() {
  const u = me();
  const t = ticketSel >= 0 ? u.tickets[ticketSel] : null;
  const faq = [...FAQ.common, ...owned(u).flatMap(id => FAQ[id] || [])];
  const head = (title, sub) => `<div class="chat-head">${ticketSel >= 0 || true ? `<button class="icon-btn sup-back" data-back aria-label="К списку">${ic("arrow")}</button>` : ""}<span class="avatar" style="background:linear-gradient(135deg,#16a36a,#2f7bff)">ЗП</span><div style="min-width:0;flex:1"><b>${title}</b><div class="small">${sub}</div></div></div>`;
  const msg = ([who, tx, tm, att]) => who === "system"
    ? `<div class="msg-sys">${esc(tx)}</div>`
    : `<div class="msg ${who === "me" ? "me" : "them"} ${who === "ai" ? "ai" : ""}">${who === "ai" ? '<span class="who">🤖 Автоответ по базе знаний</span>' : who === "agent" ? '<span class="who">Служба заботы</span>' : ""}${att && att.img ? `<span class="att-img" title="Скриншот">${ic("camera")}<span>скриншот.jpg</span></span>` : ""}${att && att.voice ? `<span class="voice">${ic("play")}<i></i><span>${att.voice}</span></span>` : ""}${tx ? esc(tx) : ""}<small>${tm}</small></div>`;
  let chat;
  if (t) {
    const [stl, stc] = ST_SUP[t.status];
    const closed = t.status === "closed";
    chat = `${head(`${esc(t.title)}`, `#${t.num} · <span class="${stc}">${stl}</span> · ${esc(t.cat)} · ${esc(PRODUCTS[t.p].name)}`)}
      <div class="msgs">${t.msgs.map(msg).join("")}
        ${t.status === "resolved" || t.status === "answered" ? `<div class="rate"><span>Ответ помог?</span>${[1, 2, 3, 4, 5].map(n => `<button class="${t.rated >= n ? "on" : ""}" data-rate="${n}" aria-label="Оценка ${n}">★</button>`).join("")}<span class="is-new">новое</span></div>` : ""}
      </div>
      ${closed ? `<div class="composer closed"><span class="small">Обращение закрыто.</span><button class="btn btn-ghost btn-sm" data-reopen type="button">Открыть снова</button><span class="is-new">новое</span></div>`
        : `<form class="composer" id="composer">
            <label class="icon-btn" title="Прикрепить скриншот">${ic("camera")}<input type="file" accept="image/*" hidden id="att"></label>
            <textarea placeholder="Написать сообщение" aria-label="Сообщение"></textarea>
            <button class="btn btn-primary" type="submit" aria-label="Отправить">${ic("send")}</button></form>
          <div class="composer-foot"><span class="kbd-hint">Enter — отправить, Shift+Enter — новая строка</span><button class="link-btn" data-close type="button">Закрыть обращение</button><span class="is-new">новое</span></div>`}`;
  } else {
    chat = `${head("Новое обращение", "Отвечаем в течение часа с 10:00 до 22:00 МСК")}
      <form class="new-ticket" id="newForm">
        <div class="fgrid">
          <div class="field"><label for="nt-cat">Категория</label><select id="nt-cat">${SUP_CATS.map(c => `<option>${c}</option>`).join("")}</select></div>
          <div class="field"><label for="nt-p">Продукт <span class="is-new">новое</span></label><select id="nt-p"><option value="">Не про конкретный продукт</option>${u.products.map(p => `<option value="${p.id}">${esc(PRODUCTS[p.id].name)}</option>`).join("")}</select></div>
          <div class="field full"><label for="nt-text">Что случилось</label><textarea id="nt-text" placeholder="Опишите вашу проблему. Если про урок или встречу, напишите какой"></textarea></div>
        </div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:14px;flex-wrap:wrap">
          <label class="btn btn-ghost btn-sm" style="cursor:pointer">${ic("camera")}Скриншот<input type="file" accept="image/*" hidden></label>
          <button class="btn btn-primary" type="submit">Отправить</button>
        </div>
      </form>`;
  }
  const list = u.tickets.map((tk, i) => { const [stl, stc] = ST_SUP[tk.status]; return `<button class="tk" role="tab" data-t="${i}" aria-selected="${i === ticketSel}"><b>${esc(tk.title)}</b><span class="m">#${tk.num} · <span class="${stc}">${stl}</span> · ${esc(tk.when)}${tk.unread ? `<i class="tk-unread">${tk.unread}</i>` : ""}</span></button>`; }).join("");
  const body = `<h2 class="h-xl">Поддержка</h2><p class="sub">Ваши обращения с историей. Ответ продублируем в Telegram и на почту.</p>
  <div class="sup-ways">
    <button class="btn btn-primary" id="newT" type="button">${ic("plus")}Новое обращение</button>
    <a class="btn btn-ghost" href="https://t.me/freemen_alliance_bot?start=support" target="_blank" rel="noopener">${ic("tg")}Написать в Telegram</a>
    <span class="small">Отвечаем в течение часа с 10:00 до 22:00 МСК</span>
  </div>
  <section class="panel sup ${t || ticketSel < 0 ? "has-chat" : ""}" style="margin-top:18px">
    <div class="sup-list" role="tablist">
      <p class="eyebrow" style="padding:6px 12px 4px">Мои обращения</p>
      ${list || '<p class="small" style="padding:10px 12px">Обращений пока не было. Если что-то не получается, напишите, разберёмся.</p>'}
    </div>
    <div class="chat">${chat}</div>
  </section>
  <section class="panel pad faq" style="margin-top:24px"><div class="sec-head"><h2 class="h-lg">Частые вопросы</h2><span class="is-new">новое</span></div>
    ${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>`;
  return shell("support", "Поддержка", body);
}

/* ---------- профиль ---------- */
function profile() {
  const u = me(); const e = ex();
  const tab = profTab;
  const tabs = [["about", "О себе"], ["loc", "Локация и бизнес"], ["notify", "Уведомления"], ["security", "Вход и безопасность"], ["view", "Внешний вид"], ["account", "Аккаунт"]];
  const sw = (on, label) => `<label class="switch"><input type="checkbox" ${on ? "checked" : ""} aria-label="${esc(label)}"><span></span></label>`;
  const saveRow = `<div style="display:flex;align-items:center;gap:14px;margin-top:18px"><button class="btn btn-primary" type="submit">Сохранить</button><span class="saved">${ic("check")}Сохранено</span></div>`;
  let pane = "";
  if (tab === "about") pane = `
    <form class="panel form-sec" data-form><h3>О себе</h3><p class="small">Это видят наставники и участники клуба.</p>
      <div class="fgrid">
        <div class="field"><label for="f1">Имя</label><input id="f1" value="${esc(u.name)}"></div>
        <div class="field"><label for="f2">Фамилия</label><input id="f2" value="${esc(u.last)}"></div>
        <div class="field"><label>Позывной</label><input value="${e.callsign ? esc(e.callsign) : ""}" placeholder="Позывной назначит наставник" disabled></div>
        <div class="field"><label>Дата рождения</label><input value="${esc(e.birth)}" disabled><div class="hint">Указывается один раз. Изменить можно через поддержку</div></div>
        <div class="field"><label for="f6">Телефон</label><input id="f6" type="tel" value="${esc(u.phone)}"></div>
        <div class="field"><label for="f7">Telegram</label><input id="f7" value="${e.tgUser ? "@" + esc(e.tgUser) : ""}" placeholder="@username"></div>
        <div class="field full"><label for="f5">О себе</label><textarea id="f5" maxlength="2000" placeholder="Чем вы занимаетесь, с кем работаете">${e.biz[0] ? esc(e.biz[0][0] + ". " + e.biz[0][2] + ".") : ""}</textarea><div class="hint">До 2000 символов</div></div>
      </div>${saveRow}</form>
    <section class="panel form-sec"><h3>Навыки</h3><p class="small">До 30 навыков. Участники клуба могут их подтверждать.</p>
      <div class="chips">${e.skills.map(s => `<span class="chip">${esc(s)}</span>`).join("")}<button class="chip add" type="button">${ic("plus")}Добавить</button></div></section>`;
  if (tab === "loc") pane = `
    <form class="panel form-sec" data-form><h3>Где вы сейчас</h3><p class="small">По городу показываем участников рядом и время встреч.</p>
      <div class="fgrid"><div class="field"><label for="l1">Город</label><input id="l1" value="${esc(u.city)}"></div>
        <div class="field" style="align-self:end"><button class="btn btn-ghost" type="button">${ic("spark")}Определить по геолокации</button></div></div>
      <h3 style="margin-top:22px">Базы Фримена</h3><p class="small">Города, где вы бываете. До 4.</p>
      <div class="chips">${e.bases.map(b => `<span class="chip">${esc(b)}</span>`).join("")}<button class="chip add" type="button">${ic("plus")}Добавить базу</button></div>${saveRow}</form>
    <section class="panel form-sec"><h3>Бизнесы</h3><p class="small">Чем вы занимаетесь. Видно в вашем профиле в клубе.</p>
      ${e.biz.length ? e.biz.map(b => `<div class="tg-row"><div class="t"><b>${esc(b[0])}</b><span class="small">${esc(b[1])} · ${esc(b[2])} · ${esc(b[3])}</span></div><button class="btn btn-ghost btn-sm" type="button">Изменить</button></div>`).join("") : '<p class="small" style="margin:0 0 12px">Пока не добавлено.</p>'}
      <button class="btn btn-soft btn-sm" type="button" style="margin-top:8px">${ic("plus")}Добавить бизнес</button></section>`;
  if (tab === "notify") {
    const cats = [["Встречи и эфиры", "За день и за 15 минут до начала", 1, 1, 1], ["Дедлайны заданий", "За сутки и утром в день сдачи", 1, 1, 1], ["Новые уроки", "Когда открывается урок", 1, 0, 1], ["Окончание доступа", "За 14 и за 3 дня", 1, 1, 1], ["Ответы поддержки", "Когда ответили на обращение", 1, 1, 0],
      ["Лента и комментарии", "Посты, лайки, комментарии", 0, 0, 0], ["Сообщения и друзья", "Личные сообщения, заявки в друзья", 1, 0, 0], ["Трекер", "Напоминания, план и отчёт дня, серия", 1, 0, 0], ["Дайджесты", "Еженедельный, книжный клуб", 0, 1, 0], ["Оракул", "Ежедневная подсказка", 0, 0, 0]];
    pane = `
    <section class="panel form-sec"><h3>Куда присылать</h3><p class="small">Telegram, почта и уведомления в браузере.</p>
      <div class="conn">${ic("check")}<div style="flex:1"><b>Telegram-бот подключён</b><div class="small">@freemen_alliance_bot · <button class="link-btn" type="button">Отправить тестовое</button></div></div><button class="btn btn-ghost btn-sm" type="button">Отключить</button></div>
      <div class="tg-row" style="margin-top:8px"><div class="t"><b>Push в браузере</b><span class="small">Уведомления на этом устройстве</span></div>${sw(false, "Push")}</div></section>
    <section class="panel form-sec"><h3>Что присылать</h3><p class="small">Первые пять пунктов новые: про учёбу во всех продуктах. Остальные уже есть на платформе.</p>
      <div class="ngrid"><span></span><span class="small">Telegram</span><span class="small">Почта</span>
      ${cats.map(([t, s, tg, em, isNew]) => `<div class="t"><b>${t}${isNew ? ' <span class="is-new">новое</span>' : ""}</b><span class="small">${s}</span></div>${sw(tg, t + " Telegram")}${sw(em, t + " почта")}`).join("")}</div></section>
    <section class="panel form-sec"><h3>Календарь в телефоне</h3><p class="small">Встречи всех ваших продуктов сами появятся в календаре.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" type="button">Apple</button><button class="btn btn-ghost btn-sm" type="button">Google</button><button class="btn btn-ghost btn-sm" type="button">Яндекс</button></div></section>`;
  }
  if (tab === "security") pane = `
    <section class="panel form-sec"><h3>Почта для входа</h3><p class="small">На неё приходят чеки и восстановление пароля.</p>
      <div class="conn">${ic("check")}<div style="flex:1"><b>${esc(u.email)}</b><div class="small">Подтверждена</div></div></div>
      <div class="field" style="margin-top:14px"><label for="ce">Контактная почта, если отличается</label><input id="ce" type="email" placeholder="Для писем от наставника"></div></section>
    <section class="panel form-sec"><h3>Способы входа</h3><p class="small">Привяжите несколько, чтобы не потерять доступ.</p>
      ${[["Почта и пароль", 1], ["Telegram", 1], ["Apple", 0], ["Google", 0]].map(([n, on]) => `<div class="tg-row"><div class="t"><b>${n}</b><span class="small">${on ? "Привязан" : "Не привязан"}</span></div>${on ? `<button class="btn btn-ghost btn-sm" type="button">Отвязать</button>` : `<button class="btn btn-soft btn-sm" type="button">Привязать</button>`}</div>`).join("")}
      <p class="small" style="margin:10px 0 0">Apple и Google недоступны пользователям из России.</p></section>
    <form class="panel form-sec" data-form><h3>Сменить пароль</h3><p class="small">Не короче 8 символов: заглавная и строчная буквы, цифра и знак.</p>
      <div class="fgrid"><div class="field"><label for="p1">Текущий пароль</label><input id="p1" type="password" autocomplete="current-password"></div>
        <div class="field"><label for="p2">Новый пароль</label><input id="p2" type="password" autocomplete="new-password"></div></div>${saveRow}</form>
    <section class="panel form-sec"><h3>Устройства</h3><p class="small">Где вы сейчас вошли. <span class="is-new">новое</span></p>
      <div class="tg-row"><div class="t"><b>Этот браузер</b><span class="small">${esc(u.city)} · сейчас</span></div></div>
      <div class="tg-row"><div class="t"><b>iPhone · Telegram</b><span class="small">${esc(u.city)} · вчера</span></div><button class="btn btn-ghost btn-sm" type="button">Выйти</button></div></section>`;
  if (tab === "view") pane = `
    <form class="panel form-sec" data-form><h3>Внешний вид</h3><p class="small">Тема и язык платформы.</p>
      <div class="fgrid">
        <div class="field"><label>Тема</label><select><option>Светлая</option><option>Тёмная</option><option>Как в системе</option></select></div>
        <div class="field"><label>Язык</label><select><option>Русский</option><option>English</option></select></div>
        <div class="field"><label>Часовой пояс</label><select><option>Москва (UTC+3)</option><option>Екатеринбург (UTC+5)</option><option>Алматы (UTC+5)</option><option>Тбилиси (UTC+4)</option><option>Бали (UTC+8)</option></select><div class="hint">Время встреч показываем по нему</div></div>
        <div class="field"><label>Валюта</label><select><option>Рубли, ₽</option><option>Доллары, $</option><option>Тенге, ₸</option><option>Евро, €</option></select><div class="hint">В ней показываем суммы и доход</div></div>
      </div>${saveRow}</form>`;
  if (tab === "account") pane = `
    <section class="panel form-sec"><h3>Пауза</h3><p class="small">Если нужен перерыв: заморозим аккаунт до выбранной даты, решение принимает наставник.</p><button class="btn btn-ghost" type="button">Запросить заморозку</button></section>
    <section class="panel form-sec"><h3>Выход из сообщества</h3><p class="small">Заявку рассмотрит администрация. Покупки и сертификаты останутся у вас.</p><button class="btn btn-ghost" type="button" style="color:var(--bad)">Подать заявку на выход</button></section>`;
  const body = `<h2 class="h-xl">Профиль</h2><p class="sub">Данные о вас, вход, уведомления и настройки в одном месте.</p>
  <div class="prof" style="margin-top:22px">
    <section class="panel prof-card">
      <div class="big-av">${avatarHtml(u)}<label class="cam" title="Сменить фото">${ic("camera")}<input type="file" accept="image/*" id="avIn" hidden></label></div>
      <h3 class="h-lg">${esc(u.name)} ${esc(u.last)}</h3><p class="small" style="margin:4px 0 0">${e.callsign ? `Позывной «${esc(e.callsign)}» · ` : ""}${esc(u.city)}</p>
      <span class="lvl">${ic("spark")}${esc(e.member)}</span>
      <div style="margin-top:16px;text-align:left">
        <div class="stat-line"><span class="ic2" style="background:rgba(240,138,40,.12)"><img src="img/freecoin.png" alt=""></span><div><div class="v">${u.phoenix.toLocaleString("ru-RU")}</div><div class="l">фениксов</div></div></div>
        <div class="stat-line"><span class="ic2" style="background:rgba(47,123,255,.1);color:var(--blue)">${ic("user")}</span><div><div class="v">${e.friends} · ${e.followers}</div><div class="l">друзей · подписчиков</div></div></div>
      </div>
      <a class="btn btn-ghost btn-sm" style="width:100%;margin-top:12px" href="https://wearefree.club/members" target="_blank" rel="noopener">Как меня видят в клубе ${ic("ext")}</a>
      ${setupBlock("profile")}
    </section>
    <div>
      <nav class="tabs" style="margin-top:0" aria-label="Разделы профиля">${tabs.map(([k, l]) => `<a href="#/profile/${k}" ${k === tab ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
      ${pane}
    </div>
  </div>`;
  return shell("profile", "Профиль", body);
}

/* ---------- внутри продукта ---------- */
function inside(id) {
  const u = me(); const d = PRODUCTS[id]; const p = u.products.find(x => x.id === id);
  if (!d) return home();
  const nav = d.nav.length ? d.nav : ["Главная"];
  const cur = p && p.cur ? p.cur : 3; const total = { ii: 13, pp: 13, mesto: 7 }[id] || 6; const from = Math.max(1, Math.min(cur - 2, total - 5));
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
        <div class="inside-note"><b>Здесь откроется текущий кабинет продукта.</b> В меню только навигация этого продукта и кнопка «В кабинет». Меню клуба внутри продукта больше не показывается. Как продукт выглядит сейчас: <a class="link" href="${d.live}" target="_blank" rel="noopener">открыть на wearefree.club</a>.</div>
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
  const dark = S.theme === "dark";
  const mode = loginMode;
  const card = mode === "reset" ? `
      <form class="au-form" id="resetForm">
        <p class="au-muted" style="text-align:center;margin:0 0 6px">Укажите email, на который вы регистрировались. Мы пришлём ссылку для восстановления пароля.</p>
        <input class="au-in" type="email" placeholder="Email" value="${esc(me().email)}">
        <button class="au-btn" type="submit">Прислать ссылку для сброса</button>
        <button class="au-link center" type="button" data-mode="login">Я вспомнил пароль! Вернуться</button>
      </form>` : mode === "register" ? `
      <form class="au-form" id="regForm">
        <div class="au-row"><input class="au-in" placeholder="Имя"><input class="au-in" placeholder="Фамилия"></div>
        <input class="au-in" type="email" placeholder="Email">
        <input class="au-in" type="password" placeholder="Пароль">
        <input class="au-in" placeholder="Код пригласившего (если есть)">
        <label class="au-check"><input type="checkbox" checked> Согласен на обработку персональных данных</label>
        <button class="au-btn" type="submit">Создать аккаунт</button>
        <button class="au-link center" type="button" data-mode="login">Уже есть аккаунт? Войти</button>
      </form>` : `
      <form class="au-form" id="loginForm">
        <input class="au-in" type="text" placeholder="Email или @telegram" value="${esc(me().email)}" autocomplete="username">
        <div class="au-pw"><input class="au-in" type="password" placeholder="Пароль" value="demodemo" autocomplete="current-password" id="au-pw"><button type="button" class="au-eye" aria-label="Показать пароль" id="au-eye"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></div>
        <button class="au-link" type="button" data-mode="reset">Забыли пароль?</button>
        <button class="au-btn" type="submit">Войти</button>
        <p class="au-muted center small2">Войти с помощью</p>
        <div class="au-soc">
          <button type="submit" aria-label="Войти через Telegram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></button>
          <button type="submit" aria-label="Войти через Apple"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg></button>
          <button type="submit" aria-label="Войти через Google"><svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg></button>
        </div>
        <div class="au-sep"><i></i><span>нет аккаунта?</span><i></i></div>
        <button class="au-out" type="button" data-mode="register">Создать аккаунт бесплатно</button>
        <p class="au-muted center small2">Дневник · Колесо баланса · ПЭРЛ-инструменты</p>
      </form>`;
  const title = mode === "reset" ? "ПАРОЛЬ" : mode === "register" ? "СТАРТ" : "ВХОД";
  return `
  <main class="au ${dark ? "au-dark" : "au-light"}">
    <video class="au-video" autoplay muted loop playsinline src="video/${dark ? "auth-background-dark.mp4" : "auth-background.mp4"}"></video>
    <canvas class="au-canvas" id="auCanvas"></canvas>
    <div class="au-glow g1"></div><div class="au-glow g2"></div><div class="au-veil"></div>
    <button class="au-theme" id="auTheme" type="button" aria-label="Сменить тему">${dark ? "☀︎ Светлая" : "☾ Тёмная"}</button>
    <img class="au-logo" src="img/${dark ? "logo-yellow.svg" : "logo-blue.svg"}" alt="Freeman's Alliance" width="80" height="80">
    <p class="au-brand">Freeman's Alliance</p>
    <div class="au-wrap"><h1 class="au-title">${title}</h1><div class="au-card">${card}</div></div>
    <p class="au-tag">Сообщество тех, кто хочет создавать богатство и сделать что-то великое</p>
  </main>`;
}

let auRaf = 0;
function startParticles() {
  cancelAnimationFrame(auRaf);
  const c = document.getElementById("auCanvas"); if (!c) return;
  const ctx = c.getContext("2d"); const dark = S.theme === "dark";
  const fit = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; }; fit(); addEventListener("resize", fit);
  const n = innerWidth < 960 ? 50 : 90;
  const pts = Array.from({ length: n }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: 1.5 + Math.random() * 2 }));
  const rgb = dark ? "255, 195, 6" : "59, 130, 246", da = dark ? .8 : .7, la = dark ? .35 : .28, md = 165;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const draw = () => {
    if (!document.body.contains(c)) return;
    ctx.clearRect(0, 0, c.width, c.height);
    for (const p of pts) { if (!still) { p.x += p.vx; p.y += p.vy; } if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0; if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0; }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy); if (d < md) { ctx.beginPath(); ctx.strokeStyle = `rgba(${rgb},${la * (1 - d / md)})`; ctx.lineWidth = .7; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); } }
    for (const p of pts) { ctx.beginPath(); ctx.fillStyle = `rgba(${rgb},${da})`; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
    if (!still) auRaf = requestAnimationFrame(draw);
  };
  draw();
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
  document.body.classList.toggle("on-login", a === "login");
  typo(root);
  root.querySelectorAll(".tabs").forEach(n => { const t = n.querySelector('[aria-current="page"]'); if (t && n.scrollWidth > n.clientWidth) n.scrollLeft = t.offsetLeft - (n.clientWidth - t.offsetWidth) / 2; });
  if (a === "login") startParticles();
  document.title = (document.querySelector(".topbar h1")?.textContent || "Вход") + " · Личный кабинет";
  bind();
}
function route(a, b) {
  if (a === "services") return services();
  if (a === "products") return b === "services" ? services() : b === "catalog" ? catalog() : b === "pay" ? purchases() : products();
  if (a === "progress") { growTab = b || "path"; return progress(); }
  if (a === "activity") return activity();
  if (a === "support") return support();
  if (a === "profile") { profTab = b || "about"; return profile(); }
  if (a === "p") return inside(b);
  return home();
}

function bind() {
  root.querySelectorAll("[data-tab]").forEach(el => el.onclick = () => { feedTab = el.dataset.tab; render(); });
  root.querySelectorAll("[data-setup-hide]").forEach(el => el.onclick = () => { setupHidden.add(S.persona); render(); });
  root.querySelectorAll("[data-atab]").forEach(el => el.onclick = () => { actTab = el.dataset.atab; actReply = -1; render(); });
  root.querySelectorAll("[data-aopen]").forEach(el => el.onclick = () => { actReply = +el.dataset.aopen; actList()[actReply].unread = false; render(); root.querySelector(".act-reply input")?.focus(); });
  root.querySelectorAll("[data-acancel]").forEach(el => el.onclick = () => { actReply = -1; render(); });
  root.querySelectorAll("[data-areply]").forEach(f => f.onsubmit = (e) => { e.preventDefault(); const v = f.querySelector("input").value.trim(); if (!v) return; actList()[+f.dataset.areply].done = "Вы ответили: " + v; actReply = -1; render(); });
  root.querySelectorAll("[data-ado]").forEach(el => el.onclick = () => { const a = actList()[+el.dataset.ado]; a.done = el.dataset.msg; a.unread = false; render(); });
  const ar = document.getElementById("actRead"); if (ar) ar.onclick = () => { actList().forEach(a => a.unread = false); render(); };
  root.querySelectorAll("[data-done]").forEach(el => el.onclick = () => { doneSet.add(S.persona + el.dataset.done); render(); });
  root.querySelectorAll("[data-t]").forEach(el => el.onclick = () => { ticketSel = +el.dataset.t; me().tickets[ticketSel].unread = 0; render(); });
  const nt = document.getElementById("newT"); if (nt) nt.onclick = () => { ticketSel = -1; render(); };
  root.querySelectorAll("[data-back]").forEach(el => el.onclick = () => { ticketSel = -2; render(); });
  root.querySelectorAll("[data-rate]").forEach(el => el.onclick = () => { me().tickets[ticketSel].rated = +el.dataset.rate; render(); });
  root.querySelectorAll("[data-reopen]").forEach(el => el.onclick = () => { const t = me().tickets[ticketSel]; t.status = "open"; t.msgs.push(["system", "Обращение открыто снова", "сейчас"]); render(); });
  root.querySelectorAll("[data-close]").forEach(el => el.onclick = () => { const t = me().tickets[ticketSel]; t.status = "closed"; t.msgs.push(["system", "Вы закрыли обращение", "сейчас"]); render(); });
  root.querySelectorAll("[data-mode]").forEach(el => el.onclick = () => { loginMode = el.dataset.mode; render(); });
  const at = document.getElementById("auTheme"); if (at) at.onclick = () => { S.theme = S.theme === "dark" ? "light" : "dark"; render(); };
  const eye = document.getElementById("au-eye"); if (eye) eye.onclick = () => { const i = document.getElementById("au-pw"); i.type = i.type === "password" ? "text" : "password"; };
  ["resetForm", "regForm"].forEach(id => { const f = document.getElementById(id); if (f) f.onsubmit = (e) => { e.preventDefault(); loginMode = "login"; S.logged = true; location.hash = "#/home"; }; });
  const nf = document.getElementById("newForm");
  if (nf) nf.onsubmit = (e) => { e.preventDefault(); const u = me(); const v = nf.querySelector("#nt-text").value.trim(); if (!v) { nf.querySelector("#nt-text").focus(); return; }
    const pid = nf.querySelector("#nt-p").value || (u.products[0] && u.products[0].id);
    u.tickets.unshift({ num: 1530 + u.tickets.length, title: v.slice(0, 48), cat: nf.querySelector("#nt-cat").value, p: pid, status: "new", when: "сейчас", msgs: [["system", RECEIPT, "сейчас"], ["me", v, "сейчас"]] }); ticketSel = 0; render(); };
  const ta = root.querySelector("#composer textarea");
  if (ta) ta.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ta.form.requestSubmit(); } };
  const att = document.getElementById("att"); if (att) att.onchange = () => { if (!att.files[0]) return; me().tickets[ticketSel].msgs.push(["me", "", "сейчас", { img: true }]); render(); };
  const bell = document.getElementById("bell");
  if (bell) bell.onclick = (e) => { e.stopPropagation(); notifOpen = !notifOpen; document.getElementById("notif").classList.toggle("open", notifOpen); bell.setAttribute("aria-expanded", notifOpen); };
  const ra = document.getElementById("readall"); if (ra) ra.onclick = (e) => { e.stopPropagation(); me().notifs.forEach(n => n.unread = false); render(); };
  root.querySelectorAll("[data-logout]").forEach(el => el.onclick = () => { S.logged = false; });
  const lf = document.getElementById("loginForm"); if (lf) lf.onsubmit = (e) => { e.preventDefault(); S.logged = true; location.hash = "#/home"; };
  root.querySelectorAll("[data-form]").forEach(f => f.onsubmit = (e) => { e.preventDefault(); const s = f.querySelector(".saved"); s.classList.add("on"); setTimeout(() => s.classList.remove("on"), 1800); });
  const comp = document.getElementById("composer");
  if (comp) comp.onsubmit = (e) => { e.preventDefault(); const ta = comp.querySelector("textarea"); const v = ta.value.trim(); if (!v) return; const u = me();
    u.tickets[ticketSel].msgs.push(["me", v, "сейчас"]);
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
sel.onchange = () => { S.persona = sel.value; ticketSel = 0; loginMode = "login"; feedTab = "today"; render(); };
document.getElementById("showNew").onchange = (e) => document.body.classList.toggle("show-new", e.target.checked);
document.getElementById("toLogin").onclick = () => { S.logged = false; location.hash = "#/login"; };

render();
})();
