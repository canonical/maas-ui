import React, { useEffect } from "react";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import { isId } from "@/app/utils";
import {
  AddZone,
  DeleteZone,
  EditZone,
  ZonesListHeader,
  ZonesTable,
} from "@/app/zones/components";
import { ZoneActionSidePanelViews } from "@/app/zones/constants";

const ZonesList: React.FC = () => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  useWindowTitle("Zones");

  const closeForm = () => {
    setSidePanelContent(null);
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
