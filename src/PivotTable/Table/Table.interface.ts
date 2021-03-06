import * as React from 'react';
import { HeaderGroup } from 'react-table';

import type { Row, TableInstance } from '../types/Table';

export interface TableProps<D extends object> {
  onRowClick?: (
    row: Row<D>,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
  getRowCharacteristics?: (row: Row<D>) => Partial<RowCharacteristics>;
  renderRowSubComponent?: (row: Row<D>) => React.ReactNode;
  isRowSubComponentAboveRow?: boolean;
  loading?: boolean;
  noDataText?: React.ReactNode;
  noDataComponent?: React.ComponentType;
  instance: TableInstance<D>;
  virtualized?: boolean;
  renderHeaderGroups?: (headerGroups: HeaderGroup<D>[]) => React.ReactNode;
  /**
   * Fix the height of every cell in px.
   * @default when virtualized only to 60
   */
  rowsHeight?: number;
  // style?: Record<string, string | number>;
  style?: any;

  showToolbar?: boolean;
  showToolbarActionsMenuButtons?: boolean;

  [name: string]: any;
}

export type RowCharacteristics = {
  isActive: boolean;
  isInteractive: boolean;
  backgroundColor: string;
};
