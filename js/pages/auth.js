window.App = window.App || {};
App.pages = App.pages || {};

App.pages.register = function () {
  const dirOptions = App.DIRECTIONS.map(d => `<option value="${d}">${d}</option>`).join("");
  return `
  <section class="section container" style="max-width:640px;">
    <div class="eyebrow">Регистрация молодого специалиста</div>
    <h2 class="section-title mb16">Расскажите о себе</h2>
    <p class="faint mb16">После выбора направления система автоматически назначит вам персонального куратора.</p>
    <form class="card" onsubmit="App.actions.submitRegister(event)">
      <div class="field"><label>ФИО</label><input type="text" name="fio" required placeholder="Иванов Иван Иванович" /></div>
      <div class="field-row">
        <div class="field"><label>Компания / ДЗО</label>
          <select name="company">${App.COMPANIES.map(c => `<option>${c}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Подразделение</label><input type="text" name="department" placeholder="Например, Департамент разработки" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Должность</label><input type="text" name="position" required placeholder="Инженер по разработке" /></div>
        <div class="field"><label>Опыт работы</label><input type="text" name="experience" placeholder="2 года" /></div>
      </div>
      <div class="field"><label>Направление деятельности</label><select name="direction" required>${dirOptions}</select></div>
      <div class="field"><label>Профессиональные компетенции</label><textarea name="competencies" placeholder="Ключевые навыки и экспертиза"></textarea></div>
      <div class="field"><label>Интересы</label><textarea name="interests" placeholder="Профессиональные интересы"></textarea></div>
      <button class="btn btn-primary btn-block" type="submit">Зарегистрироваться</button>
      <p class="faint center mt12">Уже есть аккаунт? <span class="link-btn" onclick="App.go('#/login')">Войти</span></p>
    </form>
  </section>`;
};

App.pages.login = function () {
  const users = App.state.users;
  return `
  <section class="section container" style="max-width:480px;">
    <div class="eyebrow">Демонстрационный вход</div>
    <h2 class="section-title mb16">Войти в кабинет</h2>
    ${App.ui.disclaimer("Прототип использует демонстрационную аутентификацию без production-требований к безопасности (PRD, п. 9).", {})}
    <div class="card mt16">
      <div class="field">
        <label>Выберите демо-пользователя</label>
        <select id="login-user">${users.map(u => `<option value="${u.id}">${u.fio} — ${u.position}</option>`).join("")}</select>
      </div>
      <button class="btn btn-primary btn-block" onclick="App.actions.submitLogin()">Войти</button>
      <p class="faint center mt12">Ещё нет анкеты? <span class="link-btn" onclick="App.go('#/register')">Зарегистрироваться</span></p>
    </div>
  </section>`;
};

App.actions = App.actions || {};

App.actions.submitRegister = function (e) {
  e.preventDefault();
  const f = e.target;
  const fields = {
    fio: f.fio.value.trim(),
    company: f.company.value,
    department: f.department.value.trim(),
    position: f.position.value.trim(),
    direction: f.direction.value,
    experience: f.experience.value.trim(),
    competencies: f.competencies.value.trim(),
    interests: f.interests.value.trim()
  };
  const user = App.store.register(fields);
  localStorage.setItem("bolashaq_seen_login", "1");
  App.go("#/dashboard");
};

App.actions.submitLogin = function () {
  const sel = document.getElementById("login-user");
  App.store.loginAs(sel.value);
  localStorage.setItem("bolashaq_seen_login", "1");
  App.go("#/dashboard");
};
