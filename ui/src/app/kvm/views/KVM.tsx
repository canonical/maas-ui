import { Route, Switch } from "react-router-dom";

import KVMDetails from "./KVMDetails";
import KVMList from "./KVMList";

import NotFound from "app/base/views/NotFound";
import kvmURLs from "app/kvm/urls";

const KVM = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={[kvmURLs.kvm, kvmURLs.lxd.index, kvmURLs.virsh.index]}>
        <KVMList />
      </Route>
      <Route
        exact
        path={[
          kvmURLs.lxd.single.edit(null, true),
          kvmURLs.lxd.single.index(null, true),
          kvmURLs.lxd.single.resources(null, true),
          kvmURLs.lxd.single.vms(null, true),
          kvmURLs.virsh.details.edit(null, true),
          kvmURLs.virsh.details.index(null, true),
          kvmURLs.virsh.details.resources(null, true),
        ]}
      >
        <KVMDetails />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default KVM;
