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
  const [isLeftPosition, setIsLeftPosition] = useState(false);
  const [isTopPosition, setIsTopPosition] = useState(false);

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

  return (
    <RootDiv
      style={{
        top: isTopPosition ? 0 : "auto",
        bottom: isTopPosition ? "auto" : 0,
        left: isLeftPosition ? 0 : "auto",
        right: isLeftPosition ? "auto" : 0,
      }}
    >
      <RequestListWrapper ref={elRef}>
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
      </RequestListWrapper>
      <MenuButtonWrapper>
        <MenuButton onClick={() => setIsLeftPosition(true)}>←</MenuButton>
        <MenuButton onClick={() => setIsTopPosition(true)}>↑</MenuButton>
        <MenuButton onClick={() => setIsLeftPosition(false)}>→</MenuButton>
        <MenuButton onClick={() => setIsTopPosition(false)}>↓</MenuButton>
        <MenuButton onClick={() => chrome.runtime.sendMessage({ type: "onClearRequest", tabId })}>C</MenuButton>
      </MenuButtonWrapper>
    </RootDiv>
  );
};

const RootDiv = styled.div`
  position: fixed;
  background-color: white;
  border: 1px solid black;
  padding: 5px;
  width: 25vw;
  height: 15vh;
  z-index: 2147483004;
`;

const RequestListWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const MenuButtonWrapper = styled.div`
  position: absolute;
  right: 1.5rem;
  bottom: 0.5rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  transform: translateY(-1rem);
  height: 0;
`;

const MenuButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
