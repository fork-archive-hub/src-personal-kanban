import clsx from 'clsx';
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

import Card from '../../components/Card';
import ColumnForm from '../../components/ColumnForm';
import IconButton from '../../components/IconButton';
import RecordForm from '../../components/RecordForm';
import { ColumnColor, DarkColumnColor } from '../../constants';
import { useTheme } from '../../providers/ThemeProvider';
import type { Column as ColumnType, Record } from '../../types';
import { RecordDetails } from '../RecordDetails';
import { ColumnHeader } from './ColumnHeader';

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
