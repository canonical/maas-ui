import React from "react";

import { useWindowTitle } from "app/base/hooks";
import KVMListHeader from "./KVMListHeader";
import KVMListTable from "./KVMListTable";
import Section from "app/base/components/Section";

const KVMList = () => {
  useWindowTitle("KVM");

  return (
    <Section title={<KVMListHeader />}>
      <KVMListTable />
    </Section>
  );
};

export default KVMList;
