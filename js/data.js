/* Bolashaq Energy — demo seed data. All data below is fictional and used only
   to illustrate the prototype (see PRD section 7 & 9). */
window.App = window.App || {};

App.DIRECTIONS = [
  "Геология", "Бурение", "Разработка месторождений", "Добыча", "Переработка",
  "Транспортировка", "Энергетика", "Цифровизация", "Экология", "Экономика", "Другое"
];

App.COMPANIES = ["АО «Bolashaq Munai Gas»", "ТОО «KazEnergo Production»", "АО «Каспий Terminal»", "ТОО «Digital Oilfield»"];

App.STATUS = {
  draft:        { label: "Черновик", color: "yellow", emoji: "🟡" },
  ai:           { label: "На AI-анализе", color: "blue", emoji: "🔵" },
  curator:      { label: "На рассмотрении куратора", color: "purple", emoji: "🟣" },
  revision:     { label: "Требует доработки", color: "orange", emoji: "🟠" },
  curatorOk:    { label: "Одобрен куратором", color: "green", emoji: "🟢" },
  management:   { label: "На рассмотрении руководства", color: "blue", emoji: "🔵" },
  approved:     { label: "Одобрен", color: "green", emoji: "🟢" },
  pilot:        { label: "Пилот", color: "green", emoji: "🚀" },
  implemented:  { label: "Реализован", color: "green", emoji: "🏆" },
  rejected:     { label: "Отклонён", color: "red", emoji: "🔴" }
};

/* Journey steps shown on the project page stepper (PRD 4.8) */
App.JOURNEY = ["Идея", "AI-анализ", "Куратор", "Голосование", "Руководство", "Пилот", "Реализация", "Результат"];

/* Maps a project status to how many journey steps are "done" and which is "current" */
App.statusToStep = function (status) {
  const map = {
    draft: 0, ai: 1, curator: 2, revision: 2, curatorOk: 3,
    management: 4, approved: 4, pilot: 5, implemented: 7, rejected: 2
  };
  return map[status] ?? 0;
};

App.CURATORS = [
  { id: "c1", fio: "Ержан Абенов", position: "Ведущий куратор направления", direction: "Разработка месторождений", status: "online" },
  { id: "c2", fio: "Динара Сатпаева", position: "Куратор молодых специалистов", direction: "Бурение", status: "online" },
  { id: "c3", fio: "Марат Тулегенов", position: "Куратор молодых специалистов", direction: "Добыча", status: "busy" },
  { id: "c4", fio: "Айгерим Нурланова", position: "Куратор направления «Цифровизация»", direction: "Цифровизация", status: "online" },
  { id: "c5", fio: "Серик Жаксыбеков", position: "Куратор направления «Геология»", direction: "Геология", status: "online" },
  { id: "c6", fio: "Гульмира Оспанова", position: "Куратор направления «Переработка»", direction: "Переработка", status: "busy" },
  { id: "c7", fio: "Нурлан Бектасов", position: "Куратор направления «Транспортировка»", direction: "Транспортировка", status: "online" },
  { id: "c8", fio: "Аружан Кабдулова", position: "Куратор направления «Энергетика»", direction: "Энергетика", status: "online" },
  { id: "c9", fio: "Тимур Асанов", position: "Куратор направления «Экология»", direction: "Экология", status: "online" },
  { id: "c10", fio: "Жанна Исмагулова", position: "Куратор направления «Экономика»", direction: "Экономика", status: "busy" },
  { id: "c11", fio: "Бауыржан Смагулов", position: "Куратор общих направлений", direction: "Другое", status: "online" }
];

App.curatorForDirection = function (direction) {
  return App.CURATORS.find(c => c.direction === direction) || App.CURATORS[App.CURATORS.length - 1];
};

App.USERS = [
  {
    id: "u1", fio: "Алишер Досымов", company: App.COMPANIES[0], department: "Департамент разработки месторождений",
    position: "Инженер по разработке", direction: "Разработка месторождений", experience: "4 года",
    competencies: "Гидродинамическое моделирование, анализ разработки скважин", interests: "Data science, оптимизация добычи",
    role: "specialist", curatorId: "c1"
  },
  {
    id: "u2", fio: "Мадина Ахметова", company: App.COMPANIES[1], department: "Служба бурения",
    position: "Инженер-технолог", direction: "Бурение", experience: "2 года",
    competencies: "Буровые растворы, супервайзинг", interests: "Автоматизация процессов",
    role: "specialist", curatorId: "c2"
  },
  {
    id: "u3", fio: "Данияр Оразбеков", company: App.COMPANIES[0], department: "Управление цифровизации",
    position: "Data-инженер", direction: "Цифровизация", experience: "3 года",
    competencies: "Python, ML, BI-аналитика", interests: "Предиктивная аналитика, IoT",
    role: "specialist", curatorId: "c4"
  }
];

/* Demo "current" specialist follows the walkthrough in PRD section 7 */
App.DEMO_USER_ID = "u1";

App.MANAGER = { id: "m1", fio: "Тимур Кенжебаев", position: "Директор по инновациям и развитию" };

function mkAnalysis(a) {
  return {
    sufficient: true,
    technical: a.technical,
    financial: a.financial,
    production: a.production,
    risks: a.risks,
    summary: {
      feasibility: a.summaryFeasibility,
      economicPotential: a.summaryEconomicPotential,
      payback: a.summaryPayback,
      risk: a.summaryRisk,
      scalability: a.summaryScalability
    }
  };
}

App.SEED_PROJECTS = [
  {
    id: "p1",
    title: "Оптимизация режима работы скважин с использованием интеллектуального анализа данных",
    authorId: "u1",
    scenario: "idea",
    direction: "Разработка месторождений",
    problem: "Действующий фонд скважин работает в неоптимальных режимах, что снижает суммарную добычу и увеличивает энергозатраты насосного оборудования.",
    solution: "Внедрить модуль интеллектуального анализа телеметрии скважин для автоматического подбора оптимальных режимов эксплуатации.",
    goal: "Повысить эффективность эксплуатации фонда скважин без дополнительных капитальных вложений в оборудование.",
    expectedResult: "Рост суммарной добычи на 4–6% и снижение удельных энергозатрат на механизированную добычу.",
    resources: "Доступ к SCADA/телеметрии, 2 инженера-аналитика, сервер для расчётов",
    timeline: "9 месяцев (пилот на 12 скважинах)",
    budget: "48 000 000 ₸",
    economicEffect: "24 000 000 ₸ в год",
    attachments: ["Расчёт_эффекта.xlsx", "Схема_архитектуры.pdf"],
    status: "implemented",
    curatorId: "c1",
    curatorComments: [
      { who: "Ержан Абенов", when: "2026-02-14", text: "Идея сильная, есть подтверждённые данные по пилотным скважинам. Направляю руководству." }
    ],
    managementDecision: { decidedBy: "Тимур Кенжебаев", when: "2026-03-02", decision: "approved", note: "Одобрено к масштабированию на весь фонд добывающих скважин участка №3." },
    votes: { participants: ["u2", "u3"], count: 742, history: [120, 260, 410, 560, 680, 742], comments: [
      { who: "Мадина Ахметова", when: "2026-02-10", text: "Отличная идея, у нас похожая проблема на соседнем месторождении." },
      { who: "Данияр Оразбеков", when: "2026-02-12", text: "Поддерживаю, особенно интересен ML-подход к телеметрии." }
    ] },
    createdAt: "2026-01-20",
    analysis: mkAnalysis({
      technical: { text: "Решение реализуемо на базе существующей SCADA-инфраструктуры компании. Потребуется интеграция модуля аналитики и обучение модели на исторических данных за 2 года.", complexity: "Средняя", risks: "Качество исторических данных телеметрии, задержки интеграции с SCADA" },
      financial: { cost: "48 000 000 ₸", income: "24 000 000 ₸/год", payback: "2,4 года", roi: "~150% за 3 года" },
      production: { impact: "Рост добычи на 4–6%, снижение простоев насосного оборудования", scalability: "Высокий — применимо на всех действующих месторождениях компании", process: "Минимальное вмешательство в текущие процессы эксплуатации" },
      risks: { technical: "Средний", financial: "Низкий", organizational: "Средний", implementation: "Средний" },
      summaryFeasibility: 86, summaryEconomicPotential: "Высокий", summaryPayback: "2,4 года", summaryRisk: "Средний", summaryScalability: 91
    })
  },
  {
    id: "p2",
    title: "Цифровой двойник буровой установки для прогноза аварийных ситуаций",
    authorId: "u2",
    scenario: "idea",
    direction: "Бурение",
    problem: "Аварийные остановки буровых установок приводят к простоям и дополнительным затратам на ликвидацию последствий.",
    solution: "Создать цифровой двойник буровой установки с прогнозной моделью для раннего выявления предаварийных состояний.",
    goal: "Снизить количество незапланированных простоев буровых бригад.",
    expectedResult: "Сокращение простоев на 15–20%.",
    resources: "Датчики вибрации и давления, инженер по надёжности, платформа моделирования",
    timeline: "12 месяцев",
    budget: "65 000 000 ₸",
    economicEffect: "18 000 000 ₸ в год",
    attachments: ["Презентация_проекта.pptx"],
    status: "management",
    curatorId: "c2",
    curatorComments: [
      { who: "Динара Сатпаева", when: "2026-04-02", text: "Проект проработан, требует финального решения руководства по бюджету." }
    ],
    votes: { participants: ["u1"], count: 356, history: [40, 110, 190, 260, 320, 356], comments: [
      { who: "Алишер Досымов", when: "2026-03-28", text: "Актуально, у нас на буровой №7 была похожая авария в прошлом году." }
    ] },
    createdAt: "2026-02-18",
    analysis: mkAnalysis({
      technical: { text: "Требуется установка дополнительных датчиков и интеграция с существующей SCADA буровой. Технологически реализуемо, есть аналогичные внедрения в отрасли.", complexity: "Высокая", risks: "Совместимость датчиков с устаревшим оборудованием отдельных буровых" },
      financial: { cost: "65 000 000 ₸", income: "18 000 000 ₸/год", payback: "3,6 года", roi: "~80% за 3 года" },
      production: { impact: "Снижение простоев на 15–20%, рост безопасности буровых работ", scalability: "Средний — требует адаптации под тип установки", process: "Изменение регламента реагирования на предаварийные сигналы" },
      risks: { technical: "Высокий", financial: "Средний", organizational: "Средний", implementation: "Высокий" },
      summaryFeasibility: 71, summaryEconomicPotential: "Средний", summaryPayback: "3,6 года", summaryRisk: "Высокий", summaryScalability: 64
    })
  },
  {
    id: "p3",
    title: "Мобильное приложение для контроля выбросов на объектах переработки",
    authorId: "u3",
    scenario: "problem",
    direction: "Экология",
    problem: "Ручной сбор данных экомониторинга занимает много времени и подвержен ошибкам ввода.",
    solution: "Разработать мобильное приложение для автоматизированного сбора и передачи данных экомониторинга инспекторами на местах.",
    goal: "Повысить точность и скорость экологической отчётности.",
    expectedResult: "Сокращение времени подготовки отчётов на 30%.",
    resources: "Команда мобильной разработки (2 чел.), интеграция с текущей ERP",
    timeline: "5 месяцев",
    budget: "12 000 000 ₸",
    economicEffect: "6 000 000 ₸ в год",
    attachments: [],
    status: "curator",
    curatorId: "c9",
    curatorComments: [],
    votes: { participants: [], count: 128, history: [10, 30, 60, 90, 110, 128], comments: [] },
    createdAt: "2026-05-05",
    analysis: mkAnalysis({
      technical: { text: "Стандартная задача мобильной разработки с интеграцией через существующее API ERP-системы.", complexity: "Низкая", risks: "Ограниченный опыт полевых инспекторов в работе с мобильными приложениями" },
      financial: { cost: "12 000 000 ₸", income: "6 000 000 ₸/год", payback: "2 года", roi: "~100% за 3 года" },
      production: { impact: "Ускорение экологической отчётности, снижение числа ошибок ввода", scalability: "Высокий — тиражируется на все объекты переработки", process: "Требуется обучение инспекторов работе с приложением" },
      risks: { technical: "Низкий", financial: "Низкий", organizational: "Средний", implementation: "Низкий" },
      summaryFeasibility: 88, summaryEconomicPotential: "Средний", summaryPayback: "2 года", summaryRisk: "Низкий", summaryScalability: 85
    })
  },
  {
    id: "p4",
    title: "Идея: снижение потерь при транспортировке нефти по трубопроводам",
    authorId: "u1",
    scenario: "idea",
    direction: "Транспортировка",
    problem: "Возможны потери продукта при транспортировке из-за отсутствия точных данных о состоянии трубопровода.",
    solution: "",
    goal: "",
    expectedResult: "",
    resources: "",
    timeline: "",
    budget: "",
    economicEffect: "",
    attachments: [],
    status: "ai",
    curatorId: "c7",
    curatorComments: [],
    votes: { participants: [], count: 34, history: [4, 10, 18, 24, 30, 34], comments: [] },
    createdAt: "2026-06-01",
    analysis: { sufficient: false, missing: ["Предлагаемое решение", "Цель", "Ожидаемый результат", "Необходимые ресурсы", "Предполагаемый срок", "Предполагаемый бюджет", "Предполагаемый экономический эффект"] }
  },
  {
    id: "p5",
    title: "Система прогнозирования энергопотребления производственных объектов",
    authorId: "u3",
    scenario: "improvement",
    direction: "Энергетика",
    problem: "Пиковые нагрузки на энергосети производственных объектов приводят к штрафам за превышение заявленной мощности.",
    solution: "Внедрить ML-модель прогноза энергопотребления для заблаговременного управления нагрузкой.",
    goal: "Снизить штрафы за превышение заявленной мощности.",
    expectedResult: "Снижение штрафов на 40%, повышение точности планирования энергопотребления.",
    resources: "Исторические данные энергопотребления, 1 data-инженер",
    timeline: "6 месяцев",
    budget: "9 000 000 ₸",
    economicEffect: "5 500 000 ₸ в год",
    attachments: ["Данные_энергопотребления.xlsx"],
    status: "revision",
    curatorId: "c8",
    curatorComments: [
      { who: "Аружан Кабдулова", when: "2026-05-20", text: "Нужны более подробные расчёты по окупаемости и уточнение источников исторических данных за последние 3 года." }
    ],
    votes: { participants: ["u2"], count: 67, history: [8, 20, 34, 48, 58, 67], comments: [] },
    createdAt: "2026-04-28",
    analysis: mkAnalysis({
      technical: { text: "Реализуемо при наличии качественных исторических данных за последние 2–3 года.", complexity: "Средняя", risks: "Неполнота исторических данных по отдельным объектам" },
      financial: { cost: "9 000 000 ₸", income: "5 500 000 ₸/год", payback: "1,6 года", roi: "~180% за 3 года" },
      production: { impact: "Снижение штрафов, более точное планирование нагрузки", scalability: "Высокий", process: "Требуется регулярная актуализация модели" },
      risks: { technical: "Средний", financial: "Низкий", organizational: "Низкий", implementation: "Средний" },
      summaryFeasibility: 79, summaryEconomicPotential: "Средний", summaryPayback: "1,6 года", summaryRisk: "Низкий", summaryScalability: 83
    })
  },
  {
    id: "p6",
    title: "Автоматизация учёта геологоразведочных данных",
    authorId: "u1",
    scenario: "problem",
    direction: "Геология",
    problem: "Геологоразведочные данные хранятся разрозненно в разных форматах, что затрудняет их повторное использование.",
    solution: "Создать единое хранилище геологоразведочных данных с автоматизированной систематизацией.",
    goal: "Ускорить доступ к геологоразведочным данным для принятия решений.",
    expectedResult: "Сокращение времени поиска и подготовки данных на 50%.",
    resources: "База данных, 1 backend-разработчик, геолог-консультант",
    timeline: "7 месяцев",
    budget: "15 000 000 ₸",
    economicEffect: "7 000 000 ₸ в год",
    attachments: [],
    status: "curatorOk",
    curatorId: "c5",
    curatorComments: [
      { who: "Серик Жаксыбеков", when: "2026-06-10", text: "Хорошо проработанный проект, готовлю материалы для руководства." }
    ],
    votes: { participants: [], count: 51, history: [5, 14, 22, 33, 44, 51], comments: [] },
    createdAt: "2026-05-15",
    analysis: mkAnalysis({
      technical: { text: "Стандартная задача построения хранилища данных, риски минимальны.", complexity: "Низкая", risks: "Миграция исторических данных из устаревших форматов" },
      financial: { cost: "15 000 000 ₸", income: "7 000 000 ₸/год", payback: "2,1 года", roi: "~110% за 3 года" },
      production: { impact: "Ускорение доступа к данным, снижение дублирования работ", scalability: "Высокий", process: "Требуется регламент внесения данных" },
      risks: { technical: "Низкий", financial: "Низкий", organizational: "Средний", implementation: "Низкий" },
      summaryFeasibility: 90, summaryEconomicPotential: "Средний", summaryPayback: "2,1 года", summaryRisk: "Низкий", summaryScalability: 88
    })
  },
  {
    id: "p7",
    title: "Оптимизация логистики поставок реагентов на объекты переработки",
    authorId: "u2",
    scenario: "idea",
    direction: "Экономика",
    problem: "Нерегулярные поставки реагентов приводят к простоям на объектах переработки и излишним складским запасам.",
    solution: "Внедрить систему планирования поставок на основе прогноза потребления.",
    goal: "Снизить складские издержки и исключить простои из-за нехватки реагентов.",
    expectedResult: "Снижение складских издержек на 12%, исключение простоев по причине нехватки реагентов.",
    resources: "Интеграция с ERP, аналитик по цепочкам поставок",
    timeline: "8 месяцев",
    budget: "10 000 000 ₸",
    economicEffect: "4 200 000 ₸ в год",
    attachments: [],
    status: "pilot",
    curatorId: "c10",
    curatorComments: [
      { who: "Жанна Исмагулова", when: "2026-03-15", text: "Проект одобрен, запущен пилот на объекте переработки №2." }
    ],
    managementDecision: { decidedBy: "Тимур Кенжебаев", when: "2026-03-20", decision: "approved", note: "Запустить пилот на объекте №2 сроком 3 месяца." },
    votes: { participants: ["u1", "u3"], count: 214, history: [30, 70, 110, 150, 190, 214], comments: [] },
    createdAt: "2026-02-01",
    analysis: mkAnalysis({
      technical: { text: "Реализуемо на базе текущей ERP-системы с доработкой модуля планирования.", complexity: "Средняя", risks: "Качество прогноза при нестабильном спросе" },
      financial: { cost: "10 000 000 ₸", income: "4 200 000 ₸/год", payback: "2,4 года", roi: "~125% за 3 года" },
      production: { impact: "Снижение простоев, оптимизация складских запасов", scalability: "Средний", process: "Изменение регламента заказа реагентов" },
      risks: { technical: "Низкий", financial: "Низкий", organizational: "Средний", implementation: "Низкий" },
      summaryFeasibility: 83, summaryEconomicPotential: "Средний", summaryPayback: "2,4 года", summaryRisk: "Низкий", summaryScalability: 74
    })
  },
  {
    id: "p8",
    title: "Роботизированный осмотр резервуарного парка",
    authorId: "u3",
    scenario: "idea",
    direction: "Добыча",
    problem: "Ручной осмотр резервуарного парка занимает много времени и связан с рисками для персонала.",
    solution: "Использовать автономного робота для регулярного осмотра резервуаров и раннего выявления дефектов.",
    goal: "Повысить безопасность и снизить трудозатраты на осмотр резервуаров.",
    expectedResult: "Снижение времени осмотра на 60%, повышение безопасности персонала.",
    resources: "Робототехническая платформа, инженер по эксплуатации",
    timeline: "10 месяцев",
    budget: "70 000 000 ₸",
    economicEffect: "9 000 000 ₸ в год",
    attachments: ["ТЗ_на_робота.docx"],
    status: "rejected",
    curatorId: "c3",
    curatorComments: [
      { who: "Марат Тулегенов", when: "2026-01-25", text: "Отклонено на данном этапе — срок окупаемости слишком длительный при текущем бюджете." }
    ],
    managementDecision: { decidedBy: "Тимур Кенжебаев", when: "2026-02-01", decision: "rejected", note: "Вернуться к рассмотрению при снижении стоимости оборудования." },
    votes: { participants: [], count: 89, history: [10, 25, 40, 60, 75, 89], comments: [] },
    createdAt: "2025-12-10",
    analysis: mkAnalysis({
      technical: { text: "Технологически реализуемо, но требует адаптации робототехнической платформы под климатические условия месторождения.", complexity: "Высокая", risks: "Надёжность оборудования при низких температурах" },
      financial: { cost: "70 000 000 ₸", income: "9 000 000 ₸/год", payback: "7,8 года", roi: "~35% за 3 года" },
      production: { impact: "Повышение безопасности, снижение трудозатрат на осмотр", scalability: "Средний", process: "Изменение регламента технического осмотра" },
      risks: { technical: "Высокий", financial: "Высокий", organizational: "Средний", implementation: "Высокий" },
      summaryFeasibility: 58, summaryEconomicPotential: "Низкий", summaryPayback: "7,8 года", summaryRisk: "Высокий", summaryScalability: 52
    })
  }
];

App.CHAT_QA = [
  { q: "Как создать проект?", a: "Нажмите кнопку «Предложить идею» в личном кабинете, выберите один из трёх сценариев (новая идея, доработка проекта или решение проблемы) и заполните форму. После отправки система автоматически запустит AI-анализ." },
  { q: "Как улучшить мою идею?", a: "Заполните все поля формы максимально подробно — особенно проблему, ожидаемый результат и предполагаемый бюджет. Чем полнее данные, тем точнее предварительная оценка AI и быстрее решение куратора." },
  { q: "Какие данные нужны для финансового расчёта?", a: "Для финансовой оценки AI нужны: предполагаемый бюджет, предполагаемый экономический эффект и предполагаемый срок реализации. Без этих данных AI сообщит, что оценка невозможна, и не будет их придумывать." },
  { q: "Что происходит после подачи проекта?", a: "Проект проходит предварительный AI-анализ, затем передаётся вашему куратору. Куратор может принять его на рассмотрение, вернуть на доработку, запросить дополнительную информацию или направить руководству." },
  { q: "Кто мой куратор?", a: "Куратор назначается автоматически по выбранному направлению деятельности. Карточку куратора можно увидеть в личном кабинете в блоке «Мой куратор»." },
  { q: "На каком этапе находится мой проект?", a: "Откройте страницу проекта — вверху отображается визуальный путь проекта: Идея → AI-анализ → Куратор → Голосование → Руководство → Пилот → Реализация → Результат." }
];
