export type ChromeRequestDetail = chrome.webRequest.WebRequestBodyDetails;
export type ChromeResponseDetail = chrome.webRequest.WebResponseCacheDetails;

type RequestBase = {
  id: string;
  method: string;
  path: string;
  startAt: number;
  status: "pending" | "success" | "failure";
};

type PendingRequest = RequestBase & {
  status: "pending";
};

type SuccessRequest = RequestBase & {
  status: "success";
  endAt: number;
};

type FailureRequest = RequestBase & {
  status: "failure";
  endAt: number;
};

export type RequestInfo = PendingRequest | SuccessRequest | FailureRequest;

/**
 * 監視対象として有効なリクエスト化を判定する
 */
export const isValidRequest = (requestList: RequestInfo[], requestDetail: ChromeRequestDetail) => {
  const requestUrl = new URL(requestDetail.url);
  const currentUrl = new URL(requestDetail.initiator || "");
  const isSameOriginRequest = requestUrl.hostname === currentUrl.hostname;
  const isApiRequest = requestUrl.href.includes("/api/");
  return isSameOriginRequest && isApiRequest;
};

/**
 * リクエストオブジェクトを新規作成する
 */
export const newReuqestInfo = (requestDetail: ChromeRequestDetail): RequestInfo => {
  const requestUrl = new URL(requestDetail.url);
  const path = `/api/${requestUrl.pathname.split("/api/")[1]}`;
  return {
    id: requestDetail.requestId,
    method: requestDetail.method,
    path,
    startAt: Date.now(),
    status: "pending",
  };
};

/**
 * リクエストオブジェクトを完了状態にする
 */
export const completeRequestInfo = (requestList: RequestInfo[], responseDetail: ChromeResponseDetail) => {
  const index = requestList.findIndex((req) => req.id === responseDetail.requestId);
  if (!index) return;

  const currentRequest = requestList[index];
  if (currentRequest && currentRequest.status === "pending") {
    requestList[index] = {
      ...currentRequest,
      status: "success",
      endAt: Date.now(),
    };
  }
};
