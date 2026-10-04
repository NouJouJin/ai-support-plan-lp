(() => {
  "use strict";
  const config = window.AI_SUPPORT_CONFIG || {};
  const validAirtableUrl = (value, embed) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "airtable.com" &&
        (!embed || url.pathname.startsWith("/embed/")) ? url.href : null;
    } catch { return null; }
  };
  const embedUrl = validAirtableUrl(config.airtableEmbedUrl, true);
  const formUrl = validAirtableUrl(config.airtableFormUrl, false);
  // 両方が設定されるまでは、入力・送信できないダミー表示を維持します。
  if (!embedUrl || !formUrl) return;
  const slot = document.getElementById("airtable-slot");
  if (!slot) return;
  const frame = document.createElement("iframe");
  frame.className = "airtable-frame";
  frame.title = "農家向けAI伴走支援 相談登録フォーム";
  frame.src = embedUrl;
  frame.height = "533";
  frame.loading = "lazy";
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  const fallback = document.createElement("p");
  fallback.className = "form-fallback";
  const link = document.createElement("a");
  link.href = formUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "フォームを別タブで開く";
  fallback.append(link);
  slot.replaceChildren(frame, fallback);
})();

/* スマートフォンの追従ボタン：ヒーローを過ぎたら表示し、相談フォームが見えている間は隠します。 */
(() => {
  "use strict";
  if (window.__aiSupportMobileCta) return;
  window.__aiSupportMobileCta = true;
  const bar = document.getElementById("mobile-cta");
  const hero = document.querySelector(".hero");
  const form = document.getElementById("consultation");
  if (!bar || !hero || !form || !("IntersectionObserver" in window)) return;
  const link = bar.querySelector("a");
  let heroVisible = true;
  let formVisible = false;
  const update = () => {
    const show = !heroVisible && !formVisible;
    bar.classList.toggle("is-visible", show);
    bar.setAttribute("aria-hidden", show ? "false" : "true");
    if (link) link.tabIndex = show ? 0 : -1;
  };
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }).observe(hero);
  new IntersectionObserver(([entry]) => { formVisible = entry.isIntersecting; update(); }, { threshold: 0.05 }).observe(form);
})();
