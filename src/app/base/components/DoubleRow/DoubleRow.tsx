import { useRef } from "react";
import type { ReactNode } from "react";

import classNames from "classnames";

import TableMenu from "@/app/base/components/TableMenu";
import type { Props as TableMenuProps } from "@/app/base/components/TableMenu/TableMenu";

type Props<L> = {
  readonly className?: string | null;
  readonly icon?: ReactNode | null;
  readonly iconSpace?: boolean | null;
  readonly menuClassName?: string | null;
  readonly menuLinks?: TableMenuProps<L>["links"];
  readonly menuTitle?: string | null;
  readonly onToggleMenu?: TableMenuProps<L>["onToggleMenu"];
  readonly primary?: ReactNode | null;
  readonly primaryAriaLabel?: string | null;
  readonly primaryClassName?: string | null;
  readonly primaryTextClassName?: string | null;
  readonly primaryTitle?: string | null;
  readonly secondary?: ReactNode | null;
  readonly secondaryAriaLabel?: string | null;
  readonly secondaryClassName?: string | null;
  readonly secondaryTitle?: string | null;
};

export enum TestIds {
  Icon = "icon",
  IconSpace = "icon-space",
  Primary = "primary",
  Secondary = "secondary",
}

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
}: Props<L>): React.ReactElement => {
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
        <div className="p-double-row__icon" data-testid={TestIds.Icon}>
          {icon || (
            <div
              className="p-double-row__icon-space"
              data-testid={TestIds.IconSpace}
            ></div>
          )}
        </div>
      ) : null}
      <div className="p-double-row__rows-container">
        <div
          aria-label={primaryAriaLabel || undefined}
          className={classNames("p-double-row__primary-row", primaryClassName)}
          ref={parent}
        >
          <div
            className={classNames(
              "p-double-row__primary-row-text u-truncate",
              primaryTextClassName
            )}
            data-testid={TestIds.Primary}
            title={primaryTitle || undefined}
          >
            {primary}
          </div>
          {menuLinks ? (
            <TableMenu
              className={menuClassName}
              links={menuLinks}
              onToggleMenu={onToggleMenu}
              positionNode={parent.current}
              title={menuTitle}
            />
          ) : null}
        </div>
        {secondary ? (
          <div
            aria-label={secondaryAriaLabel || undefined}
            className={classNames(
              "p-double-row__secondary-row",
              "u-truncate",
              secondaryClassName
            )}
            data-testid={TestIds.Secondary}
            title={secondaryTitle || undefined}
          >
            {secondary}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DoubleRow;
