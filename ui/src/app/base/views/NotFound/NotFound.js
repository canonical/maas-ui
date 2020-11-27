import PropTypes from "prop-types";

import { useWindowTitle } from "app/base/hooks";
import Section from "app/base/components/Section";

const NotFound = ({ includeSection = false }) => {
  const title = "Error: Page not found.";
  useWindowTitle(title);
  const message = `The requested URL ${window.location.pathname} was not found on this server.`;
  if (includeSection) {
    return (
      <Section header={title}>
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
  includeSection: PropTypes.bool,
};

export default NotFound;
