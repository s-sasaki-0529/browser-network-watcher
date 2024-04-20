export type ChromeRequestDetail = chrome.webRequest.WebRequestBodyDetails;

type RequestBase = {
  id: string;
  method: string;
  path: string;
  startAt: number;
};

type PendingRequest = RequestBase & {
  result: "pending";
};

type SuccessRequest = RequestBase & {
  result: "success";
  endAt: number;
};

type FailureRequest = RequestBase & {
  result: "failure";
  endAt: number;
};

export type RequestInfo = PendingRequest | SuccessRequest | FailureRequest;

/**
 * 監視対象として有効なリクエスト化を判定する
 */
export const isValidRequest = (requestDetail: ChromeRequestDetail) => {
  const requestUrl = new URL(requestDetail.url);
  const currentUrl = new URL(requestDetail.initiator || "");
  const isSameOriginRequest = requestUrl.hostname === currentUrl.hostname;
  const isApiRequest = requestUrl.href.includes("/api/");
  return isSameOriginRequest && isApiRequest;
};

/**
 * リクエストオブジェクトを新規作成する
 */
export const newReuqestInfo = (requestDetail: ChromeRequestDetail): PendingRequest => {
  const requestUrl = new URL(requestDetail.url);
  const path = `/api/${requestUrl.pathname.split("/api/")[1]}`;
  return {
    id: requestDetail.requestId,
    method: requestDetail.method,
    path,
    startAt: Date.now(),
    result: "pending",
  };
};

/**
 * リクエストオブジェクトを要約したテキストを生成する
 */
export const requestToString = (req: RequestInfo) => {
  return `${req.method} /api/${req.path.split("/api/")[1]}`;
};
