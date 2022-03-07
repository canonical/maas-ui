import type { ReactNode } from "react";

import type { SearchBoxProps } from "@canonical/react-components";
import { SearchBox } from "@canonical/react-components";

import ArrowPagination from "app/base/components/ArrowPagination";

type Props = {
  actions: ReactNode;
  currentPage: number;
  loading?: boolean;
  itemCount: number;
  onSearchChange: SearchBoxProps["onChange"];
  pageSize?: number;
  searchFilter: string;
  setCurrentPage: (page: number) => void;
};

const ActionBar = ({
  actions,
  currentPage,
  loading,
  itemCount,
  onSearchChange,
  pageSize = 50,
  searchFilter,
  setCurrentPage,
}: Props): JSX.Element | null => {
  return (
    <div className="action-bar">
      <div className="action-bar__actions">{actions}</div>
      <div className="action-bar__search">
        <SearchBox
          className="u-no-margin--bottom"
          externallyControlled
          onChange={onSearchChange}
          value={searchFilter}
        />
      </div>
      <div className="action-bar__pagination">
        <ArrowPagination
          className="u-display-inline-block"
          currentPage={currentPage}
          itemCount={itemCount}
          loading={loading}
          pageSize={pageSize}
          setCurrentPage={setCurrentPage}
          showPageBounds
        />
      </div>
    </div>
  );
};

export default ActionBar;
