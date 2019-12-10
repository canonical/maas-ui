import { Button, Notification } from "@canonical/react-components";
import { Link } from "react-router-dom";
import { format, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

import "./UsersList.scss";
import { useAddMessage } from "app/base/hooks";
import { user as userActions } from "app/base/actions";
import {
  user as userSelectors,
  auth as authSelectors
} from "app/base/selectors";
import { status as statusSelectors } from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import Tooltip from "app/base/components/Tooltip";

const generateUserRows = (
  users,
  authUser,
  expandedId,
  setExpandedId,
  dispatch,
  displayUsername,
  setDeleting
) =>
  users.map(user => {
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
          role: "rowheader"
        },
        { content: user.email },
        { content: user.machines_count, className: "u-align--right" },
        { content: user.is_local && "Local" },
        { content: last_login || "Never" },
        {
          content: user.is_superuser ? "Admin" : "User"
        },
        {
          content: user.sshkeys_count,
          className: "u-align--right"
        },
        {
          content: (
            <>
              <Button
                appearance="base"
                element={Link}
                hasIcon
                to={
                  isAuthUser
                    ? "/account/prefs/details"
                    : `/settings/users/${user.id}/edit`
                }
                className="is-dense u-table-cell-padding-overlap"
              >
                <i className="p-icon--edit">Edit</i>
              </Button>
              <Tooltip
                position="left"
                message={isAuthUser && "You cannot delete your own user."}
              >
                <Button
                  appearance="base"
                  className="is-dense u-table-cell-padding-overlap"
                  hasIcon
                  onClick={() => setExpandedId(user.id)}
                  disabled={isAuthUser}
                >
                  <i className="p-icon--delete">Delete</i>
                </Button>
              </Tooltip>
            </>
          ),
          className: "u-align--right"
        }
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
        "maas-keys": user.sshkeys_count
      }
    };
  });

const Users = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [displayUsername, setDisplayUsername] = useState(true);
  const [deletingUser, setDeleting] = useState();
  const users = useSelector(state => userSelectors.search(state, searchText));
  const loading = useSelector(userSelectors.loading);
  const loaded = useSelector(userSelectors.loaded);
  const authUser = useSelector(authSelectors.get);
  const saved = useSelector(userSelectors.saved);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const dispatch = useDispatch();

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

  return (
    <SettingsTable
      buttons={[{ label: "Add user", url: "/settings/users/add" }]}
      defaultSort="username"
      headers={[
        {
          className: "p-table-multi-header",
          content: (
            <>
              <Button
                appearance="link"
                className={classNames("p-table-multi-header__link", {
                  "is-active": displayUsername
                })}
                onClick={() => setDisplayUsername(true)}
              >
                Username
              </Button>
              <span className="p-table-multi-header__spacer">|</span>
              <Button
                appearance="link"
                className={classNames("p-table-multi-header__link", {
                  "is-active": !displayUsername
                })}
                onClick={() => setDisplayUsername(false)}
              >
                Real name
              </Button>
            </>
          ),
          sortKey: displayUsername ? "username" : "fullName"
        },
        { content: "Email", sortKey: "email" },
        {
          content: "Machines",
          className: "u-align--right",
          sortKey: "machines"
        },
        {
          content: "Type",
          sortKey: "type"
        },
        {
          content: "Last seen",
          sortKey: "last-seen"
        },
        {
          content: "Role",
          sortKey: "role"
        },
        {
          content: "MAAS keys",
          className: "u-align--right",
          sortKey: "maas-keys"
        },
        {
          content: "Actions",
          className: "u-align--right"
        }
      ]}
      loaded={loaded}
      loading={loading}
      rows={generateUserRows(
        users,
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
