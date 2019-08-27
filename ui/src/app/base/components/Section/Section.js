import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import "./Section.scss";
import { messages as messageActions } from "app/base/actions";
import Col from "app/base/components/Col";
import Notification from "app/base/components/Notification";
import selectors from "app/base/selectors";
import Strip from "app/base/components/Strip";

const generateMessages = (messages, dispatch) =>
  messages.map(({ id, message, status, temporary, type }) => (
    <Notification
      close={() => dispatch(messageActions.remove(id))}
      key={id}
      status={status}
      timeout={temporary && 5000}
      type={type}
    >
      {message}
    </Notification>
  ));

const Section = ({ children, sidebar, title }) => {
  const messages = useSelector(selectors.messages.all);
  const dispatch = useDispatch();
  return (
    <div className="section">
      <Strip element="header" className="section__header">
        <h1 className="p-heading--four u-no-margin--bottom">{title}</h1>
      </Strip>
      <Strip
        element="header"
        className="u-no-padding"
        rowClassName="u-equal-height section__content-wrapper"
        includeCol={false}
      >
        {sidebar && (
          <Col element="aside" size="2" className="section__sidebar">
            {sidebar}
          </Col>
        )}
        <Col size={sidebar ? 10 : 12} className="section__content">
          {generateMessages(messages, dispatch)}
          {children}
        </Col>
      </Strip>
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  sidebar: PropTypes.node,
  title: PropTypes.node.isRequired
};

export default Section;
