window.App = window.App || {};
App.pages = App.pages || {};

let catalogFilters = { direction: "", company: "", status: "", support: "", author: "", sort: "new" };

App.pages.catalog = function () {
  const users = App.state.users;
  let items = App.state.projects.slice();

  if (catalogFilters.direction) items = items.filter(p => p.direction === catalogFilters.direction);
  if (catalogFilters.company) items = items.filter(p => { const a = App.store.author(p); return a && a.company === catalogFilters.company; });
  if (catalogFilters.status) items = items.filter(p => p.status === catalogFilters.status);
  if (catalogFilters.author) items = items.filter(p => p.authorId === catalogFilters.author);
  if (catalogFilters.support === "high") items = items.filter(p => p.votes.count >= 200);
  if (catalogFilters.support === "low") items = items.filter(p => p.votes.count < 200);

  if (catalogFilters.sort === "votes") items.sort((a, b) => b.votes.count - a.votes.count);
  else if (catalogFilters.sort === "effect") items.sort((a, b) => parseFloat((b.economicEffect || "0").replace(/[^\d.]/g, "")) - parseFloat((a.economicEffect || "0").replace(/[^\d.]/g, "")));
  else items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const dirOptions = App.DIRECTIONS.map(d => `<option value="${d}" ${catalogFilters.direction === d ? "selected" : ""}>${d}</option>`).join("");
  const coOptions = App.COMPANIES.map(c => `<option value="${c}" ${catalogFilters.company === c ? "selected" : ""}>${c}</option>`).join("");
  const statusOptions = Object.entries(App.STATUS).map(([k, s]) => `<option value="${k}" ${catalogFilters.status === k ? "selected" : ""}>${s.label}</option>`).join("");
  const authorOptions = users.map(u => `<option value="${u.id}" ${catalogFilters.author === u.id ? "selected" : ""}>${App.esc(u.fio)}</option>`).join("");

  return `
  <section class="section container">
    <div class="eyebrow">Каталог проектов</div>
    <h2 class="section-title mb16">Все проекты платформы</h2>

    <div class="filter-bar">
      <select onchange="App.actions.setCatalogFilter('direction', this.value)"><option value="">Направление: все</option>${dirOptions}</select>
      <select onchange="App.actions.setCatalogFilter('company', this.value)"><option value="">ДЗО: все</option>${coOptions}</select>
      <select onchange="App.actions.setCatalogFilter('status', this.value)"><option value="">Статус: все</option>${statusOptions}</select>
      <select onchange="App.actions.setCatalogFilter('support', this.value)">
        <option value="">Поддержка: любая</option>
        <option value="high" ${catalogFilters.support === "high" ? "selected" : ""}>Высокая (≥200 голосов)</option>
        <option value="low" ${catalogFilters.support === "low" ? "selected" : ""}>Низкая (&lt;200 голосов)</option>
      </select>
      <select onchange="App.actions.setCatalogFilter('author', this.value)"><option value="">Автор: все</option>${authorOptions}</select>
      <select onchange="App.actions.setCatalogFilter('sort', this.value)">
        <option value="new" ${catalogFilters.sort === "new" ? "selected" : ""}>Сначала новые</option>
        <option value="votes" ${catalogFilters.sort === "votes" ? "selected" : ""}>По голосам</option>
        <option value="effect" ${catalogFilters.sort === "effect" ? "selected" : ""}>По экономическому эффекту</option>
      </select>
    </div>

    <p class="faint mb16">Найдено проектов: ${items.length}</p>
    <div class="grid grid-3">
      ${items.length ? items.map(App.ui.projectCard).join("") : `<div class="empty-state">Ничего не найдено по выбранным фильтрам.</div>`}
    </div>
  </section>
  ${App.ui.footer()}`;
};

App.actions = App.actions || {};
App.actions.setCatalogFilter = function (key, value) {
  catalogFilters[key] = value;
  App.renderRoute();
};
