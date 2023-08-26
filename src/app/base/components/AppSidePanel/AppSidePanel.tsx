import { useEffect, type ReactNode } from "react";

import {
  Col,
  Icon,
  Row,
  Tooltip,
  useOnEscapePressed,
} from "@canonical/react-components";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import type {
  SidePanelContent,
  SidePanelSize,
} from "app/base/side-panel-context";
import { SidePanelViews, useSidePanel } from "app/base/side-panel-context";

export type AppSidePanelProps = {
  title: string | null;
  content?: ReactNode;
  size: SidePanelSize;
  iconComponent?: ReactNode;
};

const useCloseSidePanelOnRouteChange = (): void => {
  const { setSidePanelContent } = useSidePanel();
  const history = useHistory();

  // close side panel on route change
  useEffect(() => {
    const unlisten = history.listen(() => setSidePanelContent(null));

    return () => {
      unlisten();
    };
  }, [history, setSidePanelContent]);
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

export const getSidepanelIcon = (sidePanelContent: SidePanelContent | null) => {
  if (sidePanelContent) {
    const [, name] = sidePanelContent.view;
    switch (name) {
      case SidePanelViews.POWER_OFF_MACHINE_SOFT[1]:
        return (
          <Tooltip
            message={
              <>
                A soft power off generally asks the OS to shutdown the system
                gracefully before powering off. It is only supported by IPMI
              </>
            }
            position="right"
          >
            <Icon name="information" />
          </Tooltip>
        );
      default:
        return <></>;
    }
  }
};

const AppSidePanelContent = ({
  title,
  size,
  content,
  iconComponent,
}: AppSidePanelProps): JSX.Element => {
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
      <Row>
        <Col size={12}>
          {title ? (
            <div className="row section-header">
              <div className="col-12">
                <h3 className="section-header__title u-flex--no-shrink p-heading--4">
                  {title} {iconComponent}
                </h3>
                <hr />
              </div>
            </div>
          ) : null}
          {content}
        </Col>
      </Row>
    </aside>
  );
};

const AppSidePanel = (props: Omit<AppSidePanelProps, "size">): JSX.Element => {
  useCloseSidePanelOnEscPressed();
  useCloseSidePanelOnRouteChange();
  useResetSidePanelOnUnmount();
  const { sidePanelSize } = useSidePanel();

  return <AppSidePanelContent {...props} size={sidePanelSize} />;
};

export default AppSidePanel;
