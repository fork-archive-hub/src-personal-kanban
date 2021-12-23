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
  Button,
  Checkbox,
  Chip,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

export function RecordTitle(props) {
  const {
    cardTitle,
    isEditingCardTitle,
    handleCardTitleChange,
    setIsEditingCardTitle,
  } = props;

  return isEditingCardTitle ? (
    <TextField
      value={cardTitle}
      onChange={handleCardTitleChange}
      name='cardTitle'
      label={'名称或标题'}
      multiline={cardTitle.length > 20 ? true : false}
      onBlur={() => {
        setIsEditingCardTitle(false);
      }}
    />
  ) : (
    <Typography
      onClick={() => {
        setIsEditingCardTitle(true);
      }}
      gutterBottom
      variant='h6'
    >
      {cardTitle}
    </Typography>
  );
}
