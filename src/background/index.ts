import { completeRequestInfo, isValidRequest, newReuqestInfo } from "../lib/request.js";
import type { AnyRequest } from "../lib/request.js";
import { MessageToBackground, MessageToContent, TabId } from "../lib/types.js";

// 初期化が完了したタブ一覧
const initializedTabs: TabId[] = [];

// タブごとのリクエスト一覧
const requestList: Record<TabId, AnyRequest[]> = {};

// コンテントとリクエスト一覧を同期する
const sendUpdateRequestListMessage = (tabId: TabId) => {
  chrome.tabs.sendMessage<MessageToContent>(tabId, { tabId, type: "updateRequestList", value: requestList[tabId] });
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // タブの初期化
  if (initializedTabs.includes(tabId)) return;
  initializedTabs.push(tabId);
  requestList[tabId] = [];

  // リクエスト発生イベント
  // リクエスト一覧に新しいリクエストオブジェクトを追加し、コンテンツスクリプトに送信
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (isValidRequest(details) && requestList[tabId].find((req) => req.id === details.requestId) === undefined) {
        requestList[tabId].push(newReuqestInfo(details));
        sendUpdateRequestListMessage(tabId);
      }
      return {};
    },
    { urls: ["<all_urls>"], tabId },
  );

  // リクエスト完了イベント
  // リクエストオブジェクトの情報を更新し、コンテンツスクリプトに送信
  chrome.webRequest.onCompleted.addListener(
    (details) => {
      completeRequestInfo(requestList[tabId], details);
      sendUpdateRequestListMessage(tabId);
      return {};
    },
    { urls: ["<all_urls>"], tabId },
  );

  // コンテンツスクリプトからのメッセージを監視
  // リクエストのクリックを受け取ったら新しいタブでその詳細を開く
  chrome.runtime.onMessage.addListener((message: MessageToBackground) => {
    if (message.tabId !== tabId) return;
    if (message.type === "onClickRequest") {
      chrome.tabs.create({ url: message.value.url });
    }
  });
});
