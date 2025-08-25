import type { ReactElement } from "react";
import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { AppAside, useOnEscapePressed } from "@canonical/react-components";
import classNames from "classnames";
import { useLocation } from "react-router";

import { useSidePanel } from "@/app/base/side-panel-context";

const useCloseSidePanelOnRouteChange = (): void => {
  const location = useLocation();
  const { close } = useSidePanel();

  useEffect(
    () => {
      close();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname, location.search, location.hash]
  );
};

const useResetSidePanelOnUnmount = (): void => {
  const { setSize } = useSidePanel();

  // reset side panel size to default on unmounting
  useEffect(
    () => {
      return () => {
        setSize("regular");
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

const useCloseSidePanelOnEscPressed = (): void => {
  const { close } = useSidePanel();
  useOnEscapePressed(() => {
    close();
  });
};

const AppSidePanel = (): ReactElement => {
  useCloseSidePanelOnEscPressed();
  useCloseSidePanelOnRouteChange();
  useResetSidePanelOnUnmount();

  const { isOpen, title, component: Component, props, size } = useSidePanel();

  return (
    <AppAside
      aria-label={title ?? undefined}
      className={classNames({
        "is-narrow": size === "narrow",
        "is-large": size === "large",
        "is-wide": size === "wide",
      })}
      collapsed={!isOpen}
      id="aside-panel"
    >
      <ContentSection>
        {title ? (
          <div className="row section-header section-header--side-panel">
            <div className="col-12">
              <h3 className="section-header__title u-flex--no-shrink p-heading--4">
                {title}
              </h3>
            </div>
          </div>
        ) : null}
        {isOpen && Component && <Component {...props} />}
      </ContentSection>
    </AppAside>
  );
};

export default AppSidePanel;
