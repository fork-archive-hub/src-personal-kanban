export function generatePivotTableData(count) {
  return {
    pvTableName: 'testPivotTable',
    pvData: [],
  };
}

export function getKanbanDataFromPvtData(data) {
  return data;
}

export function getPivotTableStandardColumns(options) {
  const { rowData, showGroupedTable, groupOptions } = options;

  let tableDefaultColumns: any[] = [
    {
      Header: '第1列',
      accessor: 'field1',
    },
    {
      Header: '第2列',
      accessor: 'field2',
    },
    {
      Header: '第3列',
      accessor: 'fieldN',
    },
  ];

  if (rowData && Object.keys(rowData).length > 0) {
    // 将传入数据的各个属性名作为表格的列名
    tableDefaultColumns = Object.keys(rowData).map((field, idx) => ({
      Header: field,
      accessor: field,
    }));
  }

  if (showGroupedTable && groupOptions) {
    tableDefaultColumns = tableDefaultColumns.filter(
      (col) => col.accessor !== groupOptions.groupField,
    );

    tableDefaultColumns.unshift({
      Header: groupOptions.groupHeader || groupOptions.groupField,
      accessor: groupOptions.groupField,
      Cell: ({ row: { groupByVal } }) => {
        return groupByVal;
      },
    });
  }

  return tableDefaultColumns;
}
