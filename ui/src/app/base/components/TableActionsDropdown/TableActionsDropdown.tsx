import type { Props as ButtonProps } from "@canonical/react-components/dist/components/Button";

import TableMenu from "app/base/components/TableMenu";

export type TableAction<A> = {
  label: string;
  show?: boolean;
  type: A;
};

// This allows the "data-test" attribute to be used for the action links, which
// is technically not a valid HTML prop, but we use it throughout maas-ui.
type TableActionsLink = ButtonProps & { "data-test": string };

type Props<A> = {
  actions: TableAction<A>[];
  disabled?: boolean;
  onActionClick: (action: A) => void;
};

const TableActionsDropdown = <A extends string>({
  actions,
  disabled = false,
  onActionClick,
}: Props<A>): JSX.Element => {
  const actionLinks = actions.reduce<TableActionsLink[]>((links, action) => {
    if (!(action.show === false)) {
      // Show actions that do not explicitly set show to false.
      links.push({
        children: action.label,
        "data-test": action.type,
        onClick: () => onActionClick(action.type),
      });
    }
    return links;
  }, []);

  return (
    <TableMenu
      disabled={disabled || actions.length === 0}
      links={actionLinks}
      position="right"
      title="Take action:"
    />
  );
};

export default TableActionsDropdown;
