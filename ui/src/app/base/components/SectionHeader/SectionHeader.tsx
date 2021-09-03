import type { ReactNode } from "react";

import type { TabsProps } from "@canonical/react-components";
import { Col, Row, Spinner, Tabs } from "@canonical/react-components";
import classNames from "classnames";
import type { LinkProps } from "react-router-dom";

import type { DataTestElement } from "app/base/types";

type Props<P = LinkProps> = {
  buttons?: JSX.Element[] | null;
  headerContent?: JSX.Element | null;
  loading?: boolean;
  subtitle?: ReactNode | ReactNode[];
  tabLinks?: DataTestElement<TabsProps<P>["links"]>;
  title: ReactNode;
};

const generateSubtitle = (subtitle: Props["subtitle"]) => {
  const items = (Array.isArray(subtitle) ? subtitle : [subtitle]).filter(
    Boolean
  );
  return items.map((item, i) => (
    <li
      className={classNames("p-inline-list__item u-text--light", {
        "last-item": i === items.length - 1,
      })}
      data-test="section-header-subtitle"
      key={i}
    >
      {item}
    </li>
  ));
};

const SectionHeader = ({
  buttons,
  headerContent,
  loading,
  subtitle,
  tabLinks,
  title,
}: Props): JSX.Element => {
  return (
    <>
      <div className="u-flex--between u-flex--wrap">
        <ul className="p-inline-list">
          <li className="p-inline-list__item" data-test="section-header-title">
            {typeof title === "string" ? (
              <span className="p-heading--four">{title}</span>
            ) : (
              title
            )}
          </li>
          {loading ? (
            <li className="p-inline-list__item last-item u-text--light">
              <Spinner text="Loading..." />
            </li>
          ) : (
            generateSubtitle(subtitle)
          )}
        </ul>
        {buttons?.length && (
          <ul
            className="p-inline-list u-no-margin--bottom"
            data-test="section-header-buttons"
          >
            {buttons.map((button: JSX.Element, i) => (
              <li
                className={classNames("p-inline-list__item", {
                  "last-item": i === buttons.length - 1,
                })}
                key={button.key}
              >
                {button}
              </li>
            ))}
          </ul>
        )}
      </div>
      {headerContent && (
        <Row data-test="section-header-form-wrapper">
          <Col size={12}>
            <hr />
            {headerContent}
          </Col>
        </Row>
      )}
      {tabLinks?.length && (
        <Row data-test="section-header-tabs">
          <Col size={12}>
            <hr className="u-no-margin--bottom" />
            <Tabs
              className="no-border"
              links={tabLinks}
              listClassName="u-no-margin--bottom"
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default SectionHeader;
