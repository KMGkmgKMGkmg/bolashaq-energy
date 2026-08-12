window.App = window.App || {};
App.pages = App.pages || {};

App.pages.dashboard = function () {
  const user = App.store.currentUser();
  const mine = App.store.projectsByAuthor(user.id);
  const inReview = mine.filter(p => ["ai", "curator", "revision", "management"].includes(p.status));
  const inWork = mine.filter(p => ["approved", "pilot", "curatorOk"].includes(p.status));
  const implemented = mine.filter(p => p.status === "implemented");
  const curator = App.store.curatorOf(user);
  const votingPool = App.state.projects.filter(p => p.authorId !== user.id).slice(0, 3);
  const notes = App.state.notifications;

  function projectRow(p) {
    return `<div class="flex-between" style="padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;" onclick="App.go('#/project/${p.id}')">
      <div style="max-width:70%;">
        <div style="font-weight:600;font-size:13.5px;">${App.esc(p.title)}</div>
        <div class="faint">${App.esc(p.direction)}</div>
      </div>
      ${App.ui.statusBadge(p.status)}
    </div>`;
  }

  function block(title, items, emptyText) {
    return `<div class="card">
      <div class="flex-between mb12"><h3 style="font-size:15px;">${title}</h3><span class="tag">${items.length}</span></div>
      ${items.length ? items.map(projectRow).join("") : `<p class="faint">${emptyText}</p>`}
    </div>`;
  }

  return `
  <section class="section container">
    <div class="flex-between mb24" style="align-items:flex-start;flex-wrap:wrap;gap:14px;">
      <div>
        <div class="eyebrow">Личный кабинет специалиста</div>
        <h2 class="section-title">Здравствуйте, ${App.esc(user.fio.split(" ")[0])}!</h2>
      </div>
      <a class="btn btn-primary" href="#/new" style="font-size:15px;padding:13px 24px;">＋ Предложить идею</a>
    </div>

    <div class="grid grid-4 mb16">
      ${App.ui.kpi(mine.length, "Мои проекты")}
      ${App.ui.kpi(inReview.length, "На рассмотрении")}
      ${App.ui.kpi(inWork.length, "В работе")}
      ${App.ui.kpi(implemented.length, "Реализовано")}
    </div>

    <div class="grid grid-2">
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${block("Мои проекты", mine, "Вы ещё не предложили ни одной идеи.")}
        ${block("Проекты на рассмотрении", inReview, "Нет проектов на рассмотрении.")}
        ${block("Проекты в работе", inWork, "Нет проектов в работе.")}
        ${block("Реализованные проекты", implemented, "Пока нет реализованных проектов.")}
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${App.ui.curatorCard(curator)}
        <div class="card">
          <div class="flex-between mb12"><h3 style="font-size:15px;">Голосования</h3><span class="link-btn" onclick="App.go('#/catalog')">Все проекты →</span></div>
          ${votingPool.map(p => `
            <div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border);">
              <div style="max-width:65%;font-size:13.5px;cursor:pointer;" onclick="App.go('#/project/${p.id}')">${App.esc(p.title)}</div>
              <button class="btn btn-sm ${App.store.hasVoted(p.id) ? "btn-secondary" : "btn-primary"}" ${App.store.hasVoted(p.id) ? "disabled" : ""} onclick="App.actions.quickVote('${p.id}')">${App.store.hasVoted(p.id) ? "Поддержано" : "👍 Поддержать"}</button>
            </div>`).join("")}
        </div>
        <div class="card">
          <h3 class="mb12" style="font-size:15px;">Уведомления</h3>
          ${notes.map(n => `<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;">
            <div>${App.esc(n.text)}</div><div class="faint">${n.when}</div>
          </div>`).join("")}
        </div>
      </div>
    </div>
  </section>
  ${App.ui.footer()}`;
};

App.actions = App.actions || {};
App.actions.quickVote = function (id) {
  App.store.vote(id);
  App.renderRoute();
};
