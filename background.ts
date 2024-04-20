/**
 * ネットワークリクエストを監視し、リクエスト内容をフォアグラウンドに送信する
 */
function watchApiRequest(requestDetail: chrome.webRequest.WebRequestBodyDetails) {
  const requestUrl = new URL(requestDetail.url);
  const currentUrl = new URL(requestDetail.initiator || "");
  const isSameOriginRequest = requestUrl.hostname === currentUrl.hostname;
  const isApiRequest = requestUrl.href.includes("/api/");

  if (isSameOriginRequest && isApiRequest) {
    const apiPath = `${requestDetail.method} /api/${requestUrl.pathname.split("/api/")[1]}`;
    chrome.tabs.sendMessage(requestDetail.tabId, { text: apiPath });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        watchApiRequest(details);
        return {};
      },
      { urls: ["<all_urls>"] },
    );
  }
});
