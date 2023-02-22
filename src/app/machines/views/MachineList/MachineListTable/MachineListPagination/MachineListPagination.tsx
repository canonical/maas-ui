import type {
  PaginationProps,
  PropsWithSpread,
} from "@canonical/react-components";
import { Button, Icon, Input } from "@canonical/react-components";

import { useFetchedCount } from "app/store/machine/utils";

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
  const count = useFetchedCount(machineCount, machinesLoading);
  const totalPages = machineCount
    ? Math.ceil(machineCount / props.itemsPerPage)
    : 1;

  return count > 0 ? (
    <span className="u-flex--align-baseline p-pagination--items">
      <Button
        className="p-pagination__link--previous"
        disabled={props.currentPage === 1}
        onClick={() => props.paginate(props.currentPage - 1)}
      >
        <Icon name="chevron-down" />
      </Button>
      <strong>Page </strong>{" "}
      <Input
        className="p-pagination__input"
        defaultValue={props.currentPage}
        onChange={(e) =>
          e.target.valueAsNumber > 0 && e.target.valueAsNumber <= totalPages
            ? props.paginate(e.target.valueAsNumber)
            : {}
        }
        type="number"
      />{" "}
      <strong> of {totalPages}</strong>
      <Button
        className="p-pagination__link--next"
        disabled={props.currentPage === totalPages}
        onClick={() => props.paginate(props.currentPage + 1)}
      >
        <Icon name="chevron-down" />
      </Button>
    </span>
  ) : null;
};

export default MachineListPagination;
