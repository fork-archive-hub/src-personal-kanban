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
  Button,
  Checkbox,
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
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import LinkIcon from '@material-ui/icons/Link';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import SortOutlinedIcon from '@material-ui/icons/SortOutlined';
import {
  DatePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    taskCommonActionsBtn: {
      // color: '#777',
      marginRight: '8rem',
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
    addTagBtn: {
      width: '12rem',
      height: 36,
      margin: '8px 24px',
    },
    subTaskCheckbox: {
      '& svg': {
        fontSize: '1.3rem',
      },
      '&+span': {
        color: theme.palette.text.secondary,
      },
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
    forceBoardUpdate,
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

  const [isEditingCardTitle, setIsEditingCardTitle] = useState(false);
  const [isEditingCardDesc, setIsEditingCardDesc] = useState(false);

  const doesSubTaskListExist =
    subTaskList && subTaskList['records'] && subTaskList['records'].length > 0;
  let subTasksChecklist = [];
  if (doesSubTaskListExist) {
    subTasksChecklist = convertSubTasksDataToViewChecklist(subTaskList);
  }
  // console.log(';;subTasksData ', subTaskList, subTasksChecklist);
  const handleChecklistChange = useCallback(
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
      onSubmitDataWithDialogOpen({ ...record, subTaskList: latestSubTaskList });
      forceUpdate();
      // forceBoardUpdate();
    },
    [onSubmitDataWithDialogOpen, record, subTaskList],
  );
  const handleAddSubTasksChecklistItem = useCallback(() => {
    // if (!docName || !docName.trim()) return;
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
          title: Math.random().toFixed(6),
          taskStatus: 'todo',
        },
      ],
    };
    onSubmitDataWithDialogOpen({ ...record, subTaskList: latestSubTaskList });
    forceUpdate();
  }, [onSubmitDataWithDialogOpen, record, subTaskList]);

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
    onSubmitDataWithDialogOpen({ ...record, relatedDocs: latestRelatedDocs });
    forceUpdate();
  }, [docName, onSubmitDataWithDialogOpen, record, relatedDocs]);

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

  const [isSelectingDueDate, setIsSelectingDueDate] = useState(false);
  // todo 传入的截止日期应该作为初始值
  const [selectedDueDate, setSelectedDueDate] = useState<Date | null>();
  // new Date('2014-08-18T21:11:54'),
  // new Date(),
  const handleDueDateChange = (date: Date | null) => {
    setSelectedDueDate(date);
    setIsSelectingDueDate(false);
    onSubmitDataWithDialogOpen({
      ...record,
      taskDueTime: date.toISOString().slice(0, 10),
    });
    forceUpdate();
  };
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

  return (
    <form onSubmit={handleCardFormSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {isEditingCardTitle ? (
            <TextField
              name='title'
              multiline={values.title.length > 20 ? true : false}
              label={'名称或标题'}
              value={values.title}
              error={Boolean(errors.title)}
              helperText={errors.title}
              disabled={disabled}
              onChange={handleCardFormChange}
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
              {/* {formTitle} */}
              {values.title}
            </Typography>
          )}
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='text'
            className={classes.taskCommonActionsBtn}
            startIcon={<PersonOutlineOutlinedIcon />}
          >
            无负责人
          </Button>
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
          <Button
            variant='text'
            className={classes.taskCommonActionsBtn}
            startIcon={<SortOutlinedIcon />}
          >
            优先级
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormControl component='fieldset' className={classes.formControl}>
            <FormLabel component='legend' className={classes.configItemTitle}>
              标签
            </FormLabel>
            <Grid container wrap='nowrap'>
              <TextField id='addDocNewOrLinked' label='输入标签名' />
              <Button
                // disabled
                variant='outlined'
                // color='default'
                className={classes.addTagBtn}
                startIcon={<AddIcon />}
              >
                添加标签
              </Button>
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
                // variant='body2'
                // title={description}
                className={classes.cardDesc}
                gutterBottom
                onClick={() => {
                  setIsEditingCardDesc(true);
                }}
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
                          onChange={handleChecklistChange}
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
            <Button
              variant='text'
              color='default'
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={handleAddSubTasksChecklistItem}
            >
              添加子任务
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormControl component='fieldset' className={classes.formControl}>
            <FormLabel component='legend' className={classes.configItemTitle}>
              相关文档
            </FormLabel>
          </FormControl>
          <TextField
            id='addDocNewOrLinked'
            label='先输入文档名，然后选择创建新文档或链接已有文档'
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
              卡片背景色
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
    </form>
  );
}

export default RecordDetails;
