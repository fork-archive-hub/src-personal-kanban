import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Dialog, DialogContent, Grid, Toolbar } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import ColumnForm from '../../components/ColumnForm/ColumnForm';
import type { Column } from '../../types';

export type AddColumnDialogProps = {
  /** 添加分组列的弹窗是否打开 */
  open?: boolean;
  /** 弹窗关闭时的事件处理函数 */
  onClose?: Function;
  /** 点击提交按钮时的事件处理函数 */
  onSubmit?: Function;
};

/** 添加分组/任务清单的弹窗 */
export function AddColumnDialog(props: AddColumnDialogProps) {
  const { open, onClose, onSubmit } = props;

  const handleCloseDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(
    (column: Column) => {
      onSubmit({ column });
      handleCloseDialog();
    },
    [handleCloseDialog, onSubmit],
  );

  return (
    <Dialog onClose={handleCloseDialog} open={open}>
      <DialogContent>
        <ColumnForm onSubmit={handleSubmit} onCancel={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  );
}

export default AddColumnDialog;
