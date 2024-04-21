import styled from "styled-components";
import { AnyRequest, requestToString } from "../../lib/request";

type Props = {
  request: AnyRequest;
};

export const RequestListItem: React.FC<Props> = (props) => {
  return <StyledListItem request={props.request}>{requestToString(props.request)}</StyledListItem>;
};

const StyledListItem = styled.li`
  border-bottom: 1px solid #ddd;
  padding: 2px 0;
  list-style: none;
  color: ${(props: { request: AnyRequest }) => {
    switch (props.request.status) {
      case "pending":
        return "blue";
      case "success":
        return "green";
      case "failure":
        return "red";
    }
  }};
  opacity: ${(props: { request: AnyRequest }) => (props.request.startAt < Date.now() - 10000 ? "0.5" : "1")};
`;
