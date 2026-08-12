window.App = window.App || {};

/* AI-гид — встроенный чат-помощник по навигации (PRD 4.13). Помогает ориентироваться
   в системе, не заменяет куратора и не участвует в принятии решений по проектам. */
(function () {
  let open = false;
  let messages = [{ bot: true, text: "Здравствуйте! Я AI-гид — помогу сориентироваться в системе. Задайте вопрос или выберите один из вариантов ниже." }];

  function findAnswer(text) {
    const q = text.toLowerCase();
    let best = null, bestScore = 0;
    App.CHAT_QA.forEach(item => {
      const words = item.q.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const score = words.filter(w => q.includes(w)).length;
      if (score > bestScore) { bestScore = score; best = item; }
    });
    if (best && bestScore > 0) return best.a;
    return "Не уверен, что правильно понял вопрос. Я помогаю с навигацией по системе — попробуйте выбрать один из готовых вопросов ниже, либо уточните формулировку. По вопросам решения о проекте, пожалуйста, обратитесь к вашему куратору.";
  }

  function render() {
    const el = document.getElementById("chat");
    if (!el) return;
    el.innerHTML = `
      <button class="chat-fab" onclick="App.chatbot.toggle()">${open ? "✕" : "💬"}</button>
      <div class="chat-panel ${open ? "open" : ""}">
        <div class="chat-head">
          <div class="avatar" style="background:linear-gradient(135deg, var(--accent), var(--accent-dim));color:#04231a;">AI</div>
          <div>
            <div style="font-weight:700;font-size:13.5px;">AI-гид</div>
            <div class="faint">Помощь по навигации, не заменяет куратора</div>
          </div>
        </div>
        <div class="chat-body" id="chat-body">
          ${messages.map(m => `<div class="chat-msg ${m.bot ? "bot" : "user"}">${App.esc(m.text)}</div>`).join("")}
        </div>
        <div class="chat-suggestions">
          ${App.CHAT_QA.slice(0, 3).map(item => `<button class="chip-btn" onclick="App.chatbot.ask('${item.q.replace(/'/g, "\\'")}')">${item.q}</button>`).join("")}
        </div>
        <div class="chat-input-row">
          <input type="text" id="chat-input" placeholder="Введите вопрос…" onkeydown="if(event.key==='Enter') App.chatbot.send()" />
          <button class="btn btn-primary btn-sm" onclick="App.chatbot.send()">➤</button>
        </div>
      </div>`;
    const body = document.getElementById("chat-body");
    if (body) body.scrollTop = body.scrollHeight;
  }

  App.chatbot = {
    render,
    toggle() { open = !open; render(); },
    ask(q) {
      messages.push({ bot: false, text: q });
      messages.push({ bot: true, text: findAnswer(q) });
      render();
    },
    send() {
      const input = document.getElementById("chat-input");
      if (!input || !input.value.trim()) return;
      const val = input.value.trim();
      input.value = "";
      App.chatbot.ask(val);
    }
  };
})();
