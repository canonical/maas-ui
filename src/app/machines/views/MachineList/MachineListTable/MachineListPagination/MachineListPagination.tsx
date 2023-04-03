import { useState, useRef, useEffect } from "react";

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [pageNumber, setPageNumber] = useState<number | undefined>(
    props.currentPage
  );
  const [error, setError] = useState("");

  // Clear the timeout when the component is unmounted.
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  const count = useFetchedCount(machineCount, machinesLoading);
  const totalPages = machineCount
    ? Math.ceil(machineCount / props.itemsPerPage)
    : 1;

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
          onBlur={() => {
            setPageNumber(props.currentPage);
            setError("");
          }}
          onChange={(e) => {
            if (e.target.value) {
              setPageNumber(e.target.valueAsNumber);
              if (intervalRef.current) {
                clearTimeout(intervalRef.current);
              }
              intervalRef.current = setTimeout(() => {
                if (
                  e.target.valueAsNumber > totalPages ||
                  e.target.valueAsNumber < 1
                ) {
                  setError(
                    `"${e.target.valueAsNumber}" is not a valid page number.`
                  );
                } else {
                  setError("");
                  props.paginate(e.target.valueAsNumber);
                }
              }, DEFAULT_DEBOUNCE_INTERVAL);
            } else {
              setPageNumber(undefined);
              setError("Enter a page number.");
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
