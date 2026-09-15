import type { HTMLProps, ReactElement, ReactNode } from "react";
import { lazy, Suspense } from "react";

import { Layout } from "@canonical/maas-react-components";
import { AppStatus, Modal } from "@canonical/react-components";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { matchPath, useLocation } from "react-router";

import { useModal } from "../../modal-context";
import SecondaryNavigation from "../SecondaryNavigation";

import { useThemeContext } from "@/app/base/theme-context";
import { MAAS_UI_ID } from "@/app/constants";
import { preferencesNavItems } from "@/app/preferences/constants";
import { useSettingsNavItems } from "@/app/settings/hooks/useSettingsNavItems";
import status from "@/app/store/status/selectors";

const AppSideNavigation = lazy(() => import("../AppSideNavigation"));
const StatusBar = lazy(() => import("../StatusBar"));

export type AppLayoutProps = HTMLProps<HTMLDivElement> & {
  children?: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps): ReactElement => {
  const { pathname } = useLocation();
  const authenticated = useSelector(status.authenticated);
  const connected = useSelector(status.connected);
  const isSettingsPage = !!matchPath("settings/*", pathname);
  const isPreferencesPage = !!matchPath("account/prefs/*", pathname);
  const isSecondaryNavVisible =
    (isSettingsPage || isPreferencesPage) && authenticated && connected;
  const settingsNavItems = useSettingsNavItems();
  const { theme } = useThemeContext();
  const modal = useModal();

  return (
    <Layout
      id={MAAS_UI_ID}
      isSecondaryNavVisible={isSecondaryNavVisible}
      navigation={
        <Suspense fallback={null}>
          <AppSideNavigation />
        </Suspense>
      }
      pageTitle="MAAS"
      secondaryNavigation={
        isSecondaryNavVisible ? (
          <div
            className={classNames("l-main__nav", `is-maas-${theme}--accent`)}
          >
            <SecondaryNavigation
              isOpen
              items={isSettingsPage ? settingsNavItems : preferencesNavItems}
              title={isSettingsPage ? "Settings" : "My preferences"}
            />
          </div>
        ) : null
      }
      sidePanelTitles="auto"
      statusBar={
        authenticated ? (
          <AppStatus>
            <Suspense fallback={null}>
              <StatusBar />
            </Suspense>
          </AppStatus>
        ) : undefined
      }
      view={isSettingsPage || isPreferencesPage ? "settings" : "table"}
    >
      {modal.isOpen && modal.component ? (
        <Modal close={modal.closeModal} closeOnOutsideClick title={modal.title}>
          <modal.component {...modal.props}></modal.component>
        </Modal>
      ) : null}
      {children}
    </Layout>
  );
};

export default AppLayout;
