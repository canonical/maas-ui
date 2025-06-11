import React, { useEffect } from "react";

import AddZone from "../components/AddZone";
import DeleteZone from "../components/DeleteZone";
import EditZone from "../components/EditZone";
import ZonesListHeader from "../components/ZonesListHeader";
import ZonesTable from "../components/ZonesTable";

import { useZoneCount } from "@/app/api/query/zones";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import { isId } from "@/app/utils";
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
    content = isId(zoneId) ? (
      <EditZone closeForm={closeForm} id={zoneId} />
    ) : null;
  } else if (
    sidePanelContent &&
    sidePanelContent.view === ZoneActionSidePanelViews.DELETE_ZONE
  ) {
    const zoneId =
      sidePanelContent.extras && "zoneId" in sidePanelContent.extras
        ? sidePanelContent.extras.zoneId
        : null;
    content = isId(zoneId) ? (
      <DeleteZone closeForm={closeForm} id={zoneId} />
    ) : null;
  }

  return (
    <PageContent
      header={<ZonesListHeader setSidePanelContent={setSidePanelContent} />}
      sidePanelContent={content}
      sidePanelTitle={getSidePanelTitle("Zones", sidePanelContent)}
    >
      <ZonesTable />
    </PageContent>
  );
};

export default ZonesList;
