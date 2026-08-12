window.App = window.App || {};
App.pages = App.pages || {};

App.pages.curator = function () {
  const projects = App.state.projects;
  const columns = [
    { key: "ai", title: "Новые (AI-анализ готов)", statuses: ["ai"] },
    { key: "curator", title: "На рассмотрении", statuses: ["curator"] },
    { key: "revision", title: "Требуют доработки", statuses: ["revision"] },
    { key: "forwarded", title: "Направлены руководству", statuses: ["management", "approved", "pilot", "implemented", "rejected"] }
  ];

  function miniCard(p) {
    const author = App.store.author(p);
    return `<div class="card card-hover mb12" style="cursor:pointer;padding:14px;" onclick="App.go('#/project/${p.id}')">
      <div class="flex-between mb8">${App.ui.statusBadge(p.status)}<span class="faint">${p.createdAt}</span></div>
      <div style="font-weight:700;font-size:13.5px;line-height:1.3;">${App.esc(p.title)}</div>
      <div class="faint mt8">${author ? App.esc(author.fio) : ""} · ${App.esc(p.direction)}</div>
      ${p.analysis && p.analysis.sufficient ? `<div class="faint mt8">AI: ${p.analysis.summary.feasibility}% реализуемость, риск — ${p.analysis.summary.risk}</div>` : `<div class="faint mt8">AI: недостаточно данных</div>`}
    </div>`;
  }

  return `
  <section class="section container">
    <div class="eyebrow">Кабинет куратора</div>
    <h2 class="section-title mb8">Проекты специалистов</h2>
    <p class="faint mb24">Демо-режим: куратор видит проекты всех направлений. Откройте проект, чтобы принять решение, вернуть на доработку (с комментарием) или направить руководству.</p>
    <div class="grid grid-4" style="align-items:start;">
      ${columns.map(col => {
        const items = projects.filter(p => col.statuses.includes(p.status));
        return `<div>
          <div class="flex-between mb12"><h3 style="font-size:14px;">${col.title}</h3><span class="tag">${items.length}</span></div>
          ${items.length ? items.map(miniCard).join("") : `<p class="faint">Пусто</p>`}
        </div>`;
      }).join("")}
    </div>
  </section>
  ${App.ui.footer()}`;
};
