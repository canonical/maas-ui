import { Button } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import "./TableMenu.scss";
import ContextualMenu from "app/base/components/ContextualMenu";

const TableMenu = ({ className, links, title, onToggleMenu, positionNode }) => {
  return (
    <ContextualMenu
      className={classNames("p-table-menu", className)}
      hasToggleIcon
      links={[title, ...links]}
      onToggleMenu={onToggleMenu}
      position="left"
      positionNode={positionNode}
      toggleAppearance="base"
      toggleClassName="u-no-margin--bottom p-table-menu__toggle"
    />
  );
};

TableMenu.propTypes = {
  className: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(Button.propTypes),
      PropTypes.arrayOf(PropTypes.shape(Button.propTypes))
    ])
  ),
  onToggleMenu: PropTypes.func,
  positionNode: PropTypes.object,
  title: PropTypes.string
};

export default TableMenu;
