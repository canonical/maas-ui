import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import TableMenu from "app/base/components/TableMenu";

const DoubleRow = ({
  className,
  icon,
  iconSpace,
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
  const hasIcon = icon || iconSpace;
  return (
    <div
      className={classNames(
        {
          "p-double-row": !hasIcon,
          "p-double-row--with-icon": hasIcon
        },
        className
      )}
    >
      {hasIcon ? (
        <div className="p-double-row__icon">
          {icon || <div className="p-double-row__icon-space"></div>}
        </div>
      ) : null}
      <div className="p-double-row__rows-container">
        <div
          className={classNames("p-double-row__primary-row", primaryClassName)}
          aria-label={primaryAriaLabel}
        >
          <div className="p-double-row__primary-row-text u-truncate">
            {primary}
          </div>
          {menuLinks ? (
            <TableMenu
              links={menuLinks}
              title={menuTitle}
              onToggleMenu={onToggleMenu}
            />
          ) : null}
        </div>
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
    </div>
  );
};

DoubleRow.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  iconSpace: PropTypes.bool,
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
