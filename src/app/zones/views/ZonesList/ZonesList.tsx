import React, { useEffect } from "react";

import ZonesListHeader from "./ZonesListHeader";
import ZonesListTable from "./ZonesListTable";
import AddZone from "./ZonesListTable/AddZone";
import DeleteZone from "./ZonesListTable/DeleteZone";
import EditZone from "./ZonesListTable/EditZone";

import { useZoneCount } from "@/app/api/query/zones";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import { getSidePanelTitle } from "@/app/store/utils/node/base";
import { ZoneActionSidePanelViews } from "@/app/zones/constants";

const ZonesList: React.FC = () => {
  const zonesCount = useZoneCount();
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  useWindowTitle("Zones");

  const closeForm = () => {
    setSidePanelContent(null);
    // useWebsocketAwareQuery filtering the invalidations prevents
    // the hooks from causing a list update, this line forces it
    void zonesCount.refetch();
  };

  useEffect(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  let content = null;

  if (
    sidePanelContent &&
    sidePanelContent.view === ZoneActionSidePanelViews.CREATE_ZONE
  ) {
    content = <AddZone closeForm={closeForm} key="add-zone-form" />;
  } else if (
    sidePanelContent &&
    sidePanelContent.view === ZoneActionSidePanelViews.EDIT_ZONE
  ) {
    const zoneId =
      sidePanelContent.extras && "zoneId" in sidePanelContent.extras
        ? sidePanelContent.extras.zoneId
        : null;
    content = zoneId ? <EditZone closeForm={closeForm} id={zoneId} /> : null;
  } else if (
    sidePanelContent &&
    sidePanelContent.view === ZoneActionSidePanelViews.DELETE_ZONE
  ) {
    const zoneId =
      sidePanelContent.extras && "zoneId" in sidePanelContent.extras
        ? sidePanelContent.extras.zoneId
        : null;
    content = zoneId ? (
      <DeleteZone closeForm={closeForm} id={zoneId as number} />
    ) : null;
  }

  return (
    <PageContent
      header={<ZonesListHeader setSidePanelContent={setSidePanelContent} />}
      sidePanelContent={content}
      sidePanelTitle={getSidePanelTitle("Zones", sidePanelContent)}
    >
      {zonesCount?.data && zonesCount.data > 0 && <ZonesListTable />}
    </PageContent>
  );
};

export default ZonesList;
