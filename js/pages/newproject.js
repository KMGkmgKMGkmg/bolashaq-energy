window.App = window.App || {};
App.pages = App.pages || {};

const SCENARIOS = [
  { key: "idea", t: "Новая идея", d: "Проект с нуля" },
  { key: "improvement", t: "Доработка проекта", d: "Улучшение существующего" },
  { key: "problem", t: "Решение проблемы", d: "От проблемы к решению" }
];

let selectedScenario = "idea";

App.pages.newProject = function () {
  const user = App.store.currentUser();
  const dirOptions = App.DIRECTIONS.map(d => `<option value="${d}" ${d === user.direction ? "selected" : ""}>${d}</option>`).join("");
  const existingProjects = App.store.projectsByAuthor(user.id);

  return `
  <section class="section container" style="max-width:760px;">
    <div class="eyebrow">Новый проект</div>
    <h2 class="section-title mb16">Предложить идею</h2>

    <div class="wizard-tabs">
      ${SCENARIOS.map(s => `<div class="wizard-tab ${s.key === selectedScenario ? "active" : ""}" onclick="App.actions.selectScenario('${s.key}')">
        <div class="t">${s.t}</div><div class="d">${s.d}</div>
      </div>`).join("")}
    </div>

    ${selectedScenario === "improvement" && existingProjects.length ? `
      <div class="field">
        <label>Какой проект дорабатываем?</label>
        <select id="np-related">
          <option value="">— выбрать проект —</option>
          ${existingProjects.map(p => `<option value="${p.id}">${App.esc(p.title)}</option>`).join("")}
        </select>
      </div>` : ""}

    <form class="card" onsubmit="App.actions.submitProject(event)">
      <div class="field"><label>Название проекта</label><input type="text" name="title" required placeholder="Например, «Оптимизация режима работы скважин…»" /></div>
      <div class="field"><label>Проблема</label><textarea name="problem" required placeholder="Какую производственную проблему решает проект?"></textarea></div>
      <div class="field"><label>Предлагаемое решение</label><textarea name="solution" placeholder="Как вы предлагаете решить проблему?"></textarea></div>
      <div class="field"><label>Цель</label><textarea name="goal" placeholder="Какая цель у проекта?"></textarea></div>
      <div class="field"><label>Ожидаемый результат</label><textarea name="expectedResult" placeholder="Что изменится после внедрения?"></textarea></div>
      <div class="field"><label>Направление</label><select name="direction">${dirOptions}</select></div>
      <div class="field"><label>Необходимые ресурсы</label><textarea name="resources" placeholder="Люди, технологии, оборудование, бюджет времени"></textarea></div>
      <div class="field-row">
        <div class="field"><label>Предполагаемый срок</label><input type="text" name="timeline" placeholder="Например, 9 месяцев" /></div>
        <div class="field"><label>Предполагаемый бюджет</label><input type="text" name="budget" placeholder="Например, 48 000 000 ₸" /></div>
      </div>
      <div class="field"><label>Предполагаемый экономический эффект</label><input type="text" name="economicEffect" placeholder="Например, 24 000 000 ₸ в год" /></div>
      <div class="field">
        <label>Дополнительные материалы</label>
        <input type="text" name="attachments" placeholder="Названия файлов через запятую (демо-режим, без реальной загрузки)" />
        <div class="hint">В прототипе загрузка файлов не выполняется — укажите названия материалов текстом.</div>
      </div>
      ${App.ui.disclaimer("Заполните поля максимально подробно: если данных для оценки будет недостаточно, AI явно сообщит об этом, а не будет придумывать цифры.", {})}
      <button class="btn btn-primary btn-block mt16" type="submit">Отправить на AI-анализ</button>
    </form>
  </section>
  ${App.ui.footer()}`;
};

App.actions = App.actions || {};

App.actions.selectScenario = function (key) {
  selectedScenario = key;
  App.renderRoute();
};

App.actions.submitProject = function (e) {
  e.preventDefault();
  const f = e.target;
  const attachments = f.attachments.value.split(",").map(s => s.trim()).filter(Boolean);
  const fields = {
    title: f.title.value.trim(),
    problem: f.problem.value.trim(),
    solution: f.solution.value.trim(),
    goal: f.goal.value.trim(),
    expectedResult: f.expectedResult.value.trim(),
    direction: f.direction.value,
    resources: f.resources.value.trim(),
    timeline: f.timeline.value.trim(),
    budget: f.budget.value.trim(),
    economicEffect: f.economicEffect.value.trim(),
    attachments,
    scenario: selectedScenario
  };
  const project = App.store.createProject(fields);
  selectedScenario = "idea";
  App.go("#/project/" + project.id);
};
