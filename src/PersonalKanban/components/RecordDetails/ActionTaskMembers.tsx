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
import FaceIcon from '@material-ui/icons/Face';
import LinkIcon from '@material-ui/icons/Link';
import PersonAddDisabledOutlinedIcon from '@material-ui/icons/PersonAddDisabledOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import SortOutlinedIcon from '@material-ui/icons/SortOutlined';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    taskMembersList: {
      width: 240,
    },
  }),
);

export function ActionTaskMembers(props) {
  const classes = useStyles();

  const {
    handleSelectingTaskMembersPanelOpen,
    taskMembers,
    taskMembersText,
    isSelectingTaskMembersPanelOpen,
    taskMembersAnchorEl,
    handleSelectingTaskMembersPanelClose,
    handleSetTaskMembersToEmpty,
    availableUsers,
    handleToggleSelectTaskMember,
  } = props;

  return (
    <>
      <Button
        onClick={handleSelectingTaskMembersPanelOpen}
        variant='text'
        startIcon={
          !taskMembers || (taskMembers && taskMembers.length < 1) ? (
            <PersonOutlineOutlinedIcon />
          ) : (
            <FaceIcon />
          )
        }
      >
        {taskMembersText}
      </Button>
      <Popover
        open={isSelectingTaskMembersPanelOpen}
        onClose={handleSelectingTaskMembersPanelClose}
        id={`idMembersPopover`}
        anchorEl={taskMembersAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <List dense={true} className={classes.taskMembersList}>
          <ListItem
            selected={!taskMembers || (taskMembers && taskMembers.length) === 0}
            onClick={handleSetTaskMembersToEmpty}
            button
            key=''
          >
            <ListItemAvatar>
              <Avatar>
                <PersonAddDisabledOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='????????????' />
            {!taskMembers || (taskMembers && taskMembers.length === 0) ? (
              <ListItemSecondaryAction>
                <IconButton
                  onClick={handleSetTaskMembersToEmpty}
                  edge='end'
                  aria-label='???????????????'
                >
                  <CheckIcon />
                </IconButton>
              </ListItemSecondaryAction>
            ) : null}
          </ListItem>
          {availableUsers.map((user) => {
            const { id: userId, username, avatar } = user;
            const isCurrUserSelected =
              taskMembers && taskMembers.indexOf(userId) !== -1;
            return (
              <ListItem
                button
                key={userId}
                selected={isCurrUserSelected}
                onClick={() => {
                  handleToggleSelectTaskMember(userId);
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonOutlineOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={username} />
                {isCurrUserSelected ? (
                  <ListItemSecondaryAction>
                    <IconButton
                      disableRipple
                      edge='end'
                      aria-label='??????????????????'
                      onClick={() => {
                        handleToggleSelectTaskMember(userId);
                      }}
                    >
                      <CheckIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                ) : null}
              </ListItem>
            );
          })}
        </List>
      </Popover>
    </>
  );
}
