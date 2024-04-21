import { completeRequestInfo, isValidRequest, newReuqestInfo } from "../lib/request.js";
import type { ChromeRequestDetail, AnyRequest } from "../lib/request.js";

type TabId = number;

// 初期化が完了したタブ一覧
const initializedTabs: TabId[] = [];

// タブごとのリクエスト一覧
const requestList: Record<TabId, AnyRequest[]> = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // タブの初期化
  if (initializedTabs.includes(tabId)) return;
  initializedTabs.push(tabId);
  requestList[tabId] = [];

  // リクエスト発生イベント
  // リクエスト一覧に新しいリクエストオブジェクトを追加し、コンテンツスクリプトに送信
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (isValidRequest(details)) {
        requestList[tabId].push(newReuqestInfo(details));
        chrome.tabs.sendMessage(tabId, requestList[tabId]);
      }
      return {};
    },
    { urls: ["<all_urls>"] },
  );

  // リクエスト完了イベント
  // リクエストオブジェクトの情報を更新し、コンテンツスクリプトに送信
  chrome.webRequest.onCompleted.addListener(
    (details) => {
      completeRequestInfo(requestList[tabId], details);
      chrome.tabs.sendMessage(details.tabId, requestList[tabId]);
      return {};
    },
    { urls: ["<all_urls>"] },
  );
});
