import { CheckboxInput, ContextualMenu } from "@canonical/react-components";

import { useSendAnalytics } from "app/base/hooks";
import { columnLabels, columns } from "app/machines/constants";

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
      dropdownProps={{ "aria-label": "hidden columns menu" }}
      hasToggleIcon
      position="left"
      toggleClassName="filter-accordion__toggle"
      toggleLabel={`Hidden columns ${
        hiddenColumns.length > 0 ? `(${hiddenColumns.length})` : ""
      }`}
    >
      <div className="machines-list-hidden-columns-select">
        {columns.map((column) => (
          <CheckboxInput
            aria-label={column}
            checked={hiddenColumns.includes(column)}
            disabled={column === "fqdn"}
            key={column}
            label={columnLabels[column]}
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
