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
    getTableData({ fabrics, vlans, subnets, spaces }, "fabric")[0]?.fabric
  ).toStrictEqual({
    href: "/fabric/1",
    isVisuallyHidden: false,
    label: "test-fabric",
  });

  expect(
    getTableData({ fabrics, vlans, subnets, spaces }, "fabric")[1]?.fabric
  ).toStrictEqual({
    href: "/fabric/1",
    isVisuallyHidden: true,
    label: "test-fabric",
  });

  expect(
    getTableData({ fabrics, vlans, subnets, spaces }, "fabric")[2]?.fabric
  ).toStrictEqual({
    href: "/fabric/2",
    isVisuallyHidden: false,
    label: "test-fabric",
  });
});

test("getTableData returns fabrics sorted in a correct order", () => {
  const fabrics = [
    fabricFactory({ id: 1, name: "fabric-1" }),
    fabricFactory({ id: 2, name: "1 fabric" }),
    fabricFactory({ id: 10, name: "fabric-10" }),
  ];
  const expectedOrder = ["1 fabric", "fabric-1", "fabric-10"];
  const tableData = getTableData(
    { fabrics, vlans: [], subnets: [], spaces: [] },
    "fabric"
  );
  expect(tableData).toHaveLength(3);
  tableData.forEach((row, index) => {
    expect(row.fabric.label).toEqual(expectedOrder[index]);
  });
});

test("getTableData returns spaces sorted in a correct order", () => {
  const spaces = [
    spaceFactory({ id: 1, name: "space-1" }),
    spaceFactory({ id: 2, name: "1 space" }),
    spaceFactory({ id: 10, name: "space-10" }),
  ];
  const expectedOrder = ["1 space", "space-1", "space-10"];
  const tableData = getTableData(
    { fabrics: [], vlans: [], subnets: [], spaces },
    "space"
  );
  expect(tableData).toHaveLength(3);
  tableData.forEach((row, index) => {
    expect(row.space.label).toEqual(expectedOrder[index]);
  });
});
