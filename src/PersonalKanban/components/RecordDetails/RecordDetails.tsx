import 'date-fns';

import Radio from 'PersonalKanban/components/Radio';
import { RecordColor } from 'PersonalKanban/enums';
import type { Record } from 'PersonalKanban/types';
import cx from 'clsx';
import localeCN from 'date-fns/locale/zh-CN';
import { useFormik } from 'formik';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import DateFnsUtils from '@date-io/date-fns';
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
import PersonAddDisabledOutlinedIcon from '@material-ui/icons/PersonAddDisabledOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import SortOutlinedIcon from '@material-ui/icons/SortOutlined';
import {
  DatePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { generateUserList } from './mockData';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    taskCommonActionsBtn: {
      // color: '#777',
      // marginRight: '4rem',
    },
    configItemFormControl: {
      width: '100%',
      // paddingBottom: 0,
    },
    configItemTitle: {
      margin: '8px 0 4px',
    },
    cardDesc: {
      color: theme.palette.text.secondary,
    },
    taskMembersList: {
      width: 240,
    },
    dueDatePicker: {
      width: 120,
      marginRight: '2rem',
      '& .MuiInputBase-input': {
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      },
    },
    addTagBtn: {
      // 若宽度过小，按钮上的文本会换行
      width: '12rem',
      height: 36,
      margin: '8px 0px',
    },
    addTagBtnML: {
      marginLeft: theme.spacing(2),
    },
    tagBtn: {
      backgroundColor: '#d4c5f9',
      textTransform: 'none',
      // backgroundColor: '#a2eeef',
      '&:hover': {
        backgroundColor: '#d4c5f9',
      },
    },
    tagsSpacing: {
      '& > *': {
        margin: theme.spacing(0.8),
      },
    },
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

    subTaskCheckbox: {
      '& svg': {
        fontSize: '1.3rem',
      },
      '&+span': {
        color: theme.palette.text.secondary,
      },
    },

    visibilityHidden: {
      visibility: 'hidden',
    },
  }),
);

type RecordFormProps = {
  record?: Record;
  /** 提交后会更新看板数据 */
  onSubmit: Function;
  onSubmitDataWithDialogOpen?: Function;
  onCancel?: Function;
  forceBoardUpdate?: Function;
  disabled?: boolean;
  formTitle?: string;
};

function convertSubTasksDataToViewChecklist(subTaskList): any[] {
  const retChecklist = subTaskList['records'].map((task) => {
    const { id, title, taskStatus } = task;
    return {
      id,
      title,
      status: taskStatus && taskStatus === 'done' ? true : false,
    };
  });

  return retChecklist;
}

export function RecordDetails(props: RecordFormProps) {
  const classes = useStyles();
  const [__, forceUpdate] = useReducer((x) => x + 1, 0);

  const {
    record,
    disabled,
    formTitle = '任务卡片详情',
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
    [onSubmitDataWithDialogOpen, record],
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
        title: '',
        description: '',
        color: '',
      },
      record,
    ),
    onSubmit: (values) => {
      onSubmit && onSubmit(values);
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.title) {
        errors.title = '* 必填项';
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
    [updateCardData],
  );

  const availableUsers = generateUserList(5);
  const [taskMembersAnchorEl, setTaskMembersAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const handleSelectingTaskMembersPanelOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setTaskMembersAnchorEl(event.currentTarget);
    },
    [],
  );
  const handleSelectingTaskMembersPanelClose = useCallback(() => {
    setTaskMembersAnchorEl(null);
  }, []);
  const isSelectingTaskMembersPanelOpen = Boolean(taskMembersAnchorEl);
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
    [handleSelectingTaskMembersPanelClose, updateCardData],
  );
  const handleSetTaskMembersToEmpty = useCallback(() => {
    updateCardData({
      taskMembers: [],
    });
    setSelectedTaskMembers([]);
    handleSelectingTaskMembersPanelClose();
  }, [handleSelectingTaskMembersPanelClose, updateCardData]);

  const taskMembersText = useMemo(() => {
    let retText = '无负责人';
    if (taskMembers && taskMembers.length > 0) {
      const firstMember = availableUsers.find(
        (u) => u.userId === taskMembers[0],
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
    setSelectedDueDate(date);
    setIsSelectingDueDate(false);
    updateCardData({ taskDueTime: date.toISOString().slice(0, 10) });
  };
  const dueDateContent = useMemo(() => {
    let dueDateContent = '';
    if (taskDueTime) {
      dueDateContent = taskDueTime;
    }
    if (selectedDueDate) {
      dueDateContent = selectedDueDate.toISOString().slice(0, 10);
    }
    if (isSelectingDueDate) {
      dueDateContent = '';
    }
    return dueDateContent;
  }, [isSelectingDueDate, selectedDueDate, taskDueTime]);

  const doesSubTaskListExist =
    subTaskList && subTaskList['records'] && subTaskList['records'].length > 0;
  let subTasksChecklist = [];
  if (doesSubTaskListExist) {
    subTasksChecklist = convertSubTasksDataToViewChecklist(subTaskList);
  }
  const handleSubTaskChecklistChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // console.log(';;checkbox-click ', event.target.name, event.target);
      const latestSubTaskList = {
        ...subTaskList,
        records: subTaskList['records'].map((task) =>
          task.id === event.target.name
            ? {
                ...task,
                taskStatus: task.taskStatus === 'done' ? 'todo' : 'done',
              }
            : task,
        ),
      };
      // console.log(';;latestSubTaskList ', latestSubTaskList.records);
      updateCardData({ subTaskList: latestSubTaskList });
    },
    [subTaskList, updateCardData],
  );
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const handleAddSubTaskChecklistItem = useCallback(() => {
    setIsAddingSubTask(true);
    setNewSubTaskChecklistItemName('');
  }, []);
  const [newSubTaskChecklistItemName, setNewSubTaskChecklistItemName] =
    useState('');
  const handleInputSubTaskChecklistItemName = useCallback((event) => {
    const itemName = event.target.value;
    setNewSubTaskChecklistItemName(itemName);
  }, []);
  const handleUpdateSubTasksData = useCallback(() => {
    let _subTaskList = {};
    if (subTaskList) {
      _subTaskList = subTaskList;
    }
    if (!_subTaskList['records']) {
      _subTaskList['records'] = [];
    }
    const latestSubTaskList = {
      ..._subTaskList,
      records: [
        ..._subTaskList['records'],
        {
          id: 'taskId-' + Math.random().toFixed(6),
          title: newSubTaskChecklistItemName,
          taskStatus: 'todo',
        },
      ],
    };
    updateCardData({ subTaskList: latestSubTaskList });

    setIsAddingSubTask(false);
  }, [newSubTaskChecklistItemName, subTaskList, updateCardData]);

  const [isAddingNewTag, setIsAddingNewTag] = useState(false);

  const [newTagName, setNewTagName] = useState('');
  const handleInputNewTagName = useCallback((event) => {
    setNewTagName(event.target.value);
  }, []);
  const handleStartAddNewTag = useCallback(() => {
    setIsAddingNewTag(true);
    setNewTagName('');
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
    relatedDocs && relatedDocs['docList'] && relatedDocs['docList'].length > 0;
  const [docName, setDocName] = useState('');
  const handleDocNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDocName(event.target.value);
    },
    [],
  );
  const handleAddRelatedDocs = useCallback(() => {
    if (!docName || !docName.trim()) return;
    let _relatedDocs = {};
    if (relatedDocs) {
      _relatedDocs = relatedDocs;
    }
    if (!_relatedDocs['docList']) {
      _relatedDocs['docList'] = [];
    }
    const latestRelatedDocs = {
      ..._relatedDocs,
      docList: [
        ..._relatedDocs['docList'],
        {
          docId: 'docId-' + Math.random().toFixed(6),
          docTitle: docName,
          url: '',
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
        {isEditingCardTitle ? (
          <TextField
            name='title'
            label={'名称或标题'}
            multiline={values.title.length > 20 ? true : false}
            // value={values.title}
            value={cardTitle}
            // error={Boolean(errors.title)}
            // helperText={errors.title}
            // disabled={disabled}
            // onChange={handleCardFormChange}
            onChange={handleCardTitleChange}
            onBlur={() => {
              setIsEditingCardTitle(false);
            }}
          />
        ) : (
          <Typography
            gutterBottom
            variant='h6'
            onClick={() => {
              setIsEditingCardTitle(true);
            }}
          >
            {cardTitle}
          </Typography>
        )}
        <Divider />
      </Grid>
      <Grid item container xs={12}>
        <Grid item xs={3}>
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
            id={`id`}
            open={isSelectingTaskMembersPanelOpen}
            anchorEl={taskMembersAnchorEl}
            onClose={handleSelectingTaskMembersPanelClose}
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
                button
                key=''
                selected={selectedTaskMembers.length === 0}
                onClick={handleSetTaskMembersToEmpty}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonAddDisabledOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='无负责人' />
                {selectedTaskMembers.length === 0 ? (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={handleSetTaskMembersToEmpty}
                      edge='end'
                      aria-label='选为负责人'
                    >
                      <CheckIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                ) : null}
              </ListItem>
              {availableUsers.map((user) => {
                const { userId, username, avatar } = user;
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
                          aria-label='选中为负责人'
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
        </Grid>
        <Grid item xs={5}>
          <Button
            variant='text'
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
              variant='inline'
              format='yyyy-MM-dd'
              id='date-picker-inline'
              className={cx(classes.dueDatePicker, {
                [classes.visibilityHidden]: !isSelectingDueDate,
              })}
              // label='选择截止日期/到期时间'
            />
          </MuiPickersUtilsProvider>
          {isSelectingDueDate ? (
            <Button
              variant='text'
              // startIcon={<EventAvailableOutlinedIcon />}
              onClick={() => {
                setIsSelectingDueDate(true);
                console.log(';; 清除日期');
              }}
            >
              清除日期
            </Button>
          ) : null}
        </Grid>
        <Grid item xs={2}>
          <Button
            variant='text'
            // className={classes.taskCommonActionsBtn}
            startIcon={<SortOutlinedIcon />}
          >
            优先级(未实现)
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <FormControl component='fieldset' className={classes.formControl}>
          <FormLabel component='legend' className={classes.configItemTitle}>
            标签
          </FormLabel>
          <Grid container className={classes.tagsSpacing}>
            {tags
              ? tags.map((tag) => {
                  const { tagName } = tag;
                  return (
                    <Chip
                      label={tagName}
                      onClick={() => {}}
                      onDelete={() => {}}
                      className={classes.tagBtn}
                      key={tagName}
                    />
                  );
                })
              : null}
            {isAddingNewTag ? (
              <>
                <TextField
                  value={newTagName}
                  onChange={handleInputNewTagName}
                  id='addNewTag'
                  label='输入标签名'
                />
                <Button
                  onClick={handleUpdateTagsData}
                  variant='contained'
                  color='primary'
                  className={cx(classes.addTagBtn, {
                    [classes.addTagBtnML]: true,
                  })}
                  startIcon={<AddIcon />}
                >
                  添加标签
                </Button>
              </>
            ) : (
              <Button
                onClick={handleStartAddNewTag}
                variant='outlined'
                className={cx(classes.addTagBtn, {
                  [classes.addTagBtnML]: tags && tags.length > 0,
                })}
                startIcon={<AddIcon />}
              >
                添加标签
              </Button>
            )}
          </Grid>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl
          component='fieldset'
          className={classes.configItemFormControl}
        >
          <FormLabel
            onClick={() => {
              setIsEditingCardDesc(true);
            }}
            component='legend'
            className={classes.configItemTitle}
          >
            任务描述或内容描述
            {values.description ? (
              <IconButton aria-label='edit'>
                <EditOutlinedIcon style={{ fontSize: '1rem' }} />
              </IconButton>
            ) : (
              <IconButton aria-label='add'>
                <AddIcon style={{ fontSize: '1rem' }} />
              </IconButton>
            )}
          </FormLabel>
          {isEditingCardDesc ? (
            <TextField
              multiline
              // rows={3}
              name='description'
              label={'内容描述'}
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
            <Typography
              className={classes.cardDesc}
              gutterBottom
              // variant='body2'
              // title={description}
              // onClick={() => {
              //   setIsEditingCardDesc(true);
              // }}
            >
              {values.description}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl component='fieldset' className={classes.formControl}>
          <FormLabel component='legend' className={classes.configItemTitle}>
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
                        color='primary'
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
                id='newSubTaskChecklistItemName'
                label='输入子任务名称或待办事件名称'
              />
              <Button
                variant='contained'
                color='primary'
                // className={classes.button}
                startIcon={<AddIcon />}
                onClick={handleUpdateSubTasksData}
              >
                添加子任务
              </Button>
            </>
          ) : (
            <Button
              variant='text'
              color='default'
              // className={classes.button}
              startIcon={<AddIcon />}
              onClick={handleAddSubTaskChecklistItem}
            >
              添加子任务
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <FormControl component='fieldset' className={classes.formControl}>
          <FormLabel component='legend' className={classes.configItemTitle}>
            相关文档
          </FormLabel>
        </FormControl>
        <TextField
          id='addNewDocOrLinkedDoc'
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
          className={classes.button}
          startIcon={<LinkIcon />}
        >
          添加已有文档的链接
        </Button>
        <List aria-label='相关文档列表'>
          {doesRelatedDocsExist
            ? relatedDocs['docList'].map((doc) => {
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
      </Grid>
      <Grid item xs={12}>
        <FormControl component='fieldset'>
          <FormLabel component='legend' className={classes.configItemTitle}>
            卡片背景色(开发中)
          </FormLabel>
          <RadioGroup
            row
            aria-label='background'
            name='color'
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
      {/* <Grid item xs={12}>
          <Button
            variant='outlined'
            disabled={disabled}
            onClick={onCancel as any}
          >
            取消
          </Button>
          &emsp;
          <Button
            type='submit'
            color='primary'
            variant='contained'
            disabled={disabled}
          >
            保存
          </Button>
        </Grid> */}
    </Grid>
    // </form>
  );
}

export default RecordDetails;
