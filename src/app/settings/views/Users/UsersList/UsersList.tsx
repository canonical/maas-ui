import { useEffect, useState } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import TableActions from "@/app/base/components/TableActions";
import TableHeader from "@/app/base/components/TableHeader";
import {
  useFetchActions,
  useTableSort,
  useWindowTitle,
} from "@/app/base/hooks";
import { SortDirection } from "@/app/base/types";
import urls from "@/app/base/urls";
import SettingsTable from "@/app/settings/components/SettingsTable";
import settingsURLs from "@/app/settings/urls";
import authSelectors from "@/app/store/auth/selectors";
import type { RootState } from "@/app/store/root/types";
import statusSelectors from "@/app/store/status/selectors";
import { userActions } from "@/app/store/user";
import userSelectors from "@/app/store/user/selectors";
import type { User } from "@/app/store/user/types";
import { isComparable } from "@/app/utils";
import { formatUtcDatetime } from "@/app/utils/time";

type SortKey = keyof User;

const generateUserRows = (
  users: User[],
  authUser: User | null,
  displayUsername: boolean
) =>
  users.map((user) => {
    const isAuthUser = user.id === authUser?.id;
    // Dates are in the format: Thu, 15 Aug. 2019 06:21:39.
    const last_login = user.last_login
      ? formatUtcDatetime(user.last_login)
      : "Never";
    const fullName = user.last_name;
    return {
      className: "p-table__row",
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
              deletePath={settingsURLs.users.delete({ id: user.id })}
              deleteTooltip={
                isAuthUser ? "You cannot delete your own user." : null
              }
              editPath={
                isAuthUser
                  ? urls.preferences.details
                  : settingsURLs.users.edit({ id: user.id })
              }
            />
          ),
          className: "u-align--right",
        },
      ],
      "data-testid": "user-row",
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

const UsersList = (): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const [displayUsername, setDisplayUsername] = useState(true);
  const users = useSelector((state: RootState) =>
    userSelectors.search(state, searchText)
  );
  const loading = useSelector(userSelectors.loading);
  const loaded = useSelector(userSelectors.loaded);
  const authUser = useSelector(authSelectors.get);
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

  useFetchActions([userActions.fetch]);

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
    <ContentSection>
      <ContentSection.Content>
        <SettingsTable
          buttons={[{ label: "Add user", url: settingsURLs.users.add }]}
          emptyStateMsg="No users available."
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
              className: "u-align--right u-no-wrap",
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
              className: "u-align--right u-no-wrap",
            },
            {
              content: "Actions",
              className: "u-align--right",
            },
          ]}
          loaded={loaded}
          loading={loading}
          rows={generateUserRows(sortedUsers, authUser, displayUsername)}
          searchOnChange={setSearchText}
          searchPlaceholder="Search users"
          searchText={searchText}
          tableClassName="user-list"
          title="Users"
        />
      </ContentSection.Content>
    </ContentSection>
  );
};

export default UsersList;
