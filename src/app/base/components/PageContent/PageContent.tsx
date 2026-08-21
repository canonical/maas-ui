import type { HTMLProps, ReactElement, ReactNode } from "react";

import { Col, Row } from "@canonical/react-components";

import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

export const MAIN_CONTENT_SECTION_ID = "main-content-section";

export type PageContentProps = HTMLProps<HTMLDivElement> & {
  children?: ReactNode;
  header?: ReactNode;
};

const PageContent = ({
  children,
  header,
  ...props
}: PageContentProps): ReactElement => {
  return (
    <div id="main-content">
      <div {...props} id={MAIN_CONTENT_SECTION_ID}>
        <div>
          {header ? (
            <header aria-label="main content" className="row">
              <Col size={12}>{header}</Col>
            </header>
          ) : null}
          <Row>
            <Col size={12}>
              <ErrorBoundary>{children}</ErrorBoundary>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PageContent;
