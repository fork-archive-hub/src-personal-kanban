import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useColumnHeaderStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  divider: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  columnMoreActionsBtn: {
    "&:hover": {
      backgroundColor: "#fff",
      color: theme.palette.primary.main,
    },
  },
}));

type ColumnHeaderProps = {
  title: string;
  description?: string;
  onEdit?: any;
  onDelete?: any;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
};

export function ColumnHeader(props: ColumnHeaderProps) {
  const {
    title,
    description,
    showEditAction = true,
    showDeleteAction = true,
    onEdit,
    onDelete,
  } = props;

  const classes = useColumnHeaderStyles();
  return (
    <>
      <Box
        bgcolor="#fff"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0 0 0 12px"
        // marginBottom={Boolean(description) ? 0.5 : 0}
        // marginBottom={1.5}
        marginBottom="12px"
      >
        <Typography
          // variant='h6'
          title={title}
          noWrap
          style={{ fontWeight: 500 }}
        >
          {title}
        </Typography>
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              alert("更多分组操作，开发中...");
            }}
            className={classes.columnMoreActionsBtn}
            aria-label="更多分组操作"
            disableRipple
          >
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
