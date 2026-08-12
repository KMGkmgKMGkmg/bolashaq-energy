window.App = window.App || {};
App.pages = App.pages || {};

App.pages.myPath = function () {
  const user = App.store.currentUser();
  const stats = App.store.myPathStats(user.id);
  const mine = App.store.projectsByAuthor(user.id);
  const effectFmt = stats.effect >= 1000000 ? (stats.effect / 1000000).toFixed(1).replace(/\.0$/, "") + " млн ₸" : stats.effect.toLocaleString("ru-RU") + " ₸";

  return `
  <section class="section container">
    <div class="eyebrow">Личный прогресс</div>
    <h2 class="section-title mb16">Мой путь</h2>

    <div class="card mb24" style="background:linear-gradient(180deg, var(--accent-glow), transparent 70%);border-color:var(--accent-dim);">
      <div style="font-size:20px;font-weight:800;">
        ${stats.ideas} иде${stats.ideas === 1 ? "я" : "и"} · ${stats.accepted} проект${stats.accepted === 1 ? "" : stats.accepted >= 2 && stats.accepted <= 4 ? "а" : "ов"} · ${stats.implemented} внедрен${stats.implemented === 1 ? "ие" : "ий"} · +${effectFmt} экономического эффекта
      </div>
    </div>

    <div class="grid grid-4 mb24">
      ${App.ui.kpi(stats.ideas, "Идей предложено")}
      ${App.ui.kpi(stats.accepted, "Проектов принято")}
      ${App.ui.kpi(stats.implemented, "Реализовано")}
      ${App.ui.kpi(stats.votes, "Голосов получено")}
    </div>

    <div class="section-head"><div class="section-title" style="font-size:18px;">История проектов</div></div>
    <div class="grid grid-3">
      ${mine.length ? mine.map(App.ui.projectCard).join("") : `<div class="empty-state">Вы ещё не предложили ни одной идеи. <div class="mt12"><a class="btn btn-primary" href="#/new">Предложить идею</a></div></div>`}
    </div>
  </section>
  ${App.ui.footer()}`;
};
