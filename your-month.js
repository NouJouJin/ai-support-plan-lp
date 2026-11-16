/* 「あなたの場合の1か月」：困りごと・事例の切り替え。
   JavaScriptが無効な環境では、すべての内容が縦に並んで表示されます。 */
(() => {
  "use strict";
  const panels = Array.from(document.querySelectorAll("[data-panel]"));
  const chips = Array.from(document.querySelectorAll("[data-theme]"));
  const tabs = Array.from(document.querySelectorAll(".ym-tab"));
  const box = document.getElementById("panels");
  if (!panels.length || !box) return;
  const ids = panels.map((panel) => panel.dataset.panel);

  const showTab = (tab) => {
    tabs.forEach((item) => {
      const on = item === tab;
      item.classList.toggle("is-active", on);
      item.setAttribute("aria-selected", on ? "true" : "false");
      item.tabIndex = on ? 0 : -1;
      const pane = document.getElementById(item.getAttribute("aria-controls"));
      if (pane) pane.hidden = !on;
    });
  };

  const select = (id, scroll) => {
    if (!ids.includes(id)) return;
    panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === id));
    chips.forEach((chip) => {
      const on = chip.dataset.theme === id;
      chip.classList.toggle("is-active", on);
      if (on) chip.setAttribute("aria-current", "true"); else chip.removeAttribute("aria-current");
    });
    if (scroll) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      box.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  chips.forEach((chip) => chip.addEventListener("click", (event) => {
    event.preventDefault();
    const id = chip.dataset.theme;
    select(id, true);
    try { history.replaceState(null, "", "#" + id); } catch { /* 履歴を書き換えられない環境では何もしません */ }
  }));

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      showTab(next);
      next.focus();
    });
  });

  // コピーは、対応しているブラウザでだけボタンを出します。
  if (navigator.clipboard && window.isSecureContext) {
    document.querySelectorAll(".ym-copy").forEach((button) => {
      const label = button.textContent;
      button.hidden = false;
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.copy || "");
          button.textContent = "コピーしました";
        } catch {
          button.textContent = "コピーできませんでした";
        }
        window.setTimeout(() => { button.textContent = label; }, 2400);
      });
    });
  }

  const fromHash = () => {
    const id = decodeURIComponent(window.location.hash.replace("#", ""));
    if (ids.includes(id)) { select(id, true); return true; }
    return false;
  };
  showTab(tabs[0]);
  if (!fromHash()) select(ids[0], false);
  window.addEventListener("hashchange", fromHash);
})();
