import PropTypes from "prop-types";

export const AuthUserShape = PropTypes.shape({
  email: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  global_permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.number.isRequired,
  is_superuser: PropTypes.bool.isRequired,
  last_name: PropTypes.string.isRequired,
  sshkeys_count: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired
});
