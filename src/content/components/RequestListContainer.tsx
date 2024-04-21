import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
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
    <StyledRootDiv ref={elRef}>
      <ul>
        {requestList.map((req) => (
          <RequestListItem request={req} key={req.id} />
        ))}
      </ul>
    </StyledRootDiv>
  );
};

const StyledRootDiv = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: white;
  border: 1px solid black;
  padding: 5px;
  width: 25vw;
  max-height: 15vh;
  overflow-y: auto;
  z-index: 2147483004;
`;
