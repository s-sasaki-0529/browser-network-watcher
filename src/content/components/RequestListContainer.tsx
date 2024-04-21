import { useEffect, useRef, useState } from "react";
import { AnyRequest } from "../../lib/request";
import { RequestListItem } from "./RequestListItem";
import { useDraggable } from "../hooks/useDraggable";

type Props = {};

export const RequestListContainer: React.FC<Props> = (_props) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [requestList, setRequestList] = useState<AnyRequest[]>([]);

  /**
   * バックグラウンドからのメッセージとステートを同期する
   */
  useEffect(() => {
    const updateRequestListState = (requestList: AnyRequest[]) => setRequestList(requestList);
    chrome.runtime.onMessage.addListener(updateRequestListState);
    return () => chrome.runtime.onMessage.removeListener(updateRequestListState);
  }, []);

  /**
   * ステート更新時、スクロールを末尾へ移動
   */
  useEffect(() => {
    if (elRef.current) {
      elRef.current.scrollTo(0, elRef.current.scrollHeight);
    }
  }, [requestList]);

  /**
   * コンテナ全体をドラッグで操作できるようにする
   */
  useDraggable(elRef);

  return (
    <div
      ref={elRef}
      className="fixed bottom-2.5 right-2.5 bg-white border border-solid border-black p-1.25 min-w-[20vw] max-w-[33vw] max-h-[20vh] overflow-y-auto z-[2147483004]"
    >
      <ul>
        {requestList.map((req) => (
          <RequestListItem request={req} key={req.id} />
        ))}
      </ul>
    </div>
  );
};
