import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import DiscoveriesListHeader from "../DiscoveriesListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";
import { actions } from "app/store/discovery";
import discoverySelectors from "app/store/discovery/selectors";

const DashboardConfigurationForm = (): JSX.Element => {
  useWindowTitle("Dashboard");

  const discoveries = useSelector(discoverySelectors.all);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  console.log("discoveries", discoveries);

  return (
    <Section
      header={<DiscoveriesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <NetworkDiscoveryForm />
    </Section>
  );
};

export default DashboardConfigurationForm;
