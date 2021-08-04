import { useEffect, useState } from "react";

import { MainTable, SearchBox, Spinner } from "@canonical/react-components";
import { highlightSubString } from "@canonical/react-components/dist/utils";
import { useDispatch, useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import LabelledList from "app/base/components/LabelledList";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  source?: Machine["system_id"] | null;
  setSource: (id: Machine["system_id"] | null) => void;
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
  source,
  setSource,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const unselectedMachines = useSelector(machineSelectors.unselected);
  const selectedMachine = useSelector((state: RootState) =>
    machineSelectors.getById(state, source)
  );
  const loaded = useSelector(machineSelectors.loaded);
  // We filter by a subset of machine parameters rather than using the search
  // selector, because the search selector will match parameters that aren't
  // included in the clone source table.
  const filteredMachines = unselectedMachines.filter(
    (machine) =>
      machine.system_id.includes(searchText) ||
      machine.hostname.includes(searchText) ||
      machine.tags.join(", ").includes(searchText)
  );

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

  return (
    <div className="source-machine-select">
      <SearchBox
        data-test="source-machine-searchbox"
        externallyControlled
        placeholder="Search by hostname, system ID or tags"
        onChange={(searchText: string) => {
          setSearchText(searchText);
          // Unset the selected machine if the search input changes - assume
          // the user wants to change it.
          if (selectedMachine) {
            setSource(null);
          }
        }}
        value={searchText}
      />
      {selectedMachine ? (
        <LabelledList
          data-test="selected-machine-details"
          items={[{ label: "Status", value: selectedMachine.status }]}
        />
      ) : (
        <div className="source-machine-select__table">
          <MainTable
            emptyStateMsg={
              loaded ? "No machines match the search criteria." : null
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
              loaded
                ? generateRows(filteredMachines, searchText, (machine) => {
                    setSource(machine.system_id);
                    setSearchText(machine.hostname);
                  })
                : []
            }
          />
        </div>
      )}
      {!loaded && <Spinner data-test="loading-spinner" text="Loading..." />}
    </div>
  );
};

export default SourceMachineSelect;
