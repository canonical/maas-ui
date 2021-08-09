import { useState } from "react";

import {
  MainTable,
  SearchBox,
  Spinner,
  Strip,
} from "@canonical/react-components";
import { highlightSubString } from "@canonical/react-components/dist/utils";
import classNames from "classnames";

import SourceMachineDetails from "./SourceMachineDetails";

import DoubleRow from "app/base/components/DoubleRow";
import type { Machine, MachineDetails } from "app/store/machine/types";

type Props = {
  className?: string;
  loadingDetails?: boolean;
  loadingMachines?: boolean;
  machines: Machine[];
  onMachineClick: (machine: Machine | null) => void;
  selectedMachine?: MachineDetails | null;
};

const generateRows = (
  machines: Machine[],
  searchText: string,
  onRowClick: (machine: Machine) => void
) => {
  const highlightedText = (text: string) => (
    <span
      dangerouslySetInnerHTML={{
        __html: highlightSubString(text, searchText).text,
      }}
      data-test={`source-machine-${text}`}
    />
  );

  return machines.map((machine) => ({
    className: "source-machine-select__row",
    columns: [
      {
        content: (
          <DoubleRow
            primary={highlightedText(machine.hostname)}
            secondary={highlightedText(machine.system_id)}
          />
        ),
      },
      {
        content: (
          <DoubleRow
            primary={machine.owner || "-"}
            secondary={
              machine.tags.length
                ? highlightedText(machine.tags.join(", "))
                : "-"
            }
          />
        ),
      },
    ],
    "data-test": "source-machine-row",
    onClick: () => onRowClick(machine),
  }));
};

export const SourceMachineSelect = ({
  className,
  loadingDetails = false,
  loadingMachines = false,
  machines,
  onMachineClick,
  selectedMachine = null,
}: Props): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  // We filter by a subset of machine parameters rather than using the search
  // selector, because the search selector will match parameters that aren't
  // included in the clone source table.
  const filteredMachines = machines.filter(
    (machine) =>
      machine.system_id.includes(searchText) ||
      machine.hostname.includes(searchText) ||
      machine.tags.join(", ").includes(searchText)
  );

  return (
    <div className={classNames("source-machine-select", className)}>
      <SearchBox
        data-test="source-machine-searchbox"
        externallyControlled
        placeholder="Search by hostname, system ID or tags"
        onChange={(searchText: string) => {
          setSearchText(searchText);
          // Unset the selected machine if the search input changes - assume
          // the user wants to change it.
          if (selectedMachine) {
            onMachineClick(null);
          }
        }}
        value={searchText}
      />
      {loadingDetails || selectedMachine ? (
        <SourceMachineDetails machine={selectedMachine} />
      ) : (
        <div className="source-machine-select__table">
          <MainTable
            emptyStateMsg={
              loadingMachines ? null : "No machines match the search criteria."
            }
            headers={[
              {
                content: (
                  <>
                    <div>Hostname</div>
                    <div>system_id</div>
                  </>
                ),
              },
              {
                content: (
                  <>
                    <div>Owner</div>
                    <div>Tags</div>
                  </>
                ),
              },
            ]}
            rows={
              loadingMachines
                ? []
                : generateRows(filteredMachines, searchText, (machine) => {
                    setSearchText(machine.hostname);
                    onMachineClick(machine);
                  })
            }
          />
        </div>
      )}
      {loadingMachines && (
        <Strip className="u-no-padding--top" shallow>
          <Spinner data-test="loading-spinner" text="Loading..." />
        </Strip>
      )}
    </div>
  );
};

export default SourceMachineSelect;
