import { AnyRequest, requestToString } from "../../lib/request";

type Props = {
  request: AnyRequest;
};

function colorClassName(request: AnyRequest) {
  switch (request.status) {
    case "success":
      return "text-green-600";
    case "failure":
      return "text-red-600";
    default:
      return "text-blue-600";
  }
}

function opacityClassName(request: AnyRequest) {
  return request.startAt < Date.now() - 10000 ? "opacity-50" : "";
}

export const RequestListItem: React.FC<Props> = (props) => {
  return (
    <li
      className={`border-b border-solid border-gray-300 p-2 ${colorClassName(props.request)} ${opacityClassName(props.request)}`}
      key={props.request.id}
      title={props.request.url}
    >
      {requestToString(props.request)}
    </li>
  );
};
