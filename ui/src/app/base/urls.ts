import type { Controller } from "app/store/controller/types";
import type { Fabric } from "app/store/fabric/types";
import type { Subnet } from "app/store/subnet/types";
import type { VLAN } from "app/store/vlan/types";
import type { Zone } from "app/store/zone/types";
import { argPath } from "app/utils";

const urls = {
  controller: argPath<{ id: Controller["system_id"] }>("/controller/:id"),
  controllers: "/controllers",
  fabric: argPath<{ id: Fabric["id"] }>("/fabric/:id"),
  images: "/images",
  index: "/",
  intro: {
    index: "/intro",
    user: "/intro/user",
  },
  subnet: argPath<{ id: Subnet["id"] }>("/subnet/:id"),
  vlan: argPath<{ id: VLAN["id"] }>("/vlan/:id"),
  zone: argPath<{ id: Zone["id"] }>("/zone/:id"),
};

export default urls;
