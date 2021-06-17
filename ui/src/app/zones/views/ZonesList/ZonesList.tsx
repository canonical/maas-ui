import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import ZonesListHeader from "./ZonesListHeader";
import ZonesListTable from "./ZonesListTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

const ZonesList = (): JSX.Element => {
  const dispatch = useDispatch();
  const zonesCount = useSelector(zoneSelectors.count);

  useWindowTitle("Zones");

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  return (
    <Section
      header={<ZonesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      {zonesCount > 0 && <ZonesListTable />}
    </Section>
  );
};

export default ZonesList;
