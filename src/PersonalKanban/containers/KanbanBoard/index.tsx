import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import KanbanBoard from '../../components/KanbanBoard';
import Toolbar from '../../containers/Toolbar';
import StorageService from '../../services/StorageService';
import {
  getCreatedAt,
  getId,
  getInitialState,
  reorder,
  reorderCards,
} from '../../services/utils';
import type { Column, Record } from '../../types';
import AddColumnDialog from './AddColumnDialog';

const useKanbanBoardStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}));

let initialState = StorageService.getColumns();
if (!initialState) {
  initialState = getInitialState();
}

type KanbanBoardContainerProps = {};

/**
 * * 创建看板数据的state，将更新逻辑setState传下去。
 */
export function KanbanBoardContainer(props: KanbanBoardContainerProps) {
  const classes = useKanbanBoardStyles();
  const [__, forceUpdate] = useReducer((x) => x + 1, 0);

  const [columns, setColumns] = useState<Column[]>(initialState);

  const cloneColumns = useCallback((columns: Column[]) => {
    return columns.map((column: Column) => ({
      ...column,
      records: [...column.records!],
    }));
  }, []);

  const getColumnIndex = useCallback(
    (id: string) => {
      return columns.findIndex((c: Column) => c.id === id);
    },
    [columns],
  );

  const getRecordIndex = useCallback(
    (recordId: string, columnId: string) => {
      return columns[getColumnIndex(columnId)]?.records?.findIndex(
        (r: Record) => r.id === recordId,
      );
    },
    [columns, getColumnIndex],
  );

  const handleClearBoard = useCallback(() => {
    setColumns([]);
  }, []);

  const handleAddColumn = useCallback(({ column }: { column: Column }) => {
    setColumns((columns: Column[]) => [
      ...columns,
      Object.assign(
        { id: getId(), records: [], createdAt: getCreatedAt() },
        column,
      ),
    ]);
  }, []);

  const handleColumnMove = useCallback(
    ({ column, index }: { column: Column; index: number }) => {
      const updatedColumns = reorder(columns, getColumnIndex(column.id), index);
      setColumns(updatedColumns);
    },
    [columns, getColumnIndex],
  );

  const handleColumnEdit = useCallback(
    ({ column }: { column: Column }) => {
      setColumns((_columns: Column[]) => {
        const columnIndex = getColumnIndex(column.id);
        const columns = cloneColumns(_columns);
        columns[columnIndex].title = column.title;
        columns[columnIndex].description = column.description;
        columns[columnIndex].color = column.color;
        columns[columnIndex].wipEnabled = column.wipEnabled;
        columns[columnIndex].wipLimit = column.wipLimit;
        return columns;
      });
    },
    [getColumnIndex, cloneColumns],
  );

  const handleColumnDelete = useCallback(
    ({ column }: { column: Column }) => {
      setColumns((_columns: Column[]) => {
        const columns = cloneColumns(_columns);
        columns.splice(getColumnIndex(column.id), 1);
        return columns;
      });
    },
    [cloneColumns, getColumnIndex],
  );

  const handleCardMove = useCallback(
    ({
      column,
      index,
      source,
      record,
    }: {
      column: Column;
      index: number;
      source: Column;
      record: Record;
    }) => {
      const updatedColumns = reorderCards({
        columns,
        destinationColumn: column,
        destinationIndex: index,
        sourceColumn: source,
        sourceIndex: getRecordIndex(record.id, source.id)!,
      });

      setColumns(updatedColumns);
    },
    [columns, getRecordIndex],
  );

  const handleAddRecord = useCallback(
    ({ column, record }: { column: Column; record: Record }) => {
      const columnIndex = getColumnIndex(column.id);
      setColumns((_columns: Column[]) => {
        const columns = cloneColumns(_columns);

        columns[columnIndex].records = [
          ...columns[columnIndex].records,
          {
            id: getId(),
            title: record.title,
            description: record.description,
            color: record.color,
            createdAt: getCreatedAt(),
          },
        ];
        return columns;
      });
    },
    [cloneColumns, getColumnIndex],
  );

  /**
   * * 更新一个任务卡片的信息。
   */
  const handleRecordEdit = useCallback(
    ({ column, record }: { column: Column; record: Record }) => {
      const columnIndex = getColumnIndex(column.id);
      const recordIndex = getRecordIndex(record.id, column.id);

      setColumns((_columns) => {
        const columns = cloneColumns(_columns);
        const _record = columns[columnIndex].records[recordIndex!];

        Object.assign(_record, record);
        return columns;
      });
    },
    [getColumnIndex, getRecordIndex, cloneColumns],
  );

  const handleRecordDelete = useCallback(
    ({ column, record }: { column: Column; record: Record }) => {
      const columnIndex = getColumnIndex(column.id);
      const recordIndex = getRecordIndex(record.id, column.id);
      setColumns((_columns) => {
        const columns = cloneColumns(_columns);
        columns[columnIndex].records.splice(recordIndex!, 1);
        return columns;
      });
    },
    [cloneColumns, getColumnIndex, getRecordIndex],
  );

  const handleAllRecordDelete = useCallback(
    ({ column }: { column: Column }) => {
      const columnIndex = getColumnIndex(column.id);
      setColumns((_columns) => {
        const columns = cloneColumns(_columns);
        columns[columnIndex].records = [];
        return columns;
      });
    },
    [cloneColumns, getColumnIndex],
  );

  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const handleOpenAddColumnDialog = useCallback(() => {
    setIsAddColumnDialogOpen(true);
  }, []);
  const handleCloseAddColumnDialog = useCallback(() => {
    setIsAddColumnDialogOpen(false);
  }, []);

  useEffect(() => {
    StorageService.setColumns(columns);
  }, [columns]);

  return (
    <>
      <Toolbar
        clearButtonDisabled={!columns.length}
        onNewColumn={handleAddColumn}
        onClearBoard={handleClearBoard}
      />
      <div className={classes.toolbar} />
      <Box padding={1}>
        <KanbanBoard
          columns={columns}
          onColumnMove={handleColumnMove}
          onColumnEdit={handleColumnEdit}
          onColumnDelete={handleColumnDelete}
          handleOpenAddColumnDialog={handleOpenAddColumnDialog}
          onCardMove={handleCardMove}
          onAddRecord={handleAddRecord}
          onRecordEdit={handleRecordEdit}
          onRecordDelete={handleRecordDelete}
          onAllRecordDelete={handleAllRecordDelete}
          forceBoardUpdate={forceUpdate}
        />
      </Box>
      <AddColumnDialog
        open={isAddColumnDialogOpen}
        onClose={handleCloseAddColumnDialog}
        onSubmit={handleAddColumn}
      />
    </>
  );
}

export default KanbanBoardContainer;
