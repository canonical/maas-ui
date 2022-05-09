import type { BasePod } from "app/store/pod/types";
import type { VMCluster } from "app/store/vmcluster/types";
import { argPath } from "app/utils";

const urls = {
  kvm: "/kvm",
  lxd: {
    cluster: {
      edit: argPath<{ clusterId: VMCluster["id"] }>(
        "/kvm/lxd/cluster/:clusterId/edit"
      ),
      host: {
        edit: argPath<{ clusterId: VMCluster["id"]; hostId: BasePod["id"] }>(
          "/kvm/lxd/cluster/:clusterId/host/:hostId/edit"
        ),
        index: argPath<{ clusterId: VMCluster["id"]; hostId: BasePod["id"] }>(
          "/kvm/lxd/cluster/:clusterId/host/:hostId"
        ),
      },
      hosts: argPath<{ clusterId: VMCluster["id"] }>(
        "/kvm/lxd/cluster/:clusterId/hosts"
      ),
      index: argPath<{ clusterId: VMCluster["id"] }>(
        "/kvm/lxd/cluster/:clusterId"
      ),
      resources: argPath<{ clusterId: VMCluster["id"] }>(
        "/kvm/lxd/cluster/:clusterId/resources"
      ),
      vms: {
        host: argPath<{ clusterId: VMCluster["id"]; hostId: BasePod["id"] }>(
          "/kvm/lxd/cluster/:clusterId/vms/:hostId"
        ),
        index: argPath<{ clusterId: VMCluster["id"] }>(
          "/kvm/lxd/cluster/:clusterId/vms"
        ),
      },
    },
    index: "/kvm/lxd",
    single: {
      edit: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id/edit"),
      index: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id"),
      resources: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id/resources"),
      vms: argPath<{ id: BasePod["id"] }>("/kvm/lxd/:id/vms"),
    },
  },
  virsh: {
    details: {
      edit: argPath<{ id: BasePod["id"] }>("/kvm/virsh/:id/edit"),
      index: argPath<{ id: BasePod["id"] }>("/kvm/virsh/:id"),
      resources: argPath<{ id: BasePod["id"] }>("/kvm/virsh/:id/resources"),
    },
    index: "/kvm/virsh",
  },
};

export default urls;
