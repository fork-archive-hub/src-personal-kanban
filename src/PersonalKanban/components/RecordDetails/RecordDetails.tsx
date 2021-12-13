import cx from "clsx";
import { useFormik } from "formik";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

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
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import EventAvailableOutlinedIcon from "@material-ui/icons/EventAvailableOutlined";
import FaceIcon from "@material-ui/icons/Face";
import LinkIcon from "@material-ui/icons/Link";
import PersonAddDisabledOutlinedIcon from "@material-ui/icons/PersonAddDisabledOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import SortOutlinedIcon from "@material-ui/icons/SortOutlined";

import Radio from "../../components/Radio";
import { RecordColor } from "../../constants";
import type { Record } from "../../types";
import { ActionDueDate } from "./ActionDueDate";
import { ActionTaskMembers } from "./ActionTaskMembers";
import { ItemChecklist } from "./ItemChecklist";
import { ItemRelatedDocs } from "./ItemRelatedDocs";
import { ItemTags } from "./ItemTags";
import { RecordTitle } from "./RecordTitle";
import { generateUserList } from "./mockData";

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    configItemFormControl: {
      width: "100%",
    },
    configItemTitle: {
      margin: "8px 0 4px",
    },
    cardDesc: {
      color: theme.palette.text.secondary,
    },
    tagsSpacing: {
      "& > *": {
        margin: theme.spacing(0.8),
      },
    },
  })
);

function convertSubTasksDataToViewChecklist(subTaskList): any[] {
  const retChecklist = subTaskList["records"].map((task) => {
    const { id, title, taskStatus } = task;
    return {
      id,
      title,
      status: taskStatus && taskStatus === "done" ? true : false,
    };
  });

  return retChecklist;
}

type RecordDetailsProps = {
  record?: Record;
  /** 提交后会更新看板数据 */
  onSubmit: Function;
  onSubmitDataWithDialogOpen?: Function;
  onCancel?: Function;
  forceBoardUpdate?: Function;
  disabled?: boolean;
  formTitle?: string;
};

export function RecordDetails(props: RecordDetailsProps) {
  const classes = useStyles();
  const [__, forceUpdate] = useReducer((x) => x + 1, 0);

  const {
    record,
    disabled,
    formTitle = "卡片详情",
    onSubmit,
    onSubmitDataWithDialogOpen,
    onCancel,
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

  const [isEditingCardDesc, setIsEditingCardDesc] = useState(false);

  /** 更新卡片数据到全局，同时不关闭卡片弹窗 */
  const updateCardData = useCallback(
    (subField) => {
      onSubmitDataWithDialogOpen({ ...record, ...subField });
      forceUpdate();
    },
    [onSubmitDataWithDialogOpen, record]
  );

  // todo 待删除
  const {
    values,
    errors,
    handleChange: handleCardFormChange,
    handleSubmit: handleCardFormSubmit,
  } = useFormik({
    initialValues: Object.assign(
      {
        title: "",
        description: "",
        color: "",
      },
      record
    ),
    onSubmit: (values) => {
      onSubmit && onSubmit(values);
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.title) {
        errors.title = "* 必填项";
      }
      return errors;
    },
  });

  const [isEditingCardTitle, setIsEditingCardTitle] = useState(false);
  const [cardTitle, setCardTitle] = useState(title);
  const handleCardTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCardTitle(event.target.value);
      // if (!event.target.value || !event.target.value.trim()) return;
      // todo 显示不能为空的提示信息
      updateCardData({ title: event.target.value });
    },
    [updateCardData]
  );

  const availableUsers = generateUserList(5);
  const [taskMembersAnchorEl, setTaskMembersAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const handleSelectingTaskMembersPanelOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setTaskMembersAnchorEl(event.currentTarget);
    },
    []
  );
  const handleSelectingTaskMembersPanelClose = useCallback(() => {
    setTaskMembersAnchorEl(null);
  }, []);
  const isSelectingTaskMembersPanelOpen = Boolean(taskMembersAnchorEl);
  // todo use taskMembers instead of selectedTaskMembers
  const [selectedTaskMembers, setSelectedTaskMembers] = useState<string[]>([]);
  const handleToggleSelectTaskMember = useCallback(
    (userId: string) => {
      setSelectedTaskMembers((prev) => {
        if (prev.length === 0 || (prev.length > 0 && prev[0] !== userId)) {
          updateCardData({
            // taskMembers: taskMembers
            //   ? [userId, ...taskMembers.slice(1)]
            //   : [userId],
            taskMembers: [userId],
          });
        }
        handleSelectingTaskMembersPanelClose();

        if (prev.indexOf(userId) !== -1) {
          // 若已选中，则取消
          return prev.filter((uid) => uid !== userId);
        }
        // return [...prev, userId];
        return [userId];
      });
    },
    [handleSelectingTaskMembersPanelClose, updateCardData]
  );
  const handleSetTaskMembersToEmpty = useCallback(() => {
    updateCardData({
      taskMembers: [],
    });
    setSelectedTaskMembers([]);
    handleSelectingTaskMembersPanelClose();
  }, [handleSelectingTaskMembersPanelClose, updateCardData]);

  const taskMembersText = useMemo(() => {
    let retText = "无负责人";
    if (taskMembers && taskMembers.length > 0) {
      const firstMember = availableUsers.find(
        (u) => u.userId === taskMembers[0]
      );
      if (firstMember) {
        retText = firstMember.username;
      }
    }
    return retText;
  }, [availableUsers, taskMembers]);

  const [isSelectingDueDate, setIsSelectingDueDate] = useState(false);
  // todo 传入的截止日期应该作为初始值
  const [selectedDueDate, setSelectedDueDate] = useState<Date | null>();
  // new Date('2014-08-18T21:11:54'),
  // new Date(),
  const handleDueDateChange = (date: Date | null) => {
    if (date instanceof Date && !isNaN(date as any)) {
      // move the time away from midnight, opposite direction of utc offset
      const offset = -date.getTimezoneOffset();
      // using trunc() because there could be negative offsets, too.
      date.setHours(Math.trunc(offset / 60), offset % 60);
    }
    setSelectedDueDate(date);
    updateCardData({ taskDueTime: date.toISOString().slice(0, 10) });
    setIsSelectingDueDate(false);
  };
  const dueDateContent = useMemo(() => {
    let dueDateContent = "";
    if (taskDueTime) {
      dueDateContent = taskDueTime;
    }
    if (selectedDueDate) {
      dueDateContent = selectedDueDate.toISOString().slice(0, 10);
    }
    if (isSelectingDueDate) {
      dueDateContent = "";
    }
    return dueDateContent;
  }, [isSelectingDueDate, selectedDueDate, taskDueTime]);

  const doesSubTaskListExist =
    subTaskList && subTaskList["records"] && subTaskList["records"].length > 0;
  let subTasksChecklist = [];
  if (doesSubTaskListExist) {
    subTasksChecklist = convertSubTasksDataToViewChecklist(subTaskList);
  }
  const handleSubTaskChecklistChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // console.log(';;checkbox-click ', event.target.name, event.target);
      const latestSubTaskList = {
        ...subTaskList,
        records: subTaskList["records"].map((task) =>
          task.id === event.target.name
            ? {
                ...task,
                taskStatus: task.taskStatus === "done" ? "todo" : "done",
              }
            : task
        ),
      };
      // console.log(';;latestSubTaskList ', latestSubTaskList.records);
      updateCardData({ subTaskList: latestSubTaskList });
    },
    [subTaskList, updateCardData]
  );
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const handleAddSubTaskChecklistItem = useCallback(() => {
    setIsAddingSubTask(true);
    setNewSubTaskChecklistItemName("");
  }, []);
  const [newSubTaskChecklistItemName, setNewSubTaskChecklistItemName] =
    useState("");
  const handleInputSubTaskChecklistItemName = useCallback((event) => {
    const itemName = event.target.value;
    setNewSubTaskChecklistItemName(itemName);
  }, []);
  const handleUpdateSubTasksData = useCallback(() => {
    let _subTaskList = {};
    if (subTaskList) {
      _subTaskList = subTaskList;
    }
    if (!_subTaskList["records"]) {
      _subTaskList["records"] = [];
    }
    const latestSubTaskList = {
      ..._subTaskList,
      records: [
        ..._subTaskList["records"],
        {
          id: "taskId-" + Math.random().toFixed(6),
          title: newSubTaskChecklistItemName,
          taskStatus: "todo",
        },
      ],
    };
    updateCardData({ subTaskList: latestSubTaskList });

    setIsAddingSubTask(false);
  }, [newSubTaskChecklistItemName, subTaskList, updateCardData]);

  const [isAddingNewTag, setIsAddingNewTag] = useState(false);

  const [newTagName, setNewTagName] = useState("");
  const handleInputNewTagName = useCallback((event) => {
    setNewTagName(event.target.value);
  }, []);
  const handleStartAddNewTag = useCallback(() => {
    setIsAddingNewTag(true);
    setNewTagName("");
  }, []);
  const handleUpdateTagsData = useCallback(() => {
    let _tags = [];
    if (tags) {
      _tags = tags;
    }
    const latestTags = [
      ..._tags,
      {
        tagName: newTagName,
        // bgColor: '',
      },
    ];
    updateCardData({ tags: latestTags });

    setIsAddingNewTag(false);
  }, [newTagName, tags, updateCardData]);

  const doesRelatedDocsExist =
    relatedDocs && relatedDocs["docList"] && relatedDocs["docList"].length > 0;
  const [docName, setDocName] = useState("");
  const handleDocNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDocName(event.target.value);
    },
    []
  );
  const handleAddRelatedDocs = useCallback(() => {
    if (!docName || !docName.trim()) return;
    let _relatedDocs = {};
    if (relatedDocs) {
      _relatedDocs = relatedDocs;
    }
    if (!_relatedDocs["docList"]) {
      _relatedDocs["docList"] = [];
    }
    const latestRelatedDocs = {
      ..._relatedDocs,
      docList: [
        ..._relatedDocs["docList"],
        {
          docId: "docId-" + Math.random().toFixed(6),
          docTitle: docName,
          url: "",
        },
      ],
    };

    updateCardData({ relatedDocs: latestRelatedDocs });
  }, [docName, relatedDocs, updateCardData]);
  // console.log(';;selectedTaskMembers-len ', selectedTaskMembers.length);

  return (
    // <form onSubmit={handleCardFormSubmit}>
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <RecordTitle
          cardTitle={cardTitle}
          isEditingCardTitle={isEditingCardTitle}
          handleCardTitleChange={handleCardTitleChange}
          setIsEditingCardTitle={setIsEditingCardTitle}
        />
        <Divider />
      </Grid>
      <Grid item container xs={12}>
        <Grid item xs={3}>
          <ActionTaskMembers
            handleSelectingTaskMembersPanelOpen={
              handleSelectingTaskMembersPanelOpen
            }
            taskMembers={taskMembers}
            taskMembersText={taskMembersText}
            isSelectingTaskMembersPanelOpen={isSelectingTaskMembersPanelOpen}
            taskMembersAnchorEl={taskMembersAnchorEl}
            handleSelectingTaskMembersPanelClose={
              handleSelectingTaskMembersPanelClose
            }
            handleSetTaskMembersToEmpty={handleSetTaskMembersToEmpty}
            availableUsers={availableUsers}
            handleToggleSelectTaskMember={handleToggleSelectTaskMember}
          />
        </Grid>
        <Grid item xs={5}>
          <ActionDueDate
            setIsSelectingDueDate={setIsSelectingDueDate}
            dueDateContent={dueDateContent}
            selectedDueDate={selectedDueDate}
            handleDueDateChange={handleDueDateChange}
            isSelectingDueDate={isSelectingDueDate}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="text"
            // className={classes.taskCommonActionsBtn}
            startIcon={<SortOutlinedIcon />}
          >
            优先级(未实现)
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend" className={classes.configItemTitle}>
            标签
          </FormLabel>
          <Grid container className={classes.tagsSpacing}>
            <ItemTags
              tags={tags}
              isAddingNewTag={isAddingNewTag}
              newTagName={newTagName}
              handleInputNewTagName={handleInputNewTagName}
              handleUpdateTagsData={handleUpdateTagsData}
              handleStartAddNewTag={handleStartAddNewTag}
            />
          </Grid>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl
          component="fieldset"
          className={classes.configItemFormControl}
        >
          <FormLabel
            onClick={() => {
              setIsEditingCardDesc(true);
            }}
            component="legend"
            className={classes.configItemTitle}
          >
            任务描述或内容描述
            {values.description ? (
              <IconButton aria-label="edit">
                <EditOutlinedIcon style={{ fontSize: "1rem" }} />
              </IconButton>
            ) : (
              <IconButton aria-label="add">
                <AddIcon style={{ fontSize: "1rem" }} />
              </IconButton>
            )}
          </FormLabel>
          {isEditingCardDesc ? (
            <TextField
              multiline
              name="description"
              label={"内容描述"}
              value={values.description}
              error={Boolean(errors.description)}
              helperText={errors.description}
              disabled={disabled}
              onChange={handleCardFormChange}
              onBlur={() => {
                setIsEditingCardDesc(false);
              }}
            />
          ) : (
            <Typography className={classes.cardDesc} gutterBottom>
              {values.description}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <ItemChecklist
          doesSubTaskListExist={doesSubTaskListExist}
          subTasksChecklist={subTasksChecklist}
          handleSubTaskChecklistChange={handleSubTaskChecklistChange}
          isAddingSubTask={isAddingSubTask}
          newSubTaskChecklistItemName={newSubTaskChecklistItemName}
          handleInputSubTaskChecklistItemName={
            handleInputSubTaskChecklistItemName
          }
          handleUpdateSubTasksData={handleUpdateSubTasksData}
          handleAddSubTaskChecklistItem={handleAddSubTaskChecklistItem}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend" className={classes.configItemTitle}>
            相关文档
          </FormLabel>
        </FormControl>
        <ItemRelatedDocs
          docName={docName}
          handleDocNameChange={handleDocNameChange}
          handleAddRelatedDocs={handleAddRelatedDocs}
          doesRelatedDocsExist={doesRelatedDocsExist}
          relatedDocs={relatedDocs}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend" className={classes.configItemTitle}>
            卡片背景色(开发中)
          </FormLabel>
          <RadioGroup
            row
            aria-label="background"
            name="color"
            value={values.color}
            onChange={handleCardFormChange}
          >
            {Object.keys(RecordColor).map((key) => {
              const colorKey = key as keyof typeof RecordColor;
              return (
                <Radio
                  key={colorKey}
                  value={colorKey}
                  color={RecordColor[colorKey]}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
    // </form>
  );
}

export default RecordDetails;
