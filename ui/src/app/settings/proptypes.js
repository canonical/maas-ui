import { PropTypes } from "prop-types";

export const RepositoryShape = PropTypes.shape({
  arches: PropTypes.arrayOf(PropTypes.string).isRequired,
  components: PropTypes.array.isRequired,
  created: PropTypes.string.isRequired,
  default: PropTypes.bool,
  disable_sources: PropTypes.bool,
  disabled_components: PropTypes.array.isRequired,
  disabled_pockets: PropTypes.array.isRequired,
  distributions: PropTypes.array.isRequired,
  enabled: PropTypes.bool,
  id: PropTypes.number.isRequired,
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
});

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
  value: PropTypes.string
});
