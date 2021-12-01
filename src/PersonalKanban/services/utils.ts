import { Column } from 'PersonalKanban/types';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export const getId = (): string => {
  return uuidv4();
};

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const getCreatedAt = () => {
  return `${moment().format('DD-MM-YYYY')} ${moment().format('h:mm:ss a')}`;
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
      title: '未开始',
      // color: "Orange",
      // records包含一个面板中的所有卡片
      records: [
        // 这里是一个卡片
        {
          id: getId(),
          title:
            '一个很长很长的标题，长到必须要换行了，甚至超过2行，显示更多行，也超过了详情弹窗中标题输入框的长度',
          // color: "Yellow",
          description:
            'Make a fresh start by erasing this board. Click delete button on main toolbar.',
          tags: [{ tagName: 'ckeditor', bgColor: 'beige' }],
          createdAt: getCreatedAt(),
          // 任务负责人
          taskStatus: 'done',
          taskMembers: [{ userId: 'id1', username: '用户名1' }],
          taskStartTime: getDateNowISOStrWithTimezone().slice(0, 10),
          taskDueTime: getDateNowISOStrWithTimezone().slice(0, 10),
          taskPriority: 11,
          taskEmoji: '💡',
          subTaskList: {
            id: getId(),
            title: 'checklist1 子任务',
            // color: "Red",
            records: [
              {
                id: getId(),
                // color: "Purple",
                title: '子任务1 Give ratings',
                createdAt: getCreatedAt(),
              },
              {
                id: getId() + 'aa',
                // color: "Purple",
                title: '子任务2 Give ratings',
                createdAt: getCreatedAt(),
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
      ],
      createdAt: getCreatedAt(),
    },
    {
      id: getId(),
      title: '进行中',
      // color: "Red",
      records: [
        {
          id: getId(),
          // color: "Purple",
          title: 'Give ratings',
          description: 'Rate and Star Personal Kanban',
          createdAt: getCreatedAt(),
        },
        {
          id: getId() + 'aa',
          // color: "Purple",
          title: 'Give ratings',
          description: `Accepts a function that contains imperative, possibly effectful code.Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (referred to as React’s render phase). Doing so will lead to confusing bugs and inconsistencies in the UI.
          
          Instead, use useEffect. The function passed to useEffect will run after the render is committed to the screen. Think of effects as an escape hatch from React’s purely functional world into the imperative world.
          
          By default, effects run after every completed render, but you can choose to fire them only when certain values have changed.
          
          Cleaning up an effect
          Often, effects create resources that need to be cleaned up before the component leaves the screen, such as a subscription or timer ID. To do this, the function passed to useEffect may return a clean-up function. For example, to create a subscription:`,
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
    {
      id: getId(),
      title: '已完成',
      // color: "Green",
      records: [
        {
          id: getId(),
          // color: "Indigo",
          title: 'Be Awesome',
          description: 'Rock the world with your creativity !',
          createdAt: getCreatedAt(),
        },
      ],
      createdAt: getCreatedAt(),
    },
  ];
};
