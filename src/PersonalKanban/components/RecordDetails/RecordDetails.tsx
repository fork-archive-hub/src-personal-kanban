import Radio from 'PersonalKanban/components/Radio';
import { RecordColor } from 'PersonalKanban/enums';
import { Record } from 'PersonalKanban/types';
import { useFormik } from 'formik';
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
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import LinkIcon from '@material-ui/icons/Link';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import SortOutlinedIcon from '@material-ui/icons/SortOutlined';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    taskCommonActionsBtn: {
      // color: '#777',
      marginRight: '5rem',
    },
  }),
);

type RecordFormProps = {
  record?: Record;
  onSubmit: Function;
  onCancel?: Function;
  disabled?: boolean;
  formTitle?: string;
};

export function RecordDetails(props: RecordFormProps) {
  const classes = useStyles();

  const {
    record,
    disabled,
    formTitle = '任务卡片详情',
    onSubmit,
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

  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChecklistChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

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
        // errors.title = t('titleRequired');
        errors.title = '* 必填项';
      }

      return errors;
    },
  });

  const doesRelatedDocsExist =
    relatedDocs && relatedDocs['docList'] && relatedDocs['docList'].length > 0;

  return (
    <form onSubmit={handleCardFormSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography gutterBottom variant='h6'>
            {/* {formTitle} */}
            {values.title}
          </Typography>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='text'
            className={classes.taskCommonActionsBtn}
            startIcon={<PersonOutlineOutlinedIcon />}
          >
            负责人
          </Button>
          <Button
            variant='text'
            className={classes.taskCommonActionsBtn}
            startIcon={<EventAvailableOutlinedIcon />}
          >
            截止日期
          </Button>
          <Button
            variant='text'
            className={classes.taskCommonActionsBtn}
            startIcon={<SortOutlinedIcon />}
          >
            优先级
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='title'
            multiline={values.title.length > 20 ? true : false}
            label={'名称或标题'}
            value={values.title}
            error={Boolean(errors.title)}
            helperText={errors.title}
            disabled={disabled}
            onChange={handleCardFormChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            rows={3}
            name='description'
            label={'内容描述'}
            value={values.description}
            error={Boolean(errors.description)}
            helperText={errors.description}
            disabled={disabled}
            onChange={handleCardFormChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component='fieldset' className={classes.formControl}>
            <FormLabel component='legend'>子任务</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gilad}
                    onChange={handleChecklistChange}
                    name='gilad'
                    color='primary'
                  />
                }
                label='阅读ckeditor的文档'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={jason}
                    onChange={handleChecklistChange}
                    name='jason'
                    color='primary'
                  />
                }
                label='练习ckeditor的examples示例'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={antoine}
                    onChange={handleChecklistChange}
                    name='antoine'
                    color='primary'
                  />
                }
                label='深入ckeditor的部分插件和源码'
              />
            </FormGroup>
            {/* <FormHelperText>Be careful</FormHelperText> */}
          </FormControl>
          <Grid item xs={12}>
            <Button
              variant='text'
              color='default'
              className={classes.button}
              startIcon={<AddIcon />}
            >
              添加子任务
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='text'
            color='default'
            className={classes.button}
            // startIcon={<LinkIcon />}
          >
            相关文档 0
          </Button>

          <TextField
            id='addDocNewOrLinked'
            label='输入文档名后选择创建新文档或链接已有文档'
          />
          <Button
            variant='text'
            color='default'
            className={classes.button}
            startIcon={<AddIcon />}
          >
            创建并添加新文档
          </Button>
          <Button
            variant='text'
            color='default'
            className={classes.button}
            startIcon={<LinkIcon />}
          >
            添加该文档链接
          </Button>
          <List aria-label='相关文档列表' disablePadding>
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
                        <a
                          className={classes.relatedDocsTitle}
                          title={docTitle}
                        >
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
            <FormLabel component='legend'>卡片背景色</FormLabel>
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
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </form>
  );
}

export default RecordDetails;
