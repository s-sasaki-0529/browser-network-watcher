export type ChromeRequestDetail = chrome.webRequest.WebRequestBodyDetails;
export type ChromeResponseDetail = chrome.webRequest.WebResponseCacheDetails;

type RequestBase = {
  id: string;
  method: string;
  url: string;
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

export type AnyRequest = PendingRequest | SuccessRequest | FailureRequest;

/**
 * 監視対象として有効なリクエスト化を判定する
 */
export const isValidRequest = (requestList: AnyRequest[], requestDetail: ChromeRequestDetail) => {
  const requestUrl = new URL(requestDetail.url);
  const currentUrl = new URL(requestDetail.initiator || "");
  const isSameOriginRequest = requestUrl.hostname === currentUrl.hostname;
  const isApiRequest = requestUrl.href.includes("/api/");
  return isSameOriginRequest && isApiRequest;
};

/**
 * リクエストオブジェクトを新規作成する
 */
export const newReuqestInfo = (requestDetail: ChromeRequestDetail): AnyRequest => {
  const requestUrl = new URL(requestDetail.url);
  const path = `/api/${requestUrl.pathname.split("/api/")[1]}`;
  return {
    id: requestDetail.requestId,
    method: requestDetail.method,
    url: requestDetail.url,
    path,
    startAt: Date.now(),
    status: "pending",
  };
};

/**
 * リクエストオブジェクトを完了状態にする
 */
export const completeRequestInfo = (requestList: AnyRequest[], responseDetail: ChromeResponseDetail) => {
  const index = requestList.findIndex((req) => req.id === responseDetail.requestId);
  const currentRequest = requestList[index];
  if (currentRequest?.status !== "pending") return;

  const statusCodeGroup = Math.floor(responseDetail.statusCode / 100);
  if (statusCodeGroup <= 3) {
    requestList[index] = {
      ...currentRequest,
      status: "success",
      endAt: Date.now(),
    };
  } else {
    requestList[index] = {
      ...currentRequest,
      status: "failure",
      endAt: Date.now(),
    };
  }
};

/**
 * リクエストオブジェクトを要約したテキストを生成する
 */
export function requestToString(req: AnyRequest) {
  if (req.status === "pending") {
    return `${req.method} /${req.path.split("/api/")[1]}`;
  } else {
    const latency = req.endAt - req.startAt;
    return `${req.method} /${req.path.split("/api/")[1]} (${latency}ms)`;
  }
}
