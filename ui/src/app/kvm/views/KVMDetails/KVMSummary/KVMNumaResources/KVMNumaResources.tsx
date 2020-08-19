import React from "react";

import KVMResourcesCard from "app/kvm/components/KVMResourcesCard";

const fakeNumas = [{ index: 0 }, { index: 1 }];

const KVMNumaResources = (): JSX.Element => {
  return (
    <div className="numa-resources-grid">
      {fakeNumas.map((numa) => (
        <KVMResourcesCard key={numa.index} title={`NUMA node ${numa.index}`} />
      ))}
    </div>
  );
};

export default KVMNumaResources;
