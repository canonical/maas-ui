import type { ReactNode } from "react";

import { Col, Row, useOnEscapePressed } from "@canonical/react-components";
import classNames from "classnames";

import { useSidePanel } from "app/base/side-panel-context";

type Props = {
  title?: string | null;
  size?: "wide" | "default" | "narrow";
  content?: ReactNode;
};

const AppSidePanel = ({
  title,
  size,
  content,
}: Props & { title: string | null }): JSX.Element => {
  const { setSidePanelContent } = useSidePanel();
  useOnEscapePressed(() => setSidePanelContent(null));
  return (
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
  );
};

export default AppSidePanel;
