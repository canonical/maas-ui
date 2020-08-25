import { Spinner } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import type { RootState } from "app/store/root/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { useWindowTitle } from "app/base/hooks";
import KVMAggregateResources from "./KVMAggregateResources";
import KVMNumaResources from "./KVMNumaResources";
import KVMStorage from "./KVMStorage";
import Switch from "app/base/components/Switch";

type RouteParams = {
  id: string;
};

const KVMSummary = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const [viewByNuma, setViewByNuma] = useState(false);

  useWindowTitle(`KVM ${`${pod?.name} ` || ""} details`);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  if (!!pod) {
    return (
      <>
        <div className="u-flex--between">
          <h4 className="u-sv1">Resources</h4>
          <Switch
            checked={viewByNuma}
            className="p-switch--inline-label"
            data-test="numa-switch"
            label="View by NUMA node"
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              setViewByNuma(evt.target.checked);
            }}
          />
        </div>
        {viewByNuma ? (
          <KVMNumaResources />
        ) : (
          <KVMAggregateResources id={pod.id} />
        )}
        <KVMStorage id={pod.id} />
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMSummary;
