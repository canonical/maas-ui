import { Button, ContextualMenu } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

const TableMenu = ({
  className,
  disabled = false,
  links,
  title,
  onToggleMenu,
  position = "left",
  positionNode,
}) => {
  return (
    <ContextualMenu
      className={classNames("p-table-menu", className)}
      hasToggleIcon
      links={[title, ...links]}
      onToggleMenu={onToggleMenu}
      position={position}
      positionNode={positionNode}
      toggleAppearance="base"
      toggleClassName="u-no-margin--bottom p-table-menu__toggle"
      toggleDisabled={disabled}
    />
  );
};

TableMenu.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  links: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(Button.propTypes),
      PropTypes.arrayOf(PropTypes.shape(Button.propTypes)),
    ])
  ),
  onToggleMenu: PropTypes.func,
  position: PropTypes.oneOf(["center", "left", "right"]),
  positionNode: PropTypes.object,
  title: PropTypes.string,
};

export default TableMenu;
