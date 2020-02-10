import { Button } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

import "./TableMenu.scss";
import ContextualMenu from "app/base/components/ContextualMenu";

const TableMenu = ({ links, title, onToggleMenu }) => {
  return (
    <ContextualMenu
      className="p-table-menu"
      dropdownClassName="u-no-margin--top"
      hasToggleIcon
      links={[title, links]}
      onToggleMenu={onToggleMenu}
      position="center"
      toggleAppearance="base"
      toggleClassName="u-no-margin--bottom p-table-menu__toggle"
    />
  );
};

TableMenu.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape(Button.propTypes)),
  onToggleMenu: PropTypes.func,
  title: PropTypes.string
};

export default TableMenu;
