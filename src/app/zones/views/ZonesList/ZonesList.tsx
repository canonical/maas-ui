import { useSelector } from "react-redux";

import ZonesListHeader from "./ZonesListHeader";
import ZonesListTable from "./ZonesListTable";

import MainContentSection from "app/base/components/MainContentSection";
import { useFetchActions, useWindowTitle } from "app/base/hooks";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

const ZonesList = (): JSX.Element => {
  const zonesCount = useSelector(zoneSelectors.count);

  useWindowTitle("Zones");

  useFetchActions([actions.fetch]);

  return (
    <MainContentSection header={<ZonesListHeader />}>
      {zonesCount > 0 && <ZonesListTable />}
    </MainContentSection>
  );
};

export default ZonesList;
