import { Route, Routes } from "react-router-dom-v5-compat";

import KVMList from "./KVMList";
import LXDClusterDetails from "./LXDClusterDetails";
import LXDSingleDetails from "./LXDSingleDetails";
import VirshDetails from "./VirshDetails";

import kvmURLs from "app/kvm/urls";
import { getRelativeRoute } from "app/utils";

const KVM = (): JSX.Element => {
  const base = kvmURLs.kvm;
  return (
    <Routes>
      <Route element={<KVMList />} path="/" />
      <Route
        element={<KVMList />}
        path={getRelativeRoute(kvmURLs.lxd.index, base)}
      />
      <Route
        element={<KVMList />}
        path={getRelativeRoute(kvmURLs.virsh.index, base)}
      />
      <Route
        element={<LXDClusterDetails />}
        path={`${getRelativeRoute(
          kvmURLs.lxd.cluster.index(null, true),
          base
        )}/*`}
      />
      <Route
        element={<LXDSingleDetails />}
        path={`${getRelativeRoute(
          kvmURLs.lxd.single.index(null, true),
          base
        )}/*`}
      />
      <Route
        element={<VirshDetails />}
        path={`${getRelativeRoute(
          kvmURLs.virsh.details.index(null, true),
          base
        )}/*`}
      />
    </Routes>
  );
};

export default KVM;
