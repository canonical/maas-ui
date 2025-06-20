import type { ReactElement } from "react";
import { useEffect } from "react";

import PageContent from "@/app/base/components/PageContent";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import {
  AddPool,
  DeletePool,
  EditPool,
  PoolsListHeader,
  PoolsTable,
} from "@/app/pools/components";
import { PoolActionSidePanelViews } from "@/app/pools/constants";
import { isId } from "@/app/utils";

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
    content = isId(poolId) ? (
      <EditPool closeForm={closeForm} id={poolId} />
    ) : null;
  } else if (
    sidePanelContent &&
    sidePanelContent.view === PoolActionSidePanelViews.DELETE_POOL
  ) {
    const poolId =
      sidePanelContent.extras && "poolId" in sidePanelContent.extras
        ? sidePanelContent.extras.poolId
        : null;
    content = isId(poolId) ? (
      <DeletePool closeForm={closeForm} id={poolId} />
    ) : null;
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
