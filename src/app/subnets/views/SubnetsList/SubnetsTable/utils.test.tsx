import {
  filterSubnetsBySearchText,
  getTableData,
  groupRowsByFabric,
  groupRowsBySpace,
  groupSubnetData,
} from "./utils";

import * as factory from "@/testing/factories";

test("getTableData generates correct sortData for fabric", () => {
  const fabrics = [factory.fabric({ id: 1, vlan_ids: [1] })];
  const vlans = [factory.vlan({ id: 1, fabric: 1, subnet_ids: [1] })];
  const subnets = [factory.subnet({ vlan: 1, cidr: "172.16.1.0/24" })];
  const spaces = [factory.space({ vlan_ids: [1] })];
  expect(
    getTableData({ fabrics, vlans, subnets, spaces }, "fabric")[0].sortData
  ).toEqual({
    cidr: "172.16.1.0/24",
    fabricId: 1,
    fabricName: fabrics[0].name,
    spaceName: "no space",
    vlanId: 1,
  });
});

test("getTableData returns fabrics sorted in a correct order", () => {
  const fabrics = [
    factory.fabric({ id: 1, name: "fabric-1" }),
    factory.fabric({ id: 2, name: "1 fabric" }),
    factory.fabric({ id: 10, name: "fabric-10" }),
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
    factory.space({ id: 1, name: "space-1" }),
    factory.space({ id: 2, name: "1 space" }),
    factory.space({ id: 10, name: "space-10" }),
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

test("groupRowsBySpace returns grouped spaces in a correct format", () => {
  const fabrics = [factory.fabric({ id: 1, vlan_ids: [1, 2, 3] })];
  const vlans = [
    factory.vlan({ vid: 1, fabric: 1, space: 1 }),
    factory.vlan({ vid: 2, fabric: 1, space: 1 }),
    factory.vlan({ vid: 3, fabric: 1, space: 2 }),
  ];
  const subnets = [factory.subnet(), factory.subnet()];
  const spaces = [
    factory.space({ id: 1, name: "space-1" }),
    factory.space({ id: 2, name: "space-2" }),
  ];
  const tableData = getTableData({ fabrics, vlans, subnets, spaces }, "fabric");

  expect(groupRowsBySpace(tableData)[0].spaceName).toBe(spaces[0].name);
  expect(groupRowsBySpace(tableData)[0].networks[0]).toStrictEqual(
    tableData[0]
  );
});

test("filterSubnetsBySearchText matches a correct number of results with each value", () => {
  const fabrics = [
    factory.fabric({ id: 1, vlan_ids: [1], name: "test-fabric-1" }),
    factory.fabric({ id: 2, name: "test-fabric-2" }),
    factory.fabric({ id: 3, name: "test-fabric-3" }),
  ];
  const vlans = [
    factory.vlan({
      id: 1,
      fabric: 1,
      space: 1,
      name: "test-vlan",
      subnet_ids: [1],
    }),
  ];
  const subnets = [factory.subnet({ cidr: "172.16.1.0/24", vlan: 1, id: 1 })];
  const spaces = [factory.space({ id: 1, name: "space-1" })];
  const tableRows = getTableData({ fabrics, vlans, subnets, spaces }, "fabric");

  expect(tableRows).toHaveLength(3);
  expect(filterSubnetsBySearchText(tableRows, "test-fabric-1")).toHaveLength(1);
  expect(filterSubnetsBySearchText(tableRows, "test-vlan")).toHaveLength(1);
  expect(filterSubnetsBySearchText(tableRows, "172.16.1.0")).toHaveLength(1);
});

test("groupRowsByFabric returns grouped rows in a correct format", () => {
  const fabrics = [
    factory.fabric({ id: 1, vlan_ids: [1] }),
    factory.fabric({ id: 2 }),
  ];
  const vlans = [factory.vlan({ fabric: 1 }), factory.vlan({ fabric: 1 })];
  const subnets = [factory.subnet(), factory.subnet()];
  const spaces = [factory.space()];
  const tableData = getTableData({ fabrics, vlans, subnets, spaces }, "fabric");

  expect(groupRowsByFabric(tableData)[0].fabricId).toBe(fabrics[0].id);
  expect(groupRowsByFabric(tableData)[0].networks[0]).toStrictEqual(
    tableData[0]
  );
});

test("groupSubnetData returns grouped data in a correct format", () => {
  const fabrics = [
    factory.fabric({ id: 1, vlan_ids: [1] }),
    factory.fabric({ id: 2 }),
  ];
  const vlans = [factory.vlan({ fabric: 1 }), factory.vlan({ fabric: 1 })];
  const subnets = [factory.subnet(), factory.subnet()];
  const spaces = [factory.space()];
  const tableData = getTableData({ fabrics, vlans, subnets, spaces }, "fabric");

  expect(groupSubnetData(tableData)).toStrictEqual({
    "test-fabric-11": { count: 2 },
    "test-fabric-12": { count: 1 },
  });
  expect(groupSubnetData(tableData, "space")).toStrictEqual({
    "no space": { count: 3 },
  });
});
