import { Button } from '@material-ui/core';

import { IconCell } from '../cell/IconCell/IconCell';

export function generatePivotTableData(count) {
  return {
    pvTableName: 'testPivotTable',
    pvData: [],
  };
}

export function getKanbanDataFromPvtData(data) {
  return data;
}

export function getTableDataFromPvtData<T>(
  data: Array<T>,
  processData?: (dataRef: Array<T>) => any[],
) {
  return typeof processData === 'function' ? processData(data) : data;
}

/**
 * * 计算出针对看板设计的table的columns列定义模型
 */
export function getTableColumnsForKanban(options?: Record<string, any>) {
  const { showGroupedTable, groupOptions } = options;

  let kanbanColumnsDefinitions = [
    {
      Header: '标题',
      accessor: 'name',
    },
    {
      Header: '描述',
      accessor: 'desc',
    },
    {
      Header: '任务分组',
      accessor: 'idListDetails',
      // accessor: (row, rowIndex) => row['idListDetails'],
      // accessor: (row, rowIndex) => JSON.stringify(row['idListDetails']),
      Cell: ({ cell: { value }, row }) => {
        // return <span>{JSON.stringify(value)}</span>;
        return <span>{value.name}</span>;
      },
    },
    {
      Header: '标签',
      // accessor: 'idLabelsDetails',
      // accessor: (row, rowIndex) => JSON.stringify(row['idLabelsDetails']),
      accessor: (row, rowIndex) => row['idLabelsDetails'],
      id: 'idLabelsDetails',
      Cell: ({ cell: { value } }) => {
        if (!value || value.length === 0) return null;
        return value.map((tag) => {
          const { name } = tag;
          return name && name.trim() ? (
            <Button
              onClick={(e) => e.stopPropagation()}
              variant='contained'
              className={'pvt-tagBtn'}
              disableElevation
              disableRipple
              key={name}
            >
              {name}
            </Button>
          ) : null;
        });
      },
    },

    {
      Header: '负责人',
      // accessor: 'idMembersDetails',
      // accessor: (row, rowIndex) => JSON.stringify(row['idMembersDetails']),
      accessor: (row, rowIndex) => row['idMembersDetails'],
      id: 'idMembersDetails',
      Cell: ({ cell: { value } }) =>
        value && value.length > 0 ? (
          <IconCell
            icon={'person-outline'}
            label={value[0].fullName}
            large={true}
          />
        ) : null,
    },
    {
      Header: '子任务',
      // accessor: 'idChecklistsDetails',
      // accessor: (row, rowIndex) => JSON.stringify(row['idChecklistsDetails']),
      accessor: (row, rowIndex) => row['idChecklistsDetails'],
      id: 'idChecklistsDetails',
      Cell: ({ cell: { value } }) =>
        value && value.length > 0 ? (
          <IconCell
            icon={'calendar-check-outline'}
            label={`0 / ${value.length}`}
            large={true}
          />
        ) : null,
    },
    {
      Header: '相关文档',
      // accessor: 'idRelatedDocsDetails',
      // accessor: (row, rowIndex) => JSON.stringify(row['idRelatedDocsDetails']),
      accessor: (row, rowIndex) => row['idRelatedDocsDetails'],
      id: 'idRelatedDocsDetails',
      Cell: ({ cell: { value } }) =>
        value && value['docList'] && value['docList'].length > 0 ? (
          <IconCell
            icon={'sheet'}
            label={`${value['docList'][0]['docTitle']}`}
            large={true}
          />
        ) : null,
    },
    {
      Header: '截止时间',
      // accessor: 'due',
      accessor: (row, rowIndex) => row['due'],
      id: 'due',
      Cell: ({ cell: { value } }) =>
        value ? (
          <IconCell
            icon={'clock-outline'}
            label={`${value.slice(0, 10)}`}
            large={true}
          />
        ) : null,
    },
    {
      Header: '优先级',
      accessor: 'priority',
    },
    {
      Header: '状态',
      accessor: 'status',
    },
  ];

  if (showGroupedTable && groupOptions) {
    kanbanColumnsDefinitions = kanbanColumnsDefinitions.filter((col: any) =>
      typeof col.accessor === 'function'
        ? col.id !== groupOptions.groupField
        : col.accessor !== groupOptions.groupField,
    );

    kanbanColumnsDefinitions.unshift({
      Header: groupOptions.groupHeader || groupOptions.groupField,
      accessor: (row, rowIndex) => row['idListDetails']['name'],
      id: groupOptions.groupField,
      Cell: ({ row: { groupByVal } }) => {
        // return <h3>groupByVal</h3>;
        return groupByVal;
      },
    } as any);
  }

  return kanbanColumnsDefinitions;
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
    tableDefaultColumns = tableDefaultColumns.filter((col) =>
      typeof col.accessor === 'function'
        ? col.id !== groupOptions.groupField
        : col.accessor !== groupOptions.groupField,
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

/**
 * * mock测试用的看板数据，根据trello导出的数据修改而来。
 * https://trello.com/b/qoBz7TLE/hello-trello
 */
export function generateKanbanGuideDemoData(count?: number) {
  if (!count) return [];

  return Array(count)
    .fill(1)
    .map((__, idx) => {
      return {
        id: 'cardId' + idx,
        name: '卡片标题 ' + idx,
        desc: '',
        descData: {
          emoji: {},
        },
        // status: 'normal',
        priority: idx % 3 === 0 ? '最高' : '',
        idList: 'idList' + (idx % 3),
        idListDetails: {
          id: 'idList' + (idx % 3),
          name: '分组' + (idx % 3),
          closed: false,
          idBoard: 'idBoard',
        },
        idBoard: 'idBoard',
        idBoardDetails: '示例看板',
        idLabels: idx % 3 === 1 ? ['idLabel1', 'idLabel2'] : [],
        idLabelsDetails:
          idx % 3 === 1
            ? [
                {
                  id: 'idLabel1',
                  idBoard: 'idBoard',
                  name: '测试标签1',
                  color: 'purple',
                },
                {
                  id: 'idLabel2',
                  idBoard: 'idBoard',
                  name: '测试标签2',
                  color: 'purple',
                },
              ]
            : [],
        idMembers: idx % 3 === 0 ? ['idUser1'] : [],
        idMembersDetails:
          idx % 3 === 0
            ? [
                {
                  id: 'idUser1',
                  username: 'uptonking1',
                  fullName: 'uptonking' + idx,
                  avatarUrl: '',
                  memberType: 'normal',
                },
              ]
            : [],
        idMembersVoted: [],
        idChecklists: ['idChecklist'],
        idChecklistsDetails: [
          {
            id: 'idChecklist',
            name: 'test checklist 子任务',
            idCard: 'cardId' + idx,
            checkItems: [
              {
                idChecklist: 'idChecklist',
                state: 'complete',
                id: '61b316a7dce17a5b97006b16',
                name: 'ckeditor',
                nameData: {
                  emoji: {},
                },
                pos: 16879,
                due: null,
                idMember: null,
              },
              {
                idChecklist: 'idChecklist',
                state: 'incomplete',
                id: '61b316ab877ce337dbc11e2e',
                name: 'prosemirror',
                nameData: {
                  emoji: {},
                },
                pos: 33786,
                due: null,
                idMember: null,
              },
            ],
          },
        ],
        idRelatedDocs: ['docId1', 'docId2'],
        idRelatedDocsDetails: {
          title: '相关文档',
          docList: [
            {
              docTitle: 'ckeditor architecture core',
              docId: 'docId1',
              url: '',
            },
            {
              docTitle: 'ckeditor editing engine',
              docId: 'docId2',
              url: '',
            },
          ],
        },
        due: '2022-01-30T08:57:00.000Z',
        dueReminder: 1440,
        dueComplete: false,
        closed: false,
        isTemplate: false,
        attachments: [],
        pluginData: [],
        customFieldItems: [],
        group: '分组' + (idx % 3),
        createdBy: '',
        createdTime: '',
      };
    });
}
