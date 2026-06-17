import { GenericTable } from "@canonical/maas-react-components";
import { useSelector } from "react-redux";

import useMachineSelectTableColumns from "./useMachineSelectTableColumns";

import { useFetchActions } from "@/app/base/hooks";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import { tagActions } from "@/app/store/tag";
import tagSelectors from "@/app/store/tag/selectors";

type Props = {
  machines: Machine[];
  onMachineClick: (machine: Machine | null) => void;
  searchText: string;
  machinesLoading?: boolean;
  setSearchText: (searchText: string) => void;
};

export const MachineSelectTable = ({
  machines,
  machinesLoading,
  onMachineClick,
  searchText,
  setSearchText,
}: Props): React.ReactElement => {
  const tags = useSelector(tagSelectors.all);
  const loadingMachines = useSelector(machineSelectors.loading);

  useFetchActions([tagActions.fetch]);

  const columns = useMachineSelectTableColumns({
    onMachineClick,
    searchText,
    setSearchText,
    tags,
  });

  return (
    <GenericTable
      className="machine-select-table"
      columns={columns}
      data={machines}
      isLoading={!!(machinesLoading || loadingMachines)}
      noData="No machines match the search criteria."
    />
  );
};

export default MachineSelectTable;
