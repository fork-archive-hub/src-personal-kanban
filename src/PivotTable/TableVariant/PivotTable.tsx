import '../pivot-table.css';

import cx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useExpanded, useGroupBy } from 'react-table';

import { useExpandAll } from '../plugin/useExpandAll/useExpandAll';
import { PivotTableStandard } from './PivotTableStandard';
import { defaultPvtData, kanbanGuideDemoCardsPvtData } from './tableData';
import {
  getKanbanDataFromPvtData,
  getPivotTableStandardColumns,
} from './tableData';

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
    // data: defaultPvtData,
    data: kanbanGuideDemoCardsPvtData,
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
  // const updatepvtViews = useCallback(() => {}, []);
  console.log(';;rendering PivotTable ', pvtViews);

  const [showToolbar, setToggleShowToolbar] = useState(true);
  const [
    showToolbarActionsMenuButtons,
    setToggleShowToolbarActionsMenuButtons,
  ] = useState(true);

  const [showGroupedTable, setToggleShowGroupedTable] = useState(false);
  // const [groupOptions, setGroupOptions] = useState({});

  /** 改变key的时候，会强制重渲染整个table，要慎用，只有需要改变大部分table的时候才建议用 */
  const tableKey = useMemo(
    () => cx({ showGroupedTable: showGroupedTable }),
    [showGroupedTable],
  );

  const currentPvtView = useMemo(() => {
    const firstView = pvtViews[0];

    let retView = null;

    // if (firstView.type === 'kanban') {
    //   const kanbanData = getKanbanDataFromPvtData(pvtData);

    //   retView = <h1>看板视图 暂未实现</h1>;
    // }

    // ------------- 默认会显示表格
    // if (firstView.type === 'table' || !firstView.type) {
    const tableData = getKanbanDataFromPvtData(pvtData)['data'];
    let groupField = '';
    if (showGroupedTable) {
      const dataFields = Object.keys(tableData[0]);
      groupField = 'group';
      // dataFields[Math.floor(Math.random() * dataFields.length)];
      console.log(';;dataFields, groupField ', dataFields, groupField);
    } else {
      groupField = '';
    }

    // todo 支持添加多个分组列
    const tableColumns = getPivotTableStandardColumns({
      rowData: tableData[0],
      showGroupedTable,
      groupOptions: showGroupedTable
        ? {
            groupField,
            // groupHeader: '分组列',
          }
        : null,
    });
    console.log(';;tableColumns ', tableColumns);

    const tableOptions: any = {
      initialState: {},
    };
    if (showGroupedTable) {
      tableOptions.initialState.groupBy = [groupField];
    }
    const tablePlugins = [];
    if (showGroupedTable) {
      tablePlugins.push(useGroupBy, useExpanded, useExpandAll);
    }

    const tableProps = {
      tableData,
      tableColumns,
      tableOptions,
      tablePlugins,

      showGroupedTable,
      setToggleShowGroupedTable,
      showToolbar,
      showToolbarActionsMenuButtons,
      pvtViews,
      setPvtViews,
    };
    // console.log(';;tableProps ', tableProps);

    retView = <PivotTableStandard {...tableProps} key={tableKey} />;
    // }

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
