import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

import { UserShape } from "app/base/proptypes";
import baseSelectors from "app/base/selectors";
import MainTable from "app/base/components/MainTable";

export const Users = ({ authUser, users }) => {
  const userRows = users.map(user => ({
    columns: [
      { content: user.username, role: "rowheader" },
      { content: user.email },
      { content: 37, className: "u-align--right" },
      { content: "Local" },
      { content: "12 mins ago" },
      { content: user.is_superuser ? "Admin" : null },
      { content: user.sshkeys_count, className: "u-align--right" },
      {
        content: (
          <>
            <Link
              to={`/users/${user.id}/edit`}
              className="p-button--base is-small"
            >
              <i className="p-icon--edit">Edit</i>
            </Link>
            {user.id !== authUser.id && (
              <Link
                to={`/users/${user.id}/delete`}
                className="p-button--base is-small"
              >
                <i className="p-icon--delete">Delete</i>
              </Link>
            )}
          </>
        ),
        className: "u-align--right"
      }
    ],
    sortData: {
      username: user.username,
      email: user.email,
      machines: 37,
      type: "local",
      "last-seen": "2018-05-12",
      role: user.is_superuser ? "Admin" : null,
      "maas-keys": user.sshkeys_count
    }
  }));
  return (
    <>
      <h4>Users</h4>
      <MainTable
        defaultSort="username"
        defaultSortDirection="ascending"
        headers={[
          { content: "Username", sortKey: "username" },
          { content: "Email", sortKey: "email" },
          {
            content: "Machines",
            className: "u-align--right",
            sortKey: "machines"
          },
          { content: "Type", sortKey: "type" },
          { content: "Last seen", sortKey: "last-seen" },
          { content: "Role", sortKey: "role" },
          {
            content: "MAAS keys",
            className: "u-align--right",
            sortKey: "maas-keys"
          },
          { content: "Actions", className: "u-align--right" }
        ]}
        rows={userRows}
        sortable={true}
      />
    </>
  );
};

Users.propTypes = {
  authUser: UserShape.isRequired,
  users: PropTypes.arrayOf(UserShape)
};

Users.defaultProps = {
  users: [
    {
      email: "admin@example.com",
      first_name: "",
      global_permissions: ["machine_create"],
      id: 1,
      is_superuser: true,
      last_name: "",
      sshkeys_count: 2,
      username: "admin"
    },
    {
      email: "simon@example.com",
      first_name: "",
      global_permissions: ["machine_create"],
      id: 2,
      is_superuser: false,
      last_name: "",
      sshkeys_count: 9,
      username: "simon"
    }
  ]
};

const mapStateToProps = (state, props) => {
  return {
    authUser: baseSelectors.auth.getAuthUser(state, props)
  };
};

export default connect(
  mapStateToProps,
  {}
)(Users);
