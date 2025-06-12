import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { useGetCurrentUser } from "@/app/api/query/auth";
import type { UserWithSummaryResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import TableHeader from "@/app/base/components/TableHeader";
import TooltipButton from "@/app/base/components/TooltipButton";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import { UserActionSidePanelViews } from "@/app/settings/views/Users/constants";

type UsersColumnDef = ColumnDef<
  UserWithSummaryResponse,
  Partial<UserWithSummaryResponse>
>;

const useUsersTableColumns = (): UsersColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();
  const authUser = useGetCurrentUser();
  const [isDisplayingUsername, setIsDisplayingUsername] = useState(true);
  return useMemo(
    () =>
      [
        {
          id: "username",
          accessorKey: "username",
          enableSorting: true,
          header: () => {
            return (
              <>
                <TableHeader
                  data-testid="username-header"
                  onClick={() => {
                    setIsDisplayingUsername(true);
                  }}
                  sortKey="username"
                >
                  Username
                </TableHeader>
                &nbsp;<strong>|</strong>&nbsp;
                <TableHeader
                  data-testid="real-name-header"
                  onClick={() => {
                    setIsDisplayingUsername(false);
                  }}
                  sortKey="last_name"
                >
                  Real name
                </TableHeader>
              </>
            );
          },
          cell: ({
            row: {
              original: { username, last_name },
            },
          }) => {
            return isDisplayingUsername ? username : last_name || <>&mdash;</>;
          },
        },
        {
          id: "email",
          accessorKey: "email",
          enableSorting: true,
          header: "Email",
        },
        {
          id: "machines_count",
          accessorKey: "machines_count",
          enableSorting: true,
          header: "Machines",
        },
        {
          id: "is_local",
          accessorKey: "is_local",
          enableSorting: true,
          header: "Local",
          cell: ({
            row: {
              original: { is_local },
            },
          }) =>
            is_local ? (
              <TooltipButton
                iconName="task-outstanding"
                iconProps={{ "aria-label": "supported" }}
                message="This is a local user."
              />
            ) : (
              <TooltipButton
                iconName="close"
                iconProps={{ "aria-label": "not supported" }}
                message="This is not a local user."
              />
            ),
        },
        {
          id: "last_login",
          accessorKey: "last_login",
          enableSorting: true,
          header: "Last seen",
          cell: ({
            row: {
              original: { last_login },
            },
          }) => {
            if (!last_login) return "Never";
            return (
              new Date(last_login)
                .toLocaleString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  timeZone: "UTC",
                  hour12: false,
                })
                .replace(",", "")
                .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:$3") + " (UTC)"
            );
          },
        },
        {
          id: "is_superuser",
          accessorKey: "is_superuser",
          enableSorting: true,
          header: "Role",
          cell: ({
            row: {
              original: { is_superuser },
            },
          }) => (is_superuser ? "Admin" : "User"),
        },
        {
          id: "sshkeys_count",
          accessorKey: "sshkeys_count",
          enableSorting: true,
          header: "MAAS keys",
        },
        {
          id: "action",
          accessorKey: "id",
          enableSorting: false,
          header: "Action",
          cell: ({
            row: {
              original: { id },
            },
          }) => {
            const isAuthUser = id === authUser.data?.id;
            return (
              <TableActions
                data-testid="user-actions"
                deleteDisabled={isAuthUser}
                deleteTooltip={
                  isAuthUser ? "You cannot delete your own user." : null
                }
                editPath={isAuthUser ? urls.preferences.details : undefined}
                onDelete={() => {
                  setSidePanelContent({
                    view: UserActionSidePanelViews.DELETE_USER,
                    extras: {
                      userId: id,
                    },
                  });
                }}
                onEdit={
                  !isAuthUser
                    ? () => {
                        setSidePanelContent({
                          view: UserActionSidePanelViews.EDIT_USER,
                          extras: {
                            userId: id,
                          },
                        });
                      }
                    : undefined
                }
              />
            );
          },
        },
      ] as UsersColumnDef[],
    [authUser.data?.id, isDisplayingUsername, setSidePanelContent]
  );
};

export default useUsersTableColumns;
