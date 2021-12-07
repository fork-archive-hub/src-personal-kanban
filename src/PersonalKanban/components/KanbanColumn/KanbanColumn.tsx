import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import Column, { ColumnCardList } from '../../components/Column';
import KanbanCard from '../../components/KanbanCard';
import { Column as ColumnType } from '../../types';

type KanbanInnerColumnCardListProps = {
  column: ColumnType;
  onRecordEdit?: any;
  onRecordDelete?: any;
};

const KanbanInnerColumnCardList: React.FC<KanbanInnerColumnCardListProps> =
  React.memo((props) => {
    const { column, onRecordEdit, onRecordDelete } = props;
    return (
      <ColumnCardList
        column={column}
        CardComponent={KanbanCard}
        onRecordEdit={onRecordEdit}
        onRecordDelete={onRecordDelete}
      />
    );
  });

type KanbanColumnCardListProps = {
  column: ColumnType;
  onRecordEdit?: any;
  onRecordDelete?: any;
};

const KanbanColumnCardList: React.FC<KanbanColumnCardListProps> = (props) => {
  const { column, onRecordEdit, onRecordDelete } = props;
  const { id: columnId, records = [], wipEnabled, wipLimit = false } = column;
  const isDropDisabled = wipEnabled && wipLimit <= records?.length;
  return (
    <Droppable droppableId={columnId} isDropDisabled={isDropDisabled}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <KanbanInnerColumnCardList
            column={column}
            onRecordEdit={onRecordEdit}
            onRecordDelete={onRecordDelete}
          />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

type KanbanColumnProps = {
  column: ColumnType;
  index: number;
  className?: string;
  onEdit?: any;
  onDelete?: any;
  onAddRecord?: any;
  onRecordEdit?: any;
  onRecordDelete?: any;
  onAllRecordDelete?: any;
  forceBoardUpdate?: Function;
};

/**
 * * 在Column组件外层加上了Draggable组件。
 */
export function KanbanColumn(props: KanbanColumnProps) {
  const {
    column,
    index,
    className,
    onEdit,
    onDelete,
    onAddRecord,
    onRecordEdit,
    onRecordDelete,
    onAllRecordDelete,
    forceBoardUpdate,
  } = props;

  // const { t } = useTranslation();

  const _column = Object.assign({}, column, {
    caption: column.wipEnabled
      ? // ? `${t('wipLimit')} :${column.wipLimit}`
        ` wipLimit :${column.wipLimit}`
      : column.createdAt,
  });

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <Column
          innerRef={provided.innerRef}
          column={_column}
          className={className}
          ColumnCardListComponent={KanbanColumnCardList}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddRecord={onAddRecord}
          onRecordEdit={onRecordEdit}
          onRecordDelete={onRecordDelete}
          onAllRecordDelete={onAllRecordDelete}
          forceBoardUpdate={forceBoardUpdate}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        />
      )}
    </Draggable>
  );
}

export default KanbanColumn;
