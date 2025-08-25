import type { ReactElement } from "react";
import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { AppAside, useOnEscapePressed } from "@canonical/react-components";
import classNames from "classnames";

import { useSidePanel } from "@/app/base/side-panel-context";
import { history } from "@/redux-store";

const useCloseSidePanelOnRouteChange = (): void => {
  const { close } = useSidePanel();

  // close side panel on route change
  useEffect(() => {
    const unlisten = history.listen(() => {
      close();
    });

    return () => {
      unlisten();
    };
  }, [close]);
};

const useResetSidePanelOnUnmount = (): void => {
  const { setSize } = useSidePanel();

  // reset side panel size to default on unmounting
  useEffect(() => {
    return () => {
      setSize("regular");
    };
  }, [setSize]);
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
