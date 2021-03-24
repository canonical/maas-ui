import { Button, Icon } from "@canonical/react-components";

type Props = {
  currentPage: number;
  itemCount: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
};

const ArrowPagination = ({
  currentPage,
  itemCount,
  pageSize,
  setCurrentPage,
}: Props): JSX.Element => {
  const onFirstPage = currentPage === 1;
  const onLastPage =
    itemCount === 0 || currentPage === Math.ceil(itemCount / pageSize);

  return (
    <>
      <Button
        appearance="base"
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
        className="u-no-margin--bottom"
        disabled={onLastPage}
        onClick={() => {
          setCurrentPage(currentPage + 1);
        }}
        hasIcon
      >
        <Icon className="u-rotate-left" name="chevron-down" />
      </Button>
    </>
  );
};

export default ArrowPagination;
