import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const Tabs = ({ links, listClassName, navClassName, noBorder }) => {
  return (
    <nav className={classNames("p-tabs", navClassName)}>
      <ul
        className={classNames("p-tabs__list", listClassName, {
          "no-border": noBorder,
        })}
      >
        {links.map((link) => (
          <li
            className={classNames("p-tabs__item", link.listItemClassName)}
            key={link.path}
          >
            <Link
              aria-selected={link.active}
              className={classNames("p-tabs__link", link.className)}
              to={link.path}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Tabs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      className: PropTypes.string,
      label: PropTypes.node.isRequired,
      listItemClassName: PropTypes.string,
      path: PropTypes.string.isRequired,
    }).isRequired
  ),
  listClassName: PropTypes.string,
  navClassName: PropTypes.string,
  noBorder: PropTypes.bool,
};

export default Tabs;
