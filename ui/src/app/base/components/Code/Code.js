import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const Code = ({
  children,
  className,
  inline,
  copyable,
  numbered,
  ...props
}) => {
  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  } else if (copyable) {
    return (
      <div className={classNames(className, "p-code-copyable")} {...props}>
        <input
          className="p-code-copyable__input"
          value={children}
          readOnly="readonly"
        />
        <button className="p-code-copyable__action">Copy to clipboard</button>
      </div>
    );
  } else if (numbered) {
    const lines = children.split(/\r?\n/);
    const content = lines.map((line, i) => (
      <span className="p-code-numbered__line" key={i}>
        {line}
      </span>
    ));
    return (
      <pre className={classNames(className, "p-code-numbered")} {...props}>
        <code>{content}</code>
      </pre>
    );
  } else {
    return (
      <pre className={className} {...props}>
        <code>{children}</code>
      </pre>
    );
  }
};

Code.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  inline: PropTypes.bool,
  copyable: PropTypes.bool,
  numbered: PropTypes.bool
};

export default Code;
