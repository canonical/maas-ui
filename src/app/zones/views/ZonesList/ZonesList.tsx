import ZonesListForm from "./ZonesListForm";
import ZonesListHeader from "./ZonesListHeader";
import ZonesListTable from "./ZonesListTable";

import { useZoneCount } from "@/app/api/query/zones";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import { ZoneActionSidePanelViews } from "@/app/zones/constants";

const ZonesList = (): JSX.Element => {
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
  }

  return (
    <PageContent
      header={<ZonesListHeader setSidePanelContent={setSidePanelContent} />}
      sidePanelContent={content}
      sidePanelTitle="Add AZ"
    >
      {zonesCount?.data && zonesCount.data > 0 && <ZonesListTable />}
    </PageContent>
  );
};

export default ZonesList;
