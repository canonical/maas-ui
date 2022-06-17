import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import {
  MainTable,
  Notification,
  SearchBox,
  Spinner,
  Strip,
} from "@canonical/react-components";
import { highlightSubString } from "@canonical/react-components/dist/utils";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import SourceMachineDetails from "./SourceMachineDetails";

import DoubleRow from "app/base/components/DoubleRow";
import type { Machine, MachineDetails } from "app/store/machine/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import { getTagNamesForIds } from "app/store/tag/utils";

type Props = {
  className?: string;
  loadingData?: boolean;
  loadingMachineDetails?: boolean;
  machines: Machine[];
  onMachineClick: (machine: Machine | null) => void;
  selectedMachine?: MachineDetails | null;
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
      data-testid={`source-machine-${text}`}
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
                ? highlightedText(
                    getTagNamesForIds(machine.tags, tags).join(", ")
                  )
                : "-"
            }
          />
        ),
      },
    ],
    "data-testid": "source-machine-row",
    onClick: () => onRowClick(machine),
  }));
};

export const SourceMachineSelect = ({
  className,
  loadingData = false,
  loadingMachineDetails = false,
  machines,
  onMachineClick,
  selectedMachine = null,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const tags = useSelector(tagSelectors.all);
  const [searchText, setSearchText] = useState("");
  // We filter by a subset of machine parameters rather than using the search
  // selector, because the search selector will match parameters that aren't
  // included in the clone source table.
  const filteredMachines = machines.filter(
    (machine) =>
      machine.system_id.includes(searchText) ||
      machine.hostname.includes(searchText) ||
      getTagNamesForIds(machine.tags, tags).join(", ").includes(searchText)
  );

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  let content: ReactNode;
  if (loadingData) {
    content = (
      <Strip shallow>
        <Spinner data-testid="loading-spinner" text="Loading..." />
      </Strip>
    );
  } else if (loadingMachineDetails || selectedMachine) {
    content = <SourceMachineDetails machine={selectedMachine} />;
  } else if (machines.length === 0) {
    content = (
      <Notification
        borderless
        data-testid="no-source-machines"
        severity="negative"
        title="No source machine available"
      >
        All machines are selected as destination machines. Unselect at least one
        machine from the list.
      </Notification>
    );
  } else {
    content = (
      <div className="source-machine-select__table">
        <MainTable
          emptyStateMsg="No machines match the search criteria."
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
          rows={generateRows(
            filteredMachines,
            searchText,
            (machine) => {
              setSearchText(machine.hostname);
              onMachineClick(machine);
            },
            tags
          )}
        />
      </div>
    );
  }
  return (
    <div className={classNames("source-machine-select", className)}>
      <SearchBox
        data-testid="source-machine-searchbox"
        externallyControlled
        onChange={(searchText: string) => {
          setSearchText(searchText);
          // Unset the selected machine if the search input changes - assume
          // the user wants to change it.
          if (selectedMachine) {
            onMachineClick(null);
          }
        }}
        placeholder="Search by hostname, system ID or tags"
        value={searchText}
      />
      {content}
    </div>
  );
};

export default SourceMachineSelect;
