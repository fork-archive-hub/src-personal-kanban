import Column from 'PersonalKanban/components/Column';
import { COLUMN_WIDTH } from 'PersonalKanban/constants';
import { Column as ColumnType } from 'PersonalKanban/types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

const useBoardStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    // width: 'fit-content',
    // width: '100wh',
    // height: '100vh',
  },
  column: {
    width: COLUMN_WIDTH,
    height: 'fit-content',
    // margin: theme.spacing(),
  },
  addColButton: {
    width: 264,
    height: 48,
    margin: theme.spacing(1),
    // margin: '8px 16px',
    backgroundColor: '#fff',
    color: theme.palette.text.secondary,
    border: 'none',
  },
}));

type BoardProps = {
  columns: ColumnType[];
  innerRef: any;
  ColumnComponent: any;
  placeholder?: any;
  onColumnEdit?: any;
  onColumnDelete?: any;
  onAddRecord?: any;
  onRecordEdit?: any;
  onRecordDelete?: any;
  onAllRecordDelete?: any;
  handleOpenAddColumnDialog?: Function;
  forceBoardUpdate?: Function;
};

/** 高度100vh的仪表板 */
export function Board(props: BoardProps) {
  const {
    columns,
    innerRef,
    ColumnComponent = Column,
    placeholder,
    onColumnEdit,
    onColumnDelete,
    onAddRecord,
    onRecordEdit,
    onRecordDelete,
    onAllRecordDelete,
    handleOpenAddColumnDialog,
    forceBoardUpdate,
    ...rest
  } = props;

  const classes = useBoardStyles();

  // const [__, forceUpdate] = useReducer((x) => x + 1, 0);
  // console.log(';;Board-forceUpdate ', forceUpdate);

  return (
    <div className={classes.root} ref={innerRef} {...rest}>
      {columns && columns.length ? (
        columns.map((column, index) => (
          <ColumnComponent
            index={index}
            key={column.id}
            column={column}
            className={classes.column}
            onEdit={onColumnEdit}
            onDelete={onColumnDelete}
            onAddRecord={onAddRecord}
            onRecordEdit={onRecordEdit}
            onRecordDelete={onRecordDelete}
            onAllRecordDelete={onAllRecordDelete}
            forceBoardUpdate={forceBoardUpdate}
          />
        ))
      ) : (
        <Box display='flex' justifyContent='center'>
          {/* <Typography>{t('noColumn')}</Typography> */}
        </Box>
      )}
      {placeholder}
      <Button
        onClick={handleOpenAddColumnDialog as any}
        variant='outlined'
        size='large'
        className={classes.addColButton}
        startIcon={<AddIcon />}
      >
        添加分组
      </Button>
    </div>
  );
}

export default Board;
