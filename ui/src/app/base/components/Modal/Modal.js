import PropTypes from "prop-types";
import React from "react";

export const Modal = ({ children, close, title }) => (
  <div className="p-modal" onClick={close}>
    <div
      className="p-modal__dialog"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={evt => evt.stopPropagation()}
    >
      <header className="p-modal__header">
        <h2 className="p-modal__title" id="modal-title">
          {title}
        </h2>
        <button
          className="p-modal__close"
          aria-label="Close active modal"
          onClick={close}
        >
          Close
        </button>
      </header>
      <div id="modal-description">{children}</div>
    </div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default Modal;
