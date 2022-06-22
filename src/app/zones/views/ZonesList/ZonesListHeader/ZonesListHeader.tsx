import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import SectionHeader from "app/base/components/SectionHeader";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import { useDispatch, useSelector } from "react-redux";

import ZonesListForm from "../ZonesListForm";

import ZonesListTitle from "./ZonesListTitle";

const ZonesListHeader = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const zonesCount = useSelector(zoneSelectors.count);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  let buttons: JSX.Element[] | null = [
    <Button
      data-testid="add-zone"
      key="add-zone"
      onClick={() => {
        setShowForm(true);
      }}
    >
      Add AZ
    </Button>,
  ];

  let headerContent: JSX.Element | null = null;

  if (showForm) {
    buttons = null;
    headerContent = (
      <ZonesListForm
        closeForm={() => {
          setShowForm(false);
        }}
        key="add-zone-form"
      />
    );
  }

  return (
    <SectionHeader
      buttons={buttons}
      headerContent={headerContent}
      subtitle={`${zonesCount} AZs available`}
      subtitleLoading={!zonesLoaded}
      title={<ZonesListTitle />}
    ></SectionHeader>
  );
};

export default ZonesListHeader;
