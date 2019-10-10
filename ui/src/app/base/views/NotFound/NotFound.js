import React from "react";

import Section from "app/base/components/Section";

const NotFound = () => (
  <Section title="Error: Page not found">
    <h2 className="p-heading--four">
      The requested URL {window.location.pathname} was not found on this server.
    </h2>
  </Section>
);

export default NotFound;
