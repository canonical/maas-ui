import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import Table from "../Table";
import TableRow from "../TableRow";
import TableHeader from "../TableHeader";
import TableCell from "../TableCell";

const MainTable = ({
  defaultSort,
  defaultSortDirection,
  expanding,
  headers,
  rows,
  responsive,
  sortable,
  ...props
}) => {
  const [currentSortKey, _setSortKey] = useState(defaultSort);
  const [currentSortDirection, _setSortDirection] = useState(
    defaultSortDirection
  );

  useEffect(() => {
    _setSortKey(defaultSort);
  }, [defaultSort]);

  useEffect(() => {
    _setSortDirection(defaultSortDirection);
  }, [defaultSortDirection]);

  const _updateSort = (sortKey, sortDirection) => {
    let newDirection = null;
    if (sortDirection === "none") {
      newDirection = "ascending";
    } else if (sortDirection === "ascending") {
      newDirection = "descending";
    } else {
      sortKey = null;
    }
    _setSortKey(sortKey);
    _setSortDirection(newDirection);
  };

  const _generateHeaders = () => {
    const headerItems = headers.map(({ content, sortKey, ...props }, index) => {
      let sortDirection;
      if (sortable && sortKey) {
        if (currentSortKey === sortKey) {
          sortDirection = currentSortDirection;
        } else {
          sortDirection = "none";
        }
      }
      return (
        <TableHeader
          key={index}
          sort={sortDirection}
          onClick={sortable && _updateSort.bind(this, sortKey, sortDirection)}
          {...props}
        >
          {content}
        </TableHeader>
      );
    });
    // When there is expanding content then provide an extra hidden header to
    // account for the extra cell in the body rows.
    return (
      <thead>
        <TableRow>
          {headerItems}
          {expanding && <TableHeader className="u-hide"></TableHeader>}
        </TableRow>
      </thead>
    );
  };
  const _generateRows = () => {
    // Clone the rows so we can restore the original order.
    const sortedRows = [...rows];
    if (sortable && currentSortKey) {
      sortedRows.sort((a, b) => {
        if (!a.sortData || !b.sortData) {
          return 0;
        }
        if (a.sortData[currentSortKey] > b.sortData[currentSortKey]) {
          return currentSortDirection === "ascending" ? 1 : -1;
        } else if (a.sortData[currentSortKey] < b.sortData[currentSortKey]) {
          return currentSortDirection === "ascending" ? -1 : 1;
        }
        return 0;
      });
    }
    const rowItems = sortedRows.map(
      (
        { columns, expanded, expandedContent, sortData, ...rowProps },
        index
      ) => {
        const cellItems = columns.map(({ content, ...cellProps }, index) => (
          <TableCell key={index} {...cellProps}>
            {content}
          </TableCell>
        ));
        // The expanding cell is alway created to match the correct number of
        // table cells in rows that do have expanding content.
        return (
          <TableRow key={index} {...rowProps}>
            {cellItems}
            {expanding && (
              <TableCell expanding={true} hidden={!expanded}>
                {expandedContent}
              </TableCell>
            )}
          </TableRow>
        );
      }
    );
    return <tbody>{rowItems}</tbody>;
  };
  return (
    <Table
      expanding={expanding}
      sortable={sortable}
      responsive={responsive}
      {...props}
    >
      {headers && _generateHeaders()}
      {headers && _generateRows()}
    </Table>
  );
};

MainTable.propTypes = {
  defaultSort: PropTypes.string,
  defaultSortDirection: PropTypes.oneOf(["ascending", "descending"]),
  expanding: PropTypes.bool,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node,
      className: PropTypes.string,
      // The key to sort on for this header.
      sortKey: PropTypes.string
    })
  ),
  responsive: PropTypes.bool,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          children: PropTypes.node,
          className: PropTypes.string,
          expanding: PropTypes.bool,
          hidden: PropTypes.bool
        })
      ),
      expanded: PropTypes.bool,
      expandedContent: PropTypes.node,
      // A map of sort keys to values for this row. The keys should map the
      // sortKey values in the headers.
      sortData: PropTypes.object
    })
  ),
  sortable: PropTypes.bool
};

export default MainTable;
