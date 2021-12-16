import '../pivot-table.css';

import cx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useExpanded, useGroupBy } from 'react-table';

import { BASIC_COLUMNS, FAKE_DATA } from '../_fakeData/storyFakeData';
import { useExpandAll } from '../plugin/useExpandAll/useExpandAll';
import {
  getKanbanDataFromPvtData,
  getPivotTableStandardColumns,
} from '../utils/mockData';
import { PivotTableStandard } from './PivotTableStandard';
import { Table, useTable } from '..';

export type PivotTableStandardProps = {
  data?: Record<string, any>;
  updateData?: Function;
  showGroupedTable?: boolean;
  setToggleShowGroupedTable?: Function;
  groupOptions?: any;
  showToolbar?: boolean;
  showToolbarActionsMenuButtons?: boolean;
};

export function PivotTable(props: PivotTableStandardProps) {
  const [pvtData, setPvtData] = useState({
    data: [
      { recordId: 1, field1: '第1行', field2: '', fieldN: '' },
      { recordId: 2, field1: '第2行', field2: '', fieldN: '' },
      { recordId: 3, field1: '第3行', field2: '', fieldN: '' },
    ],
  });

  const [pvtViews, setPvtViews] = useState([
    {
      id: 'idTv',
      name: 'tableView1',
      type: 'table',
      tableColumns: {},
      tableConfig: {},
    },
    {
      id: 'idKv',
      name: 'kanbanView1',
      type: 'kanban',
      tableColumns: {},
      tableConfig: {},
    },
  ]);

  const [showToolbar, setToggleShowToolbar] = useState(true);
  const [
    showToolbarActionsMenuButtons,
    setToggleShowToolbarActionsMenuButtons,
  ] = useState(true);

  const [showGroupedTable, setToggleShowGroupedTable] = useState(false);
  const [groupOptions, setGroupOptions] = useState({});

  console.log(';;rendering PivotTable ');

  /** 改变key的时候，会强制重渲染整个table，要慎用，只有需要改变大部分table的时候才建议用 */
  const tableKey = useMemo(
    () => cx({ showGroupedTable: showGroupedTable }),
    [showGroupedTable],
  );

  const currentPvtView = useMemo(() => {
    const firstView = pvtViews[0];

    let retView;

    if (firstView.type === 'kanban') {
      const kanbanData = getKanbanDataFromPvtData(pvtData);

      retView = <h1>看板视图 暂未实现</h1>;
    }

    // ------------- 默认会显示表格

    const tableData = getKanbanDataFromPvtData(pvtData)['data'];
    const tableColumns = getPivotTableStandardColumns({ showGroupedTable });
    const tableOptions = {};

    console.log(';;tableData, tableColumns ', tableData, tableColumns);

    const tableProps = {
      tableData,
      tableColumns,
      tableOptions,

      showGroupedTable,
      setToggleShowGroupedTable,
      showToolbar,
      showToolbarActionsMenuButtons,
    };

    retView = <PivotTableStandard {...tableProps} key={tableKey} />;

    return retView;
  }, [
    pvtData,
    pvtViews,
    showGroupedTable,
    showToolbar,
    showToolbarActionsMenuButtons,
    tableKey,
  ]);

  return currentPvtView;
}

export default PivotTable;
