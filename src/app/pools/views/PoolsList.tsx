import type { ReactElement } from "react";
import { useEffect } from "react";

import PageContent from "@/app/base/components/PageContent";
import { useSidePanel } from "@/app/base/side-panel-context";
import AddPool from "@/app/pools/components/AddPool/AddPool";
import DeletePool from "@/app/pools/components/DeletePool/DeletePool";
import EditPool from "@/app/pools/components/EditPool/EditPool";
import PoolsTable from "@/app/pools/components/PoolsTable/PoolsTable";
import { PoolActionSidePanelViews } from "@/app/pools/constants";
import PoolsListHeader from "@/app/pools/views/PoolsListHeader";
import { getSidePanelTitle } from "@/app/store/utils/node/base";

const PoolsList = (): ReactElement => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  const closeForm = () => {
    setSidePanelContent(null);
  };

  useEffect(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  let content = null;

  if (
    sidePanelContent &&
    sidePanelContent.view === PoolActionSidePanelViews.CREATE_POOL
  ) {
    content = <AddPool closeForm={closeForm} key="add-pool-form" />;
  } else if (
    sidePanelContent &&
    sidePanelContent.view === PoolActionSidePanelViews.EDIT_POOL
  ) {
    const poolId =
      sidePanelContent.extras && "poolId" in sidePanelContent.extras
        ? sidePanelContent.extras.poolId
        : null;
    content = poolId ? <EditPool closeForm={closeForm} id={poolId} /> : null;
  } else if (
    sidePanelContent &&
    sidePanelContent.view === PoolActionSidePanelViews.DELETE_POOL
  ) {
    const poolId =
      sidePanelContent.extras && "poolId" in sidePanelContent.extras
        ? sidePanelContent.extras.poolId
        : null;
    content = poolId ? <DeletePool closeForm={closeForm} id={poolId} /> : null;
  }

  return (
    <PageContent
      header={<PoolsListHeader setSidePanelContent={setSidePanelContent} />}
      sidePanelContent={content}
      sidePanelTitle={getSidePanelTitle("Pools", sidePanelContent)}
    >
      <PoolsTable />
    </PageContent>
  );
};

export default PoolsList;
