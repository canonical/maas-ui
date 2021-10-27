import type { ReactNode } from "react";

import type { SearchBoxProps } from "@canonical/react-components";
import { SearchBox } from "@canonical/react-components";

import { VMS_PER_PAGE } from "../LXDVMsTable";

import ArrowPagination from "app/base/components/ArrowPagination";

type Props = {
  actions: ReactNode;
  currentPage: number;
  loading?: boolean;
  itemCount: number;
  onSearchChange: SearchBoxProps["onChange"];
  searchFilter: string;
  setCurrentPage: (page: number) => void;
};

const KVMActionBar = ({
  actions,
  currentPage,
  loading,
  itemCount,
  onSearchChange,
  searchFilter,
  setCurrentPage,
}: Props): JSX.Element | null => {
  return (
    <div className="kvm-action-bar">
      <div className="kvm-action-bar__actions">{actions}</div>
      <div className="kvm-action-bar__search">
        <SearchBox
          className="u-no-margin--bottom"
          externallyControlled
          onChange={onSearchChange}
          value={searchFilter}
        />
      </div>
      <div className="kvm-action-bar__pagination">
        <ArrowPagination
          className="u-display-inline-block"
          currentPage={currentPage}
          itemCount={itemCount}
          loading={loading}
          pageSize={VMS_PER_PAGE}
          setCurrentPage={setCurrentPage}
          showPageBounds
        />
      </div>
    </div>
  );
};

export default KVMActionBar;
