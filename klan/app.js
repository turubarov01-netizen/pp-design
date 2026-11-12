/* Прототип «Мой клан». Данные выдуманы. */
(() => {
const P = {
  dash: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  clip: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  link: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  panel: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
  dollar: '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  set: '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  up: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  tri: '<path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>',
  cal: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  dl: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  spark: '<path d="M9.94 14.06 4 20"/><path d="m14 4 6 6"/><path d="M12 2v2"/><path d="M22 12h-2"/><path d="m18 8-6 6"/>',
};
const ic = (n, c = 'i') => `<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
const plural = (n, a, b, c) => { const m = n % 100, d = n % 10; return m > 10 && m < 20 ? c : d === 1 ? a : d >= 2 && d <= 4 ? b : c; };
const medal = k => k === '—' ? '' : `<span class="medal-ic m-${k}" role="img" aria-label="${({g:'Золото',s:'Серебро',b:'Бронза'})[k]}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="14" r="7"/><path d="M8.5 7.5 6 2h4l2 4 2-4h4l-2.5 5.5"/></svg></span>`;
const rub = n => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';

const MENU = [
  { id: 'dashboard', t: 'Обзор', i: 'dash' },
  { id: 'league', t: 'Лига кланов', i: 'trophy' },
  { id: 'analytics', t: 'Аналитика', i: 'up' },
  { g: 'Клиенты' },
  { id: 'leads', t: 'Клиенты', i: 'users' },
  { id: 'onboarding', t: 'Онбординг', i: 'clip' },
  { g: 'Ссылки и страницы' },
  { id: 'invites', t: 'Ссылки и приглашения', i: 'link' },
  { id: 'sites', t: 'Сайты и вебинары', i: 'globe' },
  { id: 'landing', t: 'Страница клана', i: 'panel' },
  { g: 'Деньги' },
  { id: 'finance', t: 'Финансы', i: 'dollar' },
  { id: 'catalog', t: 'Каталог счетов', i: 'file' },
  { g: 'Настройки' },
  { id: 'settings', t: 'Настройки', i: 'set' },
  { id: 'handbook', t: 'Настольная книга', i: 'book' },
  { g: 'Убрали из меню' },
  { id: 'gone', t: 'Точки А', i: 'target', gone: 1 },
  { id: 'gone', t: 'Задания ПЭРЛ', i: 'tri', gone: 1 },
  { id: 'gone', t: 'Встречи с клиентами', i: 'cal', gone: 1 },
  { id: 'gone', t: 'Привлечение', i: 'chart', gone: 1 },
];

const CLANS = [
  { n: 'Клан Вектор', pts: 8.4, m: 'b', sales: 21, rev: 1188, me: 1 },
  { n: 'Клан Север', pts: 5, m: 'b', sales: 5, rev: 1100 },
  { n: 'Клан Орбита', pts: 4.4, m: 'b', sales: 8, rev: 378 },
  { n: 'Клан Пульсар', pts: 0, m: '—', sales: 0, rev: 0 },
];

const CLIENTS = [
  ['Ирина Л.', '@irina_l', 'сегодня', 'Пешка', 0, 0, '—', 'Новые', ''],
  ['Олег С.', '@oleg_s', '2 дня назад', 'Пешка', 1, 9900, 'до 12.12', 'Счёт выставлен', 'счёт 12 000 ₽ не оплачен'],
  ['Марина К.', 'marina@…', '5 дней назад', 'Раб', 2, 21900, 'до 03.02', 'Купили', ''],
  ['Дмитрий В.', '+7 9•• ••• 41', '12.10', 'Бунтарь', 3, 129000, 'до 12.10.27', 'Члены клуба', ''],
  ['Алина Р.', '@alina_r', '08.10', 'Раб', 1, 990, 'кончится через 3 дн.', 'Купили', 'доступ кончится через 3 дн.'],
  ['Сергей Т.', '@sergey_t', '01.10', 'Пешка', 0, 0, '—', 'В работе', ''],
  ['Наталья П.', 'nat@…', '27.09', 'Бунтарь', 2, 99000, 'до 27.09.27', 'Члены клуба', ''],
];

const demoNote = (html) => `<div class="note"><span class="tag">Обсудить</span><div>${html}</div></div>`;

/* ---------- страницы ---------- */
const pages = {};

const PULSE = {
  7: { n: 6, nt: 2, p: 5, pt: 1, m: '49&nbsp;500', mt: '9&nbsp;900', chk: '9&nbsp;900', share: '39&nbsp;600' },
  30: { n: 23, nt: 2, p: 19, pt: 1, m: '188&nbsp;100', mt: '9&nbsp;900', chk: '9&nbsp;900', share: '150&nbsp;480' },
  90: { n: 61, nt: 2, p: 44, pt: 1, m: '402&nbsp;600', mt: '9&nbsp;900', chk: '9&nbsp;150', share: '322&nbsp;080' },
};
const tiles = d => { const x = PULSE[d]; return `
  <a class="tile" href="#leads"><span class="tl">Новые люди</span><b class="tv num">${x.n}</b><span class="tt up">+${x.nt} сегодня</span></a>
  <a class="tile" href="#finance"><span class="tl">Оплаты</span><b class="tv num">${x.p}</b><span class="tt up">+${x.pt} сегодня</span><span class="ts">чек ${x.chk}&nbsp;₽</span></a>
  <a class="tile wide money" href="#finance"><span class="tl">Поступило</span><b class="tv num">${x.m}&nbsp;₽</b><span class="tt up">+${x.mt}&nbsp;₽ сегодня</span><span class="ts">доля клана ${x.share}&nbsp;₽</span></a>`; };
window.setPulse = (d, btn) => {
  document.getElementById('tiles').innerHTML = tiles(d);
  btn.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === btn));
};
const QUICK = [['Сайт Альянса', 'wearefree.club/d/anna'], ['SCALE', 'wearefree.club/scale/anna'], ['Онбординг', 'wearefree.club/start?c=vektor'], ['Онбординг в Telegram', 't.me/freemen_alliance_bot?start=vektor'], ['Ссылка клана', 'wearefree.club/c/vektor'], ['Реферальная', 'wearefree.club/r/vektor']];
pages.dashboard = () => `
  <div class="ov">
  <div class="ov-head"><div><h1>Мой клан</h1><p>Клан Вектор</p></div>
    <div class="seg" role="group" aria-label="Период">${[7, 30, 90].map(d => `<button type="button" aria-pressed="${d === 30}" onclick="setPulse(${d}, this)">${d}&nbsp;дн</button>`).join('')}</div></div>
  ${demoNote('Компактная главная под телефон: крупные ключевые цифры плитками, сезон — одна плитка, ссылки — список с кнопкой копирования. Расчёт с Head Office — в «Финансах».')}
  <a class="btn pri ov-add" href="#new-client">${ic('plus')}Добавить клиента</a>
  <div class="tiles">
    <a class="tile season-t" href="#league"><span class="tl">Сезон 1</span><b class="tv num">8,4</b><span class="tm">${medal('b')} Бронза · 1 место</span><span class="tbar"><i style="width:28%"></i></span><span class="ts">до серебра 0,6</span></a>
    <div class="tiles-p" id="tiles">${tiles(30)}</div>
  </div>
  <section class="card ov-card">
    <div class="ch"><h2>Ссылки клана</h2><a class="btn ghost sm" href="#invites">Все ${ic('arrow')}</a></div>
    <ul class="qlinks">${QUICK.map(([n, u]) => `<li><div class="qn">${n}<span>${u}</span></div><button class="qcopy" type="button" aria-label="Копировать: ${n}">${ic('copy')}</button></li>`).join('')}</ul>
  </section>
  <div class="tiles two">
    <a class="tile" href="#analytics"><span class="tl">Лучшая кампания</span><b class="tv sm">Reels</b><span class="ts">48&nbsp;клиентов · клиент за&nbsp;104&nbsp;₽</span></a>
    <a class="tile" href="#onboarding"><span class="tl">Онбординг</span><b class="tv num">24</b><span class="ts">проходят сейчас · 6&nbsp;застряли</span></a>
  </div>
  </div>`;

pages.league = () => `
  <div class="ph"><div><h1>Лига кланов</h1><p>Сезон 1: 1 сентября – 30 ноября. До конца сезона 48 дней.</p></div></div>
  <section class="card">
    <div class="ch"><h2>Ваш клан в этом сезоне</h2></div>
    <div class="grid3" style="align-items:end">
      <div><div class="season-pts num">8,4</div><div class="muted">очков</div></div>
      <div><div style="font-size:22px;font-weight:700">${medal('b')} Бронза</div><div class="muted">До серебра 0,6 очка</div></div>
      <div><div style="font-size:22px;font-weight:700">80%</div><div class="muted">ваша доля сейчас</div></div>
    </div>
    <div style="margin-top:18px"><div class="bar"><i style="width:28%"></i></div><div class="comp" style="display:block"><div class="marks"><span style="left:0">0</span><span style="left:10%">${medal('b')} 3</span><span style="left:30%">${medal('s')} 9</span><span style="right:0">${medal('g')} 30 очков</span></div></div></div>
    <p class="muted" style="margin:12px 0 0;font-size:14px">Если сезон закончится так, доля снизится до 70%.</p>
  </section>
  <section class="card">
    <div class="ch"><h2>Таблица сезона 1</h2></div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Клан</th><th>Медаль</th><th class="r">Очки</th><th class="r">Продажи</th><th class="r">Выручка</th><th class="r">Доля</th></tr></thead><tbody>
    ${CLANS.map(c => `<tr class="row"${c.me ? ' style="font-weight:650"' : ''}><td>${c.n}</td><td>${medal(c.m)}</td><td class="r num">${String(c.pts).replace('.', ',')}</td><td class="r num">${c.sales}</td><td class="r num">$${c.rev.toLocaleString('ru-RU')}</td><td class="r num">80% → 70%</td></tr>`).join('')}
    </tbody></table></div>
  </section>
  <section class="card">
    <div class="ch"><h2>Правила простыми словами</h2></div>
    <div class="rules">
      <div><h3>Очки за продажи</h3><ul><li>Месячная подписка или любой курс — 1</li><li>Годовое членство — 5</li><li>Стартовый и продления за $7–13 — 0,1</li></ul></div>
      <div><h3>Медали за сезон (3 месяца)</h3><ul><li>${medal('g')} Золото — от 30 очков</li><li>${medal('s')} Серебро — от 9</li><li>${medal('b')} Бронза — от 3</li></ul></div>
      <div><h3>Что медаль делает с долей</h3><ul><li>Золото — доля +10%, до 80%</li><li>Серебро — доля та же</li><li>Бронза — −10%</li><li>Без медали — −20%</li><li>Меньше 60% доля не бывает</li></ul></div>
    </div>
  </section>`;

pages.leads = () => `
  <div class="ph"><div><h1>Клиенты клана</h1><p>Клан Вектор · 214 чел.</p></div><div class="acts"><a class="btn pri" href="#new-client">${ic('plus')}Добавить клиента</a></div></div>
  ${demoNote('Сейчас страница грузится медленно: вместе со списком клана она тянет все карточки клиентов платформы, чтобы открыть одну. Это чиним отдельно от дизайна.')}
  <div class="tabs" role="group"><button aria-pressed="true">Клиенты<span class="cnt">214</span></button><button aria-pressed="false">Переписки</button><button aria-pressed="false">Поддержка<span class="cnt">3</span></button></div>
  <div class="stages">
    ${[['Новые', 12, 'пришли за 7 дней'], ['В работе', 131, 'ещё ничего не купили'], ['Счёт выставлен', 9, 'ждём оплату'], ['Купили', 48, 'есть покупки'], ['Члены клуба', 14, 'Бунтарь и выше']].map(([l, n, s]) => `<button class="stage" type="button"><b class="num">${n}</b><div class="l">${l}</div><div class="s">${s}</div></button>`).join('')}
  </div>
  <section class="card">
    <div class="toolbar">
      <label class="input grow">${ic('search')}<input placeholder="Имя, @telegram, email или телефон"></label>
      <label class="input"><select><option>Откуда: все источники</option><option>Сайт директора</option><option>Страница клана</option><option>Реф-ссылка</option><option>Инвайт</option><option>Добавлен вручную</option></select></label>
      <label class="input"><select><option>Покупал: любой продукт</option><option>ничего не покупал</option></select></label>
      <label class="input"><select><option>Сначала требуют внимания</option><option>Новые сверху</option><option>Свежие оплаты сверху</option></select></label>
      <button class="btn" type="button">${ic('dl')}В Excel</button>
    </div>
    <div class="chips" style="margin-bottom:12px">${[['Все', 214], ['Требуют внимания', 6], ['Члены клуба', 14], ['Рабы', 34], ['Пешки', 152], ['Без аккаунта', 14]].map(([t, n], i) => `<button class="chip" aria-pressed="${i === 0}">${t} <span class="n">${n}</span></button>`).join('')}</div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Клиент</th><th>Пришёл</th><th>Уровень</th><th class="r">Покупки</th><th class="r">Оплачено</th><th>Доступ</th></tr></thead><tbody>
      ${CLIENTS.map(c => `<tr class="row"><td><div class="who"><span class="ava">${c[0].split(' ').map(x => x[0]).join('')}</span><div><div class="n">${c[0]}</div><div class="m">${c[1]}</div>${c[8] ? `<div class="alert">${c[8]}</div>` : ''}</div></div></td><td class="muted">${c[2]}</td><td><span class="badge ${c[3] === 'Бунтарь' ? 'blue' : ''}">${c[3]}</span></td><td class="r num">${c[4]}</td><td class="r num">${c[5] ? rub(c[5]) : '—'}</td><td class="muted">${c[6]}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="empty" style="margin-top:16px">Не нашли своего клиента в списке? <button class="btn sm" type="button" style="margin-left:8px">${ic('search')}Искать по всей базе</button></div>
  </section>`;

pages.onboarding = () => `
  <div class="ph"><div><h1>Онбординг</h1><p>Кто проходит онбординг, где останавливается, кто эти люди и кто из них покупает. Нажмите на любую цифру, чтобы увидеть людей.</p></div></div>
  <section class="card">
    <div class="ch"><h2>Воронка</h2><span class="sub">Должны пройти: 186</span></div>
    <div class="fun">
      ${[['Начали', 186], ['Прошли профиль', 152], ['Рассказали про дело', 131], ['Прошли «Что держит»', 118], ['Получили маршрут', 104], ['Дошли до предложения', 77], ['Оплатили', 19]].map(([l, n]) => `<div class="r"><span>${l}</span><div class="bar"><i style="width:${Math.round(n / 186 * 100)}%"></i></div><span class="num r" style="text-align:right;font-weight:650">${n}</span></div>`).join('')}
    </div>
  </section>
  <section class="card">
    <div class="tabs" role="group"><button aria-pressed="true">Люди</button><button aria-pressed="false">Кто проходит</button><button aria-pressed="false">Кто покупает</button></div>
    <div class="toolbar"><label class="input grow">${ic('search')}<input placeholder="Имя, Telegram, почта"></label></div>
    <div class="chips" style="margin-bottom:12px">${['Все', 'Проходят', 'Прошли', 'Не начали', 'На установочной'].map((t, i) => `<button class="chip" aria-pressed="${i === 0}">${t}</button>`).join('')}</div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Человек</th><th>Статус</th><th>Где сейчас</th><th>Доход → цель</th><th>Активность</th></tr></thead><tbody>
      ${[['Ирина Л.', 'Проходит', 'Что держит', '80 → 300 тыс.', 'сегодня'], ['Олег С.', 'Прошёл', 'Предложение', '150 → 500 тыс.', 'вчера'], ['Сергей Т.', 'Не начал', '—', '—', '3 дня назад'], ['Марина К.', 'Прошла', 'Оплатила', '120 → 400 тыс.', '5 дней назад']].map(r => `<tr class="row"><td><div class="who"><span class="ava">${r[0].split(' ').map(x => x[0]).join('')}</span><div class="n">${r[0]}</div></div></td><td><span class="badge ${r[1].startsWith('Прош') ? 'ok' : r[1] === 'Проходит' ? 'blue' : ''}">${r[1]}</span></td><td>${r[2]}</td><td class="num">${r[3]}</td><td class="muted">${r[4]}</td></tr>`).join('')}
    </tbody></table></div>
  </section>`;

const CAMPS = [
  ['Reels «Как найти первых клиентов»', 'Reels', 'съёмка', 5000, 640, 48, 6, 59400],
  ['Мастер-класс 8 ноября', 'Мероприятие', 'аренда зала', 12000, 85, 31, 5, 49500],
  ['Выступление на бизнес-завтраке', 'Выступление', 'участие', 15000, 120, 22, 4, 39600],
  ['Реклама в Telegram-канале', 'Реклама', 'пост в канале', 8000, 210, 9, 1, 9900],
  ['Флайеры в коворкинге', 'Флайеры', 'печать', 3000, 14, 3, 0, 0],
];
pages.analytics = () => {
  const row = c => {
    const cpl = Math.round(c[3] / c[5]);
    const roi = c[7] ? (c[7] / c[3]).toFixed(1).replace('.', ',') : null;
    return `<tr class="row"><td><div style="font-weight:600">${c[0]}</div><div class="muted" style="font-size:12.5px">${c[2]} · ${rub(c[3])}</div></td><td><span class="badge blue">${c[1]}</span></td><td class="r num">${rub(c[3])}</td><td class="r num">${c[4]}</td><td class="r num">${c[5]}</td><td class="r num">${c[6]}</td><td class="r num">${c[7] ? rub(c[7]) : '—'}</td><td class="r num" style="font-weight:650">${rub(cpl)}</td><td class="r num">${roi ? `<span class="badge ${+roi.replace(',', '.') >= 2 ? 'ok' : 'warn'}">×${roi}</span>` : '<span class="badge bad">0</span>'}</td></tr>`;
  };
  return `
  <div class="ph"><div><h1>Аналитика</h1><p>Откуда приходят клиенты клана, сколько стоит каждый и сколько он приносит.</p></div><div class="acts"><div class="chips">${['7 дней', '30 дней', '90 дней', 'Всё время'].map((t, i) => `<button class="chip" aria-pressed="${i === 1}">${t}</button>`).join('')}</div></div></div>
  ${demoNote('Кампания — это любой способ привлечь людей: Reels, выступление, своё мероприятие, флайеры, реклама. У каждой своя ссылка, по ней система считает, кто пришёл и кто оплатил. Расход директор записывает к кампании сам: съёмка, печать, аренда зала, участие в конференции. Из этого считается цена клиента и окупаемость.')}
  <section class="card">
    <div class="ch"><h2>Воронка за 30 дней</h2></div>
    <div class="grid4">
      ${[['Посетители страниц', '2 140', 'уникальные, без тестовых'], ['Новые клиенты', '186', '8,7% посетителей'], ['Завели аккаунт', '121', '65% новых'], ['Оплатили', '19', '16% с аккаунтом · 188&nbsp;100&nbsp;₽']].map(([l, v, s]) => `<div><div class="muted" style="font-size:13px">${l}</div><div style="font-size:28px;font-weight:750;letter-spacing:-.02em" class="num">${v}</div><div class="faint" style="font-size:12.5px">${s}</div></div>`).join('')}
    </div>
  </section>
  <section class="card">
    <div class="ch"><h2>Кампании и события</h2><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" type="button">${ic('plus')}Записать расход</button><button class="btn pri sm" type="button">${ic('plus')}Новая кампания</button></div></div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Кампания</th><th>Тип</th><th class="r">Потрачено</th><th class="r">Переходы</th><th class="r">Клиенты</th><th class="r">Оплатили</th><th class="r">Выручка</th><th class="r">Цена клиента</th><th class="r">Окупаемость</th></tr></thead><tbody>
      ${CAMPS.map(row).join('')}
      <tr class="row"><td><div style="font-weight:600">Без кампании</div><div class="muted" style="font-size:12.5px">сайт директора, сарафан, ручное добавление</div></td><td><span class="badge">—</span></td><td class="r num">—</td><td class="r num">1 071</td><td class="r num">73</td><td class="r num">3</td><td class="r num">${rub(29700)}</td><td class="r num">—</td><td class="r num">—</td></tr>
      <tr><td style="font-weight:700">Итого</td><td></td><td class="r num" style="font-weight:700">${rub(43000)}</td><td class="r num" style="font-weight:700">2 140</td><td class="r num" style="font-weight:700">186</td><td class="r num" style="font-weight:700">19</td><td class="r num" style="font-weight:700">${rub(188100)}</td><td class="r num" style="font-weight:700">${rub(231)}</td><td class="r num" style="font-weight:700">×4,4</td></tr>
    </tbody></table></div>
  </section>
  <div class="grid2">
    <section class="card">
      <div class="ch"><h2>Деньги с клиента</h2></div>
      <div class="kv"><span class="k">Средний чек</span><span class="v num">9 900 ₽</span></div>
      <div class="kv"><span class="k">LTV<small>сколько в среднем платит клиент за всё время</small></span><span class="v num">14 300 ₽</span></div>
      <div class="kv"><span class="k">Покупают повторно</span><span class="v num">32%</span></div>
      <div class="kv"><span class="k">Цена клиента<small>все расходы ÷ новые клиенты</small></span><span class="v num">231 ₽</span></div>
      <div class="kv"><span class="k">Цена покупателя<small>все расходы ÷ оплатившие</small></span><span class="v num">2 263 ₽</span></div>
      <div class="kv"><span class="k">Окупаемость расходов</span><span class="v plus num">×4,4</span></div>
    </section>
    <section class="card">
      <div class="ch"><h2>Последние расходы</h2></div>
      ${[['12.11', 'Флайеры в коворкинге', 'печать 200 шт.', 3000], ['08.11', 'Мастер-класс 8 ноября', 'аренда зала', 12000], ['05.11', 'Выступление на бизнес-завтраке', 'участие', 15000], ['01.11', 'Reels «Как найти первых клиентов»', 'съёмка и монтаж', 5000]].map(r => `<div class="kv"><span class="k">${r[1]}<small>${r[0]} · ${r[2]}</small></span><span class="v num">${rub(r[3])}</span></div>`).join('')}
    </section>
  </div>
  <section class="card">
    <div class="ch"><h2>Страницы</h2><span class="sub">как каждая страница доводит до оплаты</span></div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Страница</th><th class="r">Посетители</th><th class="r">Нажали кнопку</th><th class="r">Долистали</th><th class="r">Создали аккаунт</th><th class="r">Конверсия</th><th class="r">Выручка</th></tr></thead><tbody>
      ${[['Сайт Альянса · Анна', 1290, 214, 388, 61, '4,7%', 99000], ['Тест «Мой оффер»', 520, 301, 0, 44, '8,5%', 59400], ['Вебинар «Свой продукт за 30 дней»', 330, 96, 140, 16, '4,8%', 29700]].map(r => `<tr class="row"><td style="font-weight:600">${r[0]}</td><td class="r num">${r[1].toLocaleString("ru-RU")}</td><td class="r num">${r[2]}</td><td class="r num">${r[3] || '—'}</td><td class="r num">${r[4]}</td><td class="r num">${r[5]}</td><td class="r num">${rub(r[6])}</td></tr>`).join('')}
    </tbody></table></div>
  </section>`;
};

pages['new-client'] = () => `
  <div class="nc">
  <a class="back" href="#leads">${ic('arrow')}Клиенты</a>
  <h1>Новый клиент</h1>
  <p class="muted lead">Заведите человека сами: аккаунт появится сразу, ему придёт ссылка для входа в кабинет.</p>
  ${demoNote('«Уже оплатил»: оплата пишется как «получил клан», доступ открывается, онбординг идёт без шага с оплатой; в расчёте с Head Office 20% платформе. «Без оплаты»: человек проходит онбординг как все и в конце получает предложение купить, клиент закреплён за кланом.')}
  <form class="card ncf" onsubmit="return ncSubmit(event)" novalidate data-paid="1">
    <div class="nc-mode">
      <span class="flabel" id="nc-mode-l">Клиент уже заплатил вам?</span>
      <div class="seg wide" role="group" aria-labelledby="nc-mode-l"><button type="button" aria-pressed="true" onclick="ncMode(1)">Уже оплатил</button><button type="button" aria-pressed="false" onclick="ncMode(0)">Без оплаты</button></div>
      <small class="help" id="nc-mode-help">Доступ откроется сразу, предложения купить в онбординге не будет</small>
    </div>
    <fieldset>
      <legend><span class="step">1</span>Кто</legend>
      <div class="fields">
        <div class="field"><label for="nc-name">Имя и фамилия <i>*</i></label><div class="input"><input id="nc-name" autocomplete="name" required value="Ольга Кравец"></div></div>
        <div class="field"><label for="nc-email">Почта <i>*</i></label><div class="input"><input id="nc-email" type="email" inputmode="email" autocomplete="email" required placeholder="name@mail.ru"></div><small class="help" id="nc-email-help">На неё создаём аккаунт и отправляем вход</small></div>
        <div class="field"><label for="nc-tg">Telegram</label><div class="input"><input id="nc-tg" autocomplete="off" placeholder="@username"></div><small class="help">Чтобы отправить вход в Telegram</small></div>
        <div class="field"><label for="nc-phone">Телефон</label><div class="input"><input id="nc-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7"></div></div>
      </div>
    </fieldset>
    <fieldset id="nc-pay">
      <legend><span class="step">2</span>Что оплатил</legend>
      <div class="fields">
        <div class="field"><label for="nc-prod">Продукт <i>*</i></label><div class="input"><select id="nc-prod"><option>ПП-клуб · месяц</option><option>ПП-клуб · год</option><option>Альянс · месяц</option><option>Альянс · год</option><option>Стартовый пакет</option><option>ИИнструменты</option><option>Место притяжения</option></select></div></div>
        <div class="field"><label for="nc-sum">Сумма <i>*</i></label><div class="input"><input id="nc-sum" inputmode="numeric" value="14 990"><span class="suf">₽</span></div></div>
        <div class="field"><label for="nc-date">Дата оплаты</label><div class="input"><input id="nc-date" type="date" value="2026-11-13"></div></div>
        <div class="field"><span class="flabel" id="nc-how-l">Как заплатил</span><div class="seg wide" role="group" aria-labelledby="nc-how-l"><button type="button" aria-pressed="true">Наличные</button><button type="button" aria-pressed="false">Карта</button><button type="button" aria-pressed="false">Перевод</button></div></div>
      </div>
    </fieldset>
    <fieldset>
      <legend><span class="step" id="nc-step-send">3</span>Куда отправить вход</legend>
      <div class="seg wide" role="group" aria-label="Куда отправить вход"><button type="button" aria-pressed="true">На почту</button><button type="button" aria-pressed="false">В Telegram</button><button type="button" aria-pressed="false">Скопирую ссылку</button></div>
      <small class="help">Ссылка одноразовая, действует 7 дней. Пароль человек задаст сам.</small>
    </fieldset>
    <div class="ncf-foot"><button class="btn pri big" type="submit" id="nc-go">Создать аккаунт и отправить вход</button><a class="btn ghost" href="#leads">Отмена</a></div>
  </form>
  <div class="card ncd" id="nc-done" hidden tabindex="-1" aria-live="polite">
    <div class="ok-ic">${ic('check')}</div>
    <h2>Аккаунт создан</h2>
    <p class="muted">Ольга Кравец · olga@mail.ru</p>
    <div id="nc-rows"></div>
    <div class="ncf-foot"><a class="btn pri" href="#leads">К клиентам</a><button class="btn" type="button" onclick="route()">Добавить ещё</button></div>
  </div>
  </div>`;
window.ncMode = paid => {
  const f = document.querySelector('.ncf'); f.dataset.paid = paid ? '1' : '0';
  document.getElementById('nc-pay').hidden = !paid;
  document.getElementById('nc-step-send').textContent = paid ? '3' : '2';
  document.getElementById('nc-mode-help').textContent = paid ? 'Доступ откроется сразу, предложения купить в онбординге не будет' : 'Человек пройдёт онбординг и в конце получит предложение купить';
};
window.ncSubmit = e => {
  e.preventDefault();
  const em = document.getElementById('nc-email');
  const f = em.closest('.field');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)) {
    f.classList.add('err'); document.getElementById('nc-email-help').textContent = 'Нужна почта, на неё создаётся аккаунт'; em.focus(); return false;
  }
  const b = document.getElementById('nc-go'); b.disabled = true; b.textContent = 'Создаём аккаунт…';
  const pressed = sel => (document.querySelector(sel + ' [aria-pressed="true"]') || {}).textContent || '';
  const name = document.getElementById('nc-name').value.trim() || 'Без имени';
  const prod = document.getElementById('nc-prod').value;
  const sum = parseInt(document.getElementById('nc-sum').value.replace(/\D/g, ''), 10) || 0;
  const how = pressed('.ncf fieldset:nth-of-type(2) .seg');
  const to = pressed('.ncf fieldset:nth-of-type(3) .seg');
  const dt = new Date(document.getElementById('nc-date').value || '2026-11-13');
  if (/год/.test(prod)) dt.setFullYear(dt.getFullYear() + 1); else dt.setMonth(dt.getMonth() + 1);
  const until = /месяц|год/.test(prod) ? ' до\u00a0' + dt.toLocaleDateString('ru-RU') : ', открыт';
  const howTxt = { 'Наличные': 'наличными', 'Карта': 'картой', 'Перевод': 'переводом' }[how] || '';
  const link = 'wearefree.club/in/7Kq2xM';
  const toTxt = to === 'В Telegram' ? 'ссылка отправлена в\u00a0Telegram' : to === 'Скопирую ссылку' ? `<button type="button" class="qcopy inl" aria-label="Скопировать ссылку для входа">${link}</button>` : 'ссылка отправлена на\u00a0почту';
  const kv = (k, v) => `<div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  setTimeout(() => {
    document.querySelector('.ncf').hidden = true;
    const d = document.getElementById('nc-done'); d.hidden = false;
    d.querySelector('.muted').textContent = name + ' · ' + em.value;
    const paid = document.querySelector('.ncf').dataset.paid === '1';
    d.querySelector('h2').textContent = paid ? 'Аккаунт создан, доступ открыт' : 'Аккаунт создан';
    d.querySelector('#nc-rows').innerHTML = paid ? (
      kv('Доступ', prod + until) +
      kv('Оплата', `<span class="num">${rub(sum)}</span> ${howTxt}`) +
      kv('Деньги получил', 'клан') +
      kv('Платформе по\u00a0расчёту', `<span class="num">20% · ${rub(Math.round(sum * 0.2))}</span>`)) : (
      kv('Доступ', 'откроется после оплаты') +
      kv('Онбординг', 'с\u00a0предложением купить') +
      kv('Клиент', 'закреплён за\u00a0кланом')) +
      kv('Вход', toTxt);
    const c = d.querySelector('.qcopy.inl');
    if (c) c.onclick = () => { navigator.clipboard && navigator.clipboard.writeText('https://' + link).catch(() => {}); c.classList.add('done'); c.textContent = 'Скопировано'; setTimeout(() => { c.classList.remove('done'); c.textContent = link; }, 1500); };
    d.focus();
  }, 900);
  return false;
};

pages.invites = () => `
  <div class="ph"><div><h1>Ссылки клана</h1><p>Постоянная ссылка и UTM/ref-ссылки клана «Вектор»: они закрепляют пришедшего за вами. Ниже видно, кто по ним пришёл.</p></div></div>
  <section class="card">
    <div class="ch"><h2>Ваши сайты</h2></div>
    <div class="links">
      ${[['Сайт Альянса', 'wearefree.club/d/anna'], ['Сайт SCALE для предпринимателей', 'wearefree.club/scale/anna'], ['Бесплатный онбординг', 'wearefree.club/start?c=vektor'], ['Онбординг в Telegram', 't.me/freemen_alliance_bot?start=vektor']].map(([n, u]) => `
        <div class="lnk"><div><div class="n">${n}</div><div class="u">${u}</div></div><div class="a"><button class="btn sm" type="button">${ic('copy')}Копировать</button><button class="btn sm" type="button">${ic('ext')}Открыть</button></div></div>`).join('')}
    </div>
  </section>
  <section class="card">
    <div class="ch"><h2>Постоянная ссылка клана</h2></div>
    <div class="lnk" style="padding:0"><div class="u" style="font-size:15px;color:var(--ink)">wearefree.club/c/vektor</div><div class="a"><button class="btn sm" type="button">${ic('copy')}Копировать</button></div></div>
  </section>
  <section class="card">
    <div class="ch"><h2>UTM / реф-ссылки на регистрацию</h2><button class="btn sm" type="button">${ic('plus')}Новая ссылка</button></div>
    <div class="tabs" role="group"><button aria-pressed="true">Ссылки<span class="cnt">4</span></button><button aria-pressed="false">Промокоды<span class="cnt">2</span></button></div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Целевая страница</th><th>Метка</th><th>Промокод</th><th class="r">Бонус фениксов</th></tr></thead><tbody>
      ${[['Главная Альянса', 'insta_bio', '—', '0'], ['Тест «Мой оффер»', 'reels_okt', 'VEKTOR10', '🔥 50'], ['SCALE', 'tg_post', '—', '0'], ['Онбординг', 'webinar_11', '—', '🔥 20']].map(r => `<tr class="row"><td>${r[0]}</td><td><span class="badge">${r[1]}</span></td><td>${r[2]}</td><td class="r">${r[3]}</td></tr>`).join('')}
    </tbody></table></div>
  </section>
  <section class="card">
    <div class="ch"><h2>Статистика инвайтов и реф-ссылок</h2></div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Участник</th><th>Дата</th><th>Способ</th><th>Реф-ссылка</th><th>UTM</th></tr></thead><tbody>
      ${[['Ирина Л.', '12.11', 'Реф-ссылка', 'insta_bio', 'instagram / bio'], ['Олег С.', '10.11', 'Инвайт', '—', '—'], ['Сергей Т.', '01.11', 'Реф-ссылка', 'reels_okt', 'instagram / reels']].map(r => `<tr class="row"><td>${r[0]}</td><td class="muted">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="muted">${r[4]}</td></tr>`).join('')}
    </tbody></table></div>
  </section>`;

pages.sites = () => `
  <div class="ph"><div><h1>Сайты и вебинары</h1><p>Страницы, лендинги и вебинары клана «Вектор»</p></div><div class="acts"><button class="btn pri" type="button">${ic('plus')}Создать страницу</button></div></div>
  <section class="card">
    <div class="ch"><h2>Стартовая страница клана</h2><span class="badge ok">Опубликована</span></div>
    <p class="muted" style="margin:0 0 12px">Вход для твоих клиентов: wearefree.club/c/vektor</p>
    <div style="display:flex;gap:8px"><button class="btn sm" type="button">${ic('ext')}Открыть</button><a class="btn sm" href="#landing">Настроить</a></div>
  </section>
  <section class="card">
    <div class="tabs" role="group"><button aria-pressed="true">Страницы клана</button><button aria-pressed="false">Общие (только просмотр)</button></div>
    <div class="toolbar"><label class="input grow">${ic('search')}<input placeholder="Поиск по названию, описанию или адресу..."></label></div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Название</th><th>Тип</th><th>Статус</th><th class="r">Визиты</th><th class="r">Регистрации</th></tr></thead><tbody>
      ${[['Вебинар «Свой продукт за 30 дней»', 'Вебинар', 'Активна', 412, 38], ['Лендинг SCALE · Анна', 'Лендинг', 'Активна', 1290, 61], ['Тест «Мой оффер»', 'Тест', 'Активна', 870, 102], ['Эфир 5 ноября', 'Вебинар', 'Архив', 233, 19]].map(r => `<tr class="row"><td style="font-weight:600">${r[0]}</td><td>${r[1]}</td><td><span class="badge ${r[2] === 'Активна' ? 'ok' : ''}">${r[2]}</span></td><td class="r num">${r[3]}</td><td class="r num">${r[4]}</td></tr>`).join('')}
    </tbody></table></div>
  </section>`;

const sec = (t, c, body, open) => `<details class="sec"${open ? ' open' : ''}><summary>${t}<span class="c">${c}</span></summary><div class="body">${body}</div></details>`;
const flds = arr => `<div class="fields">${arr.map(([l, v]) => `<div class="field"><label>${l}</label><div class="input"><input value="${v}"></div></div>`).join('')}</div>`;
pages.landing = () => `
  <div class="ph"><div><h1>Страница клана</h1><p>Персональный вход для твоих клиентов: wearefree.club/c/vektor</p></div><div class="acts"><button class="btn" type="button">${ic('ext')}Открыть</button></div></div>
  ${demoNote('Сейчас это семь длинных карточек одна под другой. Здесь они свёрнуты, чтобы было видно объём: решаем, что директор правда меняет сам, а что заполняется один раз.')}
  <section class="card">
    ${sec('Оформление', 'адрес, цвет, заголовок, о клане', flds([['Адрес страницы', 'vektor'], ['Акцентный цвет', '#2f7bff'], ['Имя лидера', 'Анна Миронова'], ['Заголовок', 'Клан Вектор'], ['Подзаголовок', 'Строим свой продукт вместе'], ['О клане', 'Предприниматели, которые…']]) + '<div style="margin-top:14px;display:flex;gap:8px"><button class="btn pri sm">Сохранить</button><button class="btn sm">На модерацию</button></div>', 1)}
    ${sec('Визитка основателя', '14 полей: роль, слоган, видео, регалии, отзывы', '<p class="muted">Имя и фамилия, Кто ты, Короткий слоган, Профиль, Год начала пути, Бегущая строка, Главная кнопка, Соцсети, Кнопки-меню, Обо мне, Видео, Регалии и цифры, Отзывы, Награды и дипломы.</p>')}
    ${sec('Реквизиты и футер', '13 полей', '<p class="muted">Наименование, ИНН, ОГРН / ОГРНИП, КПП, Юридический адрес, Банк, Расчётный счёт, Корр. счёт, БИК, E-mail, Телефон, Подписант, Приписка в футере.</p>')}
    ${sec('Дизайн и SEO публичных страниц клана', 'тема, шрифты, SEO', '<p class="muted">Тема, Шрифты, SEO-заголовок, SEO-описание, Текст согласия.</p>')}
    ${sec('Документы клана', '3 документа', '<p class="muted">Оферта, Политика конфиденциальности, Согласие на обработку данных.</p>')}
    ${sec('Офферы клана', '2 утверждены, 1 на согласовании', '<p class="muted">Черновик / На согласовании / Утверждён / Отклонён.</p>')}
    ${sec('Условия по уровням', 'вступительный и годовой %', '<p class="muted">Уровень · Вступительный, % · Годовой, % · Бонус клана.</p>')}
  </section>`;

pages.finance = () => `
  <div class="ph"><div><h1>Финансы клана</h1><p>Клан Вектор</p></div></div>
  <div class="tabs" role="group"><button aria-pressed="true">Текущий период</button><button aria-pressed="false">Журнал транзакций</button><button aria-pressed="false">История расчётов</button></div>
  <div class="grid2">
    <section class="card">
      <div class="ch"><h2>Финансы клана</h2><div class="chips"><button class="chip" aria-pressed="false">Этот месяц</button><button class="chip" aria-pressed="false">Прошлый</button><button class="chip" aria-pressed="true">Всё открытое</button></div></div>
      <div class="kv"><span class="k">Оборот клана</span><span class="v num">343 000 ₽</span></div>
      <div class="kv"><span class="k">Положено клану (80%)</span><span class="v num">274 400 ₽</span></div>
      <div class="kv"><span class="k">Положено платформе (20%)</span><span class="v num">68 600 ₽</span></div>
      <div class="kv"><span class="k">Получили вы напрямую</span><span class="v num">214 000 ₽</span></div>
      <div class="kv"><span class="k">Получила платформа за вас</span><span class="v num">129 000 ₽</span></div>
      <div class="kv"><span class="k">Удержано с оплат платформы<small>налог 1%, вывод 1,5%, комиссия платёжки 1,9–2,32%</small></span><span class="v minus num">− 4 800 ₽</span></div>
      <div class="kv"><span class="k">Ручные строки</span><span class="v minus num">− 10 000 ₽</span></div>
      <div class="kv" style="margin-top:6px"><span class="k" style="font-weight:650;color:var(--ink)">Head Office доплатит вам</span><span class="v plus num" style="font-size:18px">45 600 ₽</span></div>
    </section>
    <section class="card">
      <div class="ch"><h2>Ручные строки</h2><button class="btn sm" type="button">${ic('plus')}Добавить строку</button></div>
      <p class="muted" style="margin:0 0 10px;font-size:14px">Долги, которые не оплата клиента: обучение сотрудника, возврат, договорённость.</p>
      <ul class="adj"><li><span>Обучение сотрудника в ПП · 12.11</span><span class="num">− 10 000 ₽</span></li></ul>
      <div style="margin-top:18px"><button class="btn pri" type="button">Закрыть период</button></div>
    </section>
  </div>
  <section class="card">
    <div class="ch"><h2>Журнал транзакций</h2><span class="sub">последние оплаты</span></div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Дата</th><th>Клиент</th><th class="r">Оборот</th><th class="r">Клану</th><th>Куда поступили</th><th>Метод</th></tr></thead><tbody>
      ${[['12.11', 'Олег С.', 9900, 7426, 'Платформа', 'CloudPayments'], ['08.11', 'Марина К.', 12000, 9600, 'Клан', 'Карта Сбер'], ['03.11', 'Дмитрий В.', 100000, 75180, 'Платформа', 'Т-Банк'], ['29.10', 'Алина Р.', 990, 743, 'Платформа', 'СБП']].map(r => `<tr class="row"><td class="muted">${r[0]}</td><td>${r[1]}</td><td class="r num">${rub(r[2])}</td><td class="r num">${rub(r[3])}</td><td><span class="badge ${r[4] === 'Клан' ? 'blue' : ''}">${r[4]}</span></td><td class="muted">${r[5]}</td></tr>`).join('')}
    </tbody></table></div>
  </section>`;

pages.catalog = () => `
  <div class="ph"><div><h1>Каталог счетов</h1><p>Клан Вектор · счета зачисления вашего клана</p></div><div class="acts"><button class="btn pri" type="button">${ic('plus')}Добавить счёт</button></div></div>
  <section class="card">
    <div class="tscroll"><table class="tbl"><thead><tr><th>Название</th><th>Тип</th><th>Валюта</th><th>Статус</th></tr></thead><tbody>
      ${[['Карта Сбер Анны', 'Карта', 'RUB', 'Активен'], ['ИП Миронова · Т-Банк', 'Банковский счёт', 'RUB', 'Активен'], ['Наличные', 'Наличные', 'RUB', 'Архив']].map(r => `<tr class="row"><td style="font-weight:600">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><span class="badge ${r[3] === 'Активен' ? 'ok' : ''}">${r[3]}</span></td></tr>`).join('')}
    </tbody></table></div>
  </section>`;

pages.settings = () => `
  <div class="ph"><div><h1>Настройки клана</h1><p>Клан Вектор</p></div></div>
  <div class="grid2">
    <section class="card"><div class="ch"><h2>Информация о клане</h2></div>${flds([['Название', 'Клан Вектор'], ['Цвет', '#2f7bff']])}<div class="field" style="margin-top:14px"><label>Описание</label><div class="input"><input value="Предприниматели, которые строят свой продукт"></div></div><div style="margin-top:14px"><button class="btn pri sm">Сохранить</button></div></section>
    <section class="card"><div class="ch"><h2>Реферальная ссылка</h2></div><div class="lnk" style="padding:0"><div class="u" style="color:var(--ink)">wearefree.club/r/vektor</div><div class="a"><button class="btn sm">${ic('copy')}Копировать</button></div></div><p class="muted" style="font-size:13px;margin:12px 0 0">Все регистрации по этой ссылке автоматически закрепятся за вашим кланом.</p></section>
  </div>
  <section class="card">
    <div class="ch"><h2>Промокоды клана</h2><button class="btn sm" type="button">${ic('plus')}Создать</button></div>
    <div class="tscroll"><table class="tbl"><thead><tr><th>Код</th><th>Тип</th><th class="r">Использований</th><th class="r">Оплачено</th><th>До</th><th>Статус</th></tr></thead><tbody>
      ${[['VEKTOR10', 'Скидка 10%', 14, 6, '31.12', 'Активен'], ['WEBINAR', 'Скидка $20', 3, 1, '15.11', 'Истёк']].map(r => `<tr class="row"><td style="font-weight:650">${r[0]}</td><td>${r[1]}</td><td class="r num">${r[2]}</td><td class="r num">${r[3]}</td><td class="muted">${r[4]}</td><td><span class="badge ${r[5] === 'Активен' ? 'ok' : ''}">${r[5]}</span></td></tr>`).join('')}
    </tbody></table></div>
  </section>
  <section class="card"><div class="ch"><h2>Банковские реквизиты</h2></div>${flds([['Получатель', 'ИП Миронова А. В.'], ['Банк', 'Т-Банк'], ['IBAN / счёт', '4080 2810 •••• •••• 1234'], ['Комментарий', '']])}<div style="margin-top:14px"><button class="btn pri sm">Сохранить</button></div></section>`;

pages.handbook = () => `
  <div class="ph"><div><h1>Настольная книга</h1><p>Настольная книга директора филиала</p></div></div>
  <section class="card"><div class="book"><h2>Настольная книга директора филиала</h2><p class="muted">Документ открывается здесь на всю высоту страницы. Содержание не меняем.</p></div></section>`;

pages.gone = () => `
  <div class="ph"><div><h1>Убрали из меню</h1><p>Для сверки: что было в старом меню и почему ушло.</p></div></div>
  <section class="card">
    ${[['target', 'Точки А', 'Механизм больше не нужен: первое задание изменилось.'], ['tri', 'Задания ПЭРЛ', 'Больше не нужны.'], ['cal', 'Встречи с клиентами', 'Вынесены в отдельный раздел платформы.'], ['up', 'Привлечение', 'Дублировало другие разделы. Воронка, конверсии страниц и клики по ссылкам переехали в «Аналитику», туда же добавлены расходы и цена клиента.']].map(([i, t, d]) => `
      <div class="kv" style="justify-content:flex-start;gap:14px;align-items:flex-start">${ic(i)}<span class="k"><b style="color:var(--ink)">${t}</b><small style="font-size:13.5px;color:var(--muted)">${d}</small></span></div>`).join('')}
  </section>`;

/* ---------- каркас ---------- */
const root = document.getElementById('root');
function shell() {
  root.innerHTML = `
  <div class="mbar"><button type="button" id="burger" aria-label="Меню">${ic('menu')}</button><span class="t" id="mtitle">Мой клан</span></div>
  <div class="shell">
    <aside class="side" aria-label="Меню клана">
      <div class="brand"><span class="logo">В</span><div><div class="t">Мой клан</div><div class="s">Клан Вектор</div></div></div>
      ${MENU.map(m => m.g ? `<div class="grp">${m.g}</div>` : `<a class="nav${m.gone ? ' gone' : ''}" href="#${m.id}" data-id="${m.id}">${ic(m.i)}<span>${m.t}</span></a>`).join('')}
      <div class="foot"><a class="nav" href="../kabinet/">${ic('home')}<span>Личный кабинет</span></a><a class="nav" href="#">${ic('spark')}<span>Возможности роста</span></a></div>
    </aside>
    <main class="main"><div class="wrap" id="page"></div></main>
  </div>`;
  document.getElementById('burger').onclick = () => document.body.classList.toggle('menu-open');
}
function route() {
  const id = (location.hash.slice(1) || 'dashboard');
  const fn = pages[id] || pages.dashboard;
  document.getElementById('page').innerHTML = fn();
  document.querySelectorAll('.nav[data-id]').forEach(a => a.toggleAttribute('aria-current', false));
  const navId = id === 'new-client' ? 'leads' : id;
  const cur = document.querySelector(`.nav[data-id="${navId}"]:not(.gone)`) || (id === 'gone' && document.querySelector('.nav.gone'));
  if (cur) cur.setAttribute('aria-current', 'page');
  const m = MENU.find(x => x.id === navId);
  document.getElementById('mtitle').textContent = m ? m.t : 'Мой клан';
  document.body.classList.remove('menu-open');
  window.scrollTo(0, 0);
  document.querySelectorAll('.seg.wide').forEach(g => g.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); }));
  document.querySelectorAll('.qcopy').forEach(b => b.addEventListener('click', () => { b.classList.add('done'); b.innerHTML = ic('check'); b.setAttribute('aria-label', 'Скопировано'); setTimeout(() => { b.classList.remove('done'); b.innerHTML = ic('copy'); }, 1500); }));
  document.querySelectorAll('.tabs, .chips').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
  }));
}
shell();
window.route = route;
window.addEventListener('hashchange', route);
route();

document.getElementById('theme').onclick = () => {
  const d = document.documentElement; d.dataset.theme = d.dataset.theme === 'dark' ? '' : 'dark';
};
document.getElementById('notes').onclick = e => {
  document.body.classList.toggle('hide-notes');
  e.target.textContent = document.body.classList.contains('hide-notes') ? 'Показать заметки' : 'Скрыть заметки';
};
})();
