import IconButton from 'PersonalKanban/components/IconButton';
import { Record } from 'PersonalKanban/types';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton as MIconButton,
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

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    paper: {
      minHeight: 80,
      maxHeight: 480,
      padding: '8px 0 8px 12px',
      '&:hover .cardMoreActionsIcon': {
        display: 'flex',
      },
      '& .cardMoreActionsIcon': {
        display: 'none',
      },
    },
    description: {
      color: theme.palette.text.secondary,
      maxHeight: '5rem',
      minHeight: '5rem',
      // display: '-webkit-box',
      // '-webkit-line-clamp': 4,
      // '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
      whiteSpace: 'pre-line',
    },
    cardTitle: {},
    cardTagBtn: {
      backgroundColor: '#d4c5f9',
      textTransform: 'none',
      // backgroundColor: '#a2eeef',
      '&:hover': {
        backgroundColor: '#d4c5f9',
      },
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
    cardOwnerMemberBtn: {
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
};

/**
 * 看板中一个面板列上的一个卡片
 */
export function Card(props: CardProps) {
  const {
    record,
    className,
    innerRef,
    style,
    showEditAction,
    showDeleteAction,
    onDelete,
    onEdit,
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

  const classes = useStyles();

  const handleEdit = useCallback(() => onEdit(record), [record, onEdit]);
  const handleDelete = useCallback(() => onDelete(record), [record, onDelete]);

  const doesSubTaskListExist =
    subTaskList && subTaskList['records'] && subTaskList['records'].length > 0;
  let cardSubTasksTotalCount = 0;
  let cardSubTasksTodoCount = 0;
  if (doesSubTaskListExist) {
    cardSubTasksTotalCount = subTaskList['records'].length;
    subTaskList['records'].forEach((record) => {
      if (record.taskStatus === 'todo') {
        cardSubTasksTodoCount++;
      }
    });
  }

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
          <MIconButton
            onClick={(e) => e.stopPropagation()}
            disableRipple
            aria-label='更多任务卡片操作'
            className='cardMoreActionsIcon'
          >
            <MoreHorizOutlinedIcon />
          </MIconButton>
        </Grid>
        {/* <Typography
        variant='subtitle1'
        title={description}
        className={classes.description}
        gutterBottom
      >
        {description}
      </Typography> */}
        <Grid item container>
          {tags && tags.length > 0 ? (
            <Grid item>
              <Button
                onClick={(e) => e.stopPropagation()}
                variant='contained'
                disableElevation
                className={classes.cardTagBtn}
                // title=''
              >
                {tags[0]['tagName']}
              </Button>
            </Grid>
          ) : null}
        </Grid>
        <Grid item container>
          {taskDueTime ? (
            <Grid item>
              <Button
                onClick={(e) => e.stopPropagation()}
                variant='contained'
                disableElevation
                className={classes.taskDueTimeBtn}
                startIcon={<AlarmOutlinedIcon />}
                title='截止日期'
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
                title={`待办事项: 已完成 ${cardSubTasksTodoCount} / 总事项 ${cardSubTasksTotalCount}`}
              >
                {cardSubTasksTodoCount}/{cardSubTasksTotalCount}
              </Button>
            </Grid>
          ) : null}
        </Grid>
        <Grid item container>
          {taskPriority ? (
            <Grid item>
              <Button
                onClick={(e) => e.stopPropagation()}
                // variant='contained'
                disableElevation
                // className={classes.subTaskListBtn}
                startIcon={<SortOutlinedIcon />}
                title={`当前卡片任务优先级: ${taskPriority}，任务默认优先级为普通-10`}
              >
                优先级: {taskPriority}
              </Button>
            </Grid>
          ) : null}
        </Grid>
        <Grid item container>
          {doesRelatedDocsExist ? (
            <>
              <Grid item container>
                <Button
                  onClick={handleToggleRelatedDocsListOpen}
                  variant='text'
                  // color='textSecondary'
                  className={classes.relatedDocsCollapseBtn}
                  startIcon={
                    isRelatedDocsListOpen ? (
                      <ExpandMore />
                    ) : (
                      <ChevronRightIcon />
                    )
                  }
                >
                  相关文档/文献
                </Button>
              </Grid>
              <Grid item container>
                <Collapse
                  in={isRelatedDocsListOpen}
                  timeout='auto'
                  unmountOnExit
                >
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
                            {/* <Link
                            href={`/doc2/${
                              Math.floor(Math.random() * (20000 - 1 + 1)) + 1
                            }`}
                          > */}
                            <a
                              className={classes.relatedDocsTitle}
                              title={docTitle}
                            >
                              {docTitle.length > 24
                            ? docTitle.slice(0, 24) + '...'
                            : docTitle}
                            </a>
                            {/* </Link> */}
                          </ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </Grid>
            </>
          ) : null}
        </Grid>
        <Grid item container alignItems='center' justifyContent='space-between'>
          <Box display='flex'>
            <Typography title={title} gutterBottom noWrap>
              {/* {title} */}
            </Typography>
          </Box>
          {taskMembers && taskMembers.length > 0 ? (
            <MIconButton
              onClick={(e) => e.stopPropagation()}
              aria-label='任务负责人 owner member'
              disableRipple
              className={classes.cardOwnerMemberBtn}
            >
              <AccountCircleOutlinedIcon />
            </MIconButton>
          ) : null}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Card;
