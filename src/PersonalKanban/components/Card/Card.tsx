import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AlarmOutlinedIcon from '@material-ui/icons/AlarmOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import SortOutlinedIcon from '@material-ui/icons/SortOutlined';

import type { Record } from '../../types';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    paper: {
      minHeight: 80,
      maxHeight: 480,
      padding: '8px 0 8px 12px',
      '&:hover .cardMoreActionsIcon': {
        visibility: 'visible',
        // color: theme.palette.primary.main,
      },
      '& .cardMoreActionsIcon': {
        visibility: 'hidden',
      },
    },
    description: {
      color: theme.palette.text.secondary,
      maxHeight: '5rem',
      minHeight: '5rem',
      overflow: 'hidden',
      whiteSpace: 'pre-line',
    },
    cardTitle: {},
    tagBtn: {
      backgroundColor: '#d4c5f9',
      textTransform: 'none',
      // backgroundColor: '#a2eeef',
      '&:hover': {
        backgroundColor: '#d4c5f9',
      },
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
    taskDueTimeBtn: {
      backgroundColor: '#eef3fc',
    },
    subTaskListBtn: {
      // backgroundColor: '#eef3fc',
      color: theme.palette.text.secondary,
    },
    relatedDocsTitle: {
      color: theme.palette.text.secondary,
    },
    relatedDocsItemIcon: {
      opacity: 0.75,
      minWidth: 24,
      // fontSize: '1rem',
    },
    relatedDocsDocIcon: {
      fontSize: '1rem',
    },
    relatedDocListItem: {
      // paddingLeft: theme.spacing(2),
      padding: '0 0 0 16px',
    },
    relatedDocsCollapseBtn: {
      color: theme.palette.text.secondary,
    },
    cardBottomIconBtn: {
      paddingTop: 0,
      paddingBottom: 0,
      '&:hover': {
        backgroundColor: '#fff',
      },
    },
  }),
);

type CardProps = {
  record: Record;
  className?: string;
  style?: any;
  innerRef?: any;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  onDelete?: any;
  onEdit?: any;
  forceColumnUpdate?: Function;
};

/**
 * 看板中一个面板列上的一个卡片
 */
export function Card(props: CardProps) {
  const classes = useStyles();

  const {
    record,
    className,
    innerRef,
    style,
    showEditAction,
    showDeleteAction,
    onDelete,
    onEdit,
    forceColumnUpdate,
    ...rest
  } = props;
  const {
    title,
    description,
    createdAt,
    tags,
    taskStatus,
    taskMembers,
    taskStartTime,
    taskDueTime,
    taskPriority,
    taskEmoji,
    subTaskList,
    relatedDocs,
    attachments,
    comments,
  } = record;

  const handleEdit = useCallback(() => onEdit(record), [record, onEdit]);
  const handleDelete = useCallback(() => onDelete(record), [record, onDelete]);

  const doesSubTaskListExist =
    subTaskList && subTaskList['records'] && subTaskList['records'].length > 0;
  let cardSubTasksTotalCount = 0;
  let cardSubTasksDoneCount = 0;
  if (doesSubTaskListExist) {
    cardSubTasksTotalCount = subTaskList['records'].length;
    subTaskList['records'].forEach((record) => {
      // console.log(';;subTask-record ', record);

      if (record.taskStatus === 'done') {
        cardSubTasksDoneCount++;
      }
    });
  }
  // console.log(';;cardSubTasksDoneCount ', cardSubTasksDoneCount);

  const doesRelatedDocsExist =
    relatedDocs && relatedDocs['docList'] && relatedDocs['docList'].length > 0;
  const [isRelatedDocsListOpen, setIsRelatedDocsListOpen] = useState(true);
  const handleToggleRelatedDocsListOpen = useCallback((e) => {
    setIsRelatedDocsListOpen((prev) => !prev);
    e.stopPropagation();
  }, []);

  return (
    <Paper
      onClick={handleEdit}
      elevation={0}
      // elevation={1}
      className={clsx(classes.paper, className)}
      style={style}
      ref={innerRef}
      {...rest}
    >
      <Grid container spacing={1}>
        <Grid item container alignItems='center' justifyContent='space-between'>
          <Box display='flex' style={{ padding: `12px 12px 12px 8px` }}>
            <Typography title={title} className={classes.cardTitle}>
              {taskEmoji && taskEmoji.trim() ? taskEmoji + ' ' : null}
              {title}
            </Typography>
          </Box>
        </Grid>

        {tags && tags.length > 0 ? (
          <Grid item container>
            <Grid item>
              {tags.map((tag) => {
                const { tagName } = tag;
                return tagName && tagName.trim() ? (
                  <Button
                    onClick={(e) => e.stopPropagation()}
                    variant='contained'
                    className={classes.tagBtn}
                    disableElevation
                    disableRipple
                    key={tagName}
                  >
                    {tagName}
                  </Button>
                ) : null;
              })}
            </Grid>
          </Grid>
        ) : null}

        {taskDueTime || doesSubTaskListExist ? (
          <Grid item container>
            {taskDueTime ? (
              <Grid item>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant='contained'
                  className={classes.taskDueTimeBtn}
                  startIcon={<AlarmOutlinedIcon />}
                  title='截止日期'
                  disableElevation
                >
                  {taskDueTime}
                </Button>
              </Grid>
            ) : null}
            {doesSubTaskListExist ? (
              <Grid item>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  // variant='contained'
                  disableElevation
                  className={classes.subTaskListBtn}
                  startIcon={<AssignmentTurnedInOutlinedIcon />}
                  title={`待办事件(子任务)清单: 已完成 ${cardSubTasksDoneCount} / 总事项 ${cardSubTasksTotalCount};    未完成 ${
                    Number(cardSubTasksTotalCount) -
                    Number(cardSubTasksDoneCount)
                  } `}
                >
                  {cardSubTasksDoneCount}/{cardSubTasksTotalCount}
                </Button>
              </Grid>
            ) : null}
          </Grid>
        ) : null}

        {taskPriority ? (
          <Grid item container>
            <Grid item>
              <Button
                onClick={(e) => e.stopPropagation()}
                // variant='contained'
                disableElevation
                className={classes.subTaskListBtn}
                startIcon={<SortOutlinedIcon />}
                title={`当前优先级: ${taskPriority}，任务默认优先级为普通-10`}
              >
                优先级: {taskPriority}
              </Button>
            </Grid>
          </Grid>
        ) : null}

        {doesRelatedDocsExist ? (
          <Grid item container>
            <Grid item container>
              <Button
                onClick={handleToggleRelatedDocsListOpen}
                variant='text'
                className={classes.relatedDocsCollapseBtn}
                startIcon={
                  isRelatedDocsListOpen ? <ExpandMore /> : <ChevronRightIcon />
                }
              >
                相关文档/文献
              </Button>
            </Grid>
            <Grid item container>
              <Collapse in={isRelatedDocsListOpen} timeout='auto' unmountOnExit>
                <List aria-label='相关文档列表' disablePadding>
                  {relatedDocs['docList'].map((doc) => {
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
                          <a
                            className={classes.relatedDocsTitle}
                            title={docTitle}
                          >
                            {docTitle.length > 24
                              ? docTitle.slice(0, 24) + '...'
                              : docTitle}
                          </a>
                        </ListItemText>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </Grid>
          </Grid>
        ) : null}

        <Grid item container alignItems='center' justifyContent='space-between'>
          {taskMembers && taskMembers.length > 0 ? (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                alert('选择其他成员，开发中...');
              }}
              aria-label='任务负责人 owner member'
              disableRipple
              className={classes.cardBottomIconBtn}
            >
              <AccountCircleOutlinedIcon />
            </IconButton>
          ) : (
            <span></span>
          )}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              alert('更多卡片操作，开发中...');
            }}
            disableRipple
            aria-label='更多任务卡片操作'
            className={`cardMoreActionsIcon ${classes.cardBottomIconBtn}`}
          >
            <MoreHorizOutlinedIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Card;
