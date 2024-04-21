export type TabId = number;
export type MessageToContent = {
  type: "updateRequestList";
  tabId: TabId;
  value: AnyRequest[];
};
export type MessageToBackground = {
  type: "onClickRequest";
  tabId: TabId;
  value: AnyRequest;
};
