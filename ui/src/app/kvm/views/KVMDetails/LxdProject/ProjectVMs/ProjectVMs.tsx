import { useEffect } from "react";

import { Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import VMsActionBar from "./VMsActionBar";
import VMsTable from "./VMsTable";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = { id: Pod["id"] };

const ProjectVMs = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machinesLoading = useSelector(machineSelectors.loading);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const podVMs = useSelector((state: RootState) =>
    podSelectors.getVMs(state, pod)
  );

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

  return (
    <Strip shallow>
      <VMsActionBar loading={machinesLoading} vms={podVMs} />
      <Strip shallow>
        <VMsTable id={id} />
      </Strip>
    </Strip>
  );
};

export default ProjectVMs;
