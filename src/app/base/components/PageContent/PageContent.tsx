import type { HTMLProps, ReactNode } from "react";

import classNames from "classnames";
import { useSelector } from "react-redux";
import { matchPath, useLocation } from "react-router-dom-v5-compat";

import AppSidePanel from "../AppSidePanel";
import Footer from "../Footer";
import MainContentSection from "../MainContentSection";
import SecondaryNavigation from "../SecondaryNavigation";

import { useThemeContext } from "app/base/theme-context";
import { preferencesNavItems } from "app/preferences/constants";
import { settingsNavItems } from "app/settings/constants";
import status from "app/store/status/selectors";

export type Props = {
  children?: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  isNotificationListHidden?: boolean;
  sidePanelContent: React.ReactNode;
  sidePanelSize?: "wide";
  sidePanelTitle: string | null;
} & HTMLProps<HTMLDivElement>;

const PageContent = ({
  children,
  header,
  sidebar,
  isNotificationListHidden = false,
  sidePanelContent,
  sidePanelSize,
  sidePanelTitle,
  ...props
}: Props): JSX.Element => {
  const { pathname } = useLocation();
  const isSettingsPage = matchPath("settings/*", pathname);
  const isPreferencesPage = matchPath("account/prefs/*", pathname);
  const authenticated = useSelector(status.authenticated);
  const connected = useSelector(status.connected);
  const hasSecondaryNav = isSettingsPage || isPreferencesPage;
  const isSecondaryNavVisible = hasSecondaryNav && authenticated && connected;
  const { theme } = useThemeContext();

  return (
    <>
      <main className="l-main">
        {isSecondaryNavVisible ? (
          <div
            className={classNames("l-main__nav", `is-maas-${theme}--accent`)}
          >
            <SecondaryNavigation
              isOpen={!!isSecondaryNavVisible}
              items={
                isSettingsPage
                  ? settingsNavItems
                  : isPreferencesPage
                  ? preferencesNavItems
                  : []
              }
              title={
                isSettingsPage
                  ? "Settings"
                  : isPreferencesPage
                  ? "My preferences"
                  : ""
              }
            />
          </div>
        ) : null}
        <div className="l-main__content" id="main-content">
          <MainContentSection
            header={header}
            isNotificationListHidden={isNotificationListHidden}
            {...props}
          >
            {children}
          </MainContentSection>
          <hr />
          <Footer />
        </div>
      </main>
      <AppSidePanel
        content={sidePanelContent}
        size={sidePanelSize}
        title={sidePanelTitle}
      />
    </>
  );
};

export default PageContent;
