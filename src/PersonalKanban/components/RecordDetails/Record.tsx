import cx from 'clsx';
import { useFormik } from 'formik';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
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
  Popover,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import FaceIcon from '@material-ui/icons/Face';
import LinkIcon from '@material-ui/icons/Link';
import PersonAddDisabledOutlinedIcon from '@material-ui/icons/PersonAddDisabledOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import SortOutlinedIcon from '@material-ui/icons/SortOutlined';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import Radio from '../../components/Radio';
import { RecordColor } from '../../constants';
import type { Record } from '../../types';
import { generateUserList } from './mockData';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    taskCommonActionsBtn: {
      // color: '#777',
      // marginRight: '4rem',
    },
    configItemFormControl: {
      width: '100%',
      // paddingBottom: 0,
    },
    configItemTitle: {
      margin: '8px 0 4px',
    },
    cardDesc: {
      color: theme.palette.text.secondary,
    },
    taskMembersList: {
      width: 240,
    },
    dueDatePicker: {
      width: 120,
      marginRight: '2rem',
      '& .MuiInputBase-input': {
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      },
    },
    addTagBtn: {
      // 若宽度过小，按钮上的文本会换行
      width: '12rem',
      height: 36,
      margin: '8px 0px',
    },
    addTagBtnML: {
      marginLeft: theme.spacing(2),
    },
    tagBtn: {
      backgroundColor: '#d4c5f9',
      textTransform: 'none',
      // backgroundColor: '#a2eeef',
      '&:hover': {
        backgroundColor: '#d4c5f9',
      },
    },
    tagsSpacing: {
      '& > *': {
        margin: theme.spacing(0.8),
      },
    },
    relatedDocsItemIcon: {
      opacity: 0.75,
      minWidth: 24,
    },
    relatedDocsDocIcon: {
      fontSize: '1.1rem',
    },
    relatedDocListItem: {
      // paddingLeft: theme.spacing(2),
      padding: '0 0 0 0',
    },
    textSecondary: {
      color: theme.palette.text.secondary,
    },

    subTaskCheckbox: {
      '& svg': {
        fontSize: '1.3rem',
      },
      '&+span': {
        color: theme.palette.text.secondary,
      },
    },

    visibilityHidden: {
      visibility: 'hidden',
    },
  }),
);

export function RecordTitle(props) {
  const classes = useStyles();

  const { a } = props;

  return 1;
}
