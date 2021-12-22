import { v4 as uuidv4 } from 'uuid';

import type { Column } from '../types';

export const getId = (): string => {
  return uuidv4();
};

/** 获取ISO格式的当前时间，返回值示例 2021-11-17T15:45:56 */
export function getDateNowISOStrWithTimezone() {
  //offset in milliseconds
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const dateISOStr = new Date(Date.now() - timezoneOffset).toISOString();
  return dateISOStr.slice(0, -5);
}

export function getCreatedAt() {
  //   return `${moment().format('DD-MM-YYYY')} ${moment().format('h:mm:ss a')}`;
  return getDateNowISOStrWithTimezone();
}

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const reorderCards = ({
  columns,
  sourceColumn,
  destinationColumn,
  sourceIndex,
  destinationIndex,
}: {
  columns: Column[];
  sourceColumn: Column;
  destinationColumn: Column;
  sourceIndex: number;
  destinationIndex: number;
}) => {
  const getColumnIndex = (columnId: string) =>
    columns.findIndex((c) => c.id === columnId);

  const getRecords = (columnId: string) => [
    ...columns.find((c) => c.id === columnId)?.cardsRecords!,
  ];

  const current = getRecords(sourceColumn.id);
  const next = getRecords(destinationColumn.id);
  const target = current[sourceIndex];

  // moving to same list
  if (sourceColumn.id === destinationColumn.id) {
    const reordered = reorder(current, sourceIndex, destinationIndex);
    const newColumns = columns.map((c) => ({ ...c }));
    newColumns[getColumnIndex(sourceColumn.id)].cardsRecords = reordered;
    return newColumns;
  }

  // moving to different list
  current.splice(sourceIndex, 1);
  next.splice(destinationIndex, 0, target);
  const newColumns = columns.map((c) => ({ ...c }));
  newColumns[getColumnIndex(sourceColumn.id)].cardsRecords = current;
  newColumns[getColumnIndex(destinationColumn.id)].cardsRecords = next;
  return newColumns;
};

export const getInitialState = () => {
  return [
    // 这里是一个分组列
    {
      id: 'listGroupId' + getId(),
      listGroupTitle: '看板示例说明',
      // color: "Orange",
      // cardsRecords包含一个分组面板中的所有卡片
      cardsRecords: [
        // 这里是一个卡片
        {
          id: 'cardId' + getId(),
          cardTitle: '这是一个全功能的卡片示例，其他卡片是使用教程',
          cardTitleEmoji: '✨',
          desc: 'Make a fresh start by erasing this board. Click delete button on main toolbar.',
          status: 'done',
          priority: '11',
          cardStartTime: getDateNowISOStrWithTimezone().slice(0, 10),
          cardDueTime: getDateNowISOStrWithTimezone().slice(0, 10),
          cardLabels: [
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '全功能卡片',
              color: 'purple',
            },
          ],
          cardMembers: [
            {
              id: 'idUser1',
              username: 'uptonking1',
              fullName: 'uptonking',
              avatarUrl: '',
              memberType: 'normal',
            },
          ],
          cardChecklists: [
            {
              id: 'idChecklist',
              name: 'test checklist 子任务',
              idCard: 'cardId',
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
          cardRelatedDocs: [
            {
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
          ],
          attachments: [],
          comments: {},
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          cardTitle: '看板结构：分组列(代表一组任务) + 卡片(代表一个任务)',
          desc: 'Rate and Star Personal Kanban',
          cardLabels: [
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '每个分组列可向下添加多个卡片',
              color: 'purple',
            },
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '点击卡片会出现卡片详情弹窗',
              color: 'purple',
            },
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '分组列和卡片都可拖拽移动',
              color: 'purple',
            },
          ],
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
    {
      id: getId(),
      listGroupTitle: '看板核心功能',
      // cardsRecords包含一个分组面板中的所有卡片
      cardsRecords: [
        {
          id: getId(),
          cardTitle: '紫色块是标签，可在卡片详情弹窗中添加标签',
          cardTitleEmoji: '💡',
          desc: 'Rate and Star Personal Kanban',
          cardLabels: [
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '教程',
              color: 'purple',
            },
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '这里是标签',
              color: 'purple',
            },
          ],
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          cardTitle:
            '在卡片详情弹窗中设置卡片负责人后，卡片右下角会显示负责人头像',
          cardTitleEmoji: '💡',
          desc: 'Rock the world with your creativity !',
          cardMembers: ['userId1'],
          cardLabels: [
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '教程',
              color: 'purple',
            },
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '添加成员/负责人',
              color: 'purple',
            },
          ],
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          cardTitle: '标签下面是 截止日期 + 任务进度，鼠标悬浮会提示意义',
          cardTitleEmoji: '💡',
          desc: 'Rate and Star Personal Kanban',
          cardLabels: [
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '教程',
              color: 'purple',
            },
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '截止日期',
              color: 'purple',
            },
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '待办事项/任务进度',
              color: '',
            },
          ],
          cardChecklists: [
            {
              id: 'idChecklist',
              name: 'test checklist 子任务',
              idCard: 'cardId',
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
          createdAt: getCreatedAt(),
          taskDueTime: getDateNowISOStrWithTimezone().slice(0, 10),
        },
        {
          id: getId(),
          cardTitle:
            '小卡片能展示的信息有限，可在卡片上直接显示相关的详情文档/双链文档，可折叠',
          cardTitleEmoji: '💡',
          desc: 'Rate and Star Personal Kanban',
          cardLabels: [
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '教程',
              color: 'purple',
            },
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '相关文档',
              color: 'purple',
            },
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '双链文档',
              color: 'purple',
            },
          ],
          cardRelatedDocs: [
            {
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
          ],
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
    {
      id: getId(),
      listGroupTitle: '看板使用小技巧',
      cardsRecords: [
        {
          id: getId(),
          cardTitle: '在卡片详情弹窗中点击标题文字可直接编辑标题',
          desc: 'Rock the world with your creativity !',
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          cardTitle: '标题文字前放个emoji更醒目',
          cardTitleEmoji: '👉',
          desc: `Accepts a function that contains imperative, possibly effectful code.Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (referred to as React’s render phase). Doing so will lead to confusing bugs and inconsistencies in the UI.
          
          Instead, use useEffect. The function passed to useEffect will run after the render is committed to the screen. Think of effects as an escape hatch from React’s purely functional world into the imperative world.
          
          By default, effects run after every completed render, but you can choose to fire them only when certain values have changed.
          
          Cleaning up an effect
          Often, effects create resources that need to be cleaned up before the component leaves the screen, such as a subscription or timer ID. To do this, the function passed to useEffect may return a clean-up function. For example, to create a subscription:`,
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          // color: "Indigo",
          cardTitle:
            '一个很长很长的标题，长到必须要换行了，甚至超过2行，显示更多行，也超过了详情弹窗中标题输入框的长度； ',
          cardLabels: [
            {
              id: 'idLabel1',
              idBoard: 'idBoard',
              name: '可将内容全放在标题，而不放在描述',
              color: 'purple',
            },
          ],
          desc: 'Rock the world with your creativity !',
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
    {
      id: getId(),
      listGroupTitle: '看板功能和设计仅供参考',
      cardsRecords: [
        {
          id: getId(),
          cardTitle: '不足1：卡片详情弹窗中部分按钮不可用，功能开发中...',
          desc: 'Rock the world with your creativity !',
          cardMembers: [
            {
              id: 'idUser1',
              username: 'uptonking1',
              fullName: 'uptonking',
              avatarUrl: '',
              memberType: 'normal',
            },
          ],
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          cardTitle: '不足2：很多功能只实现了添加，暂未实现修改和删除',
          desc: 'Rock the world with your creativity !',
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
  ];
};
