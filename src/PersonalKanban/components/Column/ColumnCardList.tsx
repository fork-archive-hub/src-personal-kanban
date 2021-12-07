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
import { ColumnHeader } from './ColumnHeader';

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
  forceColumnUpdate?: Function;
};

export function ColumnCardList(props: ColumnCardListProps) {
  const {
    column,
    innerRef,
    CardComponent = Card,
    onRecordEdit,
    onRecordDelete,
    forceColumnUpdate,
  } = props;
  
  const classes = useColumnCardListStyles();

  const { records = [] } = column;

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
              forceColumnUpdate={forceColumnUpdate}
            />
          ))
        : // <Typography>{t('noRecord')}</Typography>
          null}
    </div>
  );
}
