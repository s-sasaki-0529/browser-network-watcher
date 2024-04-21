import type { RequestInfo } from "./src/request";

// オーバーレイ表示用のコンテナを作成
const overlayContainer = document.createElement("div");
overlayContainer.style.position = "fixed";
overlayContainer.style.bottom = "10px";
overlayContainer.style.right = "10px";
overlayContainer.style.backgroundColor = "white";
overlayContainer.style.border = "1px solid black";
overlayContainer.style.padding = "5px";
overlayContainer.style.overflowY = "auto";
overlayContainer.style.zIndex = "1000";
document.body.appendChild(overlayContainer);

// 要素の内容を更新する関数
const updateOverlay = (requestList: RequestInfo[]) => {
  // 既存の内容をクリア
  overlayContainer.innerHTML = "";

  // リクエスト情報ごとに要素を作成し、オーバーレイに追加
  requestList.forEach((req) => {
    const requestDiv = document.createElement("div");
    requestDiv.textContent = requestToString(req);
    requestDiv.style.borderBottom = "1px solid #ddd";
    requestDiv.style.padding = "2px 0";

    // 色を結果によって変更
    if (req.result === "pending") {
      requestDiv.style.color = "blue";
    } else if (req.result === "success") {
      requestDiv.style.color = "green";
    } else if (req.result === "failure") {
      requestDiv.style.color = "red";
    }

    overlayContainer.appendChild(requestDiv);
  });
};

// バックグラウンドからのメッセージをリスン
chrome.runtime.onMessage.addListener((requestList) => {
  updateOverlay(requestList);
});

/**
 * リクエストオブジェクトを要約したテキストを生成する
 */
function requestToString(req: RequestInfo) {
  return `${req.method} /api/${req.path.split("/api/")[1]}`;
}
