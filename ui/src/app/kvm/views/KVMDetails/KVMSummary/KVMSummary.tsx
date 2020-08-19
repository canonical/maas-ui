import { Code, Spinner } from "@canonical/react-components";
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

export const fakeNumas = [
  {
    cores: { allocated: 1, free: 2, total: 3 },
    index: 0,
    nics: ["eth0", "eth2"],
    ram: {
      general: {
        allocated: 12,
        free: 12,
        total: 24,
        unit: "GiB",
      },
      hugepage: {
        allocated: 540,
        free: 420,
        pagesize: 4068,
        total: 960,
        unit: "MiB",
      },
    },
    vfs: { allocated: 13, free: 1, total: 14 },
  },
  {
    cores: { allocated: 200, free: 100, total: 300 },
    index: 1,
    nics: ["eth1", "eth3"],
    ram: {
      general: {
        allocated: 3,
        free: 1,
        total: 4,
        unit: "GiB",
      },
      hugepage: {
        allocated: 1,
        free: 1,
        pagesize: 2048,
        total: 2,
        unit: "GiB",
      },
    },
    vfs: { allocated: 18, free: 226, total: 242 },
  },
];

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
    // Fetch the IP address that is contained in the power_address. This is the
    // only place the IP address is exposed.
    const ip_address = pod.power_address.match(/[\d.]+/)[0];
    return (
      <>
        <div className="u-flex">
          <p className="u-nudge-left">
            {pod.type === "virsh" ? "Virsh:" : "LXD URL:"}
          </p>
          <Code copyable className="u-flex--grow">
            {ip_address}
          </Code>
        </div>
        <hr className="u-sv1" />
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
          <KVMNumaResources numaNodes={fakeNumas} />
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
