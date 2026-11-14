/* Макет «Путь героя»: четыре варианта шкалы жизненного пути поверх маршрутной карты. */
(function () {
  var H = window.HERO;
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
    return '<p class="sumline num">' + dayN + '-й день на маршруте · ' + lessonsDone + ' уроков · ' + stagesDone + ' этапа закрыто · этап ' + H.stage + '</p>';
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

  /* ───────── B. Две дороги: слева маршрут, справа жизнь, даты на линии ───────── */
  function vB() {
    var out = [head(H.name, 'Две дороги: маршрут и жизнь'), summaryLine(),
      '<div class="tw-h"><span>' + ico('flag') + 'Маршрут</span><span>' + ico('star') + 'Жизнь</span></div>', '<div class="tw">'];
    var curM = -1;
    H.past.forEach(function (e) {
      var d = dt(e.d), t = T[e.t], m = d.getMonth();
      if (m !== curM) { curM = m; out.push('<div class="tw-m"><span>' + MON_N[m] + '</span></div>'); }
      var card = '<div class="tw-c ' + (e.big ? 'big ' : '') + 'c-' + t.c + '">' + (e.img ? photo(e, 'tw-img') : '') +
        '<div class="tw-ti">' + ico(t.i) + '<b>' + esc(e.title) + '</b></div>' +
        '<div class="tw-s">' + esc(subOf(e)) + (e.stars ? ' ' + stars(e.stars) : '') + '</div></div>';
      out.push('<div class="tw-r ' + t.road + '">' + (t.road === 'route' ? card : '<i></i>') +
        '<time class="tw-d">' + dShort(e.d) + '</time>' + (t.road === 'life' ? card : '<i></i>') + '</div>');
    });
    out.push('<div class="tw-today">' + todayBar() + '</div>');
    out.push('<div class="tw-r route fut"><div>' + nowCard() + '</div><span class="tw-d dot"></span><div class="tw-ghost">' + ico('plus') + 'Здесь появятся ваши мечты, деньги и разборы</div></div>');
    out.push('<div class="tw-r route fut"><div class="tw-c c-violet dim"><div class="tw-ti">' + ico('target') + '<b>' + esc(H.goal.title) + '</b></div></div><span class="tw-d dot"></span><i></i></div>');
    H.later.forEach(function (s) {
      out.push('<div class="tw-r route fut"><div class="tw-c far"><div class="tw-ti">' + ico('lock') + '<b>Этап ' + s.stage + ' · ' + esc(s.title) + '</b></div></div><span class="tw-d dot"></span><i></i></div>');
    });
    out.push('</div>');
    return out.join('');
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
  }).join('') + '</div>') + '<main class="phone v-' + v + '">' + V[v][1]() + '</main>';
  app.querySelectorAll('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      app.querySelectorAll('.chip').forEach(function (x) { x.classList.toggle('on', x === c); });
      var f = c.dataset.f;
      app.querySelectorAll('.ag-i:not(.fut)').forEach(function (li) { li.hidden = f !== 'all' && li.dataset.f !== f; });
    });
  });
  if (window.nbspRu) window.nbspRu.fix(app);
  if (v === 'c') { drawTrail(); addEventListener('resize', drawTrail); if (document.fonts) document.fonts.ready.then(drawTrail); }
})();
