import {
  deburr,
  difference,
  get,
  lowerCase,
  reduce,
  set,
  groupBy,
} from "lodash";

import {
  IMEXColumn,
  ImportedRow,
  ImportedRowMeta,
  RowValueTypes,
  UseImportTableOptions,
  UseImportTableParams,
} from "../imex.interface";

export enum ParseCellError {
  NOT_A_NUMBER,
  INVALID,
  REQUIRED,
}
export const ParsingErrors: Record<ParseCellError, string> = {
  [ParseCellError.NOT_A_NUMBER]: "Nombre invalide",
  [ParseCellError.INVALID]: "Valeur invalide",
  [ParseCellError.REQUIRED]: "Valeur requise",
};

export const softCompare = (a: any, b: any): boolean =>
  typeof a !== "object"
    ? a === b
    : reduce(
        a,
        (ctx: boolean, value, key) => {
          if (Array.isArray(value)) {
            return (
              value?.length === get(b, key, [])?.length &&
              value.reduce(
                (arrayCtx, v) => arrayCtx && get(b, key, []).includes(v),
                true
              ) &&
              ctx
            );
          }
          if (typeof value === "object") {
            return softCompare(value, get(b, key)) && ctx;
          }
          return `${value}` === `${get(b, key)}` && ctx;
        },
        true
      );

const isNotEmptyCell = (cell: any) => cell !== "" && cell != null;

export const parseCell = (
  rawCell: any,
  type: RowValueTypes,
  options: { format: (value: any) => any }
): string | number | string[] | number[] | undefined => {
  switch (type) {
    case "number":
      if (!isNotEmptyCell(rawCell)) {
        return undefined;
      }
      if (typeof rawCell === "number") {
        return Number(options.format(rawCell));
      }
      const newCellValue = Number(options.format(rawCell.replace(",", ".")));
      if (Number.isNaN(newCellValue)) {
        throw new Error(ParsingErrors[ParseCellError.NOT_A_NUMBER]);
      }
      return newCellValue;
    case "number[]":
      if (!isNotEmptyCell(rawCell)) {
        return [];
      }
      let formattedNumberArrayCell = options.format(rawCell);
      if (!Array.isArray(formattedNumberArrayCell)) {
        if (typeof formattedNumberArrayCell !== "string") {
          throw new Error(ParsingErrors[ParseCellError.INVALID]);
        }
        formattedNumberArrayCell = formattedNumberArrayCell.split(",");
      }
      return formattedNumberArrayCell
        .filter(isNotEmptyCell)
        .map((value: string | number) => {
          const transformedValue = Number(value);
          if (Number.isNaN(transformedValue)) {
            throw new Error(ParsingErrors[ParseCellError.NOT_A_NUMBER]);
          }
          return transformedValue;
        });

    case "string[]":
      if (!isNotEmptyCell(rawCell)) {
        return [];
      }
      let formattedStringArrayCell = options.format(rawCell);
      if (!Array.isArray(formattedStringArrayCell)) {
        if (typeof formattedStringArrayCell !== "string") {
          throw new Error(ParsingErrors[ParseCellError.INVALID]);
        }
        formattedStringArrayCell = formattedStringArrayCell.split(",");
      }
      return formattedStringArrayCell.filter(isNotEmptyCell);
    default:
      if (!isNotEmptyCell(rawCell)) {
        return undefined;
      }
      return options.format(rawCell);
  }
};

const cleanHeader = (header: string | number | {}) =>
  lowerCase(deburr(`${header}`));

interface ParseDataParams<D> {
  data: any[][];
  originalData: D[];
  columns: IMEXColumn<ImportedRow<D>>[];
}
export const parseRawData = async <D extends { id?: string | number }>(
  params: ParseDataParams<D>,
  options: Pick<
    UseImportTableOptions,
    "findPrevValPredicate" | "filterRows" | "groupBy"
  >
) => {
  // clone original data array
  const originalData = [...params.originalData];

  const headers = params.data.shift()?.map(cleanHeader);
  if (!headers) {
    throw new Error("Missing headers row");
  }
  const identifierColumn = params.columns.find(
    (column) => column.meta?.imex?.identifier
  );
  if (!identifierColumn) {
    throw new Error("Missing identifier column");
  }
  const requiredColumnHeaders = params.columns
    .filter((column) => column.meta?.imex?.required)
    .map((column) => cleanHeader(column.Header as string));

  const missingRequiredColumns = difference(
    requiredColumnHeaders as string[],
    headers
  );
  if (missingRequiredColumns.length > 0) {
    throw new Error(`${missingRequiredColumns.join(", ")} manquants`);
  }

  const ignoredColumns = [];
  const orderedColumns = headers.map((header) => {
    const column = params.columns.find((imexColumn) => {
      const searchedHeader = cleanHeader(imexColumn.Header as string);
      const cleanedHeader = requiredColumnHeaders.includes(searchedHeader)
        ? header.replace(/\*$/, "")
        : header;

      return searchedHeader === cleanedHeader;
    });

    if (!column) {
      ignoredColumns.push(header);
    }
    return column;
  });

  const filteredData = params.data.filter(
    (row: string[] | null) =>
      row?.length === headers?.length && row.some((cell) => !!cell)
  );

  const parsedData: ImportedRow<D>[] = [];
  for (const row of filteredData) {
    const importedRowMeta: ImportedRowMeta<D> = {
      hasDiff: false,
      errors: {},
      isIgnored: false,
    };

    const importedRowValue: Partial<D> = {};

    const rawRowValues = Object.values(row);
    for (let index = 0; index < rawRowValues.length; index++) {
      const rawCell = rawRowValues[index];
      if (!orderedColumns[index]) {
        continue;
      }

      let cellError: string | null = null;

      const format = (value: any) =>
        orderedColumns[index]?.meta?.imex?.format?.(value, row) ?? value;

      let newCellValue: string | number | string[] | number[] | undefined =
        rawCell;

      try {
        newCellValue = parseCell(
          rawCell,
          orderedColumns[index]!.meta!.imex!.type as RowValueTypes,
          { format }
        );

        // If parsed value is null, throw if required and ignore if not.
        if (newCellValue == null) {
          if (orderedColumns[index]?.meta?.imex?.required) {
            throw new Error(ParsingErrors[ParseCellError.REQUIRED]);
          } else {
            continue;
          }
        }

        const validate =
          orderedColumns[index]?.meta?.imex?.validate ?? (() => true);
        const validateResponse = validate(newCellValue, row);
        const isValid =
          typeof validateResponse === "string"
            ? !validateResponse.length
            : !!validateResponse;
        if (!isValid) {
          throw new Error(
            typeof validateResponse === "string"
              ? validateResponse
              : ParsingErrors[ParseCellError.INVALID]
          );
        }
      } catch (e) {
        if (e instanceof Error) {
          cellError = e.message;
        }
      }

      /**
       * Add errors on row and add ignore flag
       */
      if (cellError) {
        importedRowMeta.isIgnored = true;
        set(
          importedRowMeta.errors,
          orderedColumns[index]?.accessor as string,
          cellError
        );
      }

      set(
        importedRowValue,
        orderedColumns[index]?.accessor as string,
        newCellValue
      );
    }

    /**
     * Previous value
     */
    const prevValIdentifier = get(
      importedRowValue,
      identifierColumn.accessor as string
    );
    const prevValIndex = originalData.findIndex((originalRow) => {
      if (options.findPrevValPredicate) {
        return options.findPrevValPredicate(originalRow, importedRowValue);
      }
      return (
        get(originalRow, identifierColumn.accessor as string) ===
        prevValIdentifier
      );
    });

    importedRowMeta.prevVal = originalData[prevValIndex];
    originalData.splice(prevValIndex, 1); // remove from original array

    /**
     * Diff
     */
    importedRowMeta.hasDiff = !softCompare(
      importedRowValue,
      importedRowMeta.prevVal
    );

    parsedData.push({
      ...(importedRowValue as D),
      _rowMeta: importedRowMeta as ImportedRowMeta<D>,
      id: importedRowMeta.prevVal?.id ?? undefined,
    });
  }

  /**
   * If one of the row included in the group has been modified or added, we display existing values of the group.
   */
  if (options.groupBy) {
    let filteredGroupedParsedData: ImportedRow<D>[][] = [];
    const groupedParsedData = groupBy(parsedData, options.groupBy);
    for (const rowGroup in groupedParsedData) {
      if (groupedParsedData[rowGroup].some((row) => row._rowMeta.isIgnored)) {
        // @ts-ignore do not know how to fix this
        groupedParsedData[rowGroup] = groupedParsedData[rowGroup].map(
          (row) => ({
            ...row,
            _rowMeta: {
              ...row._rowMeta,
              isIgnored: true,
            },
          })
        );
      }
      if (
        groupedParsedData[rowGroup].some(
          (row) => row._rowMeta.hasDiff || options.filterRows?.(row)
        )
      ) {
        filteredGroupedParsedData.push(groupedParsedData[rowGroup]);
      }
    }

    return filteredGroupedParsedData.flat();
  }

  /**
   * Display only modified rows or rows validated by the custom filter function
   */
  return parsedData.filter((imexRow) => {
    if (imexRow._rowMeta.hasDiff) {
      return true;
    }
    return options.filterRows?.(imexRow);
  });
};

export const validateOptions = <D>(options: UseImportTableParams<D>) => {
  if (options.concurrency && options.concurrency < 1) {
    throw new Error("concurrency should be greater than 1");
  }
};
