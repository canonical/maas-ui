import { useEffect, useState } from "react";

import { Notification } from "@canonical/react-components";
import { format, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import TableActions from "app/base/components/TableActions";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import TableHeader from "app/base/components/TableHeader";
import { useAddMessage, useTableSort, useWindowTitle } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import prefsURLs from "app/preferences/urls";
import SettingsTable from "app/settings/components/SettingsTable";
import settingsURLs from "app/settings/urls";
import authSelectors from "app/store/auth/selectors";
import type { RootState } from "app/store/root/types";
import statusSelectors from "app/store/status/selectors";
import { actions as userActions } from "app/store/user";
import userSelectors from "app/store/user/selectors";
import type { User, UserMeta, UserState } from "app/store/user/types";
import { isComparable } from "app/utils";

type SortKey = keyof User;

const generateUserRows = (
  users: User[],
  authUser: User | null,
  expandedId: User[UserMeta.PK] | null,
  setExpandedId: (expandedId: User[UserMeta.PK] | null) => void,
  dispatch: Dispatch,
  displayUsername: boolean,
  setDeleting: (deletingUser: User["username"] | null) => void,
  saved: UserState["saved"],
  saving: UserState["saving"]
) =>
  users.map((user) => {
    const expanded = expandedId === user.id;
    const isAuthUser = user.id === authUser?.id;
    // Dates are in the format: Thu, 15 Aug. 2019 06:21:39.
    const last_login = user.last_login
      ? format(
          parse(user.last_login, "E, dd LLL. yyyy HH:mm:ss", new Date()),
          "yyyy-LL-dd H:mm"
        )
      : "Never";
    const fullName = user.last_name;
    return {
      className: expanded ? "p-table__row is-active" : "p-table__row",
      columns: [
        {
          content: displayUsername ? user.username : fullName || <>&mdash;</>,
          role: "rowheader",
        },
        { content: user.email, className: "u-break-word" },
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
              deleteTooltip={
                isAuthUser ? "You cannot delete your own user." : null
              }
              editPath={
                isAuthUser
                  ? prefsURLs.details
                  : settingsURLs.users.edit({ id: user.id })
              }
              onDelete={() => setExpandedId(user.id)}
            />
          ),
          className: "u-align--right",
        },
      ],
      "data-testid": "user-row",
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          deleted={saved}
          deleting={saving}
          modelName={user.username}
          modelType="user"
          onClose={() => setExpandedId(null)}
          onConfirm={() => {
            dispatch(userActions.delete(user.id));
            setDeleting(user.username);
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

const getSortValue = (sortKey: SortKey, user: User) => {
  const value = user[sortKey];
  return isComparable(value) ? value : null;
};

const Users = (): JSX.Element => {
  const [expandedId, setExpandedId] = useState<User[UserMeta.PK] | null>(null);
  const [searchText, setSearchText] = useState("");
  const [displayUsername, setDisplayUsername] = useState(true);
  const [deletingUser, setDeleting] = useState<User["username"] | null>(null);
  const users = useSelector((state: RootState) =>
    userSelectors.search(state, searchText)
  );
  const loading = useSelector(userSelectors.loading);
  const loaded = useSelector(userSelectors.loaded);
  const authUser = useSelector(authSelectors.get);
  const saved = useSelector(userSelectors.saved);
  const saving = useSelector(userSelectors.saving);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const dispatch = useDispatch();

  const { currentSort, sortRows, updateSort } = useTableSort<User, SortKey>(
    getSortValue,
    {
      key: "username",
      direction: SortDirection.DESCENDING,
    }
  );

  const sortedUsers = sortRows(users);

  useWindowTitle("Users");

  useAddMessage(
    saved,
    userActions.cleanup,
    `${deletingUser} removed successfully.`,
    () => setDeleting(null)
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
      <Notification severity="information">
        Users for this MAAS are managed using an external service
      </Notification>
    );
  }

  return (
    <SettingsTable
      buttons={[{ label: "Add user", url: settingsURLs.users.add }]}
      headers={[
        {
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="username-header"
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
                data-testid="real-name-header"
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
              data-testid="email-header"
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
              data-testid="machines-count-header"
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
        setDeleting,
        saved,
        saving
      )}
      searchOnChange={setSearchText}
      searchPlaceholder="Search users"
      searchText={searchText}
      tableClassName="user-list"
    />
  );
};

export default Users;
