import { useEffect } from "react";

import pluralize from "pluralize";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import dashboardURLs from "app/dashboard/urls";
import { actions as discoveryActions } from "app/store/discovery";
import discoverySelectors from "app/store/discovery/selectors";

const DashboardHeader = (): JSX.Element => {
  const location = useLocation();
  const dispatch = useDispatch();
  const discoveries = useSelector(discoverySelectors.all);

  useEffect(() => {
    dispatch(discoveryActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      title="Network discovery"
      tabLinks={[
        {
          active: location.pathname === dashboardURLs.index,
          component: Link,
          label: pluralize("discovery", discoveries.length, true),
          to: dashboardURLs.index,
        },
        {
          active: location.pathname === dashboardURLs.configuration,
          component: Link,
          label: "Configuration",
          to: dashboardURLs.configuration,
        },
      ]}
    />
  );
};

export default DashboardHeader;
