
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
