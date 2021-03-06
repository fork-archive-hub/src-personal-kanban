import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { Icon, SearchBar, Tooltip } from '@habx/ui-core';

import { useMergedRef } from '../_internal/useMergedRef';
import { ColumnInstance } from '../types/Table';
import { LoadingOverlay } from './LoadingOverlay';
import { LoadingRow } from './LoadingRow';
import { TableProps } from './Table.interface';
import {
  NoDataContainer,
  SearchBarContainer,
  TableBody,
  TableContainer,
  TableContent,
  TableHead,
  TableHeadCell,
  TableHeadCellContent,
  TableHeadRow,
  TableHeaderCellContainer,
  TableHeaderCellSort,
  TableOptionBar,
} from './Table.style';
import { TableFooter } from './TableFooter';
import { TableDensity } from './TableOptions/TableDensity';
import { TablePagination } from './TableOptions/TablePagination';
import { TableRow } from './TableRow';
import { useGridTemplateColumns } from './hooks/useGridTemplateColumns';
import { useScrollbarWidth } from './hooks/useScrollbarWidth';
import { useVirtualize } from './hooks/useVirtualize';

const DEFAULT_LOAD_MORE = () => {};

export const Table = <D extends {}>({
  loading,
  instance,
  noDataComponent: NoDataComponent,
  showToolbar = true,
  showToolbarActionsMenuButtons = true,
  pvtViews,
  setPvtViews,
  renderHeaderGroups,
  onRowClick,
  getRowCharacteristics,
  renderRowSubComponent,
  isRowSubComponentAboveRow,
  setToggleShowGroupedTable,
  rowsHeight: rawRowsHeight,
  virtualized = false,
}: React.PropsWithChildren<TableProps<D>>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    footerGroups,
    prepareRow,
    columns,
    plugins,
  } = instance;

  const hasPagination = !!instance.pageOptions;
  const hasDensity = !!instance.setDensity;

  const gridTemplateColumns = useGridTemplateColumns({ plugins, columns });

  const rowsHeight = !rawRowsHeight && virtualized ? 60 : rawRowsHeight;
  const virtualState = useVirtualize(instance, { virtualized, rowsHeight });

  const currentRows = hasPagination ? page : rows;
  const isItemLoaded = (index: number) => !!currentRows[index];

  const VirtualRow = ({
    index: rowIndex,
    style: rawStyle,
  }: ListChildComponentProps) => {
    const row = currentRows[rowIndex];

    if (!row) {
      return (
        <div key={`loadingRow-${rowIndex}`} style={rawStyle}>
          {instance.loadingRowComponent ?? <LoadingRow instance={instance} />}
        </div>
      );
    }

    return (
      <TableRow
        index={rowIndex}
        row={row}
        getRowCharacteristics={getRowCharacteristics}
        instance={instance}
        onClick={onRowClick}
        style={rawStyle}
        prepareRow={prepareRow}
        renderRowSubComponent={renderRowSubComponent}
        key={`row-${rowIndex}`}
      />
    );
  };

  const tableBodyRef = useMergedRef(virtualState.scrollContainerRef);
  const scrollbarWidth = useScrollbarWidth(
    (virtualized
      ? tableBodyRef?.current?.firstElementChild
      : tableBodyRef?.current) as HTMLElement,
  );

  const handleInputChangeGlobalSearch = useCallback(
    (event) => instance.setGlobalFilter(event.target.value),
    [instance],
  );

  // console.log(';;rows, ', rows);

  const currentTableReElem = useMemo(() => {
    // const firstPvtView = pvtViews[0];

    let currPvtView = null;
    // if (firstPvtView.type === 'kanban') {
    //   currPvtView = <PersonalKanban />;
    // }

    // if (firstPvtView.type === 'table' || !firstPvtView.type) {
    currPvtView = (
      <>
        <TableContent {...getTableProps()}>
          <TableHead>
            {renderHeaderGroups?.(headerGroups) ??
              headerGroups.map((headerGroup, headerGroupIndex) => (
                <TableHeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((col, headerCellIndex) => {
                    const column = col as unknown as ColumnInstance<D>;

                    const headerProps = column.getHeaderProps(
                      ...(column.getSortByToggleProps
                        ? [column.getSortByToggleProps()]
                        : []),
                    );

                    const renderHeader =
                      column.Header && column.render('Header');
                    const isBig =
                      headerGroups.length > 1 &&
                      headerGroupIndex < headerGroups.length - 1;

                    return (
                      <TableHeadCell
                        data-big={isBig}
                        key={`headerCell-${headerCellIndex}`}
                        size={column.columns?.length ?? 1}
                      >
                        {renderHeader && (
                          // <Tooltip
                          //   title={renderHeader as string}
                          //   disabled={!isString(renderHeader) || isBig}
                          // >
                          <TableHeaderCellContainer
                            data-align={column.align ?? 'flex-start'}
                          >
                            <TableHeadCellContent
                              // variation='lowContrast'
                              {...headerProps}
                            >
                              {renderHeader}
                            </TableHeadCellContent>
                            {column.isSorted && (
                              <Icon
                                icon={
                                  column.isSortedDesc
                                    ? 'arrow-south'
                                    : 'arrow-north'
                                }
                              />
                            )}
                          </TableHeaderCellContainer>
                          // </Tooltip>
                        )}
                        {column.canFilter ? (
                          <TableHeaderCellSort>
                            {column.render('Filter')}
                          </TableHeaderCellSort>
                        ) : null}
                      </TableHeadCell>
                    );
                  })}
                </TableHeadRow>
              ))}
          </TableHead>
          {!loading && NoDataComponent && rows.length === 0 && (
            <NoDataContainer>
              <NoDataComponent />
            </NoDataContainer>
          )}
          <TableBody
            {...getTableBodyProps()}
            ref={tableBodyRef}
            rowsHeight={rowsHeight}
          >
            {virtualState.initialized ? (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={instance.total ?? currentRows.length}
                loadMoreItems={instance.loadMore ?? DEFAULT_LOAD_MORE}
              >
                {({ onItemsRendered, ref }) => {
                  return (
                    <FixedSizeList
                      ref={ref}
                      onItemsRendered={onItemsRendered}
                      width={virtualState.width ?? 0}
                      itemCount={instance.total ?? currentRows.length}
                      height={virtualState.height ?? 0}
                      itemSize={virtualState.itemSize ?? 0}
                    >
                      {VirtualRow}
                    </FixedSizeList>
                  );
                }}
              </InfiniteLoader>
            ) : (
              currentRows.map((row, rowIndex) => (
                <TableRow
                  index={rowIndex}
                  row={row}
                  getRowCharacteristics={getRowCharacteristics}
                  instance={instance}
                  onClick={onRowClick}
                  prepareRow={prepareRow}
                  renderRowSubComponent={renderRowSubComponent}
                  isRowSubComponentAboveRow={isRowSubComponentAboveRow}
                  key={`row-${rowIndex}`}
                />
              ))
            )}
          </TableBody>
          <TableFooter<D> footerGroups={footerGroups} />
        </TableContent>

        {(hasPagination || hasDensity) && (
          <TableOptionBar>
            {hasPagination && (
              <TablePagination instance={instance}>
                {hasDensity && <TableDensity instance={instance} />}
              </TablePagination>
            )}
            {!hasPagination && hasDensity && (
              <TableDensity instance={instance} />
            )}
          </TableOptionBar>
        )}
      </>
    );
    // }

    return currPvtView;
  }, [
    NoDataComponent,
    VirtualRow,
    currentRows,
    footerGroups,
    getRowCharacteristics,
    getTableBodyProps,
    getTableProps,
    hasDensity,
    hasPagination,
    headerGroups,
    instance,
    isItemLoaded,
    isRowSubComponentAboveRow,
    loading,
    onRowClick,
    prepareRow,
    renderHeaderGroups,
    renderRowSubComponent,
    rows.length,
    rowsHeight,
    tableBodyRef,
    virtualState,
  ]);

  return (
    <TableContainer
      // ???????????????div???style??????css??????????????????????????????????????? display: grid
      style={
        {
          '--table-grid-template-columns': gridTemplateColumns,
          '--table-scrollbar-width': `${scrollbarWidth}px`,
        } as React.CSSProperties
      }
      data-scrollable={!!scrollbarWidth}
      data-virtualized={virtualized}
    >
      {loading && <LoadingOverlay />}

      {currentTableReElem}
    </TableContainer>
  );
};
