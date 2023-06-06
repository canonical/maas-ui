import type { HTMLProps, ReactNode } from "react";

import classNames from "classnames";
import { useSelector } from "react-redux";
import { Outlet, matchPath, useLocation } from "react-router-dom-v5-compat";

import AppSidePanel from "../AppSidePanel";
import Footer from "../Footer";
import MainContentSection from "../MainContentSection";
import SecondaryNavigation from "../SecondaryNavigation";

import { preferencesNavItems } from "app/preferences/constants";
import { settingsNavItems } from "app/settings/constants";
import configSelectors from "app/store/config/selectors";

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
  const isSideNavVisible = isSettingsPage || isPreferencesPage;
  const maasTheme = useSelector(configSelectors.theme);

  return (
    <>
      <main className="l-main">
        {isSideNavVisible ? (
          <div
            className={classNames(
              "l-main__nav",
              `is-maas-${maasTheme}--accent`
            )}
          >
            <SecondaryNavigation
              isOpen={!!isSideNavVisible}
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

// eslint-disable-next-line react/no-multi-comp
export const LegacyPageContentWrapper = (): JSX.Element => {
  const { pathname } = useLocation();
  const isSettingsPage = matchPath("settings/*", pathname);
  const isPreferencesPage = matchPath("account/prefs/*", pathname);
  const isSideNavVisible = isSettingsPage || isPreferencesPage;
  const theme = useSelector(configSelectors.theme);

  return (
    <main className="l-main">
      {isSideNavVisible ? (
        <div className={classNames("l-main__nav", `is-maas-${theme}--accent`)}>
          <SecondaryNavigation
            isOpen={!!isSideNavVisible}
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
        <Outlet />
        <hr />
        <Footer />
      </div>
    </main>
  );
};

export default PageContent;
