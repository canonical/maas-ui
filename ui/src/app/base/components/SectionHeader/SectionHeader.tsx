import { Col, Row, Spinner } from "@canonical/react-components";
import classNames from "classnames";
import React from "react";

import type { TSFixMe } from "app/base/types";
import Tabs from "app/base/components/Tabs";

type Props = {
  buttons?: JSX.Element[];
  formWrapper?: JSX.Element;
  loading?: boolean;
  subtitle?: TSFixMe;
  tabLinks?: TSFixMe[];
  title: string;
};

const SectionHeader = ({
  buttons,
  formWrapper,
  loading,
  subtitle,
  tabLinks,
  title,
}: Props): JSX.Element => {
  return (
    <>
      <div className="u-flex--between u-flex--wrap">
        <ul className="p-inline-list">
          <li
            className="p-inline-list__item p-heading--four"
            data-test="section-header-title"
          >
            {title}
          </li>
          {subtitle && !loading && (
            <li
              className="p-inline-list__item last-item u-text--light"
              data-test="section-header-subtitle"
            >
              {subtitle}
            </li>
          )}
          {loading && (
            <Spinner
              className="u-no-padding u-no-margin"
              inline
              text="Loading..."
            />
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
      {formWrapper && (
        <Row data-test="section-header-form-wrapper">
          <Col size="12">
            <hr />
            {formWrapper}
          </Col>
        </Row>
      )}
      {tabLinks?.length && (
        <Row data-test="section-header-tabs">
          <Col size="12">
            <hr className="u-no-margin--bottom" />
            <Tabs
              links={tabLinks}
              listClassName="u-no-margin--bottom"
              noBorder
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default SectionHeader;
