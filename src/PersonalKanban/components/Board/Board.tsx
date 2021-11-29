import Column from 'PersonalKanban/components/Column';
import { COLUMN_WIDTH } from 'PersonalKanban/constants';
import { useTranslation } from 'PersonalKanban/providers/TranslationProvider';
import { Column as ColumnType } from 'PersonalKanban/types';
import React from 'react';

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
    height: '100vh',
    display: 'inline-flex',
    width: 'fit-content',
  },
  column: {
    width: COLUMN_WIDTH,
    margin: theme.spacing(),
    height: 'fit-content',
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
};

const Board: React.FC<BoardProps> = (props) => {
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
    ...rest
  } = props;

  const classes = useBoardStyles();

  const { t } = useTranslation();

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
          />
        ))
      ) : (
        <Box display='flex' justifyContent='center'>
          <Typography>{t('noColumn')}</Typography>
        </Box>
      )}
      {placeholder}
      <Button
        variant='outlined'
        color='primary'
        size='large'
        // className={classes.button}
        startIcon={<AddIcon />}
        style={{
          width: 240,
          height: 48,
        }}
      >
        添加新分组
      </Button>
    </div>
  );
};

export default Board;
