import { useEffect, type ReactNode } from "react";

import { Col, Row, useOnEscapePressed } from "@canonical/react-components";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import TooltipButton from "../TooltipButton/TooltipButton";

import type {
  SidePanelContent,
  SidePanelSize,
} from "app/base/side-panel-context";
import { SidePanelViews, useSidePanel } from "app/base/side-panel-context";

export type AppSidePanelProps = {
  title: string | null;
  content?: ReactNode;
  size: SidePanelSize;
  sidePanelContent: SidePanelContent;
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
          <TooltipButton
            iconName="information"
            message={
              <>
                A soft power off generally asks the OS to
                <br />
                shutdown the system gracefully before powering off. <br />
                It is only supported by IPMI
              </>
            }
          />
        );
      case SidePanelViews.POWER_OFF_MACHINE[1]:
        return (
          <TooltipButton
            iconName="information"
            message={
              <>
                Power off will perform a hard power off, which occurs
                immediately <br />
                without any warning to the OS.
              </>
            }
          />
        );
      default:
        return <></>;
    }
  } else {
    return <></>;
  }
};

const AppSidePanelContent = ({
  title,
  size,
  content,
  sidePanelContent,
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
                <div className="u-flex--align-center section-header__title">
                  <h3 className="u-no-margin--bottom u-no-padding--top u-nudge-left--small u-flex--no-shrink p-heading--4">
                    {title}
                  </h3>
                  {getSidepanelIcon(sidePanelContent)}
                </div>
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

const AppSidePanel = (
  props: Omit<AppSidePanelProps, "size" | "sidePanelContent">
): JSX.Element => {
  useCloseSidePanelOnEscPressed();
  useCloseSidePanelOnRouteChange();
  useResetSidePanelOnUnmount();
  const { sidePanelSize, sidePanelContent } = useSidePanel();

  return (
    <AppSidePanelContent
      {...props}
      sidePanelContent={sidePanelContent}
      size={sidePanelSize}
    />
  );
};

export default AppSidePanel;
