window.App = window.App || {};
App.pages = App.pages || {};

App.pages.landing = function () {
  const loggedIn = !!App.store.currentUser() && !!localStorage.getItem("bolashaq_seen_login");
  return `
  <section class="hero">
    <div class="container">
      <div class="eyebrow">Корпоративный портал для молодых специалистов нефтегазовой отрасли</div>
      <h1>Bolashaq Energy</h1>
      <div class="slogan">«Энергия молодых — в результате»</div>
      <p class="lead">Платформа формализует путь идеи молодого специалиста — от свободной мысли до управленческого решения — с помощью AI-аналитики, при полном сохранении человеческого контроля над решением.</p>
      <div class="flex-gap center mt24" style="justify-content:center;">
        <a class="btn btn-primary" href="#/register">Начать — предложить идею</a>
        <a class="btn btn-secondary" href="#/login">Войти в демо-кабинет</a>
      </div>
    </div>
  </section>

  <section class="section container">
    <div class="card" style="border-color:var(--accent-dim);background:linear-gradient(180deg, var(--accent-glow), transparent 60%);">
      <div class="flex-between" style="align-items:flex-start;flex-wrap:wrap;gap:16px;">
        <div style="max-width:640px;">
          <div class="eyebrow">Ключевой принцип продукта</div>
          <h3 style="font-size:19px;line-height:1.4;">AI не принимает окончательное решение по проекту. AI — интеллектуальный помощник и аналитик. Ответственным куратором проекта всегда является реальный сотрудник.</h3>
        </div>
        <div style="font-size:44px;">🧭</div>
      </div>
    </div>
  </section>

  <section class="section container">
    <div class="section-head"><div class="section-title">Путь идеи в системе</div></div>
    <div class="funnel">
      ${["ЭНЕРГИЯ МОЛОДЫХ", "ИДЕЯ", "AI-АНАЛИЗ", "КУРАТОР", "ЭКСПЕРТЫ И ГОЛОСОВАНИЕ", "РУКОВОДСТВО", "ВНЕДРЕНИЕ", "РЕЗУЛЬТАТ"]
        .map((t, i) => (i === 0 ? "" : `<div class="funnel-arrow">↓</div>`) + `<div class="funnel-item">${t}</div>`).join("")}
    </div>
  </section>

  <section class="section container">
    <div class="grid grid-3">
      <div class="card">
        <div style="font-size:26px;">💡</div>
        <h3 class="mt12" style="font-size:16px;">От идеи до решения</h3>
        <p class="faint mt8">Три сценария создания проекта: новая идея, доработка существующего проекта или решение производственной проблемы.</p>
      </div>
      <div class="card">
        <div style="font-size:26px;">🤖</div>
        <h3 class="mt12" style="font-size:16px;">AI-аналитика без домыслов</h3>
        <p class="faint mt8">Техническая, финансовая и производственная оценка с анализом рисков. Если данных недостаточно — AI честно об этом сообщает.</p>
      </div>
      <div class="card">
        <div style="font-size:26px;">🗳️</div>
        <h3 class="mt12" style="font-size:16px;">Голосование и экспертиза</h3>
        <p class="faint mt8">Коллеги поддерживают идеи открытым голосованием — как дополнение, а не замена экспертной оценки куратора и руководства.</p>
      </div>
    </div>
  </section>

  <section class="section container center" style="padding-bottom:70px;">
    <a class="btn btn-primary" href="#/register" style="padding:14px 30px;">Предложить идею</a>
  </section>
  ${App.ui.footer()}`;
};
