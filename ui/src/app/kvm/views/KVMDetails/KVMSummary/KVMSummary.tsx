import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";

import type { RootState } from "app/store/root/types";
import MachineListTable from "app/machines/views/MachineList/MachineListTable";

const KVMSummary = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );

  useWindowTitle(`KVM ${`${pod?.name} ` || ""} details`);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  return <MachineListTable filter={`pod-id:=${id}`} showActions={false} />;
};

export default KVMSummary;
