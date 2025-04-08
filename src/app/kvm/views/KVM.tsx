import { useEffect } from "react";

import { Route, Routes } from "react-router";

import KVMList from "./KVMList";
import LXDClusterDetails from "./LXDClusterDetails";
import LXDSingleDetails from "./LXDSingleDetails";
import VirshDetails from "./VirshDetails";

import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import { getRelativeRoute } from "@/app/utils";

const KVM = (): React.ReactElement => {
  const { setSidePanelContent } = useSidePanel();
  const base = urls.kvm.index;

  useEffect(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  return (
    <Routes>
      <Route element={<KVMList />} path="/" />
      <Route
        element={<KVMList />}
        path={getRelativeRoute(urls.kvm.lxd.index, base)}
      />
      <Route
        element={<KVMList />}
        path={getRelativeRoute(urls.kvm.virsh.index, base)}
      />
      <Route
        element={<LXDClusterDetails />}
        path={`${getRelativeRoute(urls.kvm.lxd.cluster.index(null), base)}/*`}
      />
      <Route
        element={<LXDSingleDetails />}
        path={`${getRelativeRoute(urls.kvm.lxd.single.index(null), base)}/*`}
      />
      <Route
        element={<VirshDetails />}
        path={`${getRelativeRoute(urls.kvm.virsh.details.index(null), base)}/*`}
      />
    </Routes>
  );
};

export default KVM;
