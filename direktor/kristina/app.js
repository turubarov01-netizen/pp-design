(() => {
  // Неразрывный пробел после коротких слов и перед тире/единицами
  const walk = (n) => {
    if (n.nodeType === 3) { n.nodeValue = n.nodeValue.replace(/(^|[\s(«"])([А-Яа-яЁёA-Za-z]{1,3})\s(?=\S)/g, '$1$2 ').replace(/(\d)\s(?=[А-Яа-яЁё$%₽×])/g, '$1 '); return; }
    if (n.nodeType === 1 && !/^(SCRIPT|STYLE|INPUT|TEXTAREA)$/.test(n.tagName)) n.childNodes.forEach(walk);
  };
  walk(document.body);

  // Шапка
  const hdr = document.getElementById('hdr');
  const onScroll = () => {
    if (hdr) hdr.classList.toggle('scrolled', scrollY > 8);
    const st = document.getElementById('sticky');
    if (st) st.classList.toggle('show', scrollY > window.innerHeight * 0.7 && !dlg?.open);
  };
  addEventListener('scroll', onScroll, { passive: true });

  // Появление блоков
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));

  // Видео
  const vf = document.getElementById('vf'), vid = document.getElementById('vid'), vp = document.getElementById('vplay');
  if (vp) vp.addEventListener('click', () => { vid.controls = true; vid.play(); vf.classList.add('playing'); });

  // Маршрут
  const ROUTES = {
    income: { t: 'Выйти на стабильный доход', s: [
      ['Точка Сборки', 'Пять дней: твёрдая услуга, цена и первая воронка.', 'Бесплатно'],
      ['Мой оффер', 'Сервис соберёт ваше предложение клиенту.', 'Сервис платформы'],
      ['План Продюсера', 'Продукт и продажи с наставниками.', 'Программа'],
      ['Клан и встречи', 'Окружение, которое держит темп.', 'Клан Кристины']] },
    product: { t: 'Запустить свой продукт', s: [
      ['Выбор ниши', 'Сервис поможет выбрать, с чем выходить на рынок.', 'Сервис платформы'],
      ['Мой оффер', 'Упаковка предложения за несколько шагов.', 'Сервис платформы'],
      ['План Продюсера', 'Запуск продукта с наставниками.', 'Программа'],
      ['ИИнструменты', 'Нейросети, которые берут рутину на себя.', 'Курс']] },
    people: { t: 'Найти сильное окружение', s: [
      ['Профиль', 'Расскажите о себе и своём деле.', 'Кабинет'],
      ['Рядом со мной', 'Участники Альянса в вашем городе.', 'Карта участников'],
      ['Вебинары и события', 'Открытые эфиры и календарь Альянса.', 'Бесплатно'],
      ['Клан Кристины', 'Встречи, чат и поддержка директора.', 'Клан']] },
    order: { t: 'Навести порядок в целях', s: [
      ['Колесо баланса', 'Десять сфер жизни на одном экране.', 'Трекер'],
      ['Фокус дня и привычки', 'Каждый день один главный шаг.', 'Трекер'],
      ['Гид на год', 'Цели на год, разбитые на шаги.', 'Трекер'],
      ['ПЭРЛ', 'Карта роста по уровням Альянса.', 'Платформа']] },
  };
  let goal = 'income';
  const path = document.getElementById('path');
  const draw = () => {
    if (!path) return;
    path.innerHTML = ROUTES[goal].s.map((s, i) => `<div class="step"><div class="sn">0${i + 1}</div><h4>${s[0]}</h4><p>${s[1]}</p><span class="where">${s[2]}</span></div>`).join('');
    walk(path);
  };
  document.querySelectorAll('.goal').forEach((b) => b.addEventListener('click', () => {
    goal = b.dataset.goal;
    document.querySelectorAll('.goal').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    draw();
  }));
  draw();

  // Регистрация
  const dlg = document.getElementById('reg');
  const mg = document.getElementById('m-goal');
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => {
    if (!dlg) return;
    const withGoal = b.hasAttribute('data-with-goal');
    mg.textContent = withGoal ? 'Ваша цель: ' + ROUTES[goal].t : '';
    mg.classList.toggle('on', withGoal);
    dlg.showModal();
    document.getElementById('sticky')?.classList.remove('show');
    setTimeout(() => dlg.querySelector('input')?.focus(), 60);
  }));
  dlg?.querySelector('[data-close]').addEventListener('click', () => dlg.close());
  dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg?.addEventListener('close', onScroll);
  const f = document.getElementById('f');
  f?.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = f.name.value.trim() && /\S+@\S+\.\S+/.test(f.email.value) && f.pw.value.length >= 6 && f.ok.checked;
    document.getElementById('err').classList.toggle('on', !ok);
    if (!ok) return;
    // Прототип: настоящей регистрации нет, переходим на страницу разового предложения
    location.href = 'oto.html?name=' + encodeURIComponent(f.name.value.trim()) + '&email=' + encodeURIComponent(f.email.value.trim());
  });
})();
