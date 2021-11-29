import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ZonesListForm from "../ZonesListForm";

import ZonesListTitle from "./ZonesListTitle";

import SectionHeader from "app/base/components/SectionHeader";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

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
      appearance="neutral"
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
        key="add-zone-form"
        closeForm={() => {
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <SectionHeader
      buttons={buttons}
      title={<ZonesListTitle />}
      subtitle={`${zonesCount} AZs available`}
      subtitleLoading={!zonesLoaded}
      headerContent={headerContent}
    ></SectionHeader>
  );
};

export default ZonesListHeader;
