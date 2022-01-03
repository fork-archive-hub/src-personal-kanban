import '../pivot-table.css';

import cx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useExpanded, useGroupBy } from 'react-table';

import { PersonalKanban } from '../../PersonalKanban';
import { Toolbar } from '../Toolbar';
import { useExpandAll } from '../plugin/useExpandAll/useExpandAll';
import { PivotTableStandard } from './PivotTableStandard';
import {
  defaultPvtData,
  generateKanbanGuideDemoData,
  getKanbanDataFromPvtData,
  getPivotTableStandardColumns,
  getTableColumnsForKanban,
  getTableDataFromPvtData,
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
  // 所有视图的源数据，初始默认的数据结构是适合在表格中直接使用的对象数组格式
  const [pvtData, setPvtData] = useState({
    // data: defaultPvtData,
    data: generateKanbanGuideDemoData(5),
  });
  const [pvtViews, setPvtViews] = useState([
    {
      id: 'idKv',
      name: '看板视图测试',
      type: 'kanban',
      tableColumns: {},
      toolbarConfig: {},
      kanbanConfig: {},
    },
    {
      id: 'idTv',
      name: '表格视图测试',
      type: 'tableForKanban',
      toolbarConfig: {},
      tableConfig: {
        columns: {},
      },
    },
  ]);
  // const updatepvtViews = useCallback(() => {}, []);
  console.log(';;rendering PivotTable ', pvtViews);

  // 这里控制全局工具条，每个视图可以定义自己的工具条配置
  const [showToolbar, setToggleShowToolbar] = useState(true);
  const [
    showToolbarActionsMenuButtons,
    setToggleShowToolbarActionsMenuButtons,
  ] = useState(true);

  const [showGroupedTable, setToggleShowGroupedTable] = useState(true);
  // const [groupOptions, setGroupOptions] = useState({});

  /** 改变key的时候，会强制重渲染整个table，要慎用，只有需要改变大部分table的时候才建议用 */
  const tableKey = useMemo(() => cx({ showGroupedTable }), [showGroupedTable]);

  const currentPvtView = useMemo(() => {
    const firstView = pvtViews[0];

    let retView = null;

    if (firstView.type === 'kanban') {
      const kanbanData = getKanbanDataFromPvtData(pvtData);

      retView = <PersonalKanban />;
    }

    // ------------- 默认会显示普通表格视图
    if (firstView.type.indexOf('table') !== -1 || !firstView.type) {
      const tableData = getTableDataFromPvtData(pvtData['data']);
      let groupField = '';
      if (showGroupedTable) {
        const dataFields = Object.keys(tableData[0]);
        groupField = 'group';
        // dataFields[Math.floor(Math.random() * dataFields.length)];

        if (firstView.type === 'tableForKanban') {
          groupField = 'idListDetails';
        }
        console.log(';;groupField, dataFields ', groupField, dataFields);
      } else {
        groupField = '';
      }

      let tableColumns;
      if (firstView.type === 'tableForKanban') {
        groupField = 'idListDetails';
        tableColumns = getTableColumnsForKanban({
          showGroupedTable,
          groupOptions: showGroupedTable
            ? {
                groupField,
                groupHeader: '分组',
              }
            : null,
        });
      } else {
        // todo 支持添加多个分组列，暂时只支持单个分组字段
        tableColumns = getPivotTableStandardColumns({
          rowData: tableData[0],
          showGroupedTable,
          groupOptions: showGroupedTable
            ? {
                groupField,
                // groupHeader: '分组列',
              }
            : null,
        });
      }
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
    }

    return retView;
  }, [
    pvtData,
    pvtViews,
    showGroupedTable,
    showToolbar,
    showToolbarActionsMenuButtons,
    tableKey,
  ]);

  return (
    <div className='pvt'>
      <>
        <Toolbar
          showToolbar={showToolbar}
          showToolbarActionsMenuButtons={showToolbarActionsMenuButtons}
          setToggleShowGroupedTable={setToggleShowGroupedTable}
          pvtViews={pvtViews}
          setPvtViews={setPvtViews}
        />
        {/* todo 将搜索筛选移到toolbar，SearchBar来自ui-core */}
        {
          // instance.setGlobalFilter ? (
          //   <SearchBarContainer>
          //     <SearchBar
          //       placeholder='全局搜索，请输入'
          //       onChange={(e) => instance.setGlobalFilter(e.target.value)}
          //       value={instance.state.globalFilter}
          //     />
          //   </SearchBarContainer>
          // ) : null
        }
      </>
      {currentPvtView}
    </div>
  );
}

export default PivotTable;
