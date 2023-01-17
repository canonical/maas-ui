import type { ReactNode } from "react";

import { Col, Row } from "@canonical/react-components";
import classNames from "classnames";
import { Portal } from "react-portal";

import { MAAS_UI_ID } from "app/constants";

type Props = {
  title?: string | null;
  size?: "wide" | "default" | "narrow";
  content?: ReactNode;
};

const AppSidePanel = ({ title, size, content }: Props): JSX.Element => (
  // display the app side panel as a child of #maas-ui DOM node no matter where it's rendered
  // TODO: https://warthogs.atlassian.net/browse/MAASENG-1245 - move setHeaderContent to the App component and remove this Portal workaround
  <Portal node={document && document.getElementById(MAAS_UI_ID)}>
    <aside
      aria-label={title ?? undefined}
      className={classNames("l-aside", {
        "is-collapsed": !content,
        "is-wide": size === "wide",
        "is-narrow": size === "narrow",
      })}
      data-testid="section-header-content"
      id="aside-panel"
    >
      <Row>
        <Col size={12}>
          {title ? (
            <div className="row section-header">
              <div className="col-12">
                <h3 className="section-header__title u-flex--no-shrink p-heading--4">
                  {title}
                </h3>
                <hr />
              </div>
            </div>
          ) : null}
          {content}
        </Col>
      </Row>
    </aside>
  </Portal>
);

export default AppSidePanel;
