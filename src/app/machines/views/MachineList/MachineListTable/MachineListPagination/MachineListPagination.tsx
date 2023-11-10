import { useState, useRef, useEffect } from "react";

import type {
  PaginationProps,
  PropsWithSpread,
} from "@canonical/react-components";
import { Button, Icon, Input } from "@canonical/react-components";

import { useFetchedCount } from "@/app/store/machine/utils";

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
    totalPages: number | null;
    machinesLoading?: boolean | null;
    paginate: NonNullable<PaginationProps["paginate"]>;
  },
  Partial<PaginationProps>
>;

const MachineListPagination = ({
  machineCount,
  machinesLoading,
  totalPages,
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
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  const count = useFetchedCount(machineCount, machinesLoading);
  const pages = useFetchedCount(totalPages, machinesLoading);

  return count > 0 ? (
    <nav aria-label={Label.Pagination} className="p-pagination">
      <span className="u-flex--align-baseline p-pagination--items">
        <Button
          aria-label={Label.PreviousPage}
          className="p-pagination__link--previous"
          disabled={props.currentPage === 1}
          onClick={() => {
            setPageNumber((page) => Number(page) - 1);
            props.paginate(Number(props.currentPage) - 1);
          }}
          type="button"
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
                  e.target.valueAsNumber > pages ||
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
        <strong className="u-no-wrap"> of {pages}</strong>
        <Button
          aria-label={Label.NextPage}
          className="p-pagination__link--next"
          disabled={props.currentPage === pages}
          onClick={() => {
            setPageNumber((page) => Number(page) + 1);
            props.paginate(Number(props.currentPage) + 1);
          }}
          type="button"
        >
          <Icon name="chevron-down" />
        </Button>
      </span>
    </nav>
  ) : null;
};

export default MachineListPagination;
