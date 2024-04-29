import { completeRequestInfo, isValidRequest, newReuqestInfo } from "../lib/request.js";
import type { AnyRequest } from "../lib/request.js";
import { MessageToBackground, MessageToContent, TabId } from "../lib/types.js";

// タブ一覧
const tabs: {
  [tabId: number]: {
    requestList: AnyRequest[];
    origin: string;
  };
} = {};

// コンテントとリクエスト一覧を同期する
const sendUpdateRequestListMessage = (tabId: TabId) => {
  chrome.tabs.sendMessage<MessageToContent>(tabId, {
    tabId,
    type: "updateRequestList",
    value: tabs[tabId].requestList,
  });
};

/**
 * タブ読み込み完了時に各種監視のセットアップを行う
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const origin = tab.url ? new URL(tab.url).origin : "";

  // 新規タブまたはタブのオリジンが変わった場合は初期化
  if (tabs[tabId] === undefined || tabs[tabId].origin !== origin) {
    tabs[tabId] = { requestList: [], origin };
    sendUpdateRequestListMessage(tabId);
  } else {
    return;
  }
});

// リクエスト発生イベント
// リクエスト一覧に新しいリクエストオブジェクトを追加し、コンテンツスクリプトに送信
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (
      isValidRequest(details) &&
      tabs[details.tabId].requestList.find((req) => req.id === details.requestId) === undefined
    ) {
      tabs[details.tabId].requestList.push(newReuqestInfo(details));
      sendUpdateRequestListMessage(details.tabId);
    }
    return {};
  },
  { urls: ["<all_urls>"] },
);

// リクエスト完了イベント
// リクエストオブジェクトの情報を更新し、コンテンツスクリプトに送信
chrome.webRequest.onCompleted.addListener(
  (details) => {
    completeRequestInfo(tabs[details.tabId].requestList, details);
    sendUpdateRequestListMessage(details.tabId);
    return {};
  },
  { urls: ["<all_urls>"] },
);

// コンテンツスクリプトからのメッセージを監視
// リクエストのクリックを受け取ったら新しいタブでその詳細を開く
chrome.runtime.onMessage.addListener((message: MessageToBackground) => {
  if (message.type === "onClickRequest") {
    chrome.tabs.create({ url: message.value.url });
  }
});
