import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";

import ZonesListTitle from "./ZonesListTitle";

import { useZoneCount } from "@/app/api/query/zones";
import ModelListSubtitle from "@/app/base/components/ModelListSubtitle";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { ZoneActionSidePanelViews } from "@/app/zones/constants";

const ZonesListHeader = ({
  setSidePanelContent,
}: {
  readonly setSidePanelContent: SetSidePanelContent;
}): React.ReactElement => {
  const zonesCount = useZoneCount();

  return (
    <MainToolbar>
      <MainToolbar.Title>
        <ZonesListTitle />
      </MainToolbar.Title>
      {zonesCount.isSuccess ? (
        <ModelListSubtitle available={zonesCount.data} modelName="AZ" />
      ) : (
        <Spinner text="Loading..." />
      )}
      <MainToolbar.Controls>
        <Button
          data-testid="add-zone"
          key="add-zone"
          onClick={() => {
            setSidePanelContent({ view: ZoneActionSidePanelViews.CREATE_ZONE });
          }}
        >
          Add AZ
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default ZonesListHeader;
