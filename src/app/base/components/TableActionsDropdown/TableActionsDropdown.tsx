import type { ButtonProps, ValueOf } from "@canonical/react-components";

import TableMenu from "@/app/base/components/TableMenu";
import type { DataTestElement } from "@/app/base/types";
import type { MachineSidePanelViews } from "@/app/machines/constants";

export type TableAction<A> = {
  label: string;
  show?: boolean;
  type: A;
  view?: ValueOf<typeof MachineSidePanelViews>;
};

// This allows the "data-testid" attribute to be used for the action links, which
// is technically not a valid HTML prop, but we use it throughout maas-ui.
type TableActionsLink = DataTestElement<ButtonProps>;

type Props<A> = {
  readonly actions: TableAction<A>[];
  readonly disabled?: boolean;
  readonly onActionClick: (action: A, view?: TableAction<A>["view"]) => void;
};

const TableActionsDropdown = <A extends string>({
  actions,
  disabled = false,
  onActionClick,
}: Props<A>): React.ReactElement => {
  const actionLinks = actions.reduce<TableActionsLink[]>((links, action) => {
    if (!(action.show === false)) {
      // Show actions that do not explicitly set show to false.
      links.push({
        children: action.label,
        "data-testid": action.type,
        onClick: () => {
          onActionClick(action.type, action?.view);
        },
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
