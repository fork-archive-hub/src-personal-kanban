import React, { useCallback, useMemo, useState } from 'react';
import { useExpanded, useGroupBy } from 'react-table';

import { BASIC_COLUMNS, FAKE_DATA } from './_fakeData/storyFakeData';
import { useExpandAll } from './plugin/useExpandAll/useExpandAll';
import { Table, useTable } from '.';

export const data = [
  { name: 'Jon', age: 19 },
  { name: 'Eddy', age: 30 },
  { name: 'Michel', age: 40 },
];

export const columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Age',
    accessor: 'age',
  },
];

export function PivotTableFull2() {
  const tableInstance = useTable({
    data,
    columns,
  });
  return (
    <div>
      <Table instance={tableInstance} />
    </div>
  );
}

export function PivotTableFull() {
  const columns = useMemo(
    () => [
      {
        Header: 'Group',
        accessor: 'group',
        Cell: ({ row: { groupByVal } }) => {
          return groupByVal;
        },
      },
      ...BASIC_COLUMNS,
    ],
    [],
  );

  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns,
      initialState: {
        groupBy: ['group'],
      },
    },
    useGroupBy,
    useExpanded,
    useExpandAll,
  );

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Table instance={tableInstance} />
    </div>
  );
}

export default PivotTableFull;
