window.App = window.App || {};

(function () {
  function parseHash() {
    const hash = (location.hash || "#/").replace(/^#/, "");
    const parts = hash.split("/").filter(Boolean);
    return parts;
  }

  function hasEntered() {
    return !!localStorage.getItem("bolashaq_seen_login");
  }

  App.go = function (hash) {
    if (location.hash === hash) { App.renderRoute(); return; }
    location.hash = hash;
  };

  App.setRole = function (role) {
    App.store.setRole(role);
    App.renderRoute();
  };

  App.renderRoute = function () {
    const parts = parseHash();
    const root = parts[0] || "";
    const app = document.getElementById("app");
    window.scrollTo(0, 0);

    const publicRoutes = ["", "login", "register"];
    if (!publicRoutes.includes(root) && !hasEntered()) {
      location.hash = "#/";
      return;
    }

    let html = "";
    switch (root) {
      case "":
        html = App.pages.landing();
        break;
      case "login":
        html = App.pages.login();
        break;
      case "register":
        html = App.pages.register();
        break;
      case "dashboard":
        html = App.pages.dashboard();
        break;
      case "my-path":
        html = App.pages.myPath();
        break;
      case "new":
        html = App.pages.newProject();
        break;
      case "project":
        html = App.pages.project(parts[1]);
        break;
      case "catalog":
        html = App.pages.catalog();
        break;
      case "curator":
        html = App.pages.curator();
        break;
      case "management":
        html = App.pages.management();
        break;
      case "conclusion":
        html = App.pages.conclusion(parts[1]);
        break;
      default:
        html = App.ui.notFound();
    }

    app.innerHTML = html;
    App.ui.renderHeader();
    App.chatbot.render();
  };

  window.addEventListener("hashchange", App.renderRoute);
})();
