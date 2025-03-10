import type { Machine } from "@/app/store/machine/types";
import { useFetchMachine } from "@/app/store/machine/utils/hooks";

const MachineHostname = ({ systemId }: { systemId: Machine["system_id"] }) => {
  const { machine } = useFetchMachine(systemId);
  return <span>{machine?.hostname || systemId}</span>;
};

export default MachineHostname;
