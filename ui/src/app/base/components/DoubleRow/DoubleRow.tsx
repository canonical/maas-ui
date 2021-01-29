import { useRef } from "react";
import type { ReactNode } from "react";

import classNames from "classnames";
import PropTypes from "prop-types";

import TableMenu from "app/base/components/TableMenu";
import type { Props as TableMenuProps } from "app/base/components/TableMenu/TableMenu";

type Props<L> = {
  className?: string | null;
  icon?: ReactNode | null;
  iconSpace?: boolean | null;
  menuClassName?: string | null;
  menuLinks?: TableMenuProps<L>["links"] | null;
  menuTitle?: string | null;
  onToggleMenu?: TableMenuProps<L>["onToggleMenu"] | null;
  primary?: ReactNode | null;
  primaryAriaLabel?: string | null;
  primaryClassName?: string | null;
  primaryTextClassName?: string | null;
  primaryTitle?: string | null;
  secondary?: ReactNode | null;
  secondaryAriaLabel?: string | null;
  secondaryClassName?: string | null;
  secondaryTitle?: string | null;
};

const DoubleRow = <L,>({
  className,
  icon,
  iconSpace,
  menuClassName,
  menuLinks,
  menuTitle,
  onToggleMenu,
  primary,
  primaryAriaLabel,
  primaryClassName,
  primaryTextClassName,
  primaryTitle,
  secondary,
  secondaryAriaLabel,
  secondaryClassName,
  secondaryTitle,
}: Props<L>): JSX.Element => {
  const parent = useRef(null);
  const hasIcon = icon || iconSpace;

  return (
    <div
      className={classNames(
        {
          "p-double-row": !hasIcon,
          "p-double-row--with-icon": hasIcon,
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
          aria-label={primaryAriaLabel || undefined}
          ref={parent}
        >
          <div
            className={classNames(
              "p-double-row__primary-row-text u-truncate",
              primaryTextClassName
            )}
            title={primaryTitle || undefined}
          >
            {primary}
          </div>
          {menuLinks ? (
            <TableMenu
              className={menuClassName}
              links={menuLinks}
              title={menuTitle}
              onToggleMenu={onToggleMenu}
              positionNode={parent.current}
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
            aria-label={secondaryAriaLabel || undefined}
            title={secondaryTitle || undefined}
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
  menuClassName: PropTypes.string,
  menuLinks: TableMenu.propTypes.links,
  menuTitle: PropTypes.string,
  onToggleMenu: PropTypes.func,
  primary: PropTypes.node,
  primaryAriaLabel: PropTypes.string,
  primaryClassName: PropTypes.string,
  primaryTextClassName: PropTypes.string,
  primaryTitle: PropTypes.string,
  secondary: PropTypes.node,
  secondaryAriaLabel: PropTypes.string,
  secondaryClassName: PropTypes.string,
  secondaryTitle: PropTypes.string,
};

export default DoubleRow;
