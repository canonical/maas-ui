import { useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import type { SortingState } from "@tanstack/react-table";
import { useSelector } from "react-redux";

import useVirshTableColumns from "../useVirshTableColumns/useVirshTableColumns";

import podSelectors from "@/app/store/pod/selectors";
import type { Pod } from "@/app/store/pod/types";

const VirshTable = () => {
  const virshKvms = useSelector(podSelectors.virsh);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: true },
  ]);
  console.log(sorting);
  const columns = useVirshTableColumns();
  // const fakeKvms = virshKvms.map((virshKvm, i) => ({
  //   ...virshKvm,
  //   resources: factory.podResources({ vm_count: { tracked: i + 1, other: 0 } }),
  // }));
  return (
    <GenericTable<Pod>
      aria-label="virsh table"
      className="virsh-table"
      columns={columns}
      data={virshKvms}
      isLoading={false}
      noData="No pods available."
      setSorting={setSorting}
      sorting={sorting}
      variant="regular"
    />
  );
};

export default VirshTable;
