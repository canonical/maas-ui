import type { ChangeEvent, ReactElement } from "react";
import { useMemo } from "react";

import { PaginationContainer } from "@canonical/maas-react-components";
import { Select } from "@canonical/react-components";

import ControlsBar from "@/app/base/components/GenericTable/PaginationBar/ControlsBar/ControlsBar";

export type PaginationBarProps = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  handlePageSizeChange: (size: number) => void;
  dataContext: string;
  setCurrentPage: (page: number) => void;
  isPending: boolean;
};
export const pageSizes: number[] = [20, 30, 50, 100];

const PaginationBar = ({
  currentPage,
  itemsPerPage,
  totalItems,
  handlePageSizeChange,
  dataContext,
  setCurrentPage,
  isPending,
}: PaginationBarProps): ReactElement => {
  const pageCounts = useMemo(() => pageSizes, []);
  const pageOptions = useMemo(
    () =>
      pageCounts.map((pageCount) => ({
        label: `${pageCount}/page`,
        value: pageCount,
      })),
    [pageCounts]
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    handlePageSizeChange(Number(value));
  };

  const getDisplayedDataCount = () => {
    if (currentPage === totalPages) {
      return itemsPerPage - (totalPages * itemsPerPage - totalItems);
    } else if (currentPage < totalPages) {
      return itemsPerPage;
    } else {
      return 0;
    }
  };

  return (
    <ControlsBar>
      <ControlsBar.Left>
        Showing {getDisplayedDataCount()} out of {totalItems} {dataContext}
      </ControlsBar.Left>
      <ControlsBar.Right>
        <PaginationContainer
          currentPage={currentPage}
          disabled={isPending}
          paginate={setCurrentPage}
          totalPages={totalPages}
        />
        <Select
          aria-label="Items per page"
          className="u-no-margin--bottom"
          name="Items per page"
          onChange={handleSizeChange}
          options={pageOptions}
          value={itemsPerPage}
        />
      </ControlsBar.Right>
    </ControlsBar>
  );
};

export default PaginationBar;
