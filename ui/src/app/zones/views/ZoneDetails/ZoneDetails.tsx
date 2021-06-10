import { useParams } from "react-router";

import ZoneDetailsHeader from "./ZoneDetailsHeader";

import Section from "app/base/components/Section";
import type { RouteParams } from "app/base/types";

const ZoneDetails = (): JSX.Element => {
  const { id } = useParams<RouteParams>();

  return (
    <Section
      header={<ZoneDetailsHeader id={parseInt(id)} />}
      headerClassName="u-no-padding--bottom"
    />
  );
};

export default ZoneDetails;
