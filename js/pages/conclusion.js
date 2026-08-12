window.App = window.App || {};
App.pages = App.pages || {};

App.pages.conclusion = function (id) {
  const p = App.store.project(id);
  if (!p) return App.ui.notFound();
  const a = p.analysis;
  const curator = App.store.curator(p);
  const curatorRecommendation = p.curatorComments.length ? p.curatorComments[0].text : "Куратор рекомендует проект к рассмотрению руководством.";

  const items = a && a.sufficient ? [
    ["Проблема", p.problem],
    ["Предлагаемое решение", p.solution],
    ["Стоимость проекта", p.budget],
    ["Потенциальный экономический эффект", p.economicEffect],
    ["Срок окупаемости", a.summary.payback],
    ["ROI", a.financial.roi],
    ["Техническая реализуемость", a.summary.feasibility + "% · сложность внедрения: " + a.technical.complexity],
    ["Риски", `Технические — ${a.risks.technical}, финансовые — ${a.risks.financial}, организационные — ${a.risks.organizational}, внедрения — ${a.risks.implementation}`],
    ["Необходимые ресурсы", p.resources],
    ["Возможность масштабирования", a.summary.scalability + "% · " + a.production.scalability],
    ["Рекомендация куратора", curatorRecommendation]
  ] : [
    ["Проблема", p.problem],
    ["Предлагаемое решение", p.solution || "—"],
    ["Стоимость проекта", p.budget || "—"],
    ["Потенциальный экономический эффект", p.economicEffect || "—"],
    ["Срок окупаемости", "Недостаточно данных для оценки"],
    ["ROI", "Недостаточно данных для оценки"],
    ["Техническая реализуемость", "Недостаточно данных для оценки"],
    ["Риски", "Недостаточно данных для оценки"],
    ["Необходимые ресурсы", p.resources || "—"],
    ["Возможность масштабирования", "Недостаточно данных для оценки"],
    ["Рекомендация куратора", curatorRecommendation]
  ];

  return `
  <section class="section container" style="max-width:820px;">
    <div class="flex-between mb16 no-print">
      <span class="link-btn" onclick="App.go('#/project/${p.id}')">← Назад к проекту</span>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨 Печать / PDF</button>
    </div>
    <div class="doc">
      <div class="eyebrow">Управленческое заключение</div>
      <h2>${App.esc(p.title)}</h2>
      <p class="faint mt8">Куратор: ${curator ? App.esc(curator.fio) : "—"} · Направление: ${App.esc(p.direction)} · Дата формирования: ${new Date().toISOString().slice(0, 10)}</p>
      <div class="hr"></div>
      ${items.map(([t, v], i) => `<div class="doc-item"><div class="n">${String(i + 1).padStart(2, "0")}</div><div class="t">${t}</div><div class="v">${App.esc(v || "—")}</div></div>`).join("")}
      <div class="hr"></div>
      ${App.ui.disclaimer("Документ сформирован автоматически на основе mock-анализа AI и носит вспомогательный характер. Окончательное решение принимает руководство на основании данного заключения и рекомендации куратора.")}
    </div>
  </section>
  ${App.ui.footer()}`;
};
