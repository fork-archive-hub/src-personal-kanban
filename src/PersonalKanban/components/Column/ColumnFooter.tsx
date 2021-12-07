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
import { useTranslation } from '../../providers/TranslationProvider';
import type { Column as ColumnType, Record } from '../../types';
import { RecordDetails } from '../RecordDetails';
import { ColumnCardList } from './ColumnCardList';
import { ColumnHeader } from './ColumnHeader';

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
