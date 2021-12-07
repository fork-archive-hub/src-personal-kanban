import { v4 as uuidv4 } from 'uuid';

import type { Column } from '../types';

export const getId = (): string => {
  return uuidv4();
};

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * 获取ISO格式的当前时间，返回值示例 2021-11-17T15:45:56
 */
export function getDateNowISOStrWithTimezone() {
  //offset in milliseconds
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const dateISOStr = new Date(Date.now() - timezoneOffset).toISOString();
  return dateISOStr.slice(0, -5);
}

export function getCreatedAt() {
  return getDateNowISOStrWithTimezone();
}

// export const getCreatedAt = () => {
//   return `${moment().format('DD-MM-YYYY')} ${moment().format('h:mm:ss a')}`;
// };

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
    ...columns.find((c) => c.id === columnId)?.records!,
  ];

  const current = getRecords(sourceColumn.id);
  const next = getRecords(destinationColumn.id);
  const target = current[sourceIndex];

  // moving to same list
  if (sourceColumn.id === destinationColumn.id) {
    const reordered = reorder(current, sourceIndex, destinationIndex);
    const newColumns = columns.map((c) => ({ ...c }));
    newColumns[getColumnIndex(sourceColumn.id)].records = reordered;
    return newColumns;
  }

  // moving to different list
  current.splice(sourceIndex, 1);
  next.splice(destinationIndex, 0, target);
  const newColumns = columns.map((c) => ({ ...c }));
  newColumns[getColumnIndex(sourceColumn.id)].records = current;
  newColumns[getColumnIndex(destinationColumn.id)].records = next;
  return newColumns;
};

export const getInitialState = () => {
  return [
    // 这里是一个分组/面板
    {
      id: getId(),
      title: '看板概述',
      // color: "Orange",
      // records包含一个分组面板中的所有卡片
      records: [
        // 这里是一个卡片
        {
          id: getId(),
          title: '这是一个全功能的卡片示例，其他卡片是使用说明',
          taskEmoji: '✨',
          description:
            'Make a fresh start by erasing this board. Click delete button on main toolbar.',
          tags: [{ tagName: '全功能卡片', bgColor: 'beige' }],
          createdAt: getCreatedAt(),
          taskStatus: 'done',
          taskMembers: ['userId1'],
          taskStartTime: getDateNowISOStrWithTimezone().slice(0, 10),
          taskDueTime: getDateNowISOStrWithTimezone().slice(0, 10),
          taskPriority: 11,
          subTaskList: {
            id: getId(),
            title: 'checklist1 子任务',
            records: [
              {
                id: getId(),
                title: '子任务1 Give ratings',
                createdAt: getCreatedAt(),
              },
              {
                id: getId(),
                title: '子任务2 Give ratings',
                createdAt: getCreatedAt(),
              },
              {
                id: getId(),
                title: '子任务3 Give ratings',
                createdAt: getCreatedAt(),
                taskStatus: 'done',
              },
            ],
            createdAt: getCreatedAt(),
          },
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
          attachments: [],
          comments: {},
        },
        {
          id: getId(),
          title: '看板结构：分组列(代表任务分组) + 卡片(代表一个任务)',
          description: 'Rate and Star Personal Kanban',
          tags: [
            { tagName: '每个分组列可向下添加多个卡片' },
            { tagName: '点击卡片会出现卡片详情弹窗' },
            { tagName: '分组列和卡片都可拖拽移动' },
          ],
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
    {
      id: getId(),
      title: '看板核心功能',
      // color: "Red",
      // records包含一个分组面板中的所有卡片
      records: [
        {
          id: getId(),
          title: '一个很短的标题',
          taskEmoji: '💡',
          description: 'Rate and Star Personal Kanban',
          tags: [{ tagName: '教程' }, { tagName: '这里是标签' }],
          createdAt: getCreatedAt(),
        },

        {
          id: getId(),
          title: '标签下面是 截止日期 + 任务进度，鼠标悬浮会提示意义',
          taskEmoji: '💡',
          tags: [
            { tagName: '教程' },
            { tagName: '截止日期' },
            { tagName: '待办事项/任务进度' },
          ],
          description: 'Rate and Star Personal Kanban',
          taskDueTime: getDateNowISOStrWithTimezone().slice(0, 10),
          subTaskList: {
            id: getId(),
            title: 'checklist1 子任务',
            records: [
              {
                id: getId(),
                title: '子任务1 Give ratings',
                createdAt: getCreatedAt(),
              },
              {
                id: getId(),
                title: '子任务2 Give ratings',
                createdAt: getCreatedAt(),
              },
              {
                id: getId(),
                title: '子任务3 Give ratings',
                createdAt: getCreatedAt(),
                taskStatus: 'done',
              },
            ],
            createdAt: getCreatedAt(),
          },
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          title:
            '小卡片能展示的信息有限，可在卡片上直接显示相关的详情文档/双链文档，可折叠',
          taskEmoji: '💡',
          description: 'Rate and Star Personal Kanban',
          tags: [
            { tagName: '教程' },
            { tagName: '相关文档' },
            { tagName: '双链文档' },
          ],
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
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          title: '在卡片详情弹窗中设置卡片负责人后，卡片右下角会显示负责人头像',
          taskEmoji: '💡',
          description: 'Rock the world with your creativity !',
          taskMembers: ['userId1'],
          tags: [{ tagName: '教程' }, { tagName: '添加成员/负责人' }],
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
    {
      id: getId(),
      title: '看板使用体验',
      // color: "Green",
      records: [
        {
          id: getId(),
          title: '标题文字前放个emoji更醒目',
          taskEmoji: '👉',
          description: `Accepts a function that contains imperative, possibly effectful code.Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (referred to as React’s render phase). Doing so will lead to confusing bugs and inconsistencies in the UI.
          
          Instead, use useEffect. The function passed to useEffect will run after the render is committed to the screen. Think of effects as an escape hatch from React’s purely functional world into the imperative world.
          
          By default, effects run after every completed render, but you can choose to fire them only when certain values have changed.
          
          Cleaning up an effect
          Often, effects create resources that need to be cleaned up before the component leaves the screen, such as a subscription or timer ID. To do this, the function passed to useEffect may return a clean-up function. For example, to create a subscription:`,
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          title: '在卡片详情弹窗中点击标题文字可直接编辑标题',
          description: 'Rock the world with your creativity !',
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          // color: "Indigo",
          title:
            '一个很长很长的标题，长到必须要换行了，甚至超过2行，显示更多行，也超过了详情弹窗中标题输入框的长度； ',
          tags: [{ tagName: '可将内容全部放在标题部分，而不是描述部分' }],
          description: 'Rock the world with your creativity !',
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
    {
      id: getId(),
      title: '看板功能和设计仅供参考',
      records: [
        {
          id: getId(),
          title: '不足1：卡片详情弹窗中部分按钮不可用，功能开发中...',
          description: 'Rock the world with your creativity !',
          taskMembers: ['userId1'],
          createdAt: getCreatedAt(),
        },
        {
          id: getId(),
          title: '不足2：很多功能只实现了添加，暂未实现修改和删除',
          description: 'Rock the world with your creativity !',
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
  ];
};
