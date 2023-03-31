import { useState } from "react";

import type {
  PaginationProps,
  PropsWithSpread,
} from "@canonical/react-components";
import { Button, Icon, Input } from "@canonical/react-components";

import { useFetchedCount } from "app/store/machine/utils";

export enum Label {
  Pagination = "Table pagination",
  PreviousPage = "Previous page",
  NextPage = "Next page",
}

export const DEFAULT_DEBOUNCE_INTERVAL = 500;

export type Props = PropsWithSpread<
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
  const [pageNumber, setPageNumber] = useState<number | undefined>(
    props.currentPage
  );
  const [error, setError] = useState("");

  const count = useFetchedCount(machineCount, machinesLoading);
  const totalPages = machineCount
    ? Math.ceil(machineCount / props.itemsPerPage)
    : 1;

  // TODO: add top margin to hr beneath pagination and shit

  return count > 0 ? (
    <nav aria-label={Label.Pagination} className="p-pagination">
      <span className="u-flex--align-baseline p-pagination--items">
        <Button
          aria-label={Label.PreviousPage}
          className="p-pagination__link--previous"
          disabled={props.currentPage === 1}
          onClick={() => props.paginate(props.currentPage - 1)}
        >
          <Icon name="chevron-down" />
        </Button>
        <strong>Page </strong>{" "}
        <Input
          aria-label="page number"
          className="p-pagination__input"
          error={error}
          onChange={(e) => {
            if (e.target.value) {
              setPageNumber(e.target.valueAsNumber);
              if (
                e.target.valueAsNumber > totalPages ||
                e.target.valueAsNumber < 1
              ) {
                setError(
                  `"${e.target.valueAsNumber}" is not a valid page number.`
                );
              } else {
                setError("");
              }
            } else {
              setPageNumber(undefined);
              setError("Enter a page number.");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !error) {
              props.paginate(e.currentTarget.valueAsNumber);
            }
          }}
          required
          type="number"
          value={pageNumber}
        />{" "}
        <strong className="u-no-wrap"> of {totalPages}</strong>
        <Button
          aria-label={Label.NextPage}
          className="p-pagination__link--next"
          disabled={props.currentPage === totalPages}
          onClick={() => props.paginate(props.currentPage + 1)}
        >
          <Icon name="chevron-down" />
        </Button>
      </span>
    </nav>
  ) : null;
};

export default MachineListPagination;
