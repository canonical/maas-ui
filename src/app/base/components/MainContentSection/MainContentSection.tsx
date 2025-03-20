import type { HTMLProps, ReactNode } from "react";

import { Col, Row } from "@canonical/react-components";

import NotificationList from "@/app/base/components/NotificationList";

export type Props = HTMLProps<HTMLDivElement> & {
  children?: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  isNotificationListHidden?: boolean;
};

export const MAIN_CONTENT_SECTION_ID = "main-content-section";

const MainContentSection = ({
  children,
  header,
  ...props
}: Props): JSX.Element => {
  return (
    <div {...props} id={MAIN_CONTENT_SECTION_ID}>
      <div>
        {header ? (
          <header aria-label="main content" className="row">
            <Col size={12}>{header}</Col>
          </header>
        ) : null}
        <Row>
          <Col size={12}>
            <NotificationList />
            {children}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MainContentSection;
