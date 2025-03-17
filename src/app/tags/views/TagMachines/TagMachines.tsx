import { useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { useGetURLId } from "@/app/base/hooks/urls";
import type { SortDirection } from "@/app/base/types";
import urls from "@/app/base/urls";
import ErrorsNotification from "@/app/machines/views/MachineList/ErrorsNotification";
import MachineListTable from "@/app/machines/views/MachineList/MachineListTable";
import { DEFAULTS } from "@/app/machines/views/MachineList/MachineListTable/constants";
import type { FetchGroupKey, FetchFilters } from "@/app/store/machine/types";
import { useFetchMachines } from "@/app/store/machine/utils/hooks";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import tagSelectors from "@/app/store/tag/selectors";
import { TagMeta } from "@/app/store/tag/types";
import { FetchNodeStatus } from "@/app/store/types/node";
import { isId } from "@/app/utils";

export enum Label {
  Machines = "Deployed machines",
}

const PAGE_SIZE = DEFAULTS.pageSize;

const TagMachines = (): React.ReactElement => {
  const id = useGetURLId(TagMeta.PK);
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  const tagsLoading = useSelector(tagSelectors.loading);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<FetchGroupKey | null>(
    DEFAULTS.sortKey
  );
  const [sortDirection, setSortDirection] = useState<
    ValueOf<typeof SortDirection>
  >(DEFAULTS.sortDirection);
  const filters: FetchFilters = { status: FetchNodeStatus.DEPLOYED };
  if (tag) {
    filters.tags = [tag.name];
  }
  const {
    callId,
    loading,
    machineCount,
    machines,
    groups,
    machinesErrors,
    totalPages,
  } = useFetchMachines({
    filters,
    sortDirection,
    sortKey,
    pagination: {
      currentPage,
      setCurrentPage,
      pageSize: PAGE_SIZE,
    },
  });

  useWindowTitle(tag ? `Deployed machines for: ${tag.name}` : "Tag");

  useFetchActions([tagActions.fetch]);

  if (!isId(id) || (!tagsLoading && !tag)) {
    return <ModelNotFound id={id} linkURL={urls.tags.index} modelName="tag" />;
  }

  if (!tag || tagsLoading) {
    return <Spinner data-testid="Spinner" />;
  }

  return (
    <>
      <ErrorsNotification errors={machinesErrors} />
      <MachineListTable
        aria-label={Label.Machines}
        callId={callId}
        currentPage={currentPage}
        groups={groups}
        machineCount={machineCount}
        machines={machines}
        machinesLoading={loading}
        pageSize={PAGE_SIZE}
        setCurrentPage={setCurrentPage}
        setSortDirection={setSortDirection}
        setSortKey={setSortKey}
        showActions={false}
        sortDirection={sortDirection}
        sortKey={sortKey}
        totalPages={totalPages}
      />
    </>
  );
};

export default TagMachines;
