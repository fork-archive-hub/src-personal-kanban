import IconButton from 'PersonalKanban/components/IconButton';
import { Record } from 'PersonalKanban/types';
import clsx from 'clsx';
import React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    paper: {
      minHeight: 150,
      maxHeight: 480,
      padding: '16px',
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
 * 看板中面板上的一个卡片
 */
const Card: React.FC<CardProps> = (props) => {
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
  const { title, description, createdAt } = record;

  const classes = useStyles();

  const handleEdit = React.useCallback(() => onEdit(record), [record, onEdit]);

  const handleDelete = React.useCallback(
    () => onDelete(record),
    [record, onDelete],
  );

  return (
    <Paper
      elevation={0}
      className={clsx(classes.paper, className)}
      style={style}
      ref={innerRef}
      onClick={handleEdit}
      {...rest}
    >
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography title={title} gutterBottom noWrap>
          {title}
        </Typography>
        <Box display='flex' alignItems='center'>
          {/* {showEditAction && <IconButton icon="edit" onClick={handleEdit} />}
          {showDeleteAction && (
            <IconButton icon="deleteForever" onClick={handleDelete} />
          )} */}
        </Box>
      </Box>
      <Typography
        variant='subtitle1'
        title={description}
        className={classes.description}
        gutterBottom
      >
        {description}
      </Typography>
      <Typography component='p' variant='caption' noWrap>
        {createdAt}
      </Typography>
    </Paper>
  );
};

export default Card;
