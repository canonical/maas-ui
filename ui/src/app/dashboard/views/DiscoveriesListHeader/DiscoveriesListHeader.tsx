import { Link, useLocation } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import dashboardURLs from "app/dashboard/urls";

const DiscoveriesListHeader = (): JSX.Element => {
  const location = useLocation();

  return (
    <SectionHeader
      title="Network discovery"
      tabLinks={[
        {
          active: location.pathname === dashboardURLs.index,
          component: Link,
          label: "Discoveries",
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

export default DiscoveriesListHeader;
