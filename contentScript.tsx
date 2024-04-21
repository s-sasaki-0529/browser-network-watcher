import type { RequestInfo } from "./src/request";

// バックグラウンドからのメッセージをリスン
chrome.runtime.onMessage.addListener((requestList) => {
  updateOverlay(requestList);
});

// オーバーレイ表示用のコンテナを作成
const overlayContainer = (() => {
  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.bottom = "10px";
  el.style.right = "10px";
  el.style.backgroundColor = "white";
  el.style.border = "1px solid black";
  el.style.padding = "5px";
  el.style.minWidth = "20vw";
  el.style.maxWidth = "33vw";
  el.style.maxHeight = "20vh";
  el.style.overflowY = "auto";
  el.style.zIndex = "2147483004";
  document.body.appendChild(el);
  return el;
})();

// オーバーレイをドラッグで操作できるようにする
(() => {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  overlayContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - overlayContainer.getBoundingClientRect().left;
    offsetY = e.clientY - overlayContainer.getBoundingClientRect().top;
    overlayContainer.style.cursor = "move";
  });
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      overlayContainer.style.left = e.clientX - offsetX + "px";
      overlayContainer.style.top = e.clientY - offsetY + "px";
      overlayContainer.style.right = "auto";
      overlayContainer.style.bottom = "auto";
    }
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
    overlayContainer.style.cursor = "default";
  });
})();

// 要素の内容を更新する関数
function updateOverlay(requestList: RequestInfo[]) {
  // 既存の内容をクリア
  overlayContainer.innerHTML = "";

  // リクエスト情報ごとに要素を作成し、オーバーレイに追加
  requestList.forEach((req) => {
    const requestDiv = document.createElement("div");
    requestDiv.textContent = requestToString(req);
    requestDiv.style.borderBottom = "1px solid #ddd";
    requestDiv.style.padding = "2px 0";
    requestDiv.title = req.url;

    // 色を結果によって変更
    if (req.status === "pending") {
      requestDiv.style.color = "blue";
    } else if (req.status === "success") {
      requestDiv.style.color = "green";
    } else if (req.status === "failure") {
      requestDiv.style.color = "red";
    }
    // 結果に関係なく、古いリクエストは半透明にして目立たなくする
    if (req.startAt < Date.now() - 10000) {
      requestDiv.style.opacity = "0.5";
    }

    overlayContainer.appendChild(requestDiv);
    overlayContainer.scrollTo(0, overlayContainer.scrollHeight);
  });
}

/**
 * リクエストオブジェクトを要約したテキストを生成する
 */
function requestToString(req: RequestInfo) {
  if (req.status === "pending") {
    return `${req.method} /api/${req.path.split("/api/")[1]}`;
  } else {
    const latency = req.endAt - req.startAt;
    return `${req.method} /api/${req.path.split("/api/")[1]} (${latency}ms)`;
  }
}