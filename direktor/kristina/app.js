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
    path.innerHTML = ROUTES[goal].s.map((s, i) => `<div class="step"><div class="sn" aria-hidden="true">0${i + 1}</div><h3>${s[0]}</h3><p>${s[1]}</p><span class="where">${s[2]}</span></div>`).join('');
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
  const RULES = {
    name: (v) => v.trim() ? '' : 'Напишите, как к вам обращаться.',
    email: (v) => /^\S+@\S+\.\S+$/.test(v.trim()) ? '' : 'Проверьте почту: нужен адрес вида name@mail.ru.',
    pw: (v) => v.length >= 6 ? '' : 'Пароль от 6 символов.',
  };
  const check = (el) => {
    const msg = el.type === 'checkbox' ? (el.checked ? '' : 'Отметьте согласие, чтобы продолжить.') : RULES[el.name](el.value);
    const box = document.getElementById('e-' + el.name);
    if (box) box.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.closest('.consent')?.classList.toggle('bad', !!msg);
    return !msg;
  };
  if (f) {
    const fields = [f.name, f.email, f.pw, f.ok];
    // Проверяем поле, когда человек из него ушёл, и снимаем ошибку, как только её исправили
    fields.forEach((el) => {
      el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') check(el); });
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => { if (el.getAttribute('aria-invalid') === 'true') check(el); });
    });
    const pt = f.querySelector('.pw-t');
    pt?.addEventListener('click', () => {
      const show = f.pw.type === 'password';
      f.pw.type = show ? 'text' : 'password';
      pt.setAttribute('aria-pressed', String(show));
      pt.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = fields.filter((el) => !check(el));
      if (bad.length) { bad[0].focus(); return; }
      const btn = f.querySelector('[type=submit]');
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Регистрируем';
      // Прототип: настоящей регистрации нет, переходим на страницу разового предложения
      setTimeout(() => {
        location.href = 'oto.html?name=' + encodeURIComponent(f.name.value.trim()) + '&email=' + encodeURIComponent(f.email.value.trim());
      }, 700);
    });
  }
})();

// Первый экран: фоновое видео только на компьютере, видео Альянса во всплывающем окне
(()=>{const bv=document.querySelector('.h3-bg video');if(bv&&matchMedia('(min-width:861px)').matches){bv.src=bv.dataset.src;bv.autoplay=true;bv.play().catch(()=>{})}
const d=document.getElementById('vdlg'),v=document.getElementById('vfull');if(!d)return;document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>{d.showModal();v.currentTime=0;v.play().catch(()=>{})}));const c=()=>{v.pause();d.close()};d.querySelector('.vclose').addEventListener('click',c);d.addEventListener('click',e=>{if(e.target===d)c()});d.addEventListener('cancel',()=>v.pause())})();
