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

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
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
  }),
);

export function ItemRelatedDocs(props) {
  const classes = useStyles();

  const {
    docName,
    handleDocNameChange,
    handleAddRelatedDocs,
    doesRelatedDocsExist,
    relatedDocs,
  } = props;

  return (
    <>
      <TextField
        id='inputAddNewDocOrLinkedDoc'
        // label='先输入文档名，然后选择创建新文档或链接已有文档'
        label='输入文档名'
        value={docName}
        onChange={handleDocNameChange}
      />
      <Button
        onClick={handleAddRelatedDocs}
        // disabled
        variant='contained'
        color='primary'
        startIcon={<AddIcon />}
        disableRipple
        disableElevation
      >
        创建并添加文档
      </Button>
      &emsp;
      <Button
        disabled
        variant='contained'
        // color='default'
        // className={classes.button}
        startIcon={<LinkIcon />}
      >
        添加已有文档的链接
      </Button>
      <List aria-label='相关文档列表'>
        {doesRelatedDocsExist
          ? relatedDocs[0]['docList'].map((doc) => {
              const { docId, docTitle } = doc;

              return (
                <ListItem
                  onClick={(e) => e.stopPropagation()}
                  key={docId}
                  button
                  disableGutters
                  className={classes.relatedDocListItem}
                >
                  <ListItemIcon className={classes.relatedDocsItemIcon}>
                    <DescriptionOutlinedIcon
                      className={classes.relatedDocsDocIcon}
                    />
                  </ListItemIcon>
                  <ListItemText>
                    {/* <Link
                            href={`/doc2/${
                              Math.floor(Math.random() * (20000 - 1 + 1)) + 1
                            }`}
                          > */}
                    <a className={classes.textSecondary} title={docTitle}>
                      {docTitle.length > 120
                        ? docTitle.slice(0, 120) + '...'
                        : docTitle}
                    </a>
                    {/* </Link> */}
                  </ListItemText>
                </ListItem>
              );
            })
          : null}
      </List>
    </>
  );
}
