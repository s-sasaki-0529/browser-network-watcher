import { isValidRequest, newReuqestInfo } from "./src/request.js";
import type { ChromeRequestDetail, RequestInfo } from "./src/request.js";

const requestList: RequestInfo[] = [];

/**
 * ネットワークリクエストを監視し、リクエスト内容をフォアグラウンドに送信する
 */
function watchApiRequest(requestDetail: ChromeRequestDetail) {
  if (!isValidRequest(requestDetail)) return;
  requestList.push(newReuqestInfo(requestDetail));
  chrome.tabs.sendMessage(requestDetail.tabId, requestList);
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
