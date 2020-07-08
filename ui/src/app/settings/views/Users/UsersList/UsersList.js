import { Notification } from "@canonical/react-components";
import { format, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import authSelectors from "app/store/auth/selectors";
import { useAddMessage } from "app/base/hooks";
import { user as userActions } from "app/base/actions";
import userSelectors from "app/store/user/selectors";
import statusSelectors from "app/store/status/selectors";
import { useWindowTitle } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import TableActions from "app/base/components/TableActions";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import TableHeader from "app/base/components/TableHeader";

const generateUserRows = (
  users,
  authUser,
  expandedId,
  setExpandedId,
  dispatch,
  displayUsername,
  setDeleting
) =>
  users.map((user) => {
    const expanded = expandedId === user.id;
    const isAuthUser = user.id === authUser.id;
    // Dates are in the format: Thu, 15 Aug. 2019 06:21:39.
    const last_login = user.last_login
      ? format(
          parse(user.last_login, "E, dd LLL. yyyy HH:mm:ss", new Date()),
          "yyyy-LL-dd H:mm"
        )
      : "Never";
    const fullName = user.last_name;
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: displayUsername ? user.username : fullName || <>&mdash;</>,
          role: "rowheader",
        },
        { content: user.email },
        { content: user.machines_count, className: "u-align--right" },
        { content: user.is_local && "Local" },
        { content: last_login || "Never" },
        {
          content: user.is_superuser ? "Admin" : "User",
        },
        {
          content: user.sshkeys_count,
          className: "u-align--right",
        },
        {
          content: (
            <TableActions
              deleteDisabled={isAuthUser}
              deleteTooltip={isAuthUser && "You cannot delete your own user."}
              editPath={
                isAuthUser
                  ? "/account/prefs/details"
                  : `/settings/users/${user.id}/edit`
              }
              onDelete={() => setExpandedId(user.id)}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          modelName={user.username}
          modelType="user"
          onCancel={setExpandedId}
          onConfirm={() => {
            dispatch(userActions.delete(user.id));
            setDeleting(user.username);
            setExpandedId();
          }}
        />
      ),
      key: user.username,
      sortData: {
        username: user.username,
        fullName: fullName,
        email: user.email,
        machines: user.machines_count,
        type: user.is_local && "local",
        "last-seen": last_login,
        role: user.is_superuser ? "admin" : "user",
        "maas-keys": user.sshkeys_count,
      },
    };
  });

const userSort = (currentSort) => {
  const { key, direction } = currentSort;

  return function (a, b) {
    if (direction === "none") {
      return 0;
    }
    if (a[key] < b[key]) {
      return direction === "descending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === "descending" ? 1 : -1;
    }
    return 0;
  };
};

const Users = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [displayUsername, setDisplayUsername] = useState(true);
  const [deletingUser, setDeleting] = useState();
  const [currentSort, setCurrentSort] = useState({
    key: "username",
    direction: "descending",
  });
  const users = useSelector((state) => userSelectors.search(state, searchText));
  const loading = useSelector(userSelectors.loading);
  const loaded = useSelector(userSelectors.loaded);
  const authUser = useSelector(authSelectors.get);
  const saved = useSelector(userSelectors.saved);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const dispatch = useDispatch();

  const sortedUsers = users.sort(userSort(currentSort));

  useWindowTitle("Users");

  useAddMessage(
    saved,
    userActions.cleanup,
    `${deletingUser} removed successfully.`,
    setDeleting
  );

  useEffect(() => {
    dispatch(userActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(userActions.cleanup());
    };
  }, [dispatch]);

  if (externalAuthURL) {
    return (
      <Notification type="information">
        Users for this MAAS are managed using an external service
      </Notification>
    );
  }

  // Update sort parameters depending on whether the same sort key was clicked.
  const updateSort = (newSortKey) => {
    const { key, direction } = currentSort;

    if (newSortKey === key) {
      if (direction === "ascending") {
        setCurrentSort({ key: "", direction: "none" });
      } else {
        setCurrentSort({ key, direction: "ascending" });
      }
    } else {
      setCurrentSort({ key: newSortKey, direction: "descending" });
    }
  };

  return (
    <SettingsTable
      buttons={[{ label: "Add user", url: "/settings/users/add" }]}
      headers={[
        {
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-test="username-header"
                onClick={() => {
                  setDisplayUsername(true);
                  updateSort("username");
                }}
                sortKey="username"
              >
                Username
              </TableHeader>
              &nbsp;<strong>|</strong>&nbsp;
              <TableHeader
                currentSort={currentSort}
                data-test="real-name-header"
                onClick={() => {
                  setDisplayUsername(false);
                  updateSort("last_name");
                }}
                sortKey="last_name"
              >
                Real name
              </TableHeader>
            </>
          ),
        },
        {
          content: (
            <TableHeader
              currentSort={currentSort}
              data-test="email-header"
              onClick={() => updateSort("email")}
              sortKey="email"
            >
              Email
            </TableHeader>
          ),
        },
        {
          content: (
            <TableHeader
              currentSort={currentSort}
              data-test="machines-count-header"
              onClick={() => updateSort("machines_count")}
              sortKey="machines_count"
            >
              Machines
            </TableHeader>
          ),
          className: "u-align--right",
        },
        {
          content: "Type",
        },
        {
          content: "Last seen",
        },
        {
          content: "Role",
        },
        {
          content: "MAAS keys",
          className: "u-align--right",
        },
        {
          content: "Actions",
          className: "u-align--right",
        },
      ]}
      loaded={loaded}
      loading={loading}
      rows={generateUserRows(
        sortedUsers,
        authUser,
        expandedId,
        setExpandedId,
        dispatch,
        displayUsername,
        setDeleting
      )}
      searchOnChange={setSearchText}
      searchPlaceholder="Search users"
      searchText={searchText}
      tableClassName="user-list"
    />
  );
};

export default Users;
