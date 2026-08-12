window.App = window.App || {};
App.pages = App.pages || {};

function supportPercent(p) {
  const seed = (p.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) + p.votes.count);
  return 55 + (seed % 40);
}

function sparkline(history) {
  const max = Math.max(...history, 1);
  return `<div class="flex" style="gap:4px;align-items:flex-end;height:56px;">
    ${history.map(v => `<div style="flex:1;background:linear-gradient(180deg,var(--accent),var(--accent-dim));border-radius:3px 3px 0 0;height:${Math.max(6, (v / max) * 56)}px;" title="${v}"></div>`).join("")}
  </div>`;
}

function aiAnalysisBlock(p) {
  const a = p.analysis;
  if (!a || !a.sufficient) {
    return `<div class="card">
      <div class="eyebrow">Предварительное заключение AI</div>
      ${App.ui.disclaimer(`<b>Недостаточно данных для оценки.</b> Не хватает: ${(a && a.missing || []).map(m => `<span class="tag" style="margin:2px;">${App.esc(m)}</span>`).join(" ")}`, { warn: true })}
      <p class="faint mt12">AI не подбирает правдоподобные, но выдуманные значения при нехватке данных — это обязательное правило платформы.</p>
      <div class="hr"></div>
      ${App.ui.disclaimer("<b>Окончательное решение принимает куратор и руководство.</b>", {})}
    </div>`;
  }
  return `<div class="card">
    <div class="flex-between mb12"><div class="eyebrow" style="margin:0;">Предварительное заключение AI</div><span class="badge badge-blue">Mock-анализ</span></div>
    <div class="grid grid-2 mb16" style="gap:10px;">
      <div class="card" style="padding:14px;background:var(--bg-elev-2);">
        <div class="faint">Техническая реализуемость</div><div style="font-size:22px;font-weight:800;color:var(--accent);">${a.summary.feasibility}%</div>
      </div>
      <div class="card" style="padding:14px;background:var(--bg-elev-2);">
        <div class="faint">Экономический потенциал</div><div style="font-size:22px;font-weight:800;">${a.summary.economicPotential}</div>
      </div>
      <div class="card" style="padding:14px;background:var(--bg-elev-2);">
        <div class="faint">Срок окупаемости</div><div style="font-size:22px;font-weight:800;">${a.summary.payback}</div>
      </div>
      <div class="card" style="padding:14px;background:var(--bg-elev-2);">
        <div class="faint">Риск</div><div style="font-size:22px;font-weight:800;">${a.summary.risk}</div>
      </div>
    </div>
    <div class="faint mb16">Потенциал масштабирования — <b style="color:var(--text);">${a.summary.scalability}%</b></div>

    <div class="hr"></div>
    <div class="grid grid-2" style="gap:14px;">
      <div><div style="font-weight:700;margin-bottom:6px;">🔧 Техническая оценка</div><p class="faint">${App.esc(a.technical.text)}</p><p class="faint mt8">Сложность внедрения: <b style="color:var(--text)">${a.technical.complexity}</b></p></div>
      <div><div style="font-weight:700;margin-bottom:6px;">💰 Финансовая оценка</div><p class="faint">Затраты: ${App.esc(a.financial.cost)}<br/>Потенциальный эффект: ${App.esc(a.financial.income)}<br/>ROI: ${App.esc(a.financial.roi)}</p></div>
      <div><div style="font-weight:700;margin-bottom:6px;">🏭 Производственная оценка</div><p class="faint">${App.esc(a.production.impact)}<br/>Масштабируемость: ${App.esc(a.production.scalability)}</p></div>
      <div><div style="font-weight:700;margin-bottom:6px;">⚠️ Риски</div><p class="faint">Технические: ${a.risks.technical} · Финансовые: ${a.risks.financial}<br/>Организационные: ${a.risks.organizational} · Внедрения: ${a.risks.implementation}</p></div>
    </div>
    <div class="hr"></div>
    ${App.ui.disclaimer("<b>Окончательное решение принимает куратор и руководство.</b> AI-заключение носит предварительный и вспомогательный характер.", {})}
  </div>`;
}

function votingBlock(p) {
  const voted = App.store.hasVoted(p.id);
  const pct = supportPercent(p);
  return `<div class="card">
    <div class="flex-between mb12"><div class="eyebrow" style="margin:0;">Голосование</div><span class="faint">Проект поддержали ${p.votes.count} человек</span></div>
    <div class="vote-bar-wrap mb8">
      <div class="progress" style="flex:1;"><div style="width:${pct}%;"></div></div>
      <div class="vote-percent">${pct}%</div>
    </div>
    <div class="faint mb16">— за реализацию, из ${p.votes.participants.length + Math.max(0, p.votes.count - p.votes.participants.length)} участников голосования</div>
    ${sparkline(p.votes.history)}
    <button class="btn ${voted ? "btn-secondary" : "btn-primary"} btn-block mt16" ${voted ? "disabled" : ""} onclick="App.actions.voteProject('${p.id}')">${voted ? "✓ Вы поддержали идею" : "👍 Поддержать идею"}</button>
    ${App.ui.disclaimer("Голосование — инструмент общественной обратной связи и не заменяет техническую, финансовую и управленческую экспертизу.", {})}
    <div class="hr"></div>
    <div style="font-weight:700;margin-bottom:8px;font-size:13.5px;">Комментарии</div>
    <div class="field-row" style="margin-bottom:10px;">
      <input type="text" id="vote-comment-${p.id}" placeholder="Оставить комментарий…" />
      <button class="btn btn-secondary btn-sm" onclick="App.actions.addComment('${p.id}')">Отправить</button>
    </div>
    ${p.votes.comments.length ? p.votes.comments.map(c => `<div class="comment"><span class="who">${App.esc(c.who)}</span> <span class="when">${c.when}</span><div class="text">${App.esc(c.text)}</div></div>`).join("") : `<p class="faint">Комментариев пока нет.</p>`}
  </div>`;
}

function curatorPanel(p) {
  const activeStates = ["ai", "curator", "revision"];
  if (!activeStates.includes(p.status)) {
    return `<div class="card">
      <div class="eyebrow">Кабинет куратора</div>
      <p class="faint">Проект уже передан на следующий этап рассмотрения. Действия куратора для этого статуса недоступны.</p>
    </div>`;
  }
  return `<div class="card">
    <div class="eyebrow">Действия куратора</div>
    <p class="faint mb12">Куратор: ${App.esc(App.store.curator(p).fio)}. Возврат на доработку требует обязательного комментария.</p>
    <div class="field"><label>Комментарий / причина</label><textarea id="curator-comment-${p.id}" placeholder="Комментарий куратора (обязателен для «Вернуть на доработку»)"></textarea></div>
    <div class="flex-gap">
      <button class="btn btn-secondary btn-sm" onclick="App.actions.curatorAct('${p.id}','accept')">Принять на рассмотрение</button>
      <button class="btn btn-secondary btn-sm" onclick="App.actions.curatorAct('${p.id}','revision')">Вернуть на доработку</button>
      <button class="btn btn-secondary btn-sm" onclick="App.actions.curatorAct('${p.id}','info')">Запросить доп. информацию</button>
      <button class="btn btn-danger btn-sm" onclick="App.actions.curatorAct('${p.id}','reject')">Отклонить</button>
      <button class="btn btn-primary btn-sm" onclick="App.actions.curatorAct('${p.id}','forward')">Подготовить для руководства</button>
    </div>
  </div>`;
}

function managementPanel(p) {
  if (p.status === "management") {
    return `<div class="card">
      <div class="eyebrow">Решение руководства</div>
      <p class="faint mb12">Ознакомьтесь с <span class="link-btn" onclick="App.go('#/conclusion/${p.id}')">управленческим заключением</span> перед принятием решения.</p>
      <div class="field"><label>Комментарий к решению</label><textarea id="mgmt-note-${p.id}" placeholder="Например, условия одобрения"></textarea></div>
      <div class="flex-gap">
        <button class="btn btn-primary btn-sm" onclick="App.actions.mgmtAct('${p.id}','approve')">Одобрить</button>
        <button class="btn btn-danger btn-sm" onclick="App.actions.mgmtAct('${p.id}','reject')">Отклонить</button>
      </div>
    </div>`;
  }
  if (p.status === "approved") {
    return `<div class="card"><div class="eyebrow">Решение руководства</div><p class="faint mb12">Проект одобрен. Можно запустить пилот.</p><button class="btn btn-primary btn-sm" onclick="App.actions.mgmtAct('${p.id}','pilot')">Запустить пилот</button></div>`;
  }
  if (p.status === "pilot") {
    return `<div class="card"><div class="eyebrow">Решение руководства</div><p class="faint mb12">Пилот запущен. Отметьте проект как реализованный после успешного завершения.</p><button class="btn btn-primary btn-sm" onclick="App.actions.mgmtAct('${p.id}','implement')">Отметить как реализован</button></div>`;
  }
  return `<div class="card"><div class="eyebrow">Решение руководства</div><p class="faint">Проект пока не направлен куратором на рассмотрение руководства.</p></div>`;
}

App.pages.project = function (id) {
  const p = App.store.project(id);
  if (!p) return App.ui.notFound();
  const author = App.store.author(p);
  const curator = App.store.curator(p);
  const role = App.state.role;

  return `
  <section class="section container">
    <div class="flex-between mb8" style="align-items:flex-start;flex-wrap:wrap;gap:10px;">
      <div>
        <span class="tag">${App.esc(p.direction)}</span>
        <h2 style="font-size:24px;margin-top:10px;max-width:720px;">${App.esc(p.title)}</h2>
        <p class="faint mt8">Автор: ${author ? App.esc(author.fio) : "—"} · Куратор: ${curator ? App.esc(curator.fio) : "—"} · Создан ${p.createdAt}</p>
      </div>
      ${App.ui.statusBadge(p.status)}
    </div>

    <div class="card mt16 mb24">${App.ui.stepper(p.status)}</div>

    ${p.managementDecision ? `<div class="mb24">${App.ui.disclaimer(`<b>Решение руководства (${p.managementDecision.when}):</b> ${p.managementDecision.decision === "approved" ? "Одобрено" : p.managementDecision.decision === "rejected" ? "Отклонено" : App.esc(p.managementDecision.decision)}. ${App.esc(p.managementDecision.note || "")}`)}</div>` : ""}

    <div class="grid grid-2" style="align-items:start;gap:16px;">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="card">
          <div class="eyebrow">Описание проекта</div>
          <p style="margin-bottom:10px;"><b>Проблема:</b> <span class="muted">${App.esc(p.problem || "—")}</span></p>
          ${p.solution ? `<p style="margin-bottom:10px;"><b>Решение:</b> <span class="muted">${App.esc(p.solution)}</span></p>` : ""}
          ${p.goal ? `<p style="margin-bottom:10px;"><b>Цель:</b> <span class="muted">${App.esc(p.goal)}</span></p>` : ""}
          ${p.expectedResult ? `<p style="margin-bottom:10px;"><b>Ожидаемый результат:</b> <span class="muted">${App.esc(p.expectedResult)}</span></p>` : ""}
          ${p.resources ? `<p style="margin-bottom:10px;"><b>Ресурсы:</b> <span class="muted">${App.esc(p.resources)}</span></p>` : ""}
          <div class="flex-gap mt8">
            ${p.timeline ? `<span class="tag">Срок: ${App.esc(p.timeline)}</span>` : ""}
            ${p.budget ? `<span class="tag">Бюджет: ${App.esc(p.budget)}</span>` : ""}
            ${p.economicEffect ? `<span class="tag">Эффект: ${App.esc(p.economicEffect)}</span>` : ""}
          </div>
          ${p.attachments && p.attachments.length ? `<div class="mt12 faint">📎 ${p.attachments.map(App.esc).join(", ")}</div>` : ""}
        </div>
        ${aiAnalysisBlock(p)}
        ${p.curatorComments.length ? `<div class="card">
          <div class="eyebrow">Комментарии куратора</div>
          ${p.curatorComments.map(c => `<div class="comment"><span class="who">${App.esc(c.who)}</span> <span class="when">${c.when}</span><div class="text">${App.esc(c.text)}</div></div>`).join("")}
        </div>` : ""}
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${role === "curator" ? curatorPanel(p) : ""}
        ${role === "management" ? managementPanel(p) : ""}
        ${votingBlock(p)}
      </div>
    </div>
  </section>
  ${App.ui.footer()}`;
};

App.actions = App.actions || {};

App.actions.voteProject = function (id) {
  App.store.vote(id);
  App.renderRoute();
};

App.actions.addComment = function (id) {
  const input = document.getElementById("vote-comment-" + id);
  if (!input || !input.value.trim()) return;
  App.store.addVoteComment(id, input.value.trim());
  App.renderRoute();
};

App.actions.curatorAct = function (id, action) {
  const textarea = document.getElementById("curator-comment-" + id);
  const comment = textarea ? textarea.value.trim() : "";
  if (action === "revision" && !comment) {
    alert("Возврат на доработку требует обязательного комментария с указанием причины.");
    return;
  }
  App.store.curatorAction(id, action, comment);
  App.renderRoute();
};

App.actions.mgmtAct = function (id, decision) {
  const textarea = document.getElementById("mgmt-note-" + id);
  const note = textarea ? textarea.value.trim() : "";
  App.store.managementDecide(id, decision, note);
  App.renderRoute();
};
