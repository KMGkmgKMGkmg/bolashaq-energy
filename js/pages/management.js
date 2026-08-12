window.App = window.App || {};
App.pages = App.pages || {};

function parseEffect(str) {
  const n = parseFloat((str || "0").replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
}

App.pages.management = function () {
  const projects = App.state.projects;
  const onReview = projects.filter(p => p.status === "management");
  const highPotential = projects.filter(p => p.analysis && p.analysis.sufficient && p.analysis.summary.feasibility >= 80);
  const highSupport = [...projects].sort((a, b) => b.votes.count - a.votes.count).slice(0, 5);
  const totalEffect = projects.reduce((s, p) => s + parseEffect(p.economicEffect), 0);
  const implementedCount = projects.filter(p => p.status === "implemented").length;

  const byDirection = {};
  App.DIRECTIONS.forEach(d => byDirection[d] = 0);
  projects.forEach(p => byDirection[p.direction] = (byDirection[p.direction] || 0) + 1);

  const byCompany = {};
  projects.forEach(p => {
    const author = App.store.author(p);
    const c = author ? author.company : "—";
    byCompany[c] = (byCompany[c] || 0) + 1;
  });

  const statusCounts = {};
  Object.keys(App.STATUS).forEach(k => statusCounts[k] = projects.filter(p => p.status === k).length);

  function barRow(label, value, max) {
    return `<div class="mb12">
      <div class="flex-between faint mb4"><span>${App.esc(label)}</span><span>${value}</span></div>
      <div class="progress"><div style="width:${max ? (value / max * 100) : 0}%;"></div></div>
    </div>`;
  }
  const maxDir = Math.max(...Object.values(byDirection), 1);
  const maxCo = Math.max(...Object.values(byCompany), 1);

  return `
  <section class="section container">
    <div class="eyebrow">Демонстрационный дашборд руководства</div>
    <h2 class="section-title mb24">Обзор проектов</h2>

    <div class="grid grid-4 mb24">
      ${App.ui.kpi(onReview.length, "На рассмотрении")}
      ${App.ui.kpi(highPotential.length, "С высоким потенциалом")}
      ${App.ui.kpi((totalEffect / 1000000).toFixed(0) + " млн ₸", "Потенциальный эффект (сумма)")}
      ${App.ui.kpi(implementedCount, "Реализовано")}
    </div>

    <div class="grid grid-2 mb24" style="align-items:start;">
      <div class="card">
        <h3 class="mb16" style="font-size:15px;">Проекты по направлениям</h3>
        ${Object.entries(byDirection).filter(([, v]) => v > 0).map(([k, v]) => barRow(k, v, maxDir)).join("")}
      </div>
      <div class="card">
        <h3 class="mb16" style="font-size:15px;">Проекты по ДЗО</h3>
        ${Object.entries(byCompany).map(([k, v]) => barRow(k, v, maxCo)).join("")}
        <div class="hr"></div>
        <h3 class="mb12" style="font-size:15px;">Статус реализации</h3>
        <div class="flex-gap">
          ${Object.entries(statusCounts).filter(([, v]) => v > 0).map(([k, v]) => `<span class="badge badge-${App.STATUS[k].color}"><span class="badge-dot ${App.STATUS[k].color}"></span>${App.STATUS[k].label}: ${v}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="section-head"><div class="section-title" style="font-size:18px;">Проекты на рассмотрении руководства</div></div>
    <div class="grid grid-3 mb24">
      ${onReview.length ? onReview.map(App.ui.projectCard).join("") : `<p class="faint">Сейчас нет проектов, ожидающих решения руководства.</p>`}
    </div>

    <div class="section-head"><div class="section-title" style="font-size:18px;">Высокий уровень поддержки</div></div>
    <div class="grid grid-3">
      ${highSupport.map(App.ui.projectCard).join("")}
    </div>
  </section>
  ${App.ui.footer()}`;
};
