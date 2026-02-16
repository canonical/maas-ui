import { GenericTable } from "@canonical/maas-react-components";

import { useLxdKVMHostTableColumns } from "@/app/kvm/views/KVMList/LxdTable/LxdKVMHostTable/useLxdKVMHostTableColumns/useLxdKVMHostTableColumns";
import type { LXDKVMHost } from "@/app/kvm/views/KVMList/LxdTable/LxdTable";

type Props = {
  rows: LXDKVMHost[];
};

const LxdKVMHostTable = ({ rows }: Props): React.ReactElement => {
  const columns = useLxdKVMHostTableColumns();

  return <GenericTable columns={columns} data={rows} isLoading={false} />;
};

export default LxdKVMHostTable;
