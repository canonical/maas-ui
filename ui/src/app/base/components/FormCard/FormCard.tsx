import type { ReactNode } from "react";

import { Card, Col, Row } from "@canonical/react-components";
import type { ClassName, ColSize } from "@canonical/react-components";
import classNames from "classnames";

import { COL_SIZES } from "app/base/constants";

type Props = {
  children: ReactNode;
  className?: ClassName;
  sidebar?: boolean;
  stacked?: boolean;
  title?: ReactNode;
};

const getContentSize = (sidebar: boolean, title: ReactNode) => {
  const { CARD_TITLE, SIDEBAR, TOTAL } = COL_SIZES;
  let contentSize = TOTAL;
  if (sidebar) {
    contentSize -= SIDEBAR;
  }
  if (title) {
    contentSize -= CARD_TITLE;
  }
  return contentSize as ColSize;
};

export const FormCard = ({
  children,
  className,
  sidebar = true,
  stacked,
  title,
}: Props): JSX.Element => {
  const { CARD_TITLE } = COL_SIZES;
  const contentSize = getContentSize(sidebar, title);
  const titleNode =
    typeof title === "string" ? (
      <h4 className="form-card__title">{title}</h4>
    ) : (
      title
    );
  const content = stacked ? (
    <>
      {titleNode}
      {children}
    </>
  ) : (
    <Row>
      {title && <Col size={CARD_TITLE}>{titleNode}</Col>}
      <Col data-test="content" size={contentSize}>
        {children}
      </Col>
    </Row>
  );
  return (
    <Card highlighted={true} className={classNames("form-card", className)}>
      {content}
    </Card>
  );
};

export default FormCard;
