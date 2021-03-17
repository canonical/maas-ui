import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

const EventLogs = ({ systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (!machine) {
    return <Spinner text="Loading..." />;
  }

  return <>Events</>;
};

export default EventLogs;
