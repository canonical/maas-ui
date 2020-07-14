import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import type { RootState } from "app/store/root/types";
import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";
import MachineListTable from "app/machines/views/MachineList/MachineListTable";
import KVMSummaryStorage from "./KVMSummaryStorage";

const KVMSummary = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );

  useWindowTitle(`KVM ${`${pod?.name} ` || ""} details`);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  if (!!pod) {
    return (
      <>
        <h4>Storage</h4>
        <KVMSummaryStorage id={pod.id} />
        <hr />
        <h4>Machines</h4>
        <MachineListTable filter={`pod-id:=${pod.id}`} showActions={false} />
      </>
    );
  }
  return null;
};

export default KVMSummary;
