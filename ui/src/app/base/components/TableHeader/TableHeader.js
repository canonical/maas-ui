import { Button } from "@canonical/react-components";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const TableHeader = ({
  children,
  className,
  currentSort,
  onClick,
  sortKey,
}) => {
  if (!onClick) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Button appearance="link" className={className} onClick={onClick}>
      <span>{children}</span>
      {currentSort && currentSort.key === sortKey && (
        <i
          className={classNames("p-icon--contextual-menu", {
            "u-mirror--y": currentSort.direction === "ascending",
          })}
        />
      )}
    </Button>
  );
};

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  currentSort: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(["ascending", "descending", "none"]),
  }),
  onClick: PropTypes.func,
  sortKey: PropTypes.string,
};

export default TableHeader;
