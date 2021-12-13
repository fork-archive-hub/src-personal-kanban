import React from "react";
import { Draggable } from "react-beautiful-dnd";

import Card from "../../components/Card";
import { DarkRecordColor, RecordColor } from "../../constants";
import { useTheme } from "../../providers/ThemeProvider";
import type { Record } from "../../types";

type KanbanCardProps = {
  record: Record;
  index: number;
  className?: string;
  onEdit?: any;
  onDelete?: any;
};

const KanbanCard: React.FC<KanbanCardProps> = (props) => {
  const { record, index, className, onEdit, onDelete } = props;

  const recordColor = record.color as keyof typeof RecordColor;

  const { darkTheme } = useTheme();

  return (
    <Draggable draggableId={record.id} index={index}>
      {(provided) => (
        <Card
          key={record.id}
          innerRef={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: darkTheme
              ? DarkRecordColor[recordColor]
              : RecordColor[recordColor],
          }}
          record={record}
          className={className}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </Draggable>
  );
};

export default KanbanCard;
