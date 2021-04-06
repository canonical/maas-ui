import type { HTMLProps } from "react";

import { Button, Icon, Spinner } from "@canonical/react-components";

type Props = {
  currentPage: number;
  itemCount: number;
  loading?: boolean;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  showPageBounds?: boolean;
} & HTMLProps<HTMLElement>;

const getBounds = (
  itemCount: number,
  currentPage: number,
  pageSize: number
) => {
  const lowerBound = itemCount === 0 ? 0 : pageSize * (currentPage - 1) + 1;
  const upperBound =
    itemCount > pageSize * currentPage ? pageSize * currentPage : itemCount;
  return `${lowerBound} - ${upperBound} of ${itemCount}`;
};

const ArrowPagination = ({
  currentPage,
  itemCount,
  loading = false,
  pageSize,
  setCurrentPage,
  showPageBounds = false,
  ...props
}: Props): JSX.Element => {
  const onFirstPage = currentPage === 1;
  const onLastPage =
    itemCount === 0 || currentPage === Math.ceil(itemCount / pageSize);

  return (
    <nav aria-label="pagination" {...props}>
      {showPageBounds && (
        <span className="u-text--muted u-nudge-left" data-test="page-bounds">
          {loading ? <Spinner /> : getBounds(itemCount, currentPage, pageSize)}
        </span>
      )}
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
