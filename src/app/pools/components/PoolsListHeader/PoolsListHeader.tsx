import type { ReactNode } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { Link } from "react-router";

import { usePoolCount } from "@/app/api/query/pools";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import { PoolActionSidePanelViews } from "@/app/pools/constants";
import { useFetchMachineCount } from "@/app/store/machine/utils/hooks";

const PoolsListHeader = ({
  setSidePanelContent,
}: {
  setSidePanelContent: SetSidePanelContent;
}): ReactNode => {
  const { machineCount } = useFetchMachineCount();
  const resourcePoolsCount = usePoolCount();
  const count = resourcePoolsCount?.data ? resourcePoolsCount.data : 0;

  return (
    <MainToolbar>
      <MainToolbar.Title>
        <Link to={urls.machines.index}>{machineCount} machines</Link>
        {` in ${count} ${pluralize("pool", count)}`}
      </MainToolbar.Title>
      <MainToolbar.Controls>
        <Button
          data-testid="add-pool"
          key="add-pool"
          onClick={() => {
            setSidePanelContent({ view: PoolActionSidePanelViews.CREATE_POOL });
          }}
        >
          Add pool
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default PoolsListHeader;
