import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

import Card from "../../components/Card";
import ColumnForm from "../../components/ColumnForm";
import IconButton from "../../components/IconButton";
import RecordForm from "../../components/RecordForm";
import { ColumnColor, DarkColumnColor } from "../../constants";
import { useTheme } from "../../providers/ThemeProvider";
import type { Column as ColumnType, Record } from "../../types";
import { RecordDetails } from "../RecordDetails";
import { ColumnCardList } from "./ColumnCardList";
import { ColumnFooter } from "./ColumnFooter";
import { ColumnHeader } from "./ColumnHeader";

const useColumnStyles = makeStyles(() => ({
  paper: (props: any) => {
    // console.log(';;col-props ', props);
    const bgColor = props.backgroundColor || "transparent";
    return {
      backgroundColor: bgColor,
    };
  },

  dialogPaper: {
    maxHeight: "80vh",
    maxWidth: "65vh",
    // overflow: 'hidden',
  },
  dialogContent: {
    overflow: "hidden",
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
  forceBoardUpdate?: Function;
};

/** 看板的一列，是一个面板，上面可以放置多个卡片 */
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
    forceBoardUpdate,
    ColumnHeaderComponent = ColumnHeader,
    ColumnActionComponent,
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

  // const [__, forceColumnUpdate] = useReducer((x) => x + 1, 0);
  // console.log(';;Column-forceBoardUpdate ', forceBoardUpdate, column);

  const disableAddRecordAction = wipEnabled && wipLimit <= records.length;

  const disableAllRecordDeleteAction = !records.length;

  const columnColor = color as keyof typeof ColumnColor;

  const { darkTheme } = useTheme();

  const classes = useColumnStyles({
    backgroundColor: darkTheme
      ? DarkColumnColor[columnColor]
      : ColumnColor[columnColor],
  });

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    content: null,
    actions: null,
  });

  const handleDelete = useCallback(
    (e) => {
      onDelete && onDelete({ column, e });
    },
    [column, onDelete]
  );

  const handleEdit = useCallback(
    (column: ColumnType) => {
      onEdit && onEdit({ column });
    },
    [onEdit]
  );

  const handleAddRecord = useCallback(
    (record: Record) => {
      onAddRecord && onAddRecord({ column, record });
    },
    [column, onAddRecord]
  );

  /** 更新看板数据的方法，会传入column和record */
  const handleRecordEdit = useCallback(
    (record: Record) => {
      onRecordEdit({ column, record });
    },
    [column, onRecordEdit]
  );

  const handleRecordDelete = useCallback(
    (record: Record) => {
      onRecordDelete({ column, record });
    },
    [column, onRecordDelete]
  );

  const handleAllRecordDelete = useCallback(() => {
    onAllRecordDelete({ column });
  }, [column, onAllRecordDelete]);

  const handleOpenDialog = useCallback(({ content, title, actions }) => {
    setDialog({ content, title, actions, open: true });
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialog(() => ({ content: null, title: "", actions: null, open: false }));
  }, []);

  const handleOpenDeleteDialog = useCallback(() => {
    const content = (
      <Typography>
        {
          // t('deleteColumnConfirmation')
          "是否要删除列？"
        }
      </Typography>
    );
    const actions = (
      <>
        <Button variant="outlined" onClick={handleCloseDialog}>
          {/* {t('cancel')} */}
          取消
        </Button>
        &nbsp;
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            handleCloseDialog();
            handleDelete(e);
          }}
        >
          删除
          {/* {t('delete')} */}
        </Button>
      </>
    );

    handleOpenDialog({
      content,
      actions,
      title: "删除分组", // t('deleteColumn')
    });
  }, [handleOpenDialog, handleDelete, handleCloseDialog]);

  const handleOpenEditDialog = useCallback(() => {
    const content = (
      <ColumnForm
        column={column}
        // formTitle={t('editColumn')}
        formTitle="编辑分组"
        onSubmit={(column: any) => {
          handleCloseDialog();
          handleEdit(column);
        }}
        onCancel={handleCloseDialog}
      ></ColumnForm>
    );

    handleOpenDialog({ content });
  }, [column, handleOpenDialog, handleCloseDialog, handleEdit]);

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

  /**
   * * 打开弹窗，编辑一个任务卡片的字段信息
   */
  const handleOpenEditRecordDialog = useCallback(
    (record: Record) => {
      const content = (
        <RecordDetails
          record={record}
          onSubmit={(record: Record) => {
            // console.log(';;RecordDetails-onSubmit ', record);
            handleCloseDialog();
            handleRecordEdit(record);
          }}
          onSubmitDataWithDialogOpen={(record: Record) => {
            // console.log(';;RecordDetails-onSubmit ', record);
            handleRecordEdit(record);
          }}
          onCancel={handleCloseDialog}
          // forceBoardUpdate={forceBoardUpdate}
        ></RecordDetails>
      );

      handleOpenDialog({ content });
    },
    [handleCloseDialog, handleOpenDialog, handleRecordEdit]
  );

  const handleOpenDeleteRecordDialog = useCallback(
    (record: Record) => {
      const content = (
        <Typography>
          {
            // t('deleteRecordConfirmation')
            "确定要删除当前卡片？"
          }
        </Typography>
      );
      const actions = (
        <>
          <Button variant="outlined" onClick={handleCloseDialog}>
            取消
          </Button>
          &nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              handleCloseDialog();
              handleRecordDelete(record);
            }}
          >
            删除当前卡片
          </Button>
        </>
      );

      handleOpenDialog({
        content,
        actions,
        title: "删除卡片",
        // t('deleteRecord')
      });
    },
    [handleOpenDialog, handleCloseDialog, handleRecordDelete]
  );

  const handleOpenDeleteAllRecordDialog = useCallback(
    (record: Record) => {
      const content = (
        <Typography>
          {
            // t('deleteAllRecordConfirmation')
            "确定要删除所有卡片？"
          }
        </Typography>
      );
      const actions = (
        <>
          <Button variant="outlined" onClick={handleCloseDialog}>
            {/* {t('cancel')} */}
            取消
          </Button>
          &nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              handleCloseDialog();
              handleAllRecordDelete();
            }}
          >
            {/* {t('delete')} */}
            删除
          </Button>
        </>
      );

      handleOpenDialog({
        content,
        actions,
        title: "删除所有卡片", // t('deleteAllRecord')
      });
    },
    [handleOpenDialog, handleCloseDialog, handleAllRecordDelete]
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
      <ColumnCardListComponent
        column={column}
        onRecordEdit={handleOpenEditRecordDialog}
        onRecordDelete={handleOpenDeleteRecordDialog}
        forceBoardUpdate={forceBoardUpdate}
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
