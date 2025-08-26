import React from "react";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { ZonesListHeader, ZonesTable } from "@/app/zones/components";

const ZonesList: React.FC = () => {
  useWindowTitle("Zones");

  return (
    <PageContent
      header={<ZonesListHeader />}
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      <ZonesTable />
    </PageContent>
  );
};

export default ZonesList;
