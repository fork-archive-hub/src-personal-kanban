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

import type { Record } from '../../types';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
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
  }),
);

export function ItemTags(props) {
  const classes = useStyles();

  const {
    tags,
    isAddingNewTag,
    newTagName,
    handleInputNewTagName,
    handleUpdateTagsData,
    handleStartAddNewTag,
  } = props;

  return (
    <>
      {tags
        ? tags.map((tag) => {
            const { tagName } = tag;
            return (
              <Chip
                label={tagName}
                onClick={() => {}}
                onDelete={() => {}}
                className={classes.tagBtn}
                key={tagName}
              />
            );
          })
        : null}
      {isAddingNewTag ? (
        <>
          <TextField
            value={newTagName}
            onChange={handleInputNewTagName}
            id='addNewTag'
            label='输入标签名'
          />
          <Button
            onClick={handleUpdateTagsData}
            variant='contained'
            color='primary'
            className={cx(classes.addTagBtn, {
              [classes.addTagBtnML]: true,
            })}
            startIcon={<AddIcon />}
          >
            添加标签
          </Button>
        </>
      ) : (
        <Button
          onClick={handleStartAddNewTag}
          variant='outlined'
          className={cx(classes.addTagBtn, {
            [classes.addTagBtnML]: tags && tags.length > 0,
          })}
          startIcon={<AddIcon />}
        >
          添加标签
        </Button>
      )}
    </>
  );
}
