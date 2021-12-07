import { useFormik } from 'formik';
import React from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Radio from '../../components/Radio';
import { ColumnColor } from '../../constants';
import type { Column } from '../../types';

type ColumnFormProps = {
  column?: Partial<Column>;
  onSubmit: any;
  onCancel: any;
  disabled?: boolean;
  formTitle?: string;
  enableWipLimit?: boolean;
};

export function ColumnForm(props: ColumnFormProps) {
  const {
    column,
    disabled,
    formTitle = '添加分组 (任务清单)',
    onSubmit,
    onCancel,
    enableWipLimit = false,
  } = props;

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: Object.assign(
      {
        title: '',
        description: '',
        color: '',
        wipEnabled: false,
        wipLimit: 0,
      },
      column,
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

      if (values.wipEnabled && !values.wipLimit) {
        // errors.wipLimit = t('limitRequired');
        errors.wipLimit = '* 必填项 卡片数量上限';
      }

      return errors;
    },
  });

  const handleWipLimitChange = React.useCallback(
    (e) => {
      e.persist();
      const { value } = e.target;
      const integerRegex = /^[0-9]*$/;
      if (value && !integerRegex.test(value)) {
        return;
      }

      handleChange(e);
    },
    [handleChange],
  );

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
            name='title'
            label={'分组名称'}
            value={values.title}
            error={Boolean(errors.title)}
            helperText={errors.title}
            disabled={disabled}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            rows={3}
            name='description'
            label={'分组描述或任务清单描述'}
            value={values.description}
            error={Boolean(errors.description)}
            helperText={errors.description}
            disabled={disabled}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          {enableWipLimit ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.wipEnabled}
                  onChange={handleChange}
                  name='wipEnabled'
                />
              }
              label={'wipLimitEnabled'}
            />
          ) : null}
        </Grid>
        <Grid item xs={12}>
          {enableWipLimit ? (
            <TextField
              name='wipLimit'
              label={'wipLimit'}
              value={values.wipLimit}
              error={Boolean(errors.wipLimit)}
              helperText={errors.wipLimit}
              disabled={disabled || !values.wipEnabled}
              onChange={handleWipLimitChange}
            />
          ) : null}
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
              {Object.keys(ColumnColor).map((key) => {
                const colorKey = key as keyof typeof ColumnColor;
                return (
                  <Radio
                    key={colorKey}
                    value={colorKey}
                    color={ColumnColor[colorKey]}
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

export default ColumnForm;
