import DiscoveriesListHeader from "../DiscoveriesListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";

const DiscoveriesList = (): JSX.Element => {
  useWindowTitle("Dashboard");

  return (
    <Section
      header={<DiscoveriesListHeader />}
      headerClassName="u-no-padding--bottom"
    />
  );
};

export default DiscoveriesList;
