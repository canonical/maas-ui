import { PropTypes } from "prop-types";

export const DhcpSnippetShape = PropTypes.shape({
  created: PropTypes.string.isRequired,
  description: PropTypes.string,
  enabled: PropTypes.bool,
  history: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  node: PropTypes.string,
  subnet: PropTypes.number,
  updated: PropTypes.string.isRequired,
  value: PropTypes.string,
});
