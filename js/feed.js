/* ===== RSSフィード設定:ここを書き換えるだけで追加・変更できます ===== */
const FEEDS = [
    { name: "Publickey", url: "https://www.publickey1.jp/atom.xml" },
    { name: "Zenn", url: "https://zenn.dev/feed" },
    { name: "はてブ IT", url: "https://b.hatena.ne.jp/hotentry/it.rss" }
];
const MAX_ITEMS = 8;
// 無料のRSS→JSON変換サービス(ブラウザから直接RSSを読むとCORSで失敗するため経由します)
const API = "https://api.rss2json.com/v1/api.json?rss_url=";

const tabs = document.getElementById("feed-tabs");
const list = document.getElementById("feed-list");

function setStatus(text) {
    list.innerHTML = "";
    const li = document.createElement("li");
    li.className = "feed-status";
    li.textContent = text;
    list.appendChild(li);
}
function fmtDate(s) {
    const d = new Date(String(s).replace(" ", "T") + (/[zZ+]/.test(s) ? "" : "Z"));
    if (isNaN(d)) return "";
    return d.getFullYear() + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getDate()).padStart(2, "0");
}
async function load(i) {
    [...tabs.children].forEach((b, n) => b.setAttribute("aria-selected", n === i));
    setStatus("読み込み中…");
    try {
        const res = await fetch(API + encodeURIComponent(FEEDS[i].url));
        const data = await res.json();
        if (data.status !== "ok" || !data.items || !data.items.length) throw new Error("no items");
        list.innerHTML = "";
        data.items.slice(0, MAX_ITEMS).forEach(item => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = item.link; a.target = "_blank"; a.rel = "noopener noreferrer";
            const t = document.createElement("time"); t.textContent = fmtDate(item.pubDate);
            const s = document.createElement("span"); s.className = "title"; s.textContent = item.title;
            a.append(t, s); li.appendChild(a); list.appendChild(li);
        });
    } catch (e) {
        setStatus("フィードを取得できませんでした。時間をおいて再読み込みしてください。");
    }
}
FEEDS.forEach((f, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.role = "tab"; b.textContent = f.name;
    b.addEventListener("click", () => load(i));
    tabs.appendChild(b);
});
load(0);