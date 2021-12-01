import ColumnForm from 'PersonalKanban/components/ColumnForm';
import IconButton from 'PersonalKanban/components/IconButton';
import { useTheme } from 'PersonalKanban/providers/ThemeProvider';
import { useTranslation } from 'PersonalKanban/providers/TranslationProvider';
import React, { useState } from 'react';

import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Link,
  IconButton as MIconButton,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Typography,
} from '@material-ui/core';
import MuiToolbar from '@material-ui/core/Toolbar';
import { makeStyles, useTheme as useMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DashboardIcon from '@material-ui/icons/Dashboard';

import type { Column } from '../../types';

type AddColumnButtonProps = {
  onSubmit: any;
};

const AddColumnButton: React.FC<AddColumnButtonProps> = (props) => {
  const { onSubmit } = props;

  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  const handleOpenDialog = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDialog = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handleSubmit = React.useCallback(
    (column: Column) => {
      onSubmit({ column });
      handleCloseDialog();
    },
    [onSubmit, handleCloseDialog],
  );

  return (
    <Box display='block'>
      <IconButton icon='add' color='primary' onClick={handleOpenDialog}>
        {t('addColumn')}
      </IconButton>
      <Dialog onClose={handleCloseDialog} open={open}>
        <DialogContent>
          <ColumnForm onSubmit={handleSubmit} onCancel={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

type ClearBoardButtonProps = {
  onClear: any;
  disabled?: boolean;
};

const ClearBoardButton: React.FC<ClearBoardButtonProps> = (props) => {
  const { disabled, onClear } = props;

  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  const handleOpenDialog = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDialog = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handleClear = React.useCallback(
    (e) => {
      onClear({ e });
      handleCloseDialog();
    },
    [onClear, handleCloseDialog],
  );

  return (
    <Box display='flex'>
      <IconButton
        icon='delete'
        color='primary'
        disabled={disabled}
        onClick={handleOpenDialog}
      ></IconButton>
      <Dialog onClose={handleCloseDialog} open={open}>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h6'>
                {/* {t('clearBoard')} */}
                删除所有分组和卡片
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>
                {/* {t('clearBoardConfirmation')} */}
                是否要删除所有分组和所有卡片？
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant='outlined' onClick={handleCloseDialog}>
                {/* {t('cancel')} */}
                取消
              </Button>
              &emsp;
              <Button color='primary' variant='contained' onClick={handleClear}>
                {/* {t('clear')} */}
                确认删除
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

type LanguageButtonProps = {};

const LanguageButton: React.FC<LanguageButtonProps> = (props) => {
  const { i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (lng: string) => () => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <Box display='block'>
      <IconButton
        icon={'language'}
        aria-controls='language-menu'
        aria-haspopup='true'
        color='inherit'
        onClick={handleClick}
      />
      <Menu
        id='language-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleChangeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={handleChangeLanguage('fr')}>Français</MenuItem>
        <MenuItem onClick={handleChangeLanguage('es')}>Español</MenuItem>
        <MenuItem onClick={handleChangeLanguage('ru')}>Pусский</MenuItem>
        <MenuItem onClick={handleChangeLanguage('de')}>Deutsch</MenuItem>
        <MenuItem onClick={handleChangeLanguage('in')}>हिंदी</MenuItem>
        <MenuItem onClick={handleChangeLanguage('jp')}>日本語</MenuItem>
        <MenuItem onClick={handleChangeLanguage('cn')}>中文</MenuItem>
      </Menu>
    </Box>
  );
};

const DarkThemeButton: React.FC<{}> = () => {
  const { darkTheme, handleToggleDarkTheme } = useTheme();

  return (
    <IconButton
      color='inherit'
      icon={darkTheme ? 'invertColors' : 'invertColorsOff'}
      onClick={handleToggleDarkTheme}
    />
  );
};

const GitHubButton: React.FC<{}> = () => {
  return (
    <IconButton
      color='inherit'
      icon='gitHub'
      component={Link}
      href='https://github.com/nishantpainter/personal-kanban'
      target='_blank'
    />
  );
};

const useInfoButtonStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 300,
    minWidth: 300,
    maxHeight: 300,
    minHeight: 300,
    padding: theme.spacing(),
  },
  buttonGridItem: {
    textAlign: 'center',
  },
}));

const InfoButton: React.FC<{}> = () => {
  const classes = useInfoButtonStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const openInfo = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const closeInfo = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const id = open ? 'info-popover' : undefined;

  return (
    <>
      <IconButton icon='info' color='primary' onClick={openInfo} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={closeInfo}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{ className: classes.paper }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box marginTop={2} textAlign='center'>
              <img
                src='https://stacks.rocks/site/templates/assets/images/stacks-logo-dark.svg'
                height='30'
                alt='Stacks'
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2'>
              <Link href='https://stacks.rocks/' target='_blank'>
                Stacks
              </Link>
              &nbsp;is a cross-platform all-in-one project management tool that
              works on top of a local folder.
              <br />
              <br />
              Get 20% off on your order by applying coupon{' '}
              <strong>NISHANT20</strong>
              <br />
              <br />
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.buttonGridItem}>
            <Button variant='contained' color='primary'>
              <Link
                color='inherit'
                href='https://stacks.rocks/store/?coupon=NISHANT20'
                target='_blank'
              >
                Order Now
              </Link>
            </Button>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};
const useToolbarStyles = makeStyles((theme) => ({
  paper: {
    padding: 0,
    backgroundColor: '#fff',
    color: theme.palette.text.primary,
  },
}));

type ToolbarProps = {
  clearButtonDisabled?: boolean;
  onNewColumn: any;
  onClearBoard: any;
};

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { clearButtonDisabled, onNewColumn, onClearBoard } = props;

  const { t } = useTranslation();

  const classes = useToolbarStyles();

  const muiTheme = useMuiTheme();

  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  return (
    <AppBar elevation={0} className={classes.paper}>
      <MuiToolbar>
        <Box display='flex' alignItems='center'>
          <MIconButton
            size='medium'
            color='primary'
            aria-label='taskBoardLogoIcon'
          >
            <DashboardIcon />
          </MIconButton>
          &nbsp;
          <Typography variant={isMobile ? 'body1' : 'h6'}>
            示例看板 - 任务管理
          </Typography>
        </Box>
        <Box display='flex' flexGrow={1} />
        <Box display='flex'>
          <AddColumnButton onSubmit={onNewColumn} />
          &emsp;
          <ClearBoardButton
            disabled={clearButtonDisabled}
            onClear={onClearBoard}
          />
          &emsp;
          {/* <InfoButton /> */}
          {/* &nbsp; */}
          {/* <DarkThemeButton /> &nbsp; */}
          {/* <LanguageButton /> &nbsp; */}
          {/* <GitHubButton /> */}
        </Box>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
