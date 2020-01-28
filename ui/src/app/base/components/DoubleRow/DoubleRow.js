import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import TableMenu from "app/base/components/TableMenu";

const DoubleRow = ({
  className,
  icon,
  iconTitle,
  menuLinks,
  menuTitle,
  onToggleMenu,
  primary,
  primaryAriaLabel,
  primaryClassName,
  secondary,
  secondaryAriaLabel,
  secondaryClassName
}) => {
  return (
    <div
      className={classNames(
        {
          "p-double-row": !icon,
          "p-double-row--with-icon": icon
        },
        className
      )}
    >
      {icon ? <div className="p-double-row__icon">{icon}</div> : null}
      <div
        className={classNames(
          "p-double-row__primary-row u-truncate",
          primaryClassName
        )}
        aria-label={primaryAriaLabel}
      >
        {primary}
      </div>
      {menuLinks ? (
        <TableMenu
          links={menuLinks}
          title={menuTitle}
          onToggleMenu={onToggleMenu}
        />
      ) : null}
      {secondary ? (
        <div
          className={classNames(
            "p-double-row__secondary-row",
            "u-truncate",
            secondaryClassName
          )}
          aria-label={secondaryAriaLabel}
        >
          {secondary}
        </div>
      ) : null}
    </div>
  );
};

DoubleRow.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  menuLinks: TableMenu.propTypes.links,
  menuTitle: PropTypes.string,
  onToggleMenu: PropTypes.func,
  primary: PropTypes.node,
  primaryAriaLabel: PropTypes.string,
  primaryClassName: PropTypes.string,
  secondary: PropTypes.node,
  secondaryAriaLabel: PropTypes.string,
  secondaryClassName: PropTypes.string
};

export default DoubleRow;
