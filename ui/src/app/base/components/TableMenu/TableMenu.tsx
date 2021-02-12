import { Button, ContextualMenu } from "@canonical/react-components";
import type { Props as ContextualMenuProps } from "@canonical/react-components/dist/components/ContextualMenu/ContextualMenu";
import classNames from "classnames";
import PropTypes from "prop-types";

export type Props<L = null> = {
  className?: ContextualMenuProps<L>["className"] | null;
  disabled?: ContextualMenuProps<L>["toggleDisabled"] | null;
  links?: ContextualMenuProps<L>["links"] | null;
  onToggleMenu?: ContextualMenuProps<L>["onToggleMenu"] | null;
  position?: ContextualMenuProps<L>["position"];
  positionNode?: ContextualMenuProps<L>["positionNode"] | null;
  title?: string | null;
};

const TableMenu = <L extends null>({
  className,
  disabled = false,
  links,
  title,
  onToggleMenu,
  position = "left",
  positionNode,
}: Props<L>): JSX.Element => {
  // If there are no links then make it an empty array so that it can be validly spread below.
  links = links || [];
  return (
    <ContextualMenu
      className={classNames("p-table-menu", className)}
      hasToggleIcon
      links={[
        ...(title ? [title] : []),
        ...(Array.isArray(links) ? links : [links]),
      ]}
      onToggleMenu={onToggleMenu || undefined}
      position={position}
      // This shouldn't need to pass `undefined` once ContextualMenu supports null
      // See: https://github.com/canonical-web-and-design/react-components/issues/377
      positionNode={positionNode || undefined}
      toggleAppearance="base"
      toggleClassName="u-no-margin--bottom p-table-menu__toggle is-dense"
      toggleDisabled={disabled || false}
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
