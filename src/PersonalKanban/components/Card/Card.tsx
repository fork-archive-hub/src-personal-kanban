import cx from 'clsx';
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
      border: `1px solid rgba(15, 15, 15, 0.12)`,
      '&:hover .cardMoreActionsIcon': {
        visibility: 'visible',
      },
      '& .cardMoreActionsIcon': {
        visibility: 'hidden',
      },
    },
    paperNoBoder: {
      border: 0,
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
      backgroundColor: '#eee8fd',
      // backgroundColor: '#a2eeef',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: '#eee8fd',
      },
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
    tagBtnFullPage: {
      backgroundColor: '#d4c5f9',
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
  kanbanVariant?: string;
};

/**
 * ????????????????????????????????????????????????
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
    kanbanVariant,
    ...rest
  } = props;
  const {
    cardTitle,
    cardTitleEmoji,
    desc,
    status,
    priority,
    createdAt,
    cardLabels,
    cardMembers,
    cardChecklists,
    cardRelatedDocs,
    cardDueTime,
  } = record;

  const handleEdit = useCallback(() => onEdit(record), [record, onEdit]);
  const handleDelete = useCallback(() => onDelete(record), [record, onDelete]);

  const doesSubTaskListExist =
    cardChecklists &&
    cardChecklists.length > 0 &&
    cardChecklists[0]['checkItems'] &&
    cardChecklists[0]['checkItems'].length > 0;
  let cardSubTasksTotalCount = 0;
  let cardSubTasksDoneCount = 0;
  if (doesSubTaskListExist) {
    cardSubTasksTotalCount = cardChecklists[0]['checkItems'].length;
    cardChecklists[0]['checkItems'].forEach((task) => {
      // console.log(';;subTask-record ', record);
      if (task.state === 'done') {
        cardSubTasksDoneCount++;
      }
    });
  }
  // console.log(';;cardSubTasksDoneCount ', cardSubTasksDoneCount);

  const doesRelatedDocsExist =
    cardRelatedDocs &&
    cardRelatedDocs.length > 0 &&
    cardRelatedDocs[0]['docList'] &&
    cardRelatedDocs[0]['docList'].length > 0;
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
      className={cx(
        classes.paper,
        { [classes.paperNoBoder]: kanbanVariant === 'fullPage' },
        className,
      )}
      style={style}
      ref={innerRef}
      {...rest}
    >
      <Grid container spacing={1}>
        <Grid item container alignItems='center' justifyContent='space-between'>
          <Box display='flex' style={{ padding: `12px 12px 12px 8px` }}>
            <Typography title={cardTitle} className={classes.cardTitle}>
              {cardTitleEmoji && cardTitleEmoji.trim()
                ? cardTitleEmoji + ' '
                : null}
              {cardTitle}
            </Typography>
          </Box>
        </Grid>

        {cardLabels && cardLabels.length > 0 ? (
          <Grid item container>
            <Grid item>
              {cardLabels.map((tag) => {
                const { name } = tag;
                return name && name.trim() ? (
                  <Button
                    onClick={(e) => e.stopPropagation()}
                    variant='contained'
                    className={cx(classes.tagBtn, {
                      [classes.tagBtnFullPage]: kanbanVariant === 'fullPage',
                    })}
                    disableElevation
                    disableRipple
                    key={name}
                  >
                    {name}
                  </Button>
                ) : null;
              })}
            </Grid>
          </Grid>
        ) : null}

        {cardDueTime || doesSubTaskListExist ? (
          <Grid item container>
            {cardDueTime ? (
              <Grid item>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant='contained'
                  className={classes.taskDueTimeBtn}
                  startIcon={<AlarmOutlinedIcon />}
                  title='????????????'
                  disableElevation
                >
                  {cardDueTime}
                </Button>
              </Grid>
            ) : null}
            {doesSubTaskListExist ? (
              <Grid item>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  disableElevation
                  className={classes.subTaskListBtn}
                  // todo ?????????????????????????????????????????????
                  startIcon={<AssignmentTurnedInOutlinedIcon />}
                  title={`????????????(?????????)??????: ????????? ${cardSubTasksDoneCount} / ????????? ${cardSubTasksTotalCount};    ????????? ${
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

        {priority ? (
          <Grid item container>
            <Grid item>
              <Button
                onClick={(e) => e.stopPropagation()}
                disableElevation
                className={classes.subTaskListBtn}
                startIcon={<SortOutlinedIcon />}
                title={`???????????????: ${priority}?????????????????????????????????-10`}
              >
                ?????????: {priority}
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
                ????????????/??????
              </Button>
            </Grid>
            <Grid item container>
              <Collapse in={isRelatedDocsListOpen} timeout='auto' unmountOnExit>
                <List aria-label='??????????????????' disablePadding>
                  {cardRelatedDocs[0]['docList'].map((doc) => {
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
                            // href='#'
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
          {cardMembers && cardMembers.length > 0 ? (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                alert('??????????????????????????????...');
              }}
              aria-label='??????????????? owner member'
              disableRipple
              className={classes.cardBottomIconBtn}
              title={cardMembers[0]['fullName']}
            >
              <AccountCircleOutlinedIcon />
            </IconButton>
          ) : (
            <span></span>
          )}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              alert('??????????????????????????????...');
            }}
            disableRipple
            aria-label='????????????????????????'
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
