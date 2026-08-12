window.App = window.App || {};

/* Mock AI analysis engine — PRD 4.4.
   This NEVER invents figures when required inputs are missing (non-negotiable rule, PRD 8.2).
   All numbers are deterministic pseudo-analytics derived from the submitted text, not a real model call
   (PRD 9: "AI-ответы — mock-данные"). */
(function () {
  const REQUIRED = [
    ["problem", "Проблема"],
    ["solution", "Предлагаемое решение"],
    ["goal", "Цель"],
    ["expectedResult", "Ожидаемый результат"],
    ["resources", "Необходимые ресурсы"],
    ["timeline", "Предполагаемый срок"],
    ["budget", "Предполагаемый бюджет"],
    ["economicEffect", "Предполагаемый экономический эффект"]
  ];

  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h;
  }

  function parseMoney(str) {
    if (!str) return null;
    const n = parseFloat(String(str).replace(/[^\d.]/g, ""));
    return isNaN(n) ? null : n;
  }

  function riskLabel(v) { return v < 33 ? "Низкий" : v < 66 ? "Средний" : "Высокий"; }
  function potentialLabel(v) { return v < 33 ? "Низкий" : v < 66 ? "Средний" : "Высокий"; }

  App.mockAI = {
    analyze(project) {
      const missing = REQUIRED.filter(([key]) => {
        const v = (project[key] || "").toString().trim();
        return v.length < 4;
      }).map(([, label]) => label);

      if (missing.length > 0) {
        return { sufficient: false, missing };
      }

      const seed = hash(project.title + "|" + project.budget + "|" + project.timeline + "|" + project.direction);
      const feasibility = 55 + (seed % 41); // 55–95
      const scalability = 40 + ((seed >> 3) % 56); // 40–95
      const riskScore = (seed >> 6) % 100;
      const economicScore = (seed >> 9) % 100;

      const budget = parseMoney(project.budget);
      const effect = parseMoney(project.economicEffect);
      let paybackYears;
      if (budget && effect && effect > 0) {
        paybackYears = Math.round((budget / effect) * 10) / 10;
      } else {
        paybackYears = Math.round((1.5 + ((seed >> 12) % 60) / 10) * 10) / 10;
      }

      const roi = budget && effect ? Math.round(((effect * 3 - budget) / budget) * 100) : null;

      return {
        sufficient: true,
        technical: {
          text: `Предварительная оценка на основе описанной проблемы и решения указывает на техническую реализуемость проекта в рамках направления «${project.direction}». Требуется проверка совместимости с текущей инфраструктурой и доступности заявленных ресурсов.`,
          complexity: feasibility > 80 ? "Низкая" : feasibility > 60 ? "Средняя" : "Высокая",
          risks: "Точная оценка технических рисков требует дополнительной технической экспертизы куратора."
        },
        financial: {
          cost: project.budget,
          income: project.economicEffect,
          payback: paybackYears + " года",
          roi: roi !== null ? `~${roi}% за 3 года` : "Недостаточно данных для точного расчёта ROI"
        },
        production: {
          impact: "Оценочное влияние на производительность рассчитано по заявленному ожидаемому результату.",
          scalability: scalability > 70 ? "Высокий" : scalability > 45 ? "Средний" : "Низкий",
          process: "Требует согласования с владельцами затрагиваемых процессов."
        },
        risks: {
          technical: riskLabel((riskScore + 10) % 100),
          financial: riskLabel((riskScore + 40) % 100),
          organizational: riskLabel((riskScore + 65) % 100),
          implementation: riskLabel(riskScore)
        },
        summary: {
          feasibility,
          economicPotential: potentialLabel(economicScore),
          payback: paybackYears + " года",
          risk: riskLabel(riskScore),
          scalability
        }
      };
    }
  };
})();
