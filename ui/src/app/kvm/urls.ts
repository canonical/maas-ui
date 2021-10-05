import type { BasePod } from "app/store/pod/types";
import type { VMCluster } from "app/store/vmcluster/types";
import { argPath } from "app/utils";

const urls = {
  kvm: "/kvm",
  lxd: {
    index: "/kvm/lxd",
    cluster: {
      index: argPath<{ id: VMCluster["id"] }>("/kvm/lxd/cluster/:id"),
      hosts: argPath<{ id: VMCluster["id"] }>("/kvm/lxd/cluster/:id/hosts"),
      host: {
        index: argPath<{ id: VMCluster["id"]; hostId: BasePod["id"] }>(
          "/kvm/lxd/cluster/:id/host/:hostId"
        ),
        edit: argPath<{ id: VMCluster["id"]; hostId: BasePod["id"] }>(
          "/kvm/lxd/cluster/:id/host/:hostId/edit"
        ),
      },
      resources: argPath<{ id: VMCluster["id"] }>(
        "/kvm/lxd/cluster/:id/resources"
      ),
      vms: {
        index: argPath<{ id: VMCluster["id"] }>("/kvm/lxd/cluster/:id/vms"),
        host: argPath<{ id: VMCluster["id"]; hostId: BasePod["id"] }>(
          "/kvm/lxd/cluster/:id/vms/:hostId"
        ),
      },
    },
    single: {
      index: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id"),
      edit: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id/edit"),
      hosts: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id/hosts"),
      resources: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id/resources"),
      vms: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id/vms"),
    },
  },
  virsh: {
    index: "/kvm/virsh",
    details: {
      index: argPath<{ id: BasePod["id"] }>("/kvm/virsh/:id"),
      edit: argPath<{ id: BasePod["id"] }>("/kvm/virsh/:id/edit"),
      resources: argPath<{ id: BasePod["id"] }>("/kvm/virsh/:id/resources"),
    },
  },
};

export default urls;
