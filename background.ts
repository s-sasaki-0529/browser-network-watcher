import { isValidRequest, newReuqestInfo, requestToString, type ChromeRequestDetail } from "./src/request.js";

/**
 * ネットワークリクエストを監視し、リクエスト内容をフォアグラウンドに送信する
 */
function watchApiRequest(requestDetail: ChromeRequestDetail) {
  if (!isValidRequest(requestDetail)) return;
  const request = newReuqestInfo(requestDetail);
  chrome.tabs.sendMessage(requestDetail.tabId, { text: requestToString(request) });
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
