// import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import PersonalKanban from './PersonalKanban';
import { PivotTableFull } from './PivotTable/PivotTable';
import { PivotTable } from './PivotTable/TableVariant/PivotTable';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  // <React.StrictMode>
  // <PersonalKanban />,
  <PivotTable />,
  // </React.StrictMode>
  document.getElementById('root'),
);

serviceWorkerRegistration.register();
reportWebVitals();
