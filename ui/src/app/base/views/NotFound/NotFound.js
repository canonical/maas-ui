import PropTypes from "prop-types";
import React from "react";

import Section from "app/base/components/Section";

const NotFound = ({ includeSection = false }) => {
  const title = "Error: Page not found.";
  const message = `The requested URL ${window.location.pathname} was not found on this server.`;
  if (includeSection) {
    return (
      <Section title={title}>
        <h2 className="p-heading--four">{message}</h2>
      </Section>
    );
  }
  return (
    <>
      <h2 className="p-heading--four">{title}</h2>
      <p>{message}</p>
    </>
  );
};

NotFound.propTypes = {
  includeSection: PropTypes.bool
};

export default NotFound;
