import { CheckboxInput, ContextualMenu } from "@canonical/react-components";

import { useSendAnalytics } from "app/base/hooks";
import { columns } from "app/machines/constants";

type Props = {
  hiddenColumns: string[];
  toggleHiddenColumn: (column: string) => void;
};

const HiddenColumnsSelect = ({
  hiddenColumns,
  toggleHiddenColumn,
}: Props): JSX.Element => {
  const sendAnalytics = useSendAnalytics();

  return (
    <ContextualMenu
      className="filter-accordion"
      constrainPanelWidth
      hasToggleIcon
      position="left"
      toggleClassName="filter-accordion__toggle"
      dropdownProps={{ "aria-label": "hidden columns menu" }}
      toggleLabel={`Hidden columns ${
        hiddenColumns.length > 0 ? `(${hiddenColumns.length})` : ""
      }`}
    >
      <div className="machines-list-hidden-columns-select">
        {columns.map((column) => (
          <CheckboxInput
            key={column}
            disabled={column === "fqdn"}
            aria-label={column}
            label={column}
            checked={hiddenColumns.includes(column)}
            onChange={() => {
              sendAnalytics(
                "MachineListControls",
                hiddenColumns.includes(column) ? "unhide" : "hide",
                column
              );
              toggleHiddenColumn(column);
            }}
          />
        ))}
      </div>
    </ContextualMenu>
  );
};

export default HiddenColumnsSelect;
