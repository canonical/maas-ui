import { Route, Switch } from "react-router-dom";

import AddKVMForm from "./AddKVMForm";
import KVMListHeader from "./KVMListHeader";
import KVMListTable from "./KVMListTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";

const KVMList = (): JSX.Element => {
  useWindowTitle("KVM");

  return (
    <Section header={<KVMListHeader />} headerClassName="u-no-padding--bottom">
      <Switch>
        <Route exact path="/kvm">
          <KVMListTable />
        </Route>
        <Route exact path="/kvm/add">
          <AddKVMForm />
        </Route>
      </Switch>
    </Section>
  );
};

export default KVMList;
