import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { getTextColorBasedOnBg } from "../_utility/getBorderClass";
import { darkenColor } from "../_utility/getDarkerColor";
import { Text } from "./Typography";
import { isBrightColor } from "../_utility/isBrightColor";

export interface SortState {
  key: string | null;
  order: "asc" | "desc";
}

// ✅ Define Types for Columns
interface TableColumn<T = any> {
  header: string;
  accessor: string;
}

// ✅ Define Props Interface for Table
export interface TableProps<T> {
  columns: TableColumn[];
  data: T[];
  backgroundColor?: string;
  team: any;
  textColor?: string;
  rowRenderer: (item: T, index: number, backgroundColor: string) => ReactNode;
}

export const Table = <T,>({
  columns,
  data,
  team,
  rowRenderer,
}: TableProps<T>): JSX.Element => {
  let backgroundColor = team?.ColorOne || "#4B5563";
  let borderColor = team?.ColorTwo || "#4B5563";
  if (isBrightColor(backgroundColor)) {
    [backgroundColor, borderColor] = [borderColor, backgroundColor];
  }
  const darkerBackgroundColor = darkenColor(backgroundColor, -5) || "#4B5563";
  const textColorClass = getTextColorBasedOnBg(backgroundColor);

  // Sorting state and sorted data
  const [sortState, setSortState] = useState<SortState>({
    key: null,
    order: "asc",
  });
  const [sortedData, setSortedData] = useState<T[]>(data);
  const [invalidSortKeys] = useState([
    "actions",
    "rank",
    "",
    "opp",
    "Day",
    "Home",
    "Away",
  ]);

  // When data or sortState changes, update sortedData
  useEffect(() => {
    if (sortState.key === null) {
      setSortedData(data);
      return;
    }
    const { key, order } = sortState;
    const sorted = [...data].sort((a: any, b: any) => {
      if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
  }, [data, sortState]);

  // Handler for sorting column
  const handleSort = (accessor: string) => {
    if (invalidSortKeys.includes(accessor)) return;
    setSortState((prev) => {
      const newOrder =
        prev.key === accessor && prev.order === "asc" ? "desc" : "asc";
      return { key: accessor, order: newOrder };
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg mt-2 w-full">
      <div
        className={`sm:table table-auto w-full border-b-2 ${textColorClass}`}
        style={{ backgroundColor, borderColor }}
      >
        {/* Header */}
        <div className="table-header-group sticky top-0">
          <div
            className={`table-row text-left ${textColorClass}`}
            style={{ backgroundColor: darkerBackgroundColor, borderColor }}
          >
            {columns.map((col) => (
              <div
                key={col.accessor}
                className="table-cell border-b-2 px-2 py-2 font-semibold whitespace-nowrap cursor-pointer"
                style={{
                  backgroundColor: darkerBackgroundColor,
                  borderColor: borderColor,
                }}
                onClick={() => handleSort(col.accessor)}
              >
                <Text variant="body-small">{col.header}</Text>
                {sortState.key === col.accessor
                  ? sortState.order === "asc"
                    ? " 🔼"
                    : " 🔽"
                  : null}
              </div>
            ))}
          </div>
        </div>
        {/* Body */}
        <div className="table-row-group">
          {sortedData.map((item, index) => {
            const bg = index % 2 === 0 ? "transparent" : darkerBackgroundColor;
            return (
              <React.Fragment key={index}>
                {rowRenderer(item, index, bg)}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
