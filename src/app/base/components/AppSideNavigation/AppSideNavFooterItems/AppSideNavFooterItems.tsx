import type { MouseEvent } from "react";

import { Navigation } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import AppSideNavItem from "../AppSideNavItem";
import type { SideNavigationProps } from "../AppSideNavigation";
import LogoutConfirm from "../LogoutConfirm";

import type { CurrentUserInfo } from "@/app/api/query/auth";
import { useModal } from "@/app/base/modal-context";
import urls from "@/app/base/urls";

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
