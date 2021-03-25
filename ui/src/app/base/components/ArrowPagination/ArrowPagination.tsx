import type { HTMLProps } from "react";

import { Button, Icon } from "@canonical/react-components";

type Props = {
  currentPage: number;
  itemCount: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
} & HTMLProps<HTMLElement>;

const ArrowPagination = ({
  currentPage,
  itemCount,
  pageSize,
  setCurrentPage,
  ...props
}: Props): JSX.Element => {
  const onFirstPage = currentPage === 1;
  const onLastPage =
    itemCount === 0 || currentPage === Math.ceil(itemCount / pageSize);

  return (
    <nav aria-label="pagination" {...props}>
      <Button
        appearance="base"
        aria-label={onFirstPage ? "" : `Page ${currentPage - 1}`}
        className="u-no-margin--right u-no-margin--bottom"
        disabled={onFirstPage}
        onClick={() => {
          setCurrentPage(currentPage - 1);
        }}
        hasIcon
      >
        <Icon className="u-rotate-right" name="chevron-down" />
      </Button>
      <Button
        appearance="base"
        aria-label={onLastPage ? "" : `Page ${currentPage + 1}`}
        className="u-no-margin--bottom"
        disabled={onLastPage}
        onClick={() => {
          setCurrentPage(currentPage + 1);
        }}
        hasIcon
      >
        <Icon className="u-rotate-left" name="chevron-down" />
      </Button>
    </nav>
  );
};

export default ArrowPagination;
