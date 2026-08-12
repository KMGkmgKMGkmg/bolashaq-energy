window.App = window.App || {};
App.ui = {};

(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  App.esc = esc;

  function initials(fio) {
    return (fio || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  }

  const NAV = [
    { hash: "#/dashboard", label: "Кабинет", roles: ["specialist"] },
    { hash: "#/catalog", label: "Каталог проектов", roles: ["specialist", "curator", "management"] },
    { hash: "#/my-path", label: "Мой путь", roles: ["specialist"] },
    { hash: "#/curator", label: "Кабинет куратора", roles: ["curator"] },
    { hash: "#/management", label: "Руководство", roles: ["management"] }
  ];

  App.ui.renderHeader = function () {
    const el = document.getElementById("header");
    if (!el) return;
    const user = App.store.currentUser();
    const role = App.state.role;
    const current = location.hash || "#/";

    if (!user) {
      el.innerHTML = `
        <div class="app-header-inner">
          <div class="brand" onclick="App.go('#/')">
            <div class="brand-mark">BE</div>
            <div><div>Bolashaq Energy</div><div class="brand-sub">Энергия молодых — в результате</div></div>
          </div>
          <div class="header-right">
            <a class="btn btn-secondary btn-sm" href="#/login">Войти</a>
            <a class="btn btn-primary btn-sm" href="#/register">Регистрация</a>
          </div>
        </div>`;
      return;
    }

    const nav = NAV.filter(n => n.roles.includes(role))
      .map(n => `<a href="${n.hash}" class="${current.startsWith(n.hash) ? "active" : ""}">${n.label}</a>`)
      .join("");

    el.innerHTML = `
      <div class="app-header-inner">
        <div class="brand" onclick="App.go('#/dashboard')">
          <div class="brand-mark">BE</div>
          <div><div>Bolashaq Energy</div><div class="brand-sub">Энергия молодых — в результате</div></div>
        </div>
        <nav class="main-nav">${nav}</nav>
        <div class="header-right">
          <div class="role-switch" title="Демо-режим: переключение ролей для показа прототипа">
            <button class="${role === "specialist" ? "active" : ""}" onclick="App.setRole('specialist')">Специалист</button>
            <button class="${role === "curator" ? "active" : ""}" onclick="App.setRole('curator')">Куратор</button>
            <button class="${role === "management" ? "active" : ""}" onclick="App.setRole('management')">Руководство</button>
          </div>
          <div class="user-chip">
            <div class="avatar">${initials(user.fio)}</div>
            <span>${esc(user.fio.split(" ")[0])}</span>
          </div>
        </div>
      </div>`;
  };

  App.ui.statusBadge = function (statusKey) {
    const s = App.STATUS[statusKey] || App.STATUS.draft;
    return `<span class="badge badge-${s.color}"><span class="badge-dot ${s.color}"></span>${s.label}</span>`;
  };

  App.ui.disclaimer = function (html, opts) {
    opts = opts || {};
    return `<div class="disclaimer ${opts.warn ? "warn" : ""}">
      <span>${opts.warn ? "⚠️" : "ℹ️"}</span>
      <div>${html}</div>
    </div>`;
  };

  App.ui.stepper = function (statusKey) {
    const doneCount = App.statusToStep(statusKey);
    const isRejected = statusKey === "rejected";
    return `<div class="stepper">${App.JOURNEY.map((label, i) => {
      const done = i < doneCount;
      const isCurrent = i === doneCount;
      const cls = isRejected && i === 2 ? "current" : done ? "done" : isCurrent ? "current" : "";
      const line = i > 0 ? `<div class="step-line ${i <= doneCount ? "done" : ""}"></div>` : "";
      return `${line}<div class="step-col"><div class="step ${cls}"><div class="step-dot">${done ? "✓" : i + 1}</div></div><div class="step-label">${label}</div></div>`;
    }).join("")}</div>`;
  };

  App.ui.kpi = function (num, label) {
    return `<div class="card kpi"><div class="num">${num}</div><div class="label">${label}</div></div>`;
  };

  App.ui.curatorCard = function (curator) {
    if (!curator) return "";
    const online = curator.status === "online";
    return `<div class="card">
      <div class="flex-between mb12">
        <span class="tag">Мой куратор</span>
        <span class="badge ${online ? "badge-green" : "badge-orange"}"><span class="badge-dot ${online ? "green" : "orange"}"></span>${online ? "Онлайн" : "Занят"}</span>
      </div>
      <div class="flex" style="gap:12px;align-items:center;">
        <div class="avatar" style="width:44px;height:44px;font-size:15px;">${initials(curator.fio)}</div>
        <div>
          <div style="font-weight:700;">${esc(curator.fio)}</div>
          <div class="faint">${esc(curator.position)}</div>
          <div class="faint">${esc(curator.direction)}</div>
        </div>
      </div>
      <button class="btn btn-secondary btn-block mt16" onclick="alert('Демо-режим: чат с куратором недоступен в прототипе.')">Связаться</button>
    </div>`;
  };

  App.ui.projectCard = function (p) {
    const author = App.state.users.find(u => u.id === p.authorId);
    const ai = p.analysis && p.analysis.sufficient
      ? `<span class="badge badge-green">AI: ${p.analysis.summary.feasibility}% реализуемость</span>`
      : `<span class="badge badge-orange">AI: недостаточно данных</span>`;
    return `<div class="card card-hover" style="cursor:pointer;display:flex;flex-direction:column;gap:10px;" onclick="App.go('#/project/${p.id}')">
      <div class="flex-between"><span class="tag">${esc(p.direction)}</span>${App.ui.statusBadge(p.status)}</div>
      <div style="font-weight:700;font-size:15px;line-height:1.35;">${esc(p.title)}</div>
      <div class="faint" style="min-height:34px;">${esc((p.problem || "").slice(0, 110))}${(p.problem || "").length > 110 ? "…" : ""}</div>
      <div class="flex-gap">${ai}<span class="badge badge-blue">👍 ${p.votes.count}</span></div>
      <div class="faint">${author ? esc(author.fio) : ""} · ${esc(p.createdAt)}</div>
    </div>`;
  };

  App.ui.notFound = function () {
    return `<div class="section container"><div class="empty-state"><h3>Страница не найдена</h3><p class="mt12"><a class="link-btn" href="#/">На главную</a></p></div></div>`;
  };

  App.ui.footer = function () {
    return `<footer class="site-footer">Bolashaq Energy — демонстрационный прототип. Все данные вымышлены и используются только для презентации. AI не принимает окончательных решений — ответственность несут куратор и руководство.</footer>`;
  };
})();
