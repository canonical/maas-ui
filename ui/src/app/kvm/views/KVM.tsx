import { Route, Switch } from "react-router-dom";

import KVMDetails from "./KVMDetails";
import KVMList from "./KVMList";

import NotFound from "app/base/views/NotFound";
import kvmURLs from "app/kvm/urls";

const KVM = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={[kvmURLs.kvm, kvmURLs.add]}>
        <KVMList />
      </Route>
      <Route
        exact
        path={[
          kvmURLs.details(null, true),
          kvmURLs.edit(null, true),
          kvmURLs.project(null, true),
          kvmURLs.resources(null, true),
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
