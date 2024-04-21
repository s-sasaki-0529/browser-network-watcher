import { createRoot } from "react-dom/client";
import { RequestListContainer } from "./components/RequestListContainer";

const contentRoot = document.createElement("div");
contentRoot.id = "browser-network-watcher-content-root";
document.body.append(contentRoot);

createRoot(contentRoot).render(<RequestListContainer />);
