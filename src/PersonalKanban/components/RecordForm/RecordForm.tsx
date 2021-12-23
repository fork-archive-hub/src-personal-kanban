import { useFormik } from 'formik';
import React from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Radio from '../../components/Radio';
import { RecordColor } from '../../constants';
import type { Record } from '../../types';

type RecordFormProps = {
  record?: Record;
  onSubmit: any;
  onCancel?: any;
  disabled?: boolean;
  formTitle?: string;
};

export function RecordForm(props: RecordFormProps) {
  const {
    record,
    disabled,
    formTitle = '添加任务卡片',
    onSubmit,
    onCancel,
  } = props;

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: Object.assign(
      {
        cardTitle: '',
        desc: '',
        color: '',
      },
      record,
    ),
    onSubmit: (values) => {
      onSubmit && onSubmit(values);
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.cardTitle) {
        errors.cardTitle = '* 必填项';
      }

      return errors;
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography gutterBottom variant='h6'>
            {formTitle}
          </Typography>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='cardTitle'
            label={'任务名称'}
            value={values.cardTitle}
            error={Boolean(errors.cardTitle)}
            helperText={errors.cardTitle}
            disabled={disabled}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            rows={3}
            name='desc'
            label={'任务描述(选填)'}
            value={values.desc}
            error={Boolean(errors.desc)}
            helperText={errors.desc}
            disabled={disabled}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>背景色</FormLabel>
            <RadioGroup
              row
              aria-label='background'
              name='color'
              value={values.color}
              onChange={handleChange}
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
          <Button variant='outlined' disabled={disabled} onClick={onCancel}>
            取消
          </Button>
          &emsp;
          <Button
            type='submit'
            color='primary'
            variant='contained'
            disabled={disabled}
          >
            添加
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default RecordForm;
