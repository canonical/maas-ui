import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";

import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import baseSelectors from "app/base/selectors";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";

const generateUserRows = (users, authUser) =>
  users.map(user => ({
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
    key: user.username,
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

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectors.users.get);
  const loading = useSelector(selectors.users.loading);
  const authUser = useSelector(baseSelectors.auth.getAuthUser);

  useEffect(() => {
    dispatch(actions.users.fetch());
  }, [dispatch]);

  return (
    <>
      <h4>
        Users
        {loading && <Loader text="Loading..." inline />}
      </h4>
      {!loading && (
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
          rows={generateUserRows(users, authUser)}
          sortable={true}
        />
      )}
    </>
  );
};

export default Users;
