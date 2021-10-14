import type { BasePod } from "app/store/pod/types";
import type { VMCluster } from "app/store/vmcluster/types";
import { argPath } from "app/utils";

const urls = {
  kvm: "/kvm",
  lxd: {
    index: "/kvm/lxd",
    cluster: {
      index: argPath<{ clusterId: VMCluster["id"] }>(
        "/kvm/lxd/cluster/:clusterId"
      ),
      edit: argPath<{ clusterId: VMCluster["id"] }>(
        "/kvm/lxd/cluster/:clusterId/edit"
      ),
      hosts: argPath<{ clusterId: VMCluster["id"] }>(
        "/kvm/lxd/cluster/:clusterId/hosts"
      ),
      host: {
        index: argPath<{ clusterId: VMCluster["id"]; hostId: BasePod["id"] }>(
          "/kvm/lxd/cluster/:clusterId/host/:hostId"
        ),
        edit: argPath<{ clusterId: VMCluster["id"]; hostId: BasePod["id"] }>(
          "/kvm/lxd/cluster/:clusterId/host/:hostId/edit"
        ),
      },
      resources: argPath<{ clusterId: VMCluster["id"] }>(
        "/kvm/lxd/cluster/:clusterId/resources"
      ),
      vms: {
        index: argPath<{ clusterId: VMCluster["id"] }>(
          "/kvm/lxd/cluster/:clusterId/vms"
        ),
        host: argPath<{ clusterId: VMCluster["id"]; hostId: BasePod["id"] }>(
          "/kvm/lxd/cluster/:clusterId/vms/:hostId"
        ),
      },
    },
    single: {
      index: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id"),
      edit: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id/edit"),
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
