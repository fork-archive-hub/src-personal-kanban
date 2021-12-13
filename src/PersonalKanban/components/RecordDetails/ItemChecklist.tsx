import cx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import {
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
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    configItemFormControl: {
      width: "100%",
      // paddingBottom: 0,
    },
    configItemTitle: {
      margin: "8px 0 4px",
    },

    subTaskCheckbox: {
      "& svg": {
        fontSize: "1.3rem",
      },
      "&+span": {
        color: theme.palette.text.secondary,
      },
    },
  })
);

export function ItemChecklist(props) {
  const classes = useStyles();

  const {
    doesSubTaskListExist,
    subTasksChecklist,
    handleSubTaskChecklistChange,
    isAddingSubTask,
    newSubTaskChecklistItemName,
    handleInputSubTaskChecklistItemName,
    handleUpdateSubTasksData,
    handleAddSubTaskChecklistItem,
  } = props;

  return (
    <>
      <FormControl
        component="fieldset"
        className={classes.configItemFormControl}
      >
        <FormLabel component="legend" className={classes.configItemTitle}>
          子任务/待办事项
        </FormLabel>
        <FormGroup>
          {doesSubTaskListExist
            ? subTasksChecklist.map((task) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleSubTaskChecklistChange}
                      checked={task.status}
                      name={task.id}
                      disableRipple
                      className={classes.subTaskCheckbox}
                      color="primary"
                    />
                  }
                  label={task.title}
                  key={task.id}
                />
              ))
            : null}
        </FormGroup>
      </FormControl>
      <Grid item xs={12}>
        {isAddingSubTask ? (
          <>
            <TextField
              value={newSubTaskChecklistItemName}
              onChange={handleInputSubTaskChecklistItemName}
              id="newSubTaskChecklistItemName"
              label="输入子任务名称或待办事件名称"
            />
            <Button
              variant="contained"
              color="primary"
              // className={classes.button}
              startIcon={<AddIcon />}
              onClick={handleUpdateSubTasksData}
            >
              添加子任务
            </Button>
          </>
        ) : (
          <Button
            variant="text"
            color="default"
            // className={classes.button}
            startIcon={<AddIcon />}
            onClick={handleAddSubTaskChecklistItem}
          >
            添加子任务
          </Button>
        )}
      </Grid>
    </>
  );
}
