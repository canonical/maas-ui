import type { ReactNode } from "react";

import type { ButtonProps } from "@canonical/react-components";
import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";

import type { Sort } from "@/app/base/types";

type Props = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly currentSort?: Sort;
  readonly onClick?: ButtonProps["onClick"];
  readonly sortKey?: string;
};

const TableHeader = ({
  children,
  className,
  currentSort,
  onClick,
  sortKey,
}: Props): React.ReactElement => {
  if (!onClick) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Button
      appearance="link"
      className={classNames("p-button--table-header", className)}
      onClick={onClick}
    >
      <span>{children}</span>
      {currentSort && currentSort.key === sortKey && (
        <Icon
          aria-label={`(${currentSort.direction})`}
          name={
            currentSort.direction === "ascending"
              ? "chevron-up"
              : "chevron-down"
          }
        />
      )}
    </Button>
  );
};

export default TableHeader;
