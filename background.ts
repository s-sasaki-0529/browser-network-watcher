import { completeRequestInfo, isValidRequest, newReuqestInfo } from "./src/lib/request.js";
import type { ChromeRequestDetail, RequestInfo } from "./src/lib/request.js";

type TabId = number;

// 初期化が完了したタブ一覧
const initializedTabs: TabId[] = [];

// タブごとのリクエスト一覧
const requestList: Record<TabId, RequestInfo[]> = {};

/**
 * ネットワークリクエストを監視し、リクエスト内容をフォアグラウンドに送信する
 */
function watchApiRequest(tabId: TabId, requestDetail: ChromeRequestDetail) {
  if (!isValidRequest(requestList[tabId], requestDetail)) return;
  requestList[tabId].push(newReuqestInfo(requestDetail));
  chrome.tabs.sendMessage(requestDetail.tabId, requestList[tabId]);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // タブの初期化
  if (initializedTabs.includes(tabId)) return;
  initializedTabs.push(tabId);
  requestList[tabId] = [];

  // リクエスト発生イベントを監視
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      watchApiRequest(tabId, details);
      return {};
    },
    { urls: ["<all_urls>"] },
  );
  // リクエスト完了イベント
  chrome.webRequest.onCompleted.addListener(
    (details) => {
      completeRequestInfo(requestList[tabId], details);
      chrome.tabs.sendMessage(details.tabId, requestList[tabId]);
      return {};
    },
    { urls: ["<all_urls>"] },
  );
});
