import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import ZonesListHeader from "./ZonesListHeader";
import ZonesListTable from "./ZonesListTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

export enum Label {
  List = "Zones list",
}

const ZonesList = (): JSX.Element => {
  const dispatch = useDispatch();
  const zonesCount = useSelector(zoneSelectors.count);

  useWindowTitle("Zones");

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  return (
    <Section aria-label={Label.List} header={<ZonesListHeader />}>
      {zonesCount > 0 && <ZonesListTable />}
    </Section>
  );
};

export default ZonesList;
