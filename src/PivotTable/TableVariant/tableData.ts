export function generatePivotTableData(count) {
  return {
    pvTableName: 'testPivotTable',
    pvData: [],
  };
}

export function getKanbanDataFromPvtData(data) {
  return data;
}

/**
 * * 计算出table的columns列定义模型
 */
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
      // accessor: field,
      accessor: (row, rowIndex) => {
        if (
          ['string', 'number', 'boolean', 'null', 'undefined'].includes(
            typeof row[field],
          )
        ) {
          return row[field];
        }

        return JSON.stringify(row[field]);
      },
      id: field,
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

export const defaultPvtData = [
  {
    recordId: 1,
    field1: 'r1c1',
    field2: 'r1c2',
    fieldN: 'r1c3',
    group: '分组A',
  },
  {
    recordId: 2,
    field1: 'r2c1',
    field2: 'r2c2',
    fieldN: 'r2c3',
    group: '分组B',
  },
  {
    recordId: 3,
    field1: 'r3c1',
    field2: 'r3c2',
    fieldN: 'r3c3',
    group: '分组A',
  },
];

export const kanbanGuideDemoCardsPvtData = [
  {
    id: 1,
    name: '卡片1',
    desc: '',
    idList: '看板示例说明',
    idBoard: '示例看板',
    idMembers: [],
    due: {},
    labels: [],
    idChecklists: [],
    relatedDocs: {
      title: '相关文档',
      docList: [
        {
          docTitle: 'ckeditor architecture core',
          docId: 'unique-doc-id1',
          url: '',
        },
        {
          docTitle: 'ckeditor editing engine',
          docId: 'unique-doc-id2',
          url: '',
        },
      ],
    },
    group: '分组A',
  },
  {
    id: 2,
    name: '卡片2',
    desc: '',
    idList: '看板示例说明',
    idBoard: '示例看板',
    idMembers: [],
    due: {},
    labels: [],
    idChecklists: [],
    relatedDocs: {},
    group: '分组B',
  },
  {
    id: 3,
    name: '卡片3',
    desc: '',
    idList: '看板示例说明',
    idBoard: '示例看板',
    idMembers: [],
    due: {},
    labels: [],
    idChecklists: [],
    relatedDocs: {},
    group: '分组A',
  },
];
