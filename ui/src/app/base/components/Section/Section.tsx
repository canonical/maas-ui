import type { HTMLProps, ReactNode } from "react";

import { Col, Strip } from "@canonical/react-components";
import classNames from "classnames";

import NotificationList from "app/base/components/NotificationList";
import { COL_SIZES } from "app/base/constants";

export type Props = {
  children?: ReactNode;
  header?: ReactNode;
  headerClassName?: string;
  sidebar?: ReactNode;
} & HTMLProps<HTMLDivElement>;

const Section = ({
  children,
  header,
  headerClassName,
  sidebar,
  ...props
}: Props): JSX.Element => {
  const { SIDEBAR, TOTAL } = COL_SIZES;
  return (
    <div className="section" {...props}>
      {header ? (
        <Strip
          className={classNames("section__header", headerClassName)}
          element="header"
          shallow
        >
          {typeof header === "string" ? (
            <h1 className="p-heading--four u-no-margin--bottom">{header}</h1>
          ) : (
            header
          )}
        </Strip>
      ) : null}
      <Strip
        element="main"
        includeCol={false}
        rowClassName="section__content-wrapper"
        shallow
      >
        {sidebar && (
          <Col element="aside" size={SIDEBAR} className="section__sidebar">
            {sidebar}
          </Col>
        )}
        <Col
          size={sidebar ? TOTAL - SIDEBAR : TOTAL}
          className="section__content"
        >
          <NotificationList />
          {children}
        </Col>
      </Strip>
    </div>
  );
};

export default Section;
