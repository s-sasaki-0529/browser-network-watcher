import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AnyRequest } from "../../lib/request";
import { RequestListItem } from "./RequestListItem";
import { MessageToContent } from "../../lib/types";

type Props = {};

export const RequestListContainer: React.FC<Props> = (_props) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [tabId, setTabId] = useState<number>(0);
  const [requestList, setRequestList] = useState<AnyRequest[]>([]);
  const [isLeftPosition, setIsLeftPosition] = useState(true);
  const [isTopPosition, setIsTopPosition] = useState(true);

  /**
   * バックグラウンドからのメッセージとステートを同期する
   */
  useEffect(() => {
    const callback = (message: MessageToContent) => {
      if (message.type !== "updateRequestList") return;
      setTabId(message.tabId);
      setRequestList(message.value);
    };
    chrome.runtime.onMessage.addListener(callback);
    return () => chrome.runtime.onMessage.removeListener(callback);
  }, []);

  /**
   * ステート更新時、スクロールを末尾へ移動
   */
  useEffect(() => {
    if (elRef.current) {
      elRef.current.scrollTo(0, elRef.current.scrollHeight);
    }
  }, [requestList]);

  if (requestList.length === 0) return null;

  return (
    <StyledRootDiv ref={elRef} isLeftPosition={isLeftPosition} isTopPosition={isTopPosition}>
      <ul>
        {requestList.map((req) => (
          <RequestListItem
            request={req}
            key={req.id}
            onClickRequest={() => {
              chrome.runtime.sendMessage({ type: "onClickRequest", tabId, value: req });
            }}
          />
        ))}
      </ul>
      <MoveButtonWrapper>
        <MoveButton onClick={() => setIsLeftPosition(true)}>←</MoveButton>
        <MoveButton onClick={() => setIsTopPosition(true)}>↑</MoveButton>
        <MoveButton onClick={() => setIsLeftPosition(false)}>→</MoveButton>
        <MoveButton onClick={() => setIsTopPosition(false)}>↓</MoveButton>
      </MoveButtonWrapper>
    </StyledRootDiv>
  );
};

const StyledRootDiv = styled.div<{ isLeftPosition: boolean; isTopPosition: boolean }>`
  position: fixed;
  top: ${(props) => (props.isTopPosition ? "0" : "auto")};
  bottom: ${(props) => (props.isTopPosition ? "auto" : "0")};
  left: ${(props) => (props.isLeftPosition ? "0" : "auto")};
  right: ${(props) => (props.isLeftPosition ? "auto" : "0")};
  background-color: white;
  border: 1px solid black;
  padding: 5px;
  width: 25vw;
  max-height: 15vh;
  overflow-y: auto;
  z-index: 2147483004;
`;

const MoveButtonWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  transform: translateY(-1rem);
  height: 0;
`;

const MoveButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #888;
  }
`;
