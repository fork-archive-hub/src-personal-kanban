import cx from "clsx";
import localeCN from "date-fns/locale/zh-CN";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import DateFnsUtils from "@date-io/date-fns";
import {
  Avatar,
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
  Popover,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import EventAvailableOutlinedIcon from "@material-ui/icons/EventAvailableOutlined";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    dueDatePicker: {
      width: 120,
      marginRight: "2rem",
      "& .MuiInputBase-input": {
        border: "none",
        outline: "none",
        boxShadow: "none",
      },
    },
    visibilityHidden: {
      visibility: "hidden",
    },
  })
);

export function ActionDueDate(props) {
  const classes = useStyles();

  const {
    setIsSelectingDueDate,
    dueDateContent,
    selectedDueDate,
    handleDueDateChange,
    isSelectingDueDate,
  } = props;

  return (
    <>
      <Button
        variant="text"
        // className={`${
        //   isSelectingDueDate ? '' : classes.taskCommonActionsBtn
        // }`}
        startIcon={<EventAvailableOutlinedIcon />}
        onClick={() => setIsSelectingDueDate(true)}
      >
        截止日期 &ensp; {dueDateContent}
      </Button>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeCN}>
        <DatePicker
          open={isSelectingDueDate}
          onOpen={() => setIsSelectingDueDate(true)}
          onClose={() => setIsSelectingDueDate(false)}
          value={selectedDueDate}
          onChange={handleDueDateChange}
          disableToolbar
          variant="inline"
          format="yyyy-MM-dd"
          id="date-picker-inline"
          className={cx(classes.dueDatePicker, {
            [classes.visibilityHidden]: !isSelectingDueDate,
          })}
          // label='选择截止日期/到期时间'
        />
      </MuiPickersUtilsProvider>
      {isSelectingDueDate ? (
        <Button
          variant="text"
          // startIcon={<EventAvailableOutlinedIcon />}
          onClick={() => {
            setIsSelectingDueDate(true);
            console.log(";; 清除日期");
          }}
        >
          清除日期
        </Button>
      ) : null}
    </>
  );
}
