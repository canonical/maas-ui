import React from "react";

import HeaderStrip from "app/machines/components/HeaderStrip";
import Routes from "app/machines/components/Routes";
import Section from "app/base/components/Section";

const Machines = () => (
  <Section headerClassName="u-no-padding--bottom" title={<HeaderStrip />}>
    <Routes />
  </Section>
);

export default Machines;
