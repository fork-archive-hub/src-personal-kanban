import cx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useExpanded, useGroupBy } from 'react-table';

import { BASIC_COLUMNS, FAKE_DATA } from '../_fakeData/storyFakeData';
import { useExpandAll } from '../plugin/useExpandAll/useExpandAll';
import { Table, useTable } from '..';

export type PivotTableStandardProps = {
  tableData?: Array<Record<string, any>>;
  tableColumns?: Array<Record<string, any>>;
  updateData?: Function;
  showGroupedTable?: boolean;
  setToggleShowGroupedTable?: Function;
  groupOptions?: any;
  showToolbar?: boolean;
  showToolbarActionsMenuButtons?: boolean;
};

export function PivotTableStandard(props: PivotTableStandardProps) {
  const {
    tableData: data,
    tableColumns: columns,
    showGroupedTable = false,
    setToggleShowGroupedTable,
    groupOptions,
    showToolbar = true,
    showToolbarActionsMenuButtons = true,
  } = props;

  // const columns = useMemo(
  //   () =>
  //     showGroupedTable
  //       ? [
  //           {
  //             Header: 'Group',
  //             accessor: 'group',
  //             Cell: ({ row: { groupByVal } }) => {
  //               return groupByVal;
  //             },
  //           },
  //           ...BASIC_COLUMNS,
  //         ]
  //       : BASIC_COLUMNS,
  //   [showGroupedTable],
  // );

  const tablePlugins = useMemo(() => {
    const plugins = [];
    if (showGroupedTable) {
      plugins.push(useGroupBy, useExpanded, useExpandAll);
    }

    return plugins;
  }, [showGroupedTable]);

  const tableOptions = useMemo(() => {
    const options: any = {
      initialState: {},
    };
    if (showGroupedTable) {
      options.initialState.groupBy = ['group'];
    }
    return options;
  }, [showGroupedTable]);

  const tableInstance = useTable<Faker.Card>(
    {
      // data: FAKE_DATA,
      data: data,
      columns,
      ...tableOptions,
    },
    ...tablePlugins,
  );

  // const tableActions = useMemo(() => {
  //   const actions: any = {};
  //   if (showGroupedTable) {
  //     actions['setToggleShowGroupedTable'] = setToggleShowGroupedTable;
  //   }
  //   return actions;
  // }, []);

  const renderRowSubComponent = React.useCallback(
    ({ row }) => <td> &nbsp;</td>,
    [],
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Table
        instance={tableInstance}
        renderRowSubComponent={renderRowSubComponent}
        isRowSubComponentAboveRow={true}
        showToolbar={showToolbar}
        showToolbarActionsMenuButtons={showToolbarActionsMenuButtons}
        setToggleShowGroupedTable={setToggleShowGroupedTable}
      />
    </div>
  );
}

export default PivotTableStandard;
