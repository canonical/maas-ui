import { getTableData } from "./utils";

import {
  fabric as fabricFactory,
  vlan as vlanFactory,
  subnet as subnetFactory,
  space as spaceFactory,
} from "testing/factories";

test("getTableData generates correct sortData for fabric", () => {
  const fabrics = [fabricFactory({ id: 1, vlan_ids: [1] })];
  const vlans = [vlanFactory({ id: 1, fabric: 1 })];
  const subnets = [subnetFactory({ vlan: 1, cidr: "172.16.1.0/24" })];
  const spaces = [spaceFactory({ vlan_ids: [1] })];
  expect(
    getTableData({ fabrics, vlans, subnets, spaces }, "fabric")[0].sortData
  ).toEqual({
    cidr: "172.16.1.0/24",
    fabricId: 1,
    fabricName: "test-fabric",
    spaceName: "no space",
    vlanId: 1,
  });
});

test("getTableData returns grouped fabrics in a correct format", () => {
  const fabrics = [
    fabricFactory({ id: 1, vlan_ids: [1] }),
    fabricFactory({ id: 2 }),
  ];
  const vlans = [vlanFactory({ fabric: 1 }), vlanFactory({ fabric: 1 })];
  const subnets = [subnetFactory(), subnetFactory()];
  const spaces = [spaceFactory()];

  expect(
    getTableData({ fabrics, vlans, subnets, spaces }, "fabric")[0]?.columns
      .fabric
  ).toStrictEqual({
    href: "/MAAS/l/fabric/1",
    isVisuallyHidden: false,
    label: "test-fabric",
  });

  expect(
    getTableData({ fabrics, vlans, subnets, spaces }, "fabric")[1]?.columns
      .fabric
  ).toStrictEqual({
    href: "/MAAS/l/fabric/1",
    isVisuallyHidden: true,
    label: "test-fabric",
  });

  expect(
    getTableData({ fabrics, vlans, subnets, spaces }, "fabric")[2]?.columns
      .fabric
  ).toStrictEqual({
    href: "/MAAS/l/fabric/2",
    isVisuallyHidden: false,
    label: "test-fabric",
  });
});
