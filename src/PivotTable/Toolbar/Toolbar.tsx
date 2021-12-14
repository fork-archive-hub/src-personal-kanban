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

export type ToolbarProps = {
  showToolbar?: boolean;
};

const toolbarActionsMenuData = [
  { name: '字段', icon: <WidgetsOutlinedIcon /> },
  { name: '分组', icon: <ViewAgendaOutlinedIcon /> },
  { name: '筛选', icon: <FilterListOutlinedIcon /> },
  { name: '排序', icon: <ImportExportIcon /> },
  { name: '搜索', icon: <SearchIcon /> },
  { name: '更多', icon: <MoreHorizIcon /> },
];

/**
 * * 工具条的结构：左边 名称+切换+重命名； 右边 字段配置+过滤+分组+排序+搜索+更多+undo
 * * 更多菜单可考虑：行高、保存模板、复制拷贝、链接拷贝、单元格换行
 */
export function Toolbar(props) {
  const { showToolbar = true } = props;

  const toolbarActionsMenuButtonsReElem = useMemo(() => {
    return toolbarActionsMenuData.map((actionMenu) => {
      const { name, icon: IconComp } = actionMenu;
      return (
        <Button
          // variant='contained'
          // color='primary'
          size='small'
          className='pvt-toolbarActionsBtn'
          startIcon={IconComp ? IconComp : null}
          key={name}
        >
          {name}
        </Button>
      );
    });
  }, []);

  const toolbarReElem = useMemo(() => {
    return (
      <div className='pvt-toolbar'>
        <div className='pvt-toolbarTitle'>
          {/* <h4>表格视图测试 1</h4>
          <IconButton aria-label='展开'>
            <ExpandMoreIcon />
          </IconButton> */}

          <Button
            // variant='contained'
            // color='primary'
            startIcon={<ViewListOutlinedIcon />}
            endIcon={<ExpandMoreIcon />}
          >
            表格视图测试 1
          </Button>
        </div>
        <div className=''>{toolbarActionsMenuButtonsReElem}</div>
      </div>
    );
  }, [toolbarActionsMenuButtonsReElem]);

  return showToolbar ? toolbarReElem : null;
}

export default Toolbar;
