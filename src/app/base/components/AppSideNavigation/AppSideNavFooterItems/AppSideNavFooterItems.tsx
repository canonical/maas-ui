import type { MouseEvent } from "react";

import { Navigation } from "@canonical/maas-react-components";
import { Badge, Button } from "@canonical/react-components";

import AppSideNavItem from "../AppSideNavItem";
import type { SideNavigationProps } from "../AppSideNavigation";
import LogoutConfirm from "../LogoutConfirm";

import type { CurrentUserInfo } from "@/app/api/query/auth";
import { useGetUserEntitlements } from "@/app/api/query/auth";
import { useAllNotifications } from "@/app/api/query/notifications";
import { useModal } from "@/app/base/modal-context";
import urls from "@/app/base/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { hasPermissions } from "@/app/utils/permissions";

type Props = {
  authUser: CurrentUserInfo | undefined;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  logout: () => void;
  path: string;
  setIsCollapsed: SideNavigationProps["setIsCollapsed"];
  toggleDarkMode: (isDark: boolean) => void;
};

export const AppSideNavFooterItems = ({
  authUser,
  isAuthenticated,
  isDarkMode,
  logout,
  path,
  setIsCollapsed,
  toggleDarkMode,
}: Props): React.ReactElement | null => {
  const { openModal } = useModal();
  const { data: userEntitlements } = useGetUserEntitlements();
  const notificationsPageEnabled =
    import.meta.env.VITE_APP_NOTIFICATIONS_PAGE === "true";
  const allNotifications = useAllNotifications({
    enabled: notificationsPageEnabled,
  });
  const notificationCount = allNotifications.data?.items.length ?? 0;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Navigation.List>
      {/* fully hidden (not just faded text) while the nav is collapsed, unlike the always-visible icons below */}
      <Navigation.Item className="is-fading-when-collapsed">
        <Navigation.Link
          appearance="link"
          as={Button}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            // allows the side navigation to collapse on mouseleave
            e.currentTarget.blur();
            toggleDarkMode(isDarkMode);
          }}
        >
          <Navigation.Icon
            name={isDarkMode ? "highlight-on" : "highlight-off"}
          />
          <Navigation.Label>{`${isDarkMode ? "Disable" : "Enable"} dark mode`}</Navigation.Label>
        </Navigation.Link>
      </Navigation.Item>
      <AppSideNavItem
        disabled={false}
        icon="profile"
        navLink={{
          label: `${authUser?.username}`,
          url: urls.preferences.index,
        }}
        path={path}
        setIsCollapsed={setIsCollapsed}
      />
      {notificationsPageEnabled ? (
        <AppSideNavItem
          disabled={
            !hasPermissions(userEntitlements, [
              Entitlement.CAN_VIEW_NOTIFICATIONS,
            ])
          }
          icon="notifications"
          navLink={{ label: "Notifications", url: urls.notifications.index }}
          path={path}
          setIsCollapsed={setIsCollapsed}
          status={
            notificationCount > 0 ? (
              <Badge
                aria-label={`${notificationCount} notifications`}
                className="notifications-count-badge"
                value={notificationCount}
              />
            ) : undefined
          }
        />
      ) : null}
      <Navigation.Item>
        <Navigation.Link
          appearance="link"
          as={Button}
          onClick={() => {
            openModal({
              component: LogoutConfirm,
              title: "Log out",
              props: { logout },
            });
          }}
        >
          <Navigation.Icon name="log-out" />
          <Navigation.Label>Log out</Navigation.Label>
        </Navigation.Link>
      </Navigation.Item>
    </Navigation.List>
  );
};

export default AppSideNavFooterItems;
