import { useEffect, type ReactNode } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { useOnEscapePressed } from "@canonical/react-components";
import classNames from "classnames";

import type { SidePanelSize } from "@/app/base/side-panel-context";
import { useSidePanel } from "@/app/base/side-panel-context";
import { history } from "@/redux-store";

export type AppSidePanelProps = {
  title: string | null;
  content?: ReactNode;
  size: SidePanelSize;
};

const useCloseSidePanelOnRouteChange = (): void => {
  const { setSidePanelContent } = useSidePanel();

  // close side panel on route change
  useEffect(() => {
    const unlisten = history.listen(() => setSidePanelContent(null));

    return () => {
      unlisten();
    };
  }, [setSidePanelContent]);
};

const useResetSidePanelOnUnmount = (): void => {
  const { setSidePanelSize } = useSidePanel();

  // reset side panel size to default on unmount
  useEffect(() => {
    return () => {
      setSidePanelSize("regular");
    };
  }, [setSidePanelSize]);
};

const useCloseSidePanelOnEscPressed = (): void => {
  const { setSidePanelContent } = useSidePanel();
  useOnEscapePressed(() => setSidePanelContent(null));
};

const AppSidePanelContent = ({
  title,
  size,
  content,
}: AppSidePanelProps): React.ReactElement => {
  return (
    <aside
      aria-label={title ?? undefined}
      className={classNames("l-aside", {
        "is-collapsed": !content,
        "is-narrow": size === "narrow",
        "is-large": size === "large",
        "is-wide": size === "wide",
      })}
      data-testid="app-side-panel"
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
        {content}
      </ContentSection>
    </aside>
  );
};

const AppSidePanel = (
  props: Omit<AppSidePanelProps, "size">
): React.ReactElement => {
  useCloseSidePanelOnEscPressed();
  useCloseSidePanelOnRouteChange();
  useResetSidePanelOnUnmount();
  const { sidePanelSize } = useSidePanel();

  return <AppSidePanelContent {...props} size={sidePanelSize} />;
};

export default AppSidePanel;
