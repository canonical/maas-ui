import PropTypes from "prop-types";

export const UserShape = PropTypes.shape({
  email: PropTypes.string.isRequired,
  global_permissions: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.number.isRequired,
  is_local: PropTypes.bool,
  is_superuser: PropTypes.bool.isRequired,
  last_name: PropTypes.string,
  last_login: PropTypes.string,
  machines_count: PropTypes.number,
  sshkeys_count: PropTypes.number,
  username: PropTypes.string.isRequired,
});
