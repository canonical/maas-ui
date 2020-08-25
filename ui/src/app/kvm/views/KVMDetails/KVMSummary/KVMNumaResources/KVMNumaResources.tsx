import React from "react";

import KVMResourcesCard from "app/kvm/components/KVMResourcesCard";

const fakeNumas = [
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

const KVMNumaResources = (): JSX.Element => {
  return (
    <div className="numa-resources-grid">
      {fakeNumas.map((numa) => (
        <KVMResourcesCard
          cores={numa.cores}
          key={numa.index}
          nics={numa.nics}
          ram={numa.ram}
          title={`NUMA node ${numa.index}`}
          vfs={numa.vfs}
        />
      ))}
    </div>
  );
};

export default KVMNumaResources;
