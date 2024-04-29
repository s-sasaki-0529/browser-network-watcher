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
  console.log(tabs);
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // タブの初期化
  if (tabs[tabId] !== undefined) return;
  tabs[tabId] = {
    requestList: [],
    origin: "",
  };

  // リクエスト発生イベント
  // リクエスト一覧に新しいリクエストオブジェクトを追加し、コンテンツスクリプトに送信
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (
        isValidRequest(details) &&
        tabs[tabId].requestList.find((req) => req.id === details.requestId) === undefined
      ) {
        tabs[tabId].requestList.push(newReuqestInfo(details));
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
      completeRequestInfo(tabs[tabId].requestList, details);
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
