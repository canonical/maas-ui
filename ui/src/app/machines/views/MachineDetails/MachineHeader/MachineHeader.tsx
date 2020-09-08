import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import React, { useEffect } from "react";

import { machine as machineActions } from "app/base/actions";
import machineSelectors from "app/store/machine/selectors";
import SectionHeader from "app/base/components/SectionHeader";
import type { RootState } from "app/store/root/types";

type RouteParams = {
  id: string;
};

const MachineHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const loading = useSelector(machineSelectors.loading);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useEffect(() => {
    dispatch(machineActions.get(id));
  }, [dispatch, id]);

  return (
    <SectionHeader loading={loading || !machine} title={machine?.fqdn || ""} />
  );
};

export default MachineHeader;
