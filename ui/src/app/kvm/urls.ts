import type { BasePod } from "app/store/pod/types";
import { argPath } from "app/utils";

const urls = {
  details: argPath<{ id: BasePod["id"] }>("/kvm/:id"),
  edit: argPath<{ id: BasePod["id"] }>("/kvm/:id/edit"),
  kvm: "/kvm",
  lxd: "/kvm/lxd",
  project: argPath<{ id: BasePod["id"] }>("/kvm/:id/project"),
  resources: argPath<{ id: BasePod["id"] }>("/kvm/:id/resources"),
  virsh: "/kvm/virsh",
};

export default urls;
