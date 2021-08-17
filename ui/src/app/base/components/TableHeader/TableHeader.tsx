import type { ReactNode } from "react";

import type { ButtonProps } from "@canonical/react-components";
import { Button } from "@canonical/react-components";
import classNames from "classnames";

import type { Sort } from "app/base/types";

type Props = {
  children: ReactNode;
  className?: string;
  currentSort?: Sort;
  onClick?: ButtonProps["onClick"];
  sortKey?: string;
};

const TableHeader = ({
  children,
  className,
  currentSort,
  onClick,
  sortKey,
}: Props): JSX.Element => {
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

export default TableHeader;
