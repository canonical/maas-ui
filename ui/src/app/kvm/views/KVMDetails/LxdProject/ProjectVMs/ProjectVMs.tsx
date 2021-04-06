import { useEffect } from "react";

import { Strip } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import VMsActionBar from "./VMsActionBar";
import VMsTable from "./VMsTable";

import type { SetSelectedAction } from "app/kvm/views/KVMDetails";
import { actions as machineActions } from "app/store/machine";
import type { Pod } from "app/store/pod/types";

type Props = {
  id: Pod["id"];
  setSelectedAction: SetSelectedAction;
};

const ProjectVMs = ({ id, setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(machineActions.fetch());

    return () => {
      // Clear machine selected state when unmounting.
      dispatch(machineActions.setSelected([]));
    };
  }, [dispatch]);

  return (
    <Strip shallow>
      <VMsActionBar id={id} setSelectedAction={setSelectedAction} />
      <Strip shallow>
        <VMsTable id={id} />
      </Strip>
    </Strip>
  );
};

export default ProjectVMs;
