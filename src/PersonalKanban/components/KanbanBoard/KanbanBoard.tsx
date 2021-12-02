import Board from 'PersonalKanban/components/Board';
import KanbanColumn from 'PersonalKanban/components/KanbanColumn';
import { Column } from 'PersonalKanban/types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

type KanbanBoardProps = {
  columns: Column[];
  onCardMove?: any;
  onColumnMove?: any;
  onColumnEdit?: any;
  onColumnDelete?: any;
  onAddRecord?: any;
  onRecordEdit?: any;
  onRecordDelete?: any;
  onAllRecordDelete?: any;
  ColumnComponent?: any;
  handleOpenAddColumnDialog?: Function;
  forceBoardUpdate?: Function;
};

/**
 * * 在Board组件外层加上了DragDropContext和Droppable。
 * * 看板中每列分组组件使用的是KanbanColumn，而不是默认的Column。
 */
export function KanbanBoard(props: KanbanBoardProps) {
  const {
    columns,
    onCardMove,
    onColumnMove,
    onColumnEdit,
    onColumnDelete,
    onAddRecord,
    onRecordEdit,
    onRecordDelete,
    onAllRecordDelete,
    ColumnComponent = KanbanColumn,
    handleOpenAddColumnDialog,
    forceBoardUpdate,
  } = props;

  const getColumnById = useCallback(
    (columnId) => columns.find((column) => column.id === columnId),
    [columns],
  );

  const getColumnByIndex = useCallback((index) => columns[index], [columns]);

  const handleDragEnd = useCallback(
    (result) => {
      const { source, destination, type } = result;

      if (!destination) {
        return;
      }

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        // Drop position is same as original
        return;
      }

      if (type === 'COLUMN') {
        onColumnMove({
          column: getColumnByIndex(source.index),
          index: destination.index,
        });
        return;
      }

      const record = getColumnById(source.droppableId)?.records?.[source.index];

      onCardMove({
        source: getColumnById(source.droppableId),
        column: getColumnById(destination.droppableId),
        record,
        index: destination.index,
      });
    },
    [onColumnMove, onCardMove, getColumnByIndex, getColumnById],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId='BOARD' type='COLUMN' direction='horizontal'>
        {(provided) => (
          <>
            <Board
              innerRef={provided.innerRef}
              // * 这里使用了自定义组件KanbanColumn，而不是Column
              ColumnComponent={ColumnComponent}
              {...provided.droppableProps}
              columns={columns}
              placeholder={provided.placeholder}
              onColumnEdit={onColumnEdit}
              onColumnDelete={onColumnDelete}
              handleOpenAddColumnDialog={handleOpenAddColumnDialog}
              onAddRecord={onAddRecord}
              onRecordEdit={onRecordEdit}
              onRecordDelete={onRecordDelete}
              onAllRecordDelete={onAllRecordDelete}
              forceBoardUpdate={forceBoardUpdate}
            />
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default KanbanBoard;
