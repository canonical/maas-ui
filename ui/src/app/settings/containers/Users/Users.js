import { BasicTable } from "@canonical/juju-react-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

import { UserShape } from "app/base/proptypes";
import baseSelectors from "app/base/selectors";

export const Users = ({ authUser, users }) => {
  const _generateUsers = users.map(user => ({
    columns: [
      {
        content: user.username
      },
      {
        content: 37
      },
      {
        content: "Local"
      },
      {
        content: "12 mins ago"
      },
      {
        content: user.is_superuser ? "Yes" : null
      },
      {
        classes: ["u-align--right"],
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
        )
      }
    ],
    key: `${user.id}`
  }));
  return (
    <>
      <h4>Users</h4>
      <BasicTable
        headers={[
          {
            content: "Username"
          },
          {
            content: "Number of nodes in use"
          },
          {
            content: "Type"
          },
          {
            content: "Last seen"
          },
          {
            content: "MAAS admin"
          },
          {
            classes: ["u-align--right"],
            content: "Actions"
          }
        ]}
        rows={_generateUsers}
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
      email: "NN7ER2rH6x@example.com",
      first_name: "",
      global_permissions: ["machine_create"],
      id: 1,
      is_superuser: true,
      last_name: "",
      sshkeys_count: 0,
      username: "admin"
    },
    {
      email: "NN7ER2rH6x@example.com",
      first_name: "",
      global_permissions: ["machine_create"],
      id: 2,
      is_superuser: false,
      last_name: "",
      sshkeys_count: 0,
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
