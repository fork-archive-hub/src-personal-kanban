import cx from 'clsx';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Popover,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewAgendaOutlinedIcon from '@material-ui/icons/ViewAgendaOutlined';
import ViewColumnOutlinedIcon from '@material-ui/icons/ViewColumnOutlined';
import ViewListOutlinedIcon from '@material-ui/icons/ViewListOutlined';
import WidgetsOutlinedIcon from '@material-ui/icons/WidgetsOutlined';

import { NOOP } from '../utils/constants';

export type ToolbarProps = {
  showToolbar?: boolean;
  showToolbarActionsMenuButtons?: boolean;
  setToggleShowGroupedTable?: Function;
  setPvtViews?: Function;
};

/**
 * * 工具条的结构：左边 名称+切换+重命名； 右边 字段配置+过滤+分组+排序+搜索+更多+undo
 * * 更多菜单可考虑：行高、保存模板、复制拷贝、链接拷贝、单元格换行
 */
export function Toolbar(props) {
  const {
    showToolbar = true,
    showToolbarActionsMenuButtons = true,
    setToggleShowGroupedTable,
    setPvtViews,
  } = props;

  const handleClickGroupTableMenu = useCallback(() => {
    setToggleShowGroupedTable((prev) => !prev);
  }, [setToggleShowGroupedTable]);

  const toolbarActionsMenuData = useMemo(
    () => [
      { name: '字段', icon: <WidgetsOutlinedIcon />, handler: NOOP },
      {
        name: '分组',
        icon: <ViewAgendaOutlinedIcon />,
        handler: handleClickGroupTableMenu,
      },
      { name: '筛选', icon: <FilterListOutlinedIcon />, handler: NOOP },
      { name: '排序', icon: <ImportExportIcon />, handler: NOOP },
      { name: '搜索', icon: <SearchIcon />, handler: NOOP },
      { name: '更多', icon: <MoreHorizIcon />, handler: NOOP },
    ],
    [handleClickGroupTableMenu],
  );

  const handlePvtTitleClick = useCallback(() => {
    setPvtViews((prev) => {
      return [prev[1], prev[0]];
    });
  }, [setPvtViews]);

  const toolbarActionsMenuButtonsReElem = useMemo(() => {
    return toolbarActionsMenuData.map((actionMenu) => {
      const { name, icon: IconElem, handler } = actionMenu;
      return (
        <Button
          onClick={handler}
          // variant='contained'
          // color='primary'
          size='small'
          className='pvt-toolbarActionsBtn'
          startIcon={IconElem ? IconElem : null}
          key={name}
        >
          {name}
        </Button>
      );
    });
  }, [toolbarActionsMenuData]);

  const toolbarRootReElem = useMemo(() => {
    return (
      <div className='pvt-toolbar'>
        <div className='pvt-toolbarTitle'>
          <Button
            onClick={handlePvtTitleClick}
            // variant='contained'
            // color='primary'
            startIcon={<ViewListOutlinedIcon />}
            endIcon={<ExpandMoreIcon />}
          >
            表格视图测试 1
          </Button>
        </div>
        <div
          className={cx({
            'pvt-toolbarActionsMenuButtons': !showToolbarActionsMenuButtons,
          })}
        >
          {toolbarActionsMenuButtonsReElem}
        </div>
      </div>
    );
  }, [
    handlePvtTitleClick,
    showToolbarActionsMenuButtons,
    toolbarActionsMenuButtonsReElem,
  ]);

  return showToolbar ? toolbarRootReElem : null;
}

export default Toolbar;
