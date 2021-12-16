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
  const { rowData, showGroupedTable } = options;

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
    tableDefaultColumns = Object.keys(rowData).map((field, idx) => ({
      Header: field,
      accessor: field,
    }));
  }

  if (showGroupedTable) {
    tableDefaultColumns.unshift({
      Header: 'Group',
      accessor: 'group',
      Cell: ({ row: { groupByVal } }) => {
        return groupByVal;
      },
    });
  }

  return tableDefaultColumns;
}

export function mockTrelloExportJson(len) {
  return {
    id: 'idBoard',
    name: 'hello-board',
    desc: '',
    descData: null,
    closed: false,
    dateClosed: null,
    idOrganization: 'idOrg',
    shortLink: '',
    dateLastActivity: '2021-12-10T09:00:43.252Z',
    dateLastView: '2021-12-10T09:00:43.252Z',
    idTags: [],
    creationMethod: 'automatic',
    idMemberCreator: 'idUser',
    pinned: false,
    starred: false,
    url: 'https://trello.com/b/qoBz7TLE/hello-trello',
    limits: {},
    subscribed: false,
    labelNames: {
      green: '完成',
      red: '警告',
      blue: '',
    },
    prefs: {
      cardCovers: true,
    },

    actions: [
      {
        id: 'idAction',
        idMemberCreator: 'idUser',
        data: {},
        type: 'updateCard',
        date: '2021-12-10T09:00:43.262Z',
      },
    ],
    cards: [
      {
        id: 'idCard',
        idList: 'idList',
        idBoard: 'idBoard',
        idLabels: ['label1'],
      },
    ],
    lists: [
      {
        id: 'idList',
        name: 'to-do',
      },
    ],
    labels: [
      {
        id: 'idLabel',
        idBoard: 'idBoard',
        name: '测试标签',
        color: 'purple',
      },
    ],
    checklists: [
      {
        id: 'idChecklist',
        name: 'test checklist',
      },
    ],
    customFields: [{}],
    members: [
      {
        id: 'idUser',
        activityBlocked: false,
      },
    ],
    memberships: [
      {
        id: 'id1',
        idMember: 'idUser',
        memberType: 'admin',
        unconfirmed: false,
        deactivated: false,
      },
    ],
  };
}
