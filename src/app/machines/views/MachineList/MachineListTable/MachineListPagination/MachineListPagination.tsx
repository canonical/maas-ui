import type {
  PaginationProps,
  PropsWithSpread,
} from "@canonical/react-components";

import Pagination from "app/base/components/Pagination";
import { useFetchedCount } from "app/store/machine/utils";

export enum Label {
  Pagination = "Table pagination",
}

type Props = PropsWithSpread<
  {
    currentPage: PaginationProps["currentPage"];
    itemsPerPage: PaginationProps["itemsPerPage"];
    machineCount: number | null;
    totalPages: number | null;
    machinesLoading?: boolean | null;
    paginate: PaginationProps["paginate"];
  },
  Partial<PaginationProps>
>;

const MachineListPagination = ({
  machineCount,
  machinesLoading,
  totalPages,
  ...props
}: Props): JSX.Element | null => {
  const count = useFetchedCount(machineCount, machinesLoading);
  const pages = useFetchedCount(totalPages, machinesLoading);

  return count > 0 ? (
    <Pagination
      aria-label={Label.Pagination}
      className="u-nudge-down"
      totalItems={count}
      totalPages={pages}
      {...props}
    />
  ) : null;
};

export default MachineListPagination;
