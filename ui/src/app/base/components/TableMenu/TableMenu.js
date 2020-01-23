import { Button } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

import "./TableMenu.scss";
import ContextualMenu from "app/base/components/ContextualMenu";

const TableMenu = ({ links, title }) => {
  return (
    <ContextualMenu
      className="p-table-menu"
      hasToggleIcon
      links={[title, links]}
      position="center"
      toggleAppearance="base"
    />
  );
};

TableMenu.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape(Button.propTypes)),
  title: PropTypes.string
};

export default TableMenu;
