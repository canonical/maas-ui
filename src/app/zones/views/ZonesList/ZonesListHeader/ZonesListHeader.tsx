import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ZonesListTitle from "./ZonesListTitle";

import ModelListSubtitle from "@/app/base/components/ModelListSubtitle";
import { useFetchActions } from "@/app/base/hooks";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { actions } from "@/app/store/zone";
import zoneSelectors from "@/app/store/zone/selectors";
import { ZoneActionSidePanelViews } from "@/app/zones/constants";

const ZonesListHeader = ({
  setSidePanelContent,
}: {
  setSidePanelContent: SetSidePanelContent;
}): JSX.Element => {
  const zonesCount = useSelector(zoneSelectors.count);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  useFetchActions([actions.fetch]);

  return (
    <MainToolbar>
      <MainToolbar.Title>
        <ZonesListTitle />
      </MainToolbar.Title>
      {zonesLoaded ? (
        <ModelListSubtitle available={zonesCount} modelName="AZ" />
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
