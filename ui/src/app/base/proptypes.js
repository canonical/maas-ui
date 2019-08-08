import PropTypes from "prop-types";

export const UserShape = PropTypes.shape({
  email: PropTypes.string.isRequired,
  first_name: PropTypes.string,
  global_permissions: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.number.isRequired,
  is_superuser: PropTypes.bool.isRequired,
  last_name: PropTypes.string,
  sshkeys_count: PropTypes.number,
  username: PropTypes.string.isRequired
});
