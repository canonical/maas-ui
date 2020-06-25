import React from "react";
import { Route, Switch } from "react-router-dom";

import { useWindowTitle } from "app/base/hooks";
import AddKVMForm from "./AddKVMForm";
import KVMListHeader from "./KVMListHeader";
import KVMListTable from "./KVMListTable";
import Section from "app/base/components/Section";

const KVMList = (): JSX.Element => {
  useWindowTitle("KVM");

  return (
    <Section headerClassName="u-no-padding--bottom" title={<KVMListHeader />}>
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
