import { useState, useEffect } from "react";

import type {
  PaginationProps,
  PropsWithSpread,
} from "@canonical/react-components";
import { Pagination } from "@canonical/react-components";

export enum Label {
  Pagination = "Table pagination",
}

type Props = PropsWithSpread<
  {
    currentPage: PaginationProps["currentPage"];
    itemsPerPage: PaginationProps["itemsPerPage"];
    machineCount: number | null;
    machinesLoading?: boolean | null;
    paginate: PaginationProps["paginate"];
  },
  Partial<PaginationProps>
>;

const MachineListPagination = ({
  machineCount,
  machinesLoading,
  ...props
}: Props): JSX.Element | null => {
  const [previousCount, setPreviousCount] = useState(machineCount);
  const count = (machinesLoading ? previousCount : machineCount) ?? 0;

  useEffect(() => {
    // The pagination needs to be displayed while the new list is being fetched
    // so this stores the previous machine count while the request is in progress.
    if (
      (machineCount || machineCount === 0) &&
      previousCount !== machineCount
    ) {
      setPreviousCount(machineCount);
    }
  }, [machineCount, previousCount]);

  return count > 0 ? (
    <Pagination
      aria-label={Label.Pagination}
      className="u-nudge-down"
      totalItems={count}
      {...props}
    />
  ) : null;
};

export default MachineListPagination;
