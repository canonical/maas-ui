import { Button, Icon, Tooltip } from "@canonical/react-components";
import classNames from "classnames";

const AppSideNavCollapseToggle = ({
  isCollapsed,
  setIsCollapsed,
  className,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  className?: string;
}): JSX.Element => {
  return (
    <Tooltip
      message={
        <>
          {!isCollapsed ? "collapse" : "expand"}( <code>[</code> )
        </>
      }
      position="right"
    >
      <Button
        appearance="base"
        aria-label={`${!isCollapsed ? "collapse" : "expand"} main navigation`}
        className={classNames(
          "is-dense has-icon is-dark u-no-margin l-navigation-collapse-toggle",
          className
        )}
        onClick={(e) => {
          setIsCollapsed(!isCollapsed);
          // Make sure the button does not have focus
          // .l-navigation remains open with :focus-within
          e.stopPropagation();
          e.currentTarget.blur();
        }}
      >
        <Icon light name="sidebar-toggle" />
      </Button>
    </Tooltip>
  );
};

export default AppSideNavCollapseToggle;
