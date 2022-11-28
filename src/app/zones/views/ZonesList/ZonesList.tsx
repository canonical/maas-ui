import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import ZonesListHeader from "./ZonesListHeader";
import ZonesListTable from "./ZonesListTable";

import MainContentSection from "app/base/components/MainContentSection";
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
    <MainContentSection header={<ZonesListHeader />}>
      {zonesCount > 0 && <ZonesListTable />}
    </MainContentSection>
  );
};

export default ZonesList;
