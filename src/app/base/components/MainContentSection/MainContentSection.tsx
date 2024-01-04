import type { HTMLProps, ReactNode } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Col, Row } from "@canonical/react-components";
import type { ColSize } from "@canonical/react-components";

import NotificationList from "app/base/components/NotificationList";
import { COL_SIZES } from "app/base/constants";

export type Props = {
  children?: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  isNotificationListHidden?: boolean;
} & HTMLProps<HTMLDivElement>;

const MainContentSection = ({
  children,
  header,
  sidebar,
  isNotificationListHidden = false,
  ...props
}: Props): JSX.Element => {
  const { SIDEBAR, TOTAL } = COL_SIZES;
  return (
    <div {...props} id="main-content-section">
      <ContentSection>
        {header ? (
          <ContentSection.Header>{header}</ContentSection.Header>
        ) : null}
        <Row>
          {sidebar && (
            <Col className="section__sidebar" element="aside" size={SIDEBAR}>
              {sidebar}
            </Col>
          )}
          <Col size={(sidebar ? TOTAL - SIDEBAR : TOTAL) as ColSize}>
            <ContentSection.Content>
              {!isNotificationListHidden && <NotificationList />}
              {children}
            </ContentSection.Content>
          </Col>
        </Row>
      </ContentSection>
    </div>
  );
};

export default MainContentSection;
