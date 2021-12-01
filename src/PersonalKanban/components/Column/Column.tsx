import Card from 'PersonalKanban/components/Card';
import ColumnForm from 'PersonalKanban/components/ColumnForm';
import IconButton from 'PersonalKanban/components/IconButton';
import RecordForm from 'PersonalKanban/components/RecordForm';
import { ColumnColor, DarkColumnColor } from 'PersonalKanban/enums';
import { useTheme } from 'PersonalKanban/providers/ThemeProvider';
import { useTranslation } from 'PersonalKanban/providers/TranslationProvider';
import { Column as ColumnType, Record } from 'PersonalKanban/types';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton as MIconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { RecordDetails } from '../RecordDetails';

const useColumnHeaderStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
  },
  divider: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
}));

type ColumnHeaderProps = {
  title: string;
  description?: string;
  onEdit?: any;
  onDelete?: any;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
};

export const ColumnHeader: React.FC<ColumnHeaderProps> = (props) => {
  const {
    title,
    description,
    showEditAction,
    showDeleteAction,
    onEdit,
    onDelete,
  } = props;

  const classes = useColumnHeaderStyles();
  return (
    <>
      <Box
        bgcolor='#fff'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        padding='0 0 0 12px'
        // marginBottom={Boolean(description) ? 0.5 : 0}
        // marginBottom={1.5}
        marginBottom='12px'
      >
        <Typography
          // variant='h6'
          title={title}
          noWrap
          style={{ fontWeight: 500 }}
        >
          {title}
        </Typography>
        <Box display='flex' alignItems='center'>
          {/* {showEditAction && <IconButton icon='edit' onClick={onEdit} />}
          {showDeleteAction && (
            <IconButton icon='deleteForever' onClick={onDelete} />
          )} */}
          <MIconButton aria-label='更多任务分组操作' disableRipple>
            <MoreHorizIcon />
          </MIconButton>
        </Box>
      </Box>
      {/* <Typography title={description} noWrap gutterBottom>
            {description}
        </Typography> */}
      {/* <Divider className={classes.divider} /> */}
    </>
  );
};

ColumnHeader.defaultProps = { showEditAction: true, showDeleteAction: true };

const useColumnActionStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
}));

type ColumnActionProps = {
  onAddRecord?: any;
  onDeleteAllRecord?: any;
  showAddRecordAction?: boolean;
  showAllRecordDeleteAction?: boolean;
  disableAllRecordDeleteAction?: boolean;
  disableAddRecordAction?: boolean;
};

export const ColumnAction: React.FC<ColumnActionProps> = (props) => {
  const {
    showAddRecordAction,
    showAllRecordDeleteAction,
    disableAllRecordDeleteAction,
    disableAddRecordAction,
    onAddRecord,
    onDeleteAllRecord,
  } = props;
  const classes = useColumnActionStyles();
  return (
    <>
      {showAddRecordAction && (
        <IconButton
          icon='add'
          disabled={disableAddRecordAction}
          onClick={onAddRecord}
        />
      )}
      {showAllRecordDeleteAction && (
        <IconButton
          icon='delete'
          disabled={disableAllRecordDeleteAction}
          onClick={onDeleteAllRecord}
        />
      )}

      <Divider className={classes.divider} />
    </>
  );
};

ColumnAction.defaultProps = {
  showAddRecordAction: true,
  showAllRecordDeleteAction: true,
};

const useColumnCardListStyles = makeStyles((theme) => ({
  card: {
    // marginBottom: theme.spacing(2),
    marginBottom: 12,
  },
}));

type ColumnCardListProps = {
  column: ColumnType;
  innerRef?: any;
  CardComponent?: any;
  onRecordEdit?: any;
  onRecordDelete?: any;
};

export const ColumnCardList: React.FC<ColumnCardListProps> = (props) => {
  const {
    column,
    innerRef,
    CardComponent = Card,
    onRecordEdit,
    onRecordDelete,
  } = props;
  const { records = [] } = column;

  const { t } = useTranslation();

  const classes = useColumnCardListStyles();

  return (
    <div ref={innerRef}>
      {records && records.length
        ? records.map((record: Record, index) => (
            <CardComponent
              key={record.id}
              record={record}
              className={classes.card}
              index={index}
              onEdit={onRecordEdit}
              onDelete={onRecordDelete}
              showEditAction={false}
              showDeleteAction={false}
            />
          ))
        : // <Typography>{t('noRecord')}</Typography>
          null}
    </div>
  );
};

const useColumnFooterStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  addCardButton: {
    width: 264,
    height: 36,
    color: theme.palette.text.secondary,
    backgroundColor: '#fff',
    border: 'none',
  },
}));

type ColumnFooterProps = {
  content?: string;
  handleOpenAddRecordDialog?: Function;
};

export const ColumnFooter: React.FC<ColumnFooterProps> = (props) => {
  const { content, handleOpenAddRecordDialog } = props;

  const classes = useColumnFooterStyles();
  return (
    <>
      {/* <Divider className={classes.divider} /> */}
      <Typography variant='caption' component='p' title={content} noWrap>
        {/* {content} */}
      </Typography>

      <Button
        onClick={handleOpenAddRecordDialog as any}
        variant='outlined'
        size='large'
        // color='secondary'
        className={classes.addCardButton}
        startIcon={<AddIcon />}
      >
        {/* 添加新任务卡片 */}
      </Button>
    </>
  );
};

const useColumnStyles = makeStyles(() => ({
  paper: (props: any) => {
    // console.log(';;col-props ', props);
    const bgColor = props.backgroundColor || 'transparent';
    return {
      backgroundColor: bgColor,
    };
  },

  dialogPaper: {
    maxHeight: '80vh',
    maxWidth: '65vh',
    // overflow: 'hidden',
  },
  dialogContent: {
    overflow: 'hidden',
    // minHeight: 860,
  },
}));

type ColumnProps = {
  column: ColumnType;
  className?: string;
  innerRef?: any;
  onEdit?: any;
  onDelete?: any;
  onAddRecord?: any;
  onRecordEdit?: any;
  onRecordDelete?: any;
  onAllRecordDelete?: any;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  showAddRecordAction?: boolean;
  showDeleteAllRecordAction?: boolean;
  ColumnHeaderComponent?: any;
  ColumnActionComponent?: any;
  ColumnCardListComponent?: any;
  ColumnFooterComponent?: any;
};

/** 看板的一列，是一个面板，上面可以放置小卡片 */
export function Column(props: ColumnProps) {
  const {
    column,
    className,
    innerRef,
    onEdit,
    onDelete,
    onAddRecord,
    onAllRecordDelete,
    showDeleteAction,
    showEditAction,
    onRecordEdit,
    onRecordDelete,
    showAddRecordAction,
    showDeleteAllRecordAction,
    ColumnHeaderComponent = ColumnHeader,
    ColumnActionComponent = ColumnAction,
    ColumnCardListComponent = ColumnCardList,
    ColumnFooterComponent = ColumnFooter,
    ...rest
  } = props;

  const {
    title,
    description,
    caption,
    color,
    records = [],
    wipEnabled,
    wipLimit = Infinity,
  } = column;

  const disableAddRecordAction = wipEnabled && wipLimit <= records.length;

  const disableAllRecordDeleteAction = !records.length;

  const columnColor = color as keyof typeof ColumnColor;

  const { darkTheme } = useTheme();

  const { t } = useTranslation();

  const classes = useColumnStyles({
    backgroundColor: darkTheme
      ? DarkColumnColor[columnColor]
      : ColumnColor[columnColor],
  });

  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    content: null,
    actions: null,
  });

  const handleDelete = useCallback(
    (e) => {
      onDelete && onDelete({ column, e });
    },
    [column, onDelete],
  );

  const handleEdit = useCallback(
    (column: ColumnType) => {
      onEdit && onEdit({ column });
    },
    [onEdit],
  );

  const handleAddRecord = useCallback(
    (record: Record) => {
      onAddRecord && onAddRecord({ column, record });
    },
    [column, onAddRecord],
  );

  const handleRecordEdit = useCallback(
    (record: Record) => {
      onRecordEdit({ column, record });
    },
    [column, onRecordEdit],
  );

  const handleRecordDelete = useCallback(
    (record: Record) => {
      onRecordDelete({ column, record });
    },
    [column, onRecordDelete],
  );

  const handleAllRecordDelete = useCallback(() => {
    onAllRecordDelete({ column });
  }, [column, onAllRecordDelete]);

  const handleOpenDialog = useCallback(({ content, title, actions }) => {
    setDialog({ content, title, actions, open: true });
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialog(() => ({ content: null, title: '', actions: null, open: false }));
  }, []);

  const handleOpenDeleteDialog = useCallback(() => {
    const content = <Typography>{t('deleteColumnConfirmation')}</Typography>;
    const actions = (
      <>
        <Button variant='outlined' onClick={handleCloseDialog}>
          {t('cancel')}
        </Button>
        &nbsp;
        <Button
          variant='contained'
          color='primary'
          onClick={(e) => {
            handleCloseDialog();
            handleDelete(e);
          }}
        >
          {t('delete')}
        </Button>
      </>
    );

    handleOpenDialog({ content, actions, title: t('deleteColumn') });
  }, [t, handleOpenDialog, handleDelete, handleCloseDialog]);

  const handleOpenEditDialog = useCallback(() => {
    const content = (
      <ColumnForm
        column={column}
        formTitle={t('editColumn')}
        onSubmit={(column: any) => {
          handleCloseDialog();
          handleEdit(column);
        }}
        onCancel={handleCloseDialog}
      ></ColumnForm>
    );

    handleOpenDialog({ content });
  }, [column, t, handleOpenDialog, handleCloseDialog, handleEdit]);

  const handleOpenAddRecordDialog = useCallback(() => {
    const content = (
      <RecordForm
        onSubmit={(record: Record) => {
          handleCloseDialog();
          handleAddRecord(record);
        }}
        onCancel={handleCloseDialog}
      ></RecordForm>
    );

    handleOpenDialog({ content });
  }, [handleOpenDialog, handleCloseDialog, handleAddRecord]);

  const handleOpenEditRecordDialog = useCallback(
    (record: Record) => {
      const content = (
        <RecordDetails
          record={record}
          onSubmit={(record: Record) => {
            handleCloseDialog();
            handleRecordEdit(record);
          }}
          onCancel={handleCloseDialog}
        ></RecordDetails>
      );

      handleOpenDialog({ content });
    },
    [handleOpenDialog, handleCloseDialog, handleRecordEdit],
  );

  const handleOpenDeleteRecordDialog = useCallback(
    (record: Record) => {
      const content = <Typography>{t('deleteRecordConfirmation')}</Typography>;
      const actions = (
        <>
          <Button variant='outlined' onClick={handleCloseDialog}>
            取消
          </Button>
          &nbsp;
          <Button
            variant='contained'
            color='primary'
            onClick={(e) => {
              handleCloseDialog();
              handleRecordDelete(record);
            }}
          >
            删除当前卡片
          </Button>
        </>
      );

      handleOpenDialog({ content, actions, title: t('deleteRecord') });
    },
    [t, handleOpenDialog, handleCloseDialog, handleRecordDelete],
  );

  const handleOpenDeleteAllRecordDialog = useCallback(
    (record: Record) => {
      const content = (
        <Typography>{t('deleteAllRecordConfirmation')}</Typography>
      );
      const actions = (
        <>
          <Button variant='outlined' onClick={handleCloseDialog}>
            {t('cancel')}
          </Button>
          &nbsp;
          <Button
            variant='contained'
            color='primary'
            onClick={(e) => {
              handleCloseDialog();
              handleAllRecordDelete();
            }}
          >
            {t('delete')}
          </Button>
        </>
      );

      handleOpenDialog({ content, actions, title: t('deleteAllRecord') });
    },
    [t, handleOpenDialog, handleCloseDialog, handleAllRecordDelete],
  );

  return (
    <Paper
      elevation={0}
      className={clsx(className, classes.paper)}
      ref={innerRef}
      {...rest}
    >
      <ColumnHeaderComponent
        title={title}
        description={description}
        showEditAction={showEditAction}
        showDeleteAction={showDeleteAction}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />
      {/* <ColumnActionComponent
        showAddRecordAction={showAddRecordAction}
        showDeleteAllRecordAction={showDeleteAllRecordAction}
        disableAddRecordAction={disableAddRecordAction}
        disableAllRecordDeleteAction={disableAllRecordDeleteAction}
        onAddRecord={handleOpenAddRecordDialog}
        onDeleteAllRecord={handleOpenDeleteAllRecordDialog}
      /> */}
      <ColumnCardListComponent
        column={column}
        onRecordEdit={handleOpenEditRecordDialog}
        onRecordDelete={handleOpenDeleteRecordDialog}
      />
      <ColumnFooterComponent
        content={caption}
        handleOpenAddRecordDialog={handleOpenAddRecordDialog}
      />
      <Dialog
        open={dialog.open}
        onClose={handleCloseDialog}
        classes={{ paper: classes.dialogPaper }}
      >
        {/* <DialogTitle>{dialog.title}</DialogTitle> */}
        <DialogContent className={classes.dialogContent}>
          {dialog.content}
        </DialogContent>
        <DialogActions>{dialog.actions}</DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Column;
