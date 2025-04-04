import { useState } from "react";

import useDebouncedValue from "@/app/base/hooks/useDebouncedValue/useDebouncedValue";

function usePagination(pageSize: number) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const debouncedPage = useDebouncedValue(page);

  const handleNextClick = () => {
    setPage((prev) => prev + 1);
  };

  const handlePreviousClick = () => {
    setPage((prev) => prev - 1);
  };

  const resetPageCount = () => setPage(1);

  const handlePageSizeChange = (size: number) => {
    setSize(size);
    resetPageCount();
  };

  return {
    page: page,
    size,
    setPage,
    debouncedPage: debouncedPage,
    handleNextClick,
    handlePreviousClick,
    handlePageSizeChange,
  };
}

export default usePagination;
