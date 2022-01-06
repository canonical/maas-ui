import { Route, Switch } from "react-router-dom";

import KVMList from "./KVMList";
import LXDClusterDetails from "./LXDClusterDetails";
import LXDSingleDetails from "./LXDSingleDetails";
import VirshDetails from "./VirshDetails";

import NotFound from "app/base/views/NotFound";
import kvmURLs from "app/kvm/urls";

const KVM = (): JSX.Element => {
  return (
    <Switch>
      {[kvmURLs.kvm, kvmURLs.lxd.index, kvmURLs.virsh.index].map((path) => (
        <Route exact key={path} path={path}>
          <KVMList />
        </Route>
      ))}
      {[
        kvmURLs.lxd.cluster.index(null, true),
        kvmURLs.lxd.cluster.edit(null, true),
        kvmURLs.lxd.cluster.host.edit(null, true),
        kvmURLs.lxd.cluster.host.index(null, true),
        kvmURLs.lxd.cluster.hosts(null, true),
        kvmURLs.lxd.cluster.resources(null, true),
        kvmURLs.lxd.cluster.vms.host(null, true),
        kvmURLs.lxd.cluster.vms.index(null, true),
      ].map((path) => (
        <Route exact key={path} path={path}>
          <LXDClusterDetails />
        </Route>
      ))}
      {[
        kvmURLs.lxd.single.index(null, true),
        kvmURLs.lxd.single.edit(null, true),
        kvmURLs.lxd.single.resources(null, true),
        kvmURLs.lxd.single.vms(null, true),
      ].map((path) => (
        <Route exact key={path} path={path}>
          <LXDSingleDetails />
        </Route>
      ))}
      {[
        kvmURLs.virsh.details.index(null, true),
        kvmURLs.virsh.details.edit(null, true),
        kvmURLs.virsh.details.resources(null, true),
      ].map((path) => (
        <Route exact key={path} path={path}>
          <VirshDetails />
        </Route>
      ))}
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default KVM;
