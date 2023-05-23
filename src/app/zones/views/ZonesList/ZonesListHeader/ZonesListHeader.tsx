import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ZonesListForm from "../ZonesListForm";

import ZonesListTitle from "./ZonesListTitle";

import SectionHeader from "app/base/components/SectionHeader";
import { useSidePanel } from "app/base/side-panel-context";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import { ZoneActionHeaderViews } from "app/zones/constants";

const ZonesListHeader = (): JSX.Element => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const dispatch = useDispatch();
  const zonesCount = useSelector(zoneSelectors.count);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  const buttons = [
    <Button
      data-testid="add-zone"
      key="add-zone"
      onClick={() => {
        setSidePanelContent({ view: ZoneActionHeaderViews.CREATE_ZONE });
      }}
    >
      Add AZ
    </Button>,
  ];
  let content = null;

  if (
    sidePanelContent &&
    sidePanelContent.view === ZoneActionHeaderViews.CREATE_ZONE
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
    <SectionHeader
      buttons={buttons}
      sidePanelContent={content}
      sidePanelTitle="Add AZ"
      subtitle={`${zonesCount} AZs available`}
      subtitleLoading={!zonesLoaded}
      title={<ZonesListTitle />}
    ></SectionHeader>
  );
};

export default ZonesListHeader;
