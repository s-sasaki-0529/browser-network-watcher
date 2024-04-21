import styled from "styled-components";
import { AnyRequest, requestToString } from "../../lib/request";

type Props = {
  request: AnyRequest;
  onClickRequest: () => void;
};

export const RequestListItem: React.FC<Props> = ({ request, onClickRequest }) => {
  return (
    <StyledListItem request={request}>
      <a
        href=""
        onClick={(e) => {
          e.preventDefault();
          onClickRequest();
        }}
      >
        {requestToString(request)}
      </a>
    </StyledListItem>
  );
};

const StyledListItem = styled.li<{ request: AnyRequest }>`
  border-bottom: 1px solid #ddd;
  padding: 0.5rem;
  list-style: none;
  color: ${(props) => {
    switch (props.request.status) {
      case "pending":
        return "blue";
      case "success":
        return "green";
      case "failure":
        return "red";
    }
  }};
  opacity: ${(props: { request: AnyRequest }) => (props.request.startAt < Date.now() - 5000 ? "0.5" : "1")};
  > a {
    color: inherit;
    text-decoration: none;
  }
`;
