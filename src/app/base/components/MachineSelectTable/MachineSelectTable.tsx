import { useEffect } from "react";

import { MainTable, Spinner } from "@canonical/react-components";
import { highlightSubString } from "@canonical/react-components/dist/utils";
import { useDispatch, useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import { getTagNamesForIds } from "app/store/tag/utils";

export enum Label {
  Loading = "Loading...",
  Hostname = "Hostname",
  Owner = "Owner",
}

type Props = {
  machines: Machine[];
  onMachineClick: (machine: Machine | null) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
};

const generateRows = (
  machines: Machine[],
  searchText: string,
  onRowClick: (machine: Machine) => void,
  tags: Tag[]
) => {
  const highlightedText = (text: string) => (
    <span
      dangerouslySetInnerHTML={{
        __html: highlightSubString(text, searchText).text,
      }}
    />
  );
  return machines.map((machine) => ({
    "aria-label": machine.hostname,
    className: "machine-select-table__row",
    columns: [
      {
        "aria-label": Label.Hostname,
        content: (
          <DoubleRow
            primary={highlightedText(machine.hostname)}
            secondary={highlightedText(machine.system_id)}
          />
        ),
      },
      {
        "aria-label": Label.Owner,
        content: (
          <DoubleRow
            primary={machine.owner || "-"}
            secondary={
              machine.tags.length
                ? highlightedText(
                    getTagNamesForIds(machine.tags, tags).join(", ")
                  )
                : "-"
            }
          />
        ),
      },
    ],
    "data-testid": "machine-select-row",
    onClick: () => onRowClick(machine),
    tabIndex: 0,
  }));
};

export const MachineSelectTable = ({
  machines,
  onMachineClick,
  searchText,
  setSearchText,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const tags = useSelector(tagSelectors.all);
  const loadingMachines = !useSelector(machineSelectors.loaded);

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  if (loadingMachines) {
    return <Spinner aria-label={Label.Loading} text={Label.Loading} />;
  }
  return (
    <MainTable
      emptyStateMsg="No machines match the search criteria."
      headers={[
        {
          content: (
            <>
              <div>{Label.Hostname}</div>
              <div>system_id</div>
            </>
          ),
        },
        {
          content: (
            <>
              <div>{Label.Owner}</div>
              <div>Tags</div>
            </>
          ),
        },
      ]}
      rows={generateRows(
        machines,
        searchText,
        (machine) => {
          setSearchText(machine.hostname);
          onMachineClick(machine);
        },
        tags
      )}
    />
  );
};

export default MachineSelectTable;
