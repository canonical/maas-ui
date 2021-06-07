import { useEffect } from "react";

import { useDispatch } from "react-redux";

import ZonesListHeader from "../ZonesListHeader";
import ZonesListTable from "../ZonesListTable";

import Section from "app/base/components/Section";
import { actions } from "app/store/zone";

const ZonesList = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  return (
    <Section
      header={<ZonesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <ZonesListTable />
    </Section>
  );
};

export default ZonesList;
