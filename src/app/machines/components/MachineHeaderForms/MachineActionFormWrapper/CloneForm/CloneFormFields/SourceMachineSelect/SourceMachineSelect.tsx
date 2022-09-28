import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import {
  Notification,
  SearchBox,
  Spinner,
  Strip,
} from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import SourceMachineDetails from "./SourceMachineDetails";

import { MachineSelectTable } from "app/base/components/MachineSelectTable/MachineSelectTable";
import type { Machine, MachineDetails } from "app/store/machine/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import { getTagNamesForIds } from "app/store/tag/utils";

export enum Label {
  Loading = "Loading...",
  NoSourceMachines = "No source machine available",
}

type Props = {
  className?: string;
  loadingData?: boolean;
  loadingMachineDetails?: boolean;
  machines: Machine[];
  onMachineClick: (machine: Machine | null) => void;
  selectedMachine?: MachineDetails | null;
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
        <Spinner aria-label={Label.Loading} text={Label.Loading} />
      </Strip>
    );
  } else if (loadingMachineDetails || selectedMachine) {
    content = <SourceMachineDetails machine={selectedMachine} />;
  } else if (machines.length === 0) {
    content = (
      <Notification
        borderless
        severity="negative"
        title={Label.NoSourceMachines}
      >
        All machines are selected as destination machines. Unselect at least one
        machine from the list.
      </Notification>
    );
  } else {
    content = (
      <div className="source-machine-select__table">
        <MachineSelectTable
          machines={filteredMachines}
          onMachineClick={onMachineClick}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </div>
    );
  }
  return (
    <div className={classNames("source-machine-select", className)}>
      <SearchBox
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
