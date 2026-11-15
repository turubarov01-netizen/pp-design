/* Макет «Путь героя»: четыре варианта шкалы жизненного пути поверх маршрутной карты. */
(function () {
  var H = window.HERO;
  (function () { var n = new Date(), t = n.getFullYear() + '-' + ('0' + (n.getMonth() + 1)).slice(-2) + '-' + ('0' + n.getDate()).slice(-2); if (t > H.today && t <= '2026-12-31') H.today = t; })(); /* «Сегодня» — настоящая дата, не раньше дня из демо-данных */
  var MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var MON_S = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  var MON_N = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  var WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  function dt(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function days(a, b) { return Math.round((dt(b) - dt(a)) / 864e5); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var I = {
    flag: '<path d="M5 21V4m0 0h11l-2 4 2 4H5"/>',
    play: '<path d="M8 5v14l11-7z"/>',
    stack: '<path d="M4 7l8-4 8 4-8 4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/>',
    paw: '<circle cx="7" cy="10" r="1.6"/><circle cx="11" cy="6.5" r="1.6"/><circle cx="15.5" cy="7.5" r="1.6"/><circle cx="18" cy="11.5" r="1.6"/><path d="M8.5 17c0-3 2-5.5 4-5.5s4 2.5 4 5c0 2-1.5 2.5-4 2.5s-4-.5-4-2z"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3"/>',
    wheel: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5V12l6 6M12 12l-7.5 3.5"/>',
    feed: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 15l4.5-4 4 3.5L16 11l4 4"/>',
    peak: '<path d="M3 20l6.5-11 4 6 2.5-3.5L21 20z"/><path d="M9.5 9V4l3 1.2-3 1.3"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8-4.3-4.1 5.9-.8z"/>',
    coins: '<ellipse cx="9" cy="7" rx="5.5" ry="2.5"/><path d="M3.5 7v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V7"/><path d="M9.5 16.5c.5 1 2.6 1.9 5 1.9 3 0 5.5-1.1 5.5-2.5v-4c0-1.2-1.8-2.2-4.3-2.4"/>',
    medal: '<circle cx="12" cy="14.5" r="5.5"/><path d="M8.5 9.8L6 3h4l2 4.5L14 3h4l-2.5 6.8"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8m-3 3l2.5 2.5M14 9l2 2"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    ul: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    ol: '<path d="M10 6h10M10 12h10M10 18h10M4 5l1.5-1v5M3.5 14.5c.4-.9 2.6-1 2.6.4 0 1-2.6 2.1-2.6 3.1h2.8"/>',
    quote: '<path d="M7 7h4v5c0 2.5-1.5 4-4 5M15 7h4v5c0 2.5-1.5 4-4 5"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    rec: '<circle cx="12" cy="12" r="8.5"/><path d="M10 8.5v7l6-3.5z"/>',
  };
  function ico(k, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + I[k] + '</svg>'; }

  /* Тип события: цвет, значок, дорога (route — маршрут, life — жизнь), подпись фильтра */
  var T = {
    start: { c: 'blue', i: 'flag', road: 'route', f: 'route' },
    lesson: { c: 'blue', i: 'play', road: 'route', f: 'route' },
    lessons: { c: 'blue', i: 'stack', road: 'route', f: 'route' },
    stage: { c: 'violet', i: 'peak', road: 'route', f: 'route' },
    zver: { c: 'orange', i: 'paw', road: 'life', f: 'money' },
    money: { c: 'green', i: 'coins', road: 'life', f: 'money' },
    buy: { c: 'violet', i: 'key', road: 'life', f: 'route' },
    meet: { c: 'indigo', i: 'video', road: 'life', f: 'life' },
    wheel: { c: 'teal', i: 'wheel', road: 'life', f: 'life' },
    post: { c: 'slate', i: 'feed', road: 'life', f: 'life' },
    dream: { c: 'rose', i: 'star', road: 'life', f: 'life' },
    badge: { c: 'amber', i: 'medal', road: 'life', f: 'life' },
  };
  function stars(n) {
    if (n == null) return '';
    return '<span class="stars" aria-label="' + n + ' из 5"><b>★</b> ' + String(n).replace('.', ',') + '</span>';
  }
  function dShort(s) { var d = dt(s); return d.getDate() + ' ' + MON_S[d.getMonth()]; }
  function dLong(s) { var d = dt(s); return d.getDate() + ' ' + MON[d.getMonth()]; }
  function subOf(e) {
    if (e.t === 'lesson') return 'Шаг ' + e.n + ' сдан';
    if (e.t === 'lessons') return 'Шаги ' + e.from + '–' + e.to + ' сданы';
    return e.sub || '';
  }
  var dayN = days(H.start, H.today);
  var lessonsDone = H.past.reduce(function (a, e) { return a + (e.t === 'lesson' ? 1 : e.t === 'lessons' ? e.to - e.from + 1 : 0); }, 0);
  var stagesDone = H.past.filter(function (e) { return e.t === 'stage'; }).length;

  function head(title, note) {
    return '<header class="ph"><div class="ava">О</div><div class="ph-t"><b>' + title + '</b><span>' + note + '</span></div></header>';
  }
  function summaryLine() {
    return '<p class="sumline num">' + dayN + '-й день на маршруте · ' + lessonsDone + ' ' + plural(lessonsDone, 'урок', 'урока', 'уроков') + ' · ' + stagesDone + ' ' + plural(stagesDone, 'этап', 'этапа', 'этапов') + ' закрыто · этап ' + H.stage + '</p>';
  }
  function chips(active) {
    var list = [['all', 'Всё'], ['route', 'Маршрут'], ['money', 'Деньги'], ['life', 'Жизнь']];
    return '<div class="chips" role="tablist">' + list.map(function (c) {
      return '<button class="chip' + (c[0] === active ? ' on' : '') + '" data-f="' + c[0] + '">' + c[1] + '</button>';
    }).join('') + '</div>';
  }
  function photo(e, cls) { return e.img ? '<img class="' + (cls || 'ph-img') + '" src="' + e.img + '" alt="">' : ''; }
  function nowCard() {
    return '<div class="now"><div class="now-k">Шаг ' + H.now.n + ' · открыт сейчас</div><div class="now-t">' + esc(H.now.title) +
      '</div><div class="now-r"><span class="pill">Урок №' + H.now.lib + '</span><button class="btn">Смотреть</button></div></div>';
  }
  function todayBar(extra) {
    return '<div class="today"><span class="today-dot"></span><b>Сегодня, ' + dLong(H.today) + '</b>' + (extra || '') + '</div>';
  }

  /* ───────── A. Повестка: линия слева, даты справа, месяцы заголовками ───────── */
  function vA() {
    var out = [head(H.name, 'Путь героя · с ' + dLong(H.start) + ' 2026'), summaryLine(), chips('all')];
    var curM = -1;
    out.push('<ol class="ag">');
    H.past.forEach(function (e) {
      var d = dt(e.d), m = d.getMonth(), t = T[e.t];
      if (m !== curM) { curM = m; out.push('<li class="ag-m" data-f="all"><span>' + MON_N[m] + '</span> 2026</li>'); }
      out.push('<li class="ag-i ' + (e.big ? 'big ' : '') + 'c-' + t.c + '" data-f="' + t.f + '">' +
        '<span class="ag-n">' + ico(t.i) + '</span>' +
        '<div class="ag-b">' + photo(e) + '<div class="ag-tt">' + esc(e.title) + '</div><div class="ag-s">' + esc(subOf(e)) + (e.stars ? ' ' + stars(e.stars) : '') +
        (e.me ? ' <span class="tag">вас разбирали</span>' : '') + '</div></div>' +
        '<time class="ag-d"><b>' + d.getDate() + '</b><span>' + MON_S[m] + ', ' + WD[d.getDay()] + '</span></time></li>');
    });
    out.push('<li class="ag-today">' + todayBar('<span class="mut">· шаг ' + H.now.n + '</span>') + '</li>');
    out.push('<li class="ag-i fut cur c-blue"><span class="ag-n">' + ico('play') + '</span><div class="ag-b">' + nowCard() + '</div><span class="ag-d"></span></li>');
    H.next.forEach(function (s) {
      out.push('<li class="ag-i fut"><span class="ag-n lock">' + ico('lock') + '</span><div class="ag-b"><div class="ag-tt">' + esc(s.title) + '</div><div class="ag-s">Шаг ' + s.n + ' · после задания шага ' + (s.n - 1) + '</div></div><span class="ag-d"></span></li>');
    });
    out.push('<li class="ag-i fut goal c-violet"><span class="ag-n">' + ico('target') + '</span><div class="ag-b"><div class="ag-tt">' + esc(H.goal.title) + '</div><div class="ag-s">Вершина этапа ' + H.goal.stage + ' «' + H.stageName + '»</div></div><span class="ag-d"></span></li>');
    H.later.forEach(function (s) {
      out.push('<li class="ag-i fut far"><span class="ag-n lock">' + ico('lock') + '</span><div class="ag-b"><div class="ag-tt">Этап ' + s.stage + ' · ' + esc(s.title) + '</div></div><span class="ag-d"></span></li>');
    });
    out.push('</ol>');
    return out.join('');
  }

  /* ───────── B. Две дороги: слева настоящая маршрутная карта по этапам, справа жизнь точками на линии; открывается на сегодня ───────── */
  var R = window.ROUTE, NOW_T = 'Воронка и замер показателей';
  var ACT = { lesson: 1, post: 1, meet: 1, stage: 1 };
  function cov(k) { return '<img src="covers/' + k + '.webp" alt="">'; }
  function cardTw(e) {
    var t = T[e.t], hero = e.big && !e.img, tile = '<span class="tw-ic">' + ico(t.i) + '</span>', act = ACT[e.t];
    return '<div class="tw-c c-' + t.c + (hero ? ' hero' : '') + (e.img ? ' pic' : '') + (act ? ' act" tabindex="0" role="button' : '') + '">' + (e.img ? photo(e, 'tw-img') : '') +
      '<div class="tw-row">' + tile + '<div class="tw-tx"><b>' + esc(e.title) + '</b>' +
      '<span class="tw-s">' + (e.d ? '<time>' + dShort(e.d) + '</time> · ' : '') + esc(subOf(e)) + (e.me ? ' <span class="tag">вас разбирали</span>' : '') + '</span>' +
      (e.t === 'post' ? '<span class="tw-lk">Открыть в ленте ›</span>' : e.t === 'meet' ? '<span class="tw-lk">Смотреть запись ›</span>' : '') + '</div>' +
      (act && e.t !== 'post' && e.t !== 'meet' ? '<span class="tw-go">' + ico('chev') + '</span>' : '') + '</div></div>';
  }
  /* Спидометр как на платформе: прогноз дохода на год и доля цели уровня */
  function gaugeTw() {
    var F = H.fin, pct = Math.min(1, F.year / F.lv[F.cur].v), cx = 60, cy = 58;
    function pt(f) { var a = Math.PI * (1 - f); return (cx + 46 * Math.cos(a)).toFixed(1) + ' ' + (cy - 46 * Math.sin(a)).toFixed(1); }
    var nd = Math.PI * (1 - pct), nx = (cx + 34 * Math.cos(nd)).toFixed(1), ny = (cy - 34 * Math.sin(nd)).toFixed(1);
    var svg = '<svg class="gg-svg" viewBox="0 0 120 66" aria-hidden="true"><path d="M' + pt(0) + ' A46 46 0 0 1 ' + pt(1) + '" class="gg-bg"/>' +
      '<path d="M' + pt(0) + ' A46 46 0 0 1 ' + pt(pct) + '" class="gg-fg"/>' +
      '<line x1="60" y1="58" x2="' + nx + '" y2="' + ny + '" class="gg-nd"/><circle cx="60" cy="58" r="4.5" class="gg-hub"/></svg>';
    return '<div class="tw-gg"><div class="gg-top">' + svg + '<div class="gg-tx"><b>' + money(F.year) + '</b><span>прогноз на год</span>' +
      '<span class="gg-p"><i>' + Math.round(pct * 100) + '%</i> цели уровня</span></div></div>' +
      '<div class="gg-lv">' + F.lv.map(function (l, i) { return '<span class="' + (i === F.cur ? 'on' : i < F.cur ? 'ok' : '') + '"><b>' + esc(l.n) + '</b>' + l.s + '</span>'; }).join('') + '</div></div>';
  }
  function money(n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function statTw(n, suf, label) {
    return '<div class="tw-k"><b class="num" data-n="' + n + '" data-s="' + suf + '">' + n + suf + '</b><span>' + label + '</span></div>';
  }
  function addDays(s, n) { var d = dt(s); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  /* Демо-прохождение Ольги: уроки сданы по порядку этапа, даты разложены внутри окна этапа */
  var WIN = { start: ['2026-03-17', '2026-04-05'], '1.1': ['2026-04-06', '2026-04-30'], '1.2': ['2026-05-05', '2026-09-10'], '1.3': ['2026-09-16', '2026-11-13'] };
  function routeItems() {
    var all = R.items.map(function (x, i) { return { st: x[0], g: x[1], title: x[2], min: x[3], cv: x[4], i: i }; });
    var nowI = all.filter(function (x) { return x.title === NOW_T; })[0].i;
    R.stages.forEach(function (s) {
      var done = all.filter(function (x) { return x.st === s.id && x.i < nowI; }), w = WIN[s.id], span = days(w[0], w[1]);
      done.forEach(function (x, k) { x.d = addDays(w[0], Math.round(span * k / Math.max(1, done.length - 1))); x.stars = [5, 4, 5, 5, 4, 5, 4.5][x.i % 7]; });
    });
    all.forEach(function (x) { x.near = Math.abs(x.i - nowI) <= 8; x.state = x.i < nowI ? 'done' : x.i === nowI ? 'now' : x.i === nowI + 1 ? 'next' : 'lock'; });
    return all;
  }
  function lessonTw(x) {
    var meta = x.state === 'done' ? '<time>' + dShort(x.d) + '</time>' + (x.min ? ' · ' + x.min + ' мин' : '') : x.state === 'next' ? 'Следующий · откроется после текущего' : (x.min ? x.min + ' мин' : 'Урок маршрута');
    return '<div class="tw-r route"><div class="tw-c ls ' + x.state + (x.state === 'lock' ? '' : ' act" tabindex="0" role="button') + '"><div class="tw-row">' +
      '<span class="ls-cv">' + (x.cv ? '<img' + (x.near ? '' : ' loading="lazy"') + ' src="' + x.cv + '" alt="">' : '') + (x.state === 'done' ? '<i class="ls-ok">' + ico('check') + '</i>' : x.state === 'lock' ? '<i class="ls-lk">' + ico('lock') + '</i>' : '') + '</span>' +
      '<div class="tw-tx"><b>' + esc(x.title) + '</b><span class="tw-s">' + meta + '</span></div>' +
      (x.state === 'done' ? '<span class="tw-st">' + stars(x.stars) + '</span>' : '') + '</div></div></div>';
  }
  function lifeTw(e) { return '<div class="tw-r life"><span class="tw-pin c-' + T[e.t].c + '"></span>' + cardTw(e) + '</div>'; }
  function stageHead(s, list, state) {
    var n = list.length, d = list.filter(function (x) { return x.state === 'done'; }).length, cl = H.past.filter(function (e) { return e.t === 'stage' && e.title.indexOf(s.id + ' ') > 0; })[0];
    var note = s.id === 'start' ? n + ' ' + plural(n, 'урок', 'урока', 'уроков') + ' · вводное видео и клятва' :
      state === 'done' ? n + ' ' + plural(n, 'урок', 'урока', 'уроков') + (cl ? ' · закрыт ' + dShort(cl.d) : '') : d + ' из ' + n + ' уроков сдано';
    return '<div class="rs-h ' + state + '" id="st' + s.id.replace('.', '-') + '"><span class="rs-n">' + (s.id === 'start' ? ico('flag') : s.id) + '</span>' +
      '<div class="rs-t"><b>' + (s.id === 'start' ? 'Старт' : 'Этап ' + s.id + ' · ' + esc(s.name)) + '</b><span>' + note + '</span>' +
      '<i class="rs-bar"><i style="width:' + Math.round(d / n * 100) + '%"></i></i></div>' +
      '<span class="rs-pill">' + (state === 'done' ? 'Пройден' : 'Сейчас') + '</span></div>';
  }
  function vB() {
    var items = routeItems(), life = H.past.filter(function (e) { return T[e.t].road === 'life'; });
    var done = items.filter(function (x) { return x.state === 'done'; }).length;
    var out = [head(H.name, 'Маршрут и жизнь на одной линии'),
      '<div class="tw-h"><div class="tw-roads"><span class="r"><i></i><b>Маршрут</b><small>этапы и уроки</small></span><span class="l"><b>Жизнь</b><i></i><small>деньги, мечты, разборы</small></span></div>' +
      '<nav class="tw-rail" aria-label="Этапы маршрута">' + R.stages.map(function (s) {
        return '<button class="tw-rb" data-go="st' + s.id.replace('.', '-') + '">' + (s.id === 'start' ? 'Старт' : s.id + ' ' + s.name) + '</button>';
      }).join('') + '<button class="tw-rb now" data-go="today">Сегодня</button></nav></div>', '<div class="tw tw-past">'];
    var li = 0;
    R.stages.forEach(function (s) {
      var list = items.filter(function (x) { return x.st === s.id; }), past = list.filter(function (x) { return x.state === 'done'; });
      var state = past.length === list.length ? 'done' : 'cur';
      out.push('<section class="rs ' + state + '" id="st' + s.id.replace('.', '-') + '">' + stageHead(s, list, state));
      if (s.id === 'start') out.push('<div class="tw-r full">' + cardTw(H.past[0]) + '</div>');
      var g = -1;
      past.forEach(function (x) {
        while (li < life.length && life[li].d <= x.d) out.push(lifeTw(life[li++]));
        if (x.g !== g) { g = x.g; out.push('<div class="tw-g">' + esc(R.groups[s.id + '|' + g]) + '</div>'); }
        out.push(lessonTw(x));
      });
      var cl = H.past.filter(function (e) { return e.t === 'stage' && e.title.indexOf(s.id + ' ') > 0; })[0];
      if (cl) {
        while (li < life.length && life[li].d <= cl.d) out.push(lifeTw(life[li++]));
        out.push('<div class="tw-r full peak">' + cardTw(cl) + '</div>');
      }
      if (state === 'cur') {
        while (li < life.length) out.push(lifeTw(life[li++]));
        var fut = list.filter(function (x) { return x.state !== 'done'; }), now = fut[0];
        out.push('<div class="tw-today" id="today">' + todayBar() + '</div>');
        out.push('<div class="tw-stats">' + statTw(dayN, '-й', 'день<br>на маршруте') + statTw(done, '', plural(done, 'урок<br>сдан', 'урока<br>сдано', 'уроков<br>сдано')) +
          statTw(stagesDone, '', plural(stagesDone, 'этап<br>закрыт', 'этапа<br>закрыто', 'этапов<br>закрыто')) + '<div class="tw-k"><b class="num">' + H.stage + '</b><span>этап<br>сейчас</span></div></div>');
        out.push(gaugeTw());
        out.push('<div class="tw-r route wide"><div class="tw-c nowc"><div class="tw-row"><span class="ls-cv big">' + (now.cv ? '<img src="' + now.cv + '" alt="">' : '') + '</span>' +
          '<div class="tw-tx"><span class="now-k">Урок сейчас · ' + esc(R.groups[s.id + '|' + now.g]) + '</span><b>' + esc(now.title) + '</b>' +
          '<span class="tw-s">Управлять можно только тем, что можешь замерить. Как отделить мнения о своём бизнесе от фактов, внедрить замер…</span></div></div>' +
          '<div class="now-r"><span class="pill">' + now.min + ' мин · задание после урока</span><button class="btn">Смотреть</button></div></div></div>');
        out.push('<div class="tw-r life"><span class="tw-pin c-orange"></span><div class="tw-ghost" tabindex="0" role="button"><span class="gh-plus">' + ico('plus') + '</span><b>Сохранить событие</b><span class="tw-s">Пост уйдёт в ленту и встанет на линию</span></div></div>');
        out.push('<div class="tw-d"><time>Дальше по этапу ' + s.id + '</time></div>');
        g = now.g;
        fut.slice(1).forEach(function (x) {
          if (x.g !== g) { g = x.g; out.push('<div class="tw-g">' + esc(R.groups[s.id + '|' + g]) + '</div>'); }
          out.push(lessonTw(x));
        });
        out.push('<div class="tw-r full"><div class="tw-c goal c-violet"><div class="tw-row"><span class="tw-ic">' + ico('target') + '</span><div class="tw-tx"><b>' + esc(H.goal.title) + '</b><span class="tw-s">Чекпоинт: закрывает этап ' + s.id + ' и уровень 1</span></div></div></div></div>');
      }
      out.push('</section>');
    });
    out.push('</div><div class="tw-later"><div class="tw-d"><time>Уровень 2 · Scaling — закрыт</time></div>');
    R.later.forEach(function (s) {
      out.push('<div class="rs-h lock"><span class="rs-n">' + s.id + '</span><div class="rs-t"><b>Этап ' + s.id + ' · ' + esc(s.name) + '</b><span>' + s.n + ' ' + plural(s.n, 'урок', 'урока', 'уроков') + ' · откроется после уровня 1</span></div><span class="rs-pill">' + ico('lock') + '</span></div>');
    });
    out.push('</div>');
    out.push('<div class="tw-fab"><button class="tw-fb back" hidden>' + ico('down') + 'Сегодня</button><button class="tw-fb add">' + ico('plus') + 'Событие</button></div>');
    /* Композер ленты. Из маршрутной карты открывается с галочкой, в самой ленте галочка снята */
    out.push('<div class="cmp" hidden><div class="cmp-bg"></div><form class="cmp-sh" role="dialog" aria-modal="true" aria-labelledby="cmp-h">' +
      '<div class="cmp-top"><b id="cmp-h">Новый пост</b><button type="button" class="cmp-x" aria-label="Закрыть">' + ico('close') + '</button></div>' +
      '<div class="cmp-ed"><div class="cmp-tb" role="toolbar" aria-label="Форматирование">' +
        '<button type="button" data-c="bold" title="Жирный (Ctrl+B)" aria-label="Жирный"><b>B</b></button>' +
        '<button type="button" data-c="italic" title="Курсив (Ctrl+I)" aria-label="Курсив"><i>I</i></button>' +
        '<button type="button" data-c="underline" title="Подчёркнутый (Ctrl+U)" aria-label="Подчёркнутый"><u>U</u></button><span class="cmp-sep"></span>' +
        '<button type="button" data-c="insertUnorderedList" title="Маркированный список" aria-label="Маркированный список">' + ico('ul') + '</button>' +
        '<button type="button" data-c="insertOrderedList" title="Нумерованный список" aria-label="Нумерованный список">' + ico('ol') + '</button>' +
        '<button type="button" data-c="formatBlock:blockquote" title="Цитата" aria-label="Цитата">' + ico('quote') + '</button>' +
        '<button type="button" data-c="formatBlock:h2" title="Заголовок" aria-label="Заголовок"><b>H</b></button></div>' +
        '<div class="cmp-tx" id="cmp-t" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Текст поста" data-ph="Что у вас нового?"></div></div>' +
      '<div class="cmp-ims"></div>' +
      '<div class="cmp-tags"><div class="cmp-tg"></div><input type="text" class="cmp-ti" placeholder="Теги (до 5), Enter — добавить" aria-label="Теги"></div>' +
      '<label class="cmp-ck"><input type="checkbox" id="cmp-c"><span class="cmp-box">' + ico('check') + '</span><span class="cmp-ct"><b>Зафиксировать в маршрутной карте</b><span>Пост встанет на линию «Путь героя». Без галочки он будет только в ленте</span></span></label>' +
      '<div class="cmp-act"><input type="file" class="cmp-file" accept="image/*" multiple hidden><button type="button" class="cmp-ph">' + ico('feed') + '<span>Фото (0/4)</span></button>' +
      '<button type="submit" class="btn cmp-go" disabled>Опубликовать</button></div>' +
      '<p class="cmp-hint">Вставляйте изображения прямо из буфера обмена (Ctrl+V)</p></form></div>');
    out.push('<div class="cmp-toast" role="status" aria-live="polite"></div>');
    return out.join('');
  }
  function initB() {
    var root = document.querySelector('.v-b'), hd = root.querySelector('.tw-h'), rail = root.querySelector('.tw-rail');
    var today = document.getElementById('today'), back = root.querySelector('.tw-fb.back'), ghost = root.querySelector('.tw-ghost');
    var RM = matchMedia('(prefers-reduced-motion: reduce)').matches, moved = false, act = '';
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    function hh() { return (parseFloat(getComputedStyle(hd).top) || 0) + hd.offsetHeight; }
    function stuck() { return hh() + 66; }
    function setHH() { root.style.setProperty('--hh', hh() + 'px'); }
    setHH(); addEventListener('resize', setHH);
    function go(el, smooth, off) {
      var y = el.getBoundingClientRect().top + scrollY - (off != null ? off : stuck() + 12);
      scrollTo({ top: Math.max(0, y), behavior: smooth && !RM ? 'smooth' : 'auto' });
    }
    function toToday(smooth) { go(today, smooth, Math.max(stuck() + 24, innerHeight * .3)); }
    function sync() {
      var line = stuck() + 40, cur = '', tr = today.getBoundingClientRect();
      root.querySelectorAll('.tw-past > .rs').forEach(function (m) { if (!cur || m.getBoundingClientRect().top <= line) cur = m.id; });
      if (tr.top < innerHeight * .7) cur = 'today';
      if (cur !== act) {
        act = cur;
        rail.querySelectorAll('.tw-rb').forEach(function (b) {
          var on = b.dataset.go === cur; b.classList.toggle('on', on);
          if (on) { b.setAttribute('aria-current', 'true'); rail.scrollTo({ left: b.offsetLeft - rail.clientWidth / 2 + b.offsetWidth / 2, behavior: RM ? 'auto' : 'smooth' }); } else b.removeAttribute('aria-current');
        });
      }
      back.hidden = tr.top < innerHeight && tr.bottom > stuck();
    }
    var tick = false;
    addEventListener('scroll', function () { moved = true; if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; sync(); }); } }, { passive: true });
    addEventListener('resize', sync);
    rail.addEventListener('click', function (ev) {
      var b = ev.target.closest('.tw-rb'); if (!b) return;
      if (b.dataset.go === 'today') toToday(true); else go(document.getElementById(b.dataset.go), true, hh() + 6);
    });
    back.addEventListener('click', function () { toToday(true); });
    var cmp = root.querySelector('.cmp'), cmpT = cmp.querySelector('.cmp-tx'), cmpC = cmp.querySelector('#cmp-c'), toast = root.querySelector('.cmp-toast'), opener = null, tt;
    var ims = [], tags = [], imBox = cmp.querySelector('.cmp-ims'), phBtn = cmp.querySelector('.cmp-ph'), file = cmp.querySelector('.cmp-file'), go = cmp.querySelector('.cmp-go'), tgBox = cmp.querySelector('.cmp-tg'), ti = cmp.querySelector('.cmp-ti');
    function drawIms() {
      imBox.innerHTML = ims.map(function (u, i) { return '<div class="cmp-im"><img src="' + u + '" alt=""><button type="button" data-i="' + i + '" aria-label="Убрать фото">' + ico('close') + '</button></div>'; }).join('');
      phBtn.querySelector('span').textContent = 'Фото (' + ims.length + '/4)'; phBtn.disabled = ims.length >= 4;
    }
    function addIm(f) { if (!f || !/^image\//.test(f.type)) return; if (ims.length >= 4) { say('Максимум 4 изображения'); return; } ims.push(URL.createObjectURL(f)); drawIms(); }
    function drawTags() { tgBox.innerHTML = tags.map(function (t, i) { return '<span class="cmp-chip">#' + esc(t) + '<button type="button" data-i="' + i + '" aria-label="Убрать тег">' + ico('close') + '</button></span>'; }).join(''); ti.hidden = tags.length >= 5; }
    function txt() { return cmpT.innerText.replace(/ /g, ' ').trim(); }
    function sync() { go.disabled = !txt(); cmpT.classList.toggle('empty', !cmpT.textContent.trim() && !cmpT.querySelector('li,img')); }
    function openCmp(fromMap, src) {
      opener = src; cmpC.checked = fromMap; cmpT.innerHTML = ''; ims = []; tags = []; drawIms(); drawTags(); sync(); cmp.hidden = false;
      requestAnimationFrame(function () { cmp.classList.add('on'); setTimeout(function () { cmpT.focus(); }, 260); });
    }
    function closeCmp() { cmp.classList.remove('on'); setTimeout(function () { cmp.hidden = true; }, 220); if (opener) opener.focus(); }
    function say(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('on'); }, 2600); }
    cmp.querySelector('.cmp-tb').addEventListener('mousedown', function (ev) { ev.preventDefault(); });
    cmp.querySelector('.cmp-tb').addEventListener('click', function (ev) {
      var bt = ev.target.closest('button'); if (!bt) return; cmpT.focus();
      var c = bt.dataset.c.split(':');
      if (c[0] === 'formatBlock') { var cur = (document.queryCommandValue('formatBlock') || '').toLowerCase(); document.execCommand('formatBlock', false, cur === c[1] ? '<p>' : '<' + c[1] + '>'); }
      else document.execCommand(c[0], false, null);
      sync();
    });
    cmpT.addEventListener('input', sync);
    cmpT.addEventListener('paste', function (ev) {
      var dt = ev.clipboardData; if (!dt) return;
      var got = false; [].forEach.call(dt.items || [], function (it) { if (it.kind === 'file' && /^image\//.test(it.type)) { addIm(it.getAsFile()); got = true; } });
      ev.preventDefault();
      if (!got) document.execCommand('insertText', false, dt.getData('text/plain'));
      sync();
    });
    phBtn.addEventListener('click', function () { file.click(); });
    file.addEventListener('change', function () { [].slice.call(file.files, 0, 4 - ims.length).forEach(addIm); file.value = ''; });
    imBox.addEventListener('click', function (ev) { var bt = ev.target.closest('button'); if (!bt) return; ims.splice(+bt.dataset.i, 1); drawIms(); });
    ti.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' && ev.key !== ',') return; ev.preventDefault();
      var v = ti.value.replace(/^#/, '').trim(); if (v && tags.length < 5 && tags.indexOf(v) < 0) { tags.push(v); drawTags(); } ti.value = '';
    });
    tgBox.addEventListener('click', function (ev) { var bt = ev.target.closest('button'); if (!bt) return; tags.splice(+bt.dataset.i, 1); drawTags(); });
    ghost.addEventListener('click', function () { openCmp(true, ghost); });
    root.querySelector('.tw-fb.add').addEventListener('click', function () { openCmp(true, this); });
    cmp.querySelector('.cmp-bg').addEventListener('click', closeCmp);
    cmp.querySelector('.cmp-x').addEventListener('click', closeCmp);
    cmp.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeCmp(); });
    cmp.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var t = txt(); if (!t) return; var onMap = cmpC.checked, first = t.split('\n')[0], img = ims[0];
      closeCmp();
      if (onMap) {
        var w = document.createElement('div');
        w.innerHTML = lifeTw({ d: H.today, t: 'post', title: first.length > 80 ? first.slice(0, 79) + '…' : first, sub: 'Пост из ленты', img: img });
        var el = w.firstChild; el.classList.add('fresh');
        ghost.parentNode.parentNode.insertBefore(el, ghost.parentNode);
        if (window.nbspRu) window.nbspRu.fix(el);
        say('Опубликовано в ленте и добавлено на маршрутную карту');
      } else say('Опубликовано в ленте. На маршрутную карту не попало');
    });
    root.querySelectorAll('[role=button]').forEach(function (el) {
      el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.click(); } });
    });
    if (location.hash !== '#top') {
      toToday(false);
      if (document.fonts) document.fonts.ready.then(function () { if (!moved) toToday(false); sync(); });
    }
    moved = false; sync();
    /* Оживление: появление карточек при прокрутке вверх и счёт цифр «сегодня» */
    if (RM) return;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (list) {
        var k = 0;
        list.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.style.transitionDelay = (k++ * 45) + 'ms';
          en.target.classList.add('in'); io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -6% 0px' });
      root.querySelectorAll('.tw-past .tw-r').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) { el.classList.add('rv'); io.observe(el); }
      });
    }
    root.querySelectorAll('.tw-k b[data-n]').forEach(function (b) {
      var n = +b.dataset.n, suf = b.dataset.s, t0 = performance.now();
      (function f(t) {
        var p = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - p, 3);
        b.textContent = Math.round(n * e) + suf;
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    });
  }

  /* ───────── C. Карта похода: этапы как участки пути, достижения как медали на тропе ───────── */
  function stagesOf() {
    var st = [
      { k: '1.1', name: 'Выбор ниши', from: H.start, to: '2026-05-03', ev: [] },
      { k: '1.2', name: 'Тест ниши', from: '2026-05-03', to: '2026-09-14', ev: [] },
      { k: '1.3', name: 'Рабочая связка', from: '2026-09-14', to: null, ev: [] },
    ];
    H.past.forEach(function (e) {
      var s = st.filter(function (x) { return e.d >= x.from && (!x.to || e.d < x.to || (e.t === 'stage' && e.d === x.to)); })[0] || st[0];
      s.ev.push(e);
    });
    return st;
  }
  function vC() {
    var out = [head(H.name, 'Карта похода · ' + dayN + '-й день'), '<div class="hk" id="hk">'];
    stagesOf().forEach(function (s, si) {
      var dur = s.to ? days(s.from, s.to) + ' дней' : 'идёт ' + days(s.from, H.today) + ' дней';
      out.push('<section class="hk-s s' + si + '"><div class="hk-sh"><span class="hk-k">' + s.k + '</span><div><b>' + s.name + '</b><span>' + dShort(s.from) + (s.to ? ' → ' + dShort(s.to) : ' → сегодня') + ' · ' + dur + '</span></div></div><div class="hk-p">');
      s.ev.forEach(function (e) {
        var t = T[e.t];
        var small = e.t === 'lesson' || e.t === 'lessons' || e.t === 'wheel';
        out.push('<div class="hk-n ' + (small ? 'sm ' : '') + (e.t === 'stage' ? 'summit ' : '') + 'c-' + t.c + '">' +
          '<span class="hk-m">' + (e.img ? '<img src="' + e.img + '" alt="">' : ico(t.i)) + '</span>' +
          '<span class="hk-l"><b>' + esc(e.t === 'lessons' ? (e.to - e.from + 1) + ' уроков' : e.title) + '</b><time>' + dShort(e.d) + '</time></span></div>');
      });
      if (!s.to) {
        out.push('<div class="hk-n here c-blue"><span class="hk-m"><img src="../marshrut-v2/img/frimi-focus-flag.webp" alt=""></span><span class="hk-l"><b>Вы здесь · шаг ' + H.now.n + '</b><time>сегодня</time></span></div>');
        out.push('<div class="hk-n fog c-violet"><span class="hk-m">' + ico('target') + '</span><span class="hk-l"><b>Вершина: $36 000 в год</b><time>экзамен</time></span></div>');
      }
      out.push('</div></section>');
    });
    out.push('<section class="hk-s fogzone"><div class="hk-sh"><span class="hk-k">2</span><div><b>Scaling</b><span>Откроется после вершины 1.3</span></div></div><div class="hk-fog">' +
      H.later.map(function (s) { return '<span>' + s.stage + ' · ' + s.title + '</span>'; }).join('') + '</div></section>');
    out.push('</div>');
    return out.join('');
  }
  function drawTrail() {
    var root = document.getElementById('hk'); if (!root) return;
    root.querySelectorAll('.hk-p').forEach(function (p) {
      var old = p.querySelector('svg.trail'); if (old) old.remove();
      var nodes = p.querySelectorAll('.hk-n'); if (!nodes.length) return;
      var w = p.clientWidth, h = p.scrollHeight, pts = [];
      nodes.forEach(function (n) { var m = n.querySelector('.hk-m'); pts.push([m.offsetLeft + n.offsetLeft + m.offsetWidth / 2, n.offsetTop + m.offsetTop + m.offsetHeight / 2, n.classList.contains('fog')]); });
      var d = 'M' + pts[0][0] + ' 0 L' + pts[0][0] + ' ' + pts[0][1], dFog = '';
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i], my = (a[1] + b[1]) / 2;
        var seg = ' C' + a[0] + ' ' + my + ' ' + b[0] + ' ' + my + ' ' + b[0] + ' ' + b[1];
        if (b[2]) dFog += 'M' + a[0] + ' ' + a[1] + seg; else d += seg;
      }
      var last = pts[pts.length - 1];
      if (!last[2]) d += ' L' + last[0] + ' ' + h;
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'trail'); svg.setAttribute('width', w); svg.setAttribute('height', h);
      svg.innerHTML = '<path class="tr-bg" d="' + d + '"/><path class="tr" d="' + d + '"/>' + (dFog ? '<path class="tr-fog" d="' + dFog + '"/>' : '');
      p.insertBefore(svg, p.firstChild);
    });
  }

  /* ───────── D. Архив по месяцам: полоса-перемотка сверху, месяц как глава ───────── */
  function vD() {
    var months = {};
    H.past.forEach(function (e) { var m = dt(e.d).getMonth(); (months[m] = months[m] || []).push(e); });
    var keys = []; for (var m = dt(H.start).getMonth(); m <= dt(H.today).getMonth(); m++) keys.push(m);
    var out = [head(H.name, 'Архив пути · ' + dayN + ' дней'), summaryLine()];
    out.push('<nav class="sc" aria-label="Перемотка по месяцам">' + keys.map(function (m) {
      var ev = months[m] || [], cur = m === dt(H.today).getMonth();
      return '<a class="sc-m' + (cur ? ' on' : '') + '" href="#m' + m + '"><span class="sc-d">' + ev.filter(function (e) { return e.t !== 'lesson'; }).map(function (e) {
        return '<i class="c-' + T[e.t].c + (e.big ? ' big' : '') + '"></i>';
      }).join('') + '</span><b>' + MON_S[m] + '</b></a>';
    }).join('') + '</nav>');
    out.push('<div class="otd"><span class="otd-k">' + ico('rec') + '7 месяцев назад, 14 апреля</span><p>Ольга сдавала шаги этапа «Выбор ниши» и через 2 недели накормила зверька на «Отлично».</p></div>');
    keys.slice().reverse().forEach(function (m) {
      var ev = months[m] || [];
      var lessons = ev.filter(function (e) { return e.t === 'lesson' || e.t === 'lessons'; });
      var nL = lessons.reduce(function (a, e) { return a + (e.t === 'lesson' ? 1 : e.to - e.from + 1); }, 0);
      var rest = ev.filter(function (e) { return e.t !== 'lesson' && e.t !== 'lessons'; });
      var pics = ev.filter(function (e) { return e.img; });
      var cur = m === dt(H.today).getMonth();
      out.push('<section class="ch" id="m' + m + '"><div class="ch-h"><b>' + MON_N[m] + '</b><span>' + (nL ? nL + ' ' + plural(nL, 'урок', 'урока', 'уроков') : '') + (nL && rest.length ? ' · ' : '') + (rest.length ? rest.length + ' ' + plural(rest.length, 'событие', 'события', 'событий') : '') + '</span></div>');
      if (cur) out.push('<div class="ch-now">' + todayBar() + nowCard() + '</div>');
      if (pics.length) out.push('<div class="ch-pics">' + pics.map(function (e) { return '<figure><img src="' + e.img + '" alt=""><figcaption>' + esc(e.title) + '</figcaption></figure>'; }).join('') + '</div>');
      out.push('<ul class="ch-l">');
      rest.slice().reverse().forEach(function (e) {
        var t = T[e.t];
        out.push('<li class="c-' + t.c + (e.big ? ' big' : '') + '"><span class="ch-i">' + ico(t.i) + '</span><div><b>' + esc(e.title) + '</b><span>' + esc(subOf(e)) + '</span></div><time>' + dt(e.d).getDate() + '</time></li>');
      });
      if (nL) out.push('<li class="c-blue lessons"><span class="ch-i">' + ico('stack') + '</span><div><b>Уроки маршрута: ' + nL + '</b><span>' + lessons.map(function (e) { return e.t === 'lesson' ? 'шаг ' + e.n : 'шаги ' + e.from + '–' + e.to; }).join(', ') + '</span></div><time>' + stars(avg(lessons)) + '</time></li>');
      out.push('</ul></section>');
    });
    return out.join('');
  }
  function avg(l) { var s = 0; l.forEach(function (e) { s += e.stars; }); return Math.round(s / l.length * 10) / 10; }
  function plural(n, a, b, c) { var m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c; }

  var V = { a: ['А · Повестка', vA], b: ['Б · Две дороги', vB], c: ['В · Карта похода', vC], d: ['Г · Архив по месяцам', vD] };
  var q = new URLSearchParams(location.search), v = (q.get('v') || 'a').toLowerCase(); if (!V[v]) v = 'a';
  var bare = q.get('bare') === '1';
  var app = document.getElementById('app');
  app.innerHTML = (bare ? '' : '<div class="sw"><span class="sw-tag">Макет</span>' + Object.keys(V).map(function (k) {
    return '<a class="sw-b' + (k === v ? ' on' : '') + '" href="?v=' + k + '">' + V[k][0] + '</a>';
  }).join('') + '</div>') + '<main class="phone v-' + v + (bare ? '' : ' has-sw') + '">' + V[v][1]() + '</main>';
  app.querySelectorAll('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      app.querySelectorAll('.chip').forEach(function (x) { x.classList.toggle('on', x === c); });
      var f = c.dataset.f;
      app.querySelectorAll('.ag-i:not(.fut)').forEach(function (li) { li.hidden = f !== 'all' && li.dataset.f !== f; });
    });
  });
  if (window.nbspRu) window.nbspRu.fix(app);
  if (v === 'b') initB();
  if (v === 'c') { drawTrail(); addEventListener('resize', drawTrail); if (document.fonts) document.fonts.ready.then(drawTrail); }
})();
