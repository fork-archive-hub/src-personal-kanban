import cx from 'clsx';
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
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useColumnHeaderStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: '#fff',
    border: `1px solid rgba(15, 15, 15, 0.12)`,
    '& .groupMoreActions': {
      visibility: 'hidden',
    },
    '&:hover .groupMoreActions': {
      visibility: 'visible',
    },
  },
  headerBorder: {
    border: 0,
  },
  divider: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  columnMoreActionsBtn: {
    '&:hover': {
      backgroundColor: '#fff',
      color: theme.palette.primary.main,
    },
  },
}));

type ColumnHeaderProps = {
  title: string;
  description?: string;
  onEdit?: any;
  onDelete?: any;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  kanbanVariant?: string;
};

export function ColumnHeader(props: ColumnHeaderProps) {
  const {
    title,
    description,
    showEditAction = true,
    showDeleteAction = true,
    onEdit,
    onDelete,
    kanbanVariant,
  } = props;

  const classes = useColumnHeaderStyles();
  return (
    <>
      <Box
        className={cx(classes.root, {
          [classes.headerBorder]: kanbanVariant === 'fullPage',
        })}
        bgcolor='#fff'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        padding='0 0 0 12px'
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
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              alert('更多分组操作，开发中...');
            }}
            className={cx('groupMoreActions', classes.columnMoreActionsBtn)}
            aria-label='更多分组操作'
            disableRipple
          >
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
