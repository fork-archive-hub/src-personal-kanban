// import './index.css';

import React from "react";
import ReactDOM from "react-dom";

import PersonalKanban from "./PersonalKanban";
import { PivotTableFull } from "./PivotTable/PivotTable";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  // <React.StrictMode>
  // <PersonalKanban />,
  <PivotTableFull />,
  // </React.StrictMode>
  document.getElementById("root")
);

serviceWorkerRegistration.register();
reportWebVitals();
