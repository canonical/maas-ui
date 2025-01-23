import React from "react";

import ZonesListForm from "./ZonesListForm";
import ZonesListHeader from "./ZonesListHeader";
import ZonesListTable from "./ZonesListTable";

import { useZoneCount } from "@/app/api/query/zones";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import { getSidePanelTitle } from "@/app/store/utils/node/base";
import { ZoneActionSidePanelViews } from "@/app/zones/constants";
import DeleteZone from "@/app/zones/views/ZonesList/ZonesListTable/DeleteZone";

const ZonesList: React.FC = () => {
  const zonesCount = useZoneCount();
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  useWindowTitle("Zones");

  let content = null;

  if (
    sidePanelContent &&
    sidePanelContent.view === ZoneActionSidePanelViews.CREATE_ZONE
  ) {
    content = (
      <ZonesListForm
        closeForm={() => {
          setSidePanelContent(null);
        }}
        key="add-zone-form"
      />
    );
  } else if (
    sidePanelContent &&
    sidePanelContent.view === ZoneActionSidePanelViews.DELETE_ZONE
  ) {
    const zoneId =
      sidePanelContent.extras && "zoneId" in sidePanelContent.extras
        ? sidePanelContent.extras.zoneId
        : null;
    content = zoneId ? (
      <DeleteZone
        closeForm={() => {
          setSidePanelContent(null);
        }}
        id={zoneId as number}
      />
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
