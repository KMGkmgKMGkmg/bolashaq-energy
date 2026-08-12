window.App = window.App || {};

(function () {
  const STORAGE_KEY = "bolashaq_energy_state_v1";

  function freshState() {
    return {
      users: JSON.parse(JSON.stringify(App.USERS)),
      projects: JSON.parse(JSON.stringify(App.SEED_PROJECTS)),
      currentUserId: App.DEMO_USER_ID,
      role: "specialist", // specialist | curator | management
      notifications: [
        { id: "n1", text: "Куратор оставил комментарий по проекту «Оптимизация режима работы скважин…»", when: "2026-02-14" },
        { id: "n2", text: "Ваш проект получил статус «Реализован» 🏆", when: "2026-03-10" }
      ]
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupted storage */ }
    return freshState();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(App.state));
  }

  App.state = load();

  App.store = {
    save,
    reset() { App.state = freshState(); save(); },

    currentUser() { return App.state.users.find(u => u.id === App.state.currentUserId); },

    curatorOf(user) { return App.curatorForDirection(user.direction); },

    setRole(role) { App.state.role = role; save(); },

    project(id) { return App.state.projects.find(p => p.id === id); },

    projectsByAuthor(userId) { return App.state.projects.filter(p => p.authorId === userId); },

    projectsForCurator(curatorId) { return App.state.projects.filter(p => p.curatorId === curatorId); },

    author(project) { return App.state.users.find(u => u.id === project.authorId); },

    curator(project) { return App.CURATORS.find(c => c.id === project.curatorId); },

    register(fields) {
      const id = "u" + (App.state.users.length + 1) + "_" + Date.now().toString(36).slice(-4);
      const curator = App.curatorForDirection(fields.direction);
      const user = Object.assign({ id, role: "specialist", curatorId: curator.id }, fields);
      App.state.users.push(user);
      App.state.currentUserId = id;
      App.state.role = "specialist";
      save();
      return user;
    },

    loginAs(userId) {
      App.state.currentUserId = userId;
      App.state.role = "specialist";
      save();
    },

    createProject(fields) {
      const id = "p" + Date.now().toString(36);
      const user = App.store.currentUser();
      const curator = App.curatorForDirection(fields.direction || user.direction);
      const project = Object.assign({
        id,
        authorId: user.id,
        curatorId: curator.id,
        attachments: fields.attachments || [],
        status: "ai",
        curatorComments: [],
        votes: { participants: [], count: 0, history: [0], comments: [] },
        createdAt: new Date().toISOString().slice(0, 10)
      }, fields);
      project.analysis = App.mockAI.analyze(project);
      App.state.projects.unshift(project);
      save();
      return project;
    },

    vote(projectId) {
      const p = App.store.project(projectId);
      const uid = App.state.currentUserId;
      if (p.votes.participants.includes(uid)) return false;
      p.votes.participants.push(uid);
      p.votes.count += 1;
      p.votes.history.push(p.votes.count);
      save();
      return true;
    },

    hasVoted(projectId) {
      const p = App.store.project(projectId);
      return p.votes.participants.includes(App.state.currentUserId);
    },

    addVoteComment(projectId, text) {
      const p = App.store.project(projectId);
      const user = App.store.currentUser();
      p.votes.comments.unshift({ who: user.fio, when: new Date().toISOString().slice(0, 10), text });
      save();
    },

    curatorAction(projectId, action, comment) {
      const p = App.store.project(projectId);
      const curator = App.store.curator(p);
      const entry = { who: curator.fio, when: new Date().toISOString().slice(0, 10), text: comment || "" };
      const transitions = {
        accept: "curator",
        revision: "revision",
        info: "curator",
        reject: "rejected",
        forward: "management",
        approveForManagement: "management"
      };
      if (transitions[action]) p.status = transitions[action];
      if (comment) p.curatorComments.unshift(entry);
      save();
    },

    managementDecide(projectId, decision, note) {
      const p = App.store.project(projectId);
      const statusMap = { approve: "approved", pilot: "pilot", implement: "implemented", reject: "rejected" };
      p.status = statusMap[decision] || p.status;
      p.managementDecision = { decidedBy: App.MANAGER.fio, when: new Date().toISOString().slice(0, 10), decision, note: note || "" };
      save();
    },

    myPathStats(userId) {
      const projects = App.store.projectsByAuthor(userId);
      const implemented = projects.filter(p => p.status === "implemented");
      const accepted = projects.filter(p => !["draft", "ai", "revision", "rejected"].includes(p.status));
      const votes = projects.reduce((s, p) => s + p.votes.count, 0);
      const effect = implemented.reduce((s, p) => {
        const n = parseFloat((p.economicEffect || "0").replace(/[^\d.]/g, ""));
        return s + (isNaN(n) ? 0 : n);
      }, 0);
      return { ideas: projects.length, accepted: accepted.length, implemented: implemented.length, votes, effect };
    }
  };
})();
