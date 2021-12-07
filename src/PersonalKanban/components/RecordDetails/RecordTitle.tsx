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
      name='title'
      label={'名称或标题'}
      multiline={cardTitle.length > 20 ? true : false}
      value={cardTitle}
      onChange={handleCardTitleChange}
      onBlur={() => {
        setIsEditingCardTitle(false);
      }}
    />
  ) : (
    <Typography
      gutterBottom
      variant='h6'
      onClick={() => {
        setIsEditingCardTitle(true);
      }}
    >
      {cardTitle}
    </Typography>
  );
}
