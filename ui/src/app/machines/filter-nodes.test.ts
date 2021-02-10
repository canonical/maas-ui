import filterNodes from "./filter-nodes";

import type { Machine } from "app/store/machine/types";
import { NodeStatus } from "app/store/types/node";
import { machine as machineFactory } from "testing/factories";

describe("filterNodes", () => {
  // If a scenario is not provided `result`, `nodes` or `selected` then the
  // following defaults are used.
  const DEFAULT_RESULT = [0];
  const DEFAULT_NODES = [
    machineFactory({ hostname: "name" }),
    machineFactory({ hostname: "other" }),
  ];
  const DEFAULT_SELECTED: Machine["system_id"][] = [];
  // These are common nodes to prevent duplication:
  const tagNodes = [
    machineFactory({ tags: ["first", "second"] }),
    machineFactory({ tags: ["second", "third"] }),
  ];

  // The `result` parameter should be an array of indexes that get mapped to
  // the `nodes` array.
  const scenarios = [
    {
      description: "handles no filters",
      filter: "hostname:(=",
      result: [0, 1],
    },
    {
      description: "matches using free search",
      filter: "nam",
    },
    {
      description: "matches free search that starts with a number",
      filter: "1nam",
      nodes: [
        machineFactory({ hostname: "1name" }),
        machineFactory({
          hostname: "name2",
          // It shouldn't match this node by turning "1nam" in an integer of 1.
          bmc: 1,
        }),
      ],
      result: [0],
    },
    {
      description: "doesn't return duplicates using free search",
      filter: "nam am",
      nodes: [
        machineFactory({ hostname: "name", pod: { id: 1, name: "name" } }),
        machineFactory({ hostname: "other" }),
      ],
    },
    {
      description: "accumulates matches using free search",
      filter: "failed commissioning",
      nodes: [
        machineFactory({ status: NodeStatus.FAILED_COMMISSIONING }),
        machineFactory({ status: NodeStatus.FAILED_DEPLOYMENT }),
      ],
    },
    {
      description: "accumulates matches using free search including negatives",
      filter: "failed !commissioning",
      nodes: [
        machineFactory({ status: NodeStatus.FAILED_COMMISSIONING }),
        machineFactory({ status: NodeStatus.FAILED_DEPLOYMENT }),
      ],
      result: [1],
    },
    {
      description: "matches selected uppercase",
      filter: "in:Selected",
      nodes: [
        machineFactory({ system_id: "1" }),
        machineFactory({ system_id: "2" }),
      ],
      selected: ["1"],
    },
    {
      description: "matches selected uppercase in brackets",
      filter: "in:(Selected)",
      nodes: [
        machineFactory({ system_id: "1" }),
        machineFactory({ system_id: "2" }),
      ],
      selected: ["1"],
    },
    {
      description: "matches non-selected",
      filter: "in:!selected",
      nodes: [
        machineFactory({ system_id: "1" }),
        machineFactory({ system_id: "2" }),
      ],
      selected: ["2"],
    },
    {
      description: "matches non-selected uppercase",
      filter: "in:!Selected",
      nodes: [
        machineFactory({ system_id: "1" }),
        machineFactory({ system_id: "2" }),
      ],
      selected: ["2"],
    },
    {
      description: "matches non-selected uppercase in brackets",
      filter: "in:(!Selected)",
      nodes: [
        machineFactory({ system_id: "1" }),
        machineFactory({ system_id: "2" }),
      ],
      selected: ["2"],
    },
    {
      description: "accumulates selected matches",
      filter: "new in:selected",
      nodes: [
        machineFactory({ status: NodeStatus.NEW, system_id: "1" }),
        machineFactory({ status: NodeStatus.NEW, system_id: "2" }),
      ],
      selected: ["1"],
    },
    {
      description: "accumulates non-selected matches",
      filter: "new in:!selected",
      nodes: [
        machineFactory({ status: NodeStatus.NEW, system_id: "1" }),
        machineFactory({ status: NodeStatus.NEW, system_id: "2" }),
      ],
      selected: ["2"],
    },
    {
      description: "matches on attribute",
      filter: "hostname:name",
    },
    {
      description: "matches on attribute that starts with a number",
      filter: "hostname:1nam",
      nodes: [
        machineFactory({ hostname: "1name" }),
        machineFactory({
          // It shouldn't match this node by turning "1nam" in an integer of 1.
          hostname: "1",
        }),
      ],
      result: [0],
    },
    {
      description: "matches with contains on attribute",
      filter: "hostname:na",
    },
    {
      description: "matches on negating attribute",
      filter: "hostname:!other",
    },
    {
      description: "matches on exact attribute",
      filter: "hostname:=other",
      nodes: [
        machineFactory({ hostname: "other" }),
        machineFactory({ hostname: "other2" }),
      ],
    },
    {
      description: "matches on array",
      filter: "fabrics:first",
      nodes: [
        machineFactory({ fabrics: ["name", "first"] }),
        machineFactory({ fabrics: ["other", "second"] }),
      ],
    },
    {
      description: "accumulates matches on attribute",
      filter: "hostname:name status:New",
      nodes: [
        machineFactory({ hostname: "name", status: NodeStatus.NEW }),
        machineFactory({
          hostname: "name2",
          status: NodeStatus.FAILED_DEPLOYMENT,
        }),
      ],
    },
    {
      description: "accumulates matches on negated attribute",
      filter: "hostname:name status:!New",
      nodes: [
        machineFactory({
          hostname: "name",
          status: NodeStatus.FAILED_DEPLOYMENT,
        }),
        machineFactory({ hostname: "name2", status: NodeStatus.NEW }),
      ],
    },
    {
      description: "matches integer values",
      filter: "storage:3",
      nodes: [machineFactory({ storage: 4 }), machineFactory({ storage: 2 })],
    },
    {
      description: "matches float values",
      filter: "storage:1.5",
      nodes: [
        machineFactory({ storage: 2.2 }),
        machineFactory({ storage: 1.1 }),
      ],
    },
    {
      description: "matches using cpu mapping function",
      filter: "cpu:3",
      nodes: [
        machineFactory({ cpu_count: 4 }),
        machineFactory({ cpu_count: 2 }),
      ],
    },
    {
      description: "matches using cores mapping function",
      filter: "cores:3",
      nodes: [
        machineFactory({ cpu_count: 4 }),
        machineFactory({ cpu_count: 2 }),
      ],
    },
    {
      description: "matches using ram mapping function",
      filter: "ram:2000",
      nodes: [
        machineFactory({ memory: 2048 }),
        machineFactory({ memory: 1024 }),
      ],
    },
    {
      description: "matches using mac mapping function",
      filter: "mac:aa:bb:cc:dd:ee:ff",
      nodes: [
        machineFactory({
          pxe_mac: "00:11:22:33:44:55",
          extra_macs: ["aa:bb:cc:dd:ee:ff"],
        }),
        machineFactory({
          pxe_mac: "66:11:22:33:44:55",
          extra_macs: ["00:bb:cc:dd:ee:ff"],
        }),
      ],
    },
    {
      description: "matches using mac mapping function",
      filter: "zone:first",
      nodes: [
        machineFactory({ zone: { id: 1, name: "first" } }),
        machineFactory({ zone: { id: 2, name: "second" } }),
      ],
    },
    {
      description: "matches using pool mapping function",
      filter: "pool:pool1",
      nodes: [
        machineFactory({ pool: { id: 1, name: "pool1" } }),
        machineFactory({ pool: { id: 2, name: "pool2" } }),
      ],
    },
    {
      description: "matches using pod mapping function",
      filter: "pod:pod1",
      nodes: [
        machineFactory({ pod: { id: 1, name: "pod1" } }),
        machineFactory({ pod: { id: 2, name: "pod2" } }),
      ],
    },
    {
      description: "matches using pod-id mapping function",
      filter: "pod-id:=1",
      nodes: [
        machineFactory({ pod: { name: "pod1", id: 1 } }),
        machineFactory({ pod: { name: "pod2", id: 2 } }),
      ],
    },
    {
      description: "matches using power mapping function",
      filter: "power:on",
      nodes: [
        machineFactory({ power_state: "on" }),
        machineFactory({ power_state: "off" }),
      ],
    },
    {
      description: "matches accumulate",
      filter: "power:on zone:first",
      nodes: [
        machineFactory({
          power_state: "on",
          zone: { id: 1, name: "first" },
        }),
        machineFactory({
          power_state: "on",
          zone: { id: 2, name: "second" },
        }),
      ],
    },
    {
      description: "matches a tag",
      filter: "tags:first",
      nodes: tagNodes,
    },
    {
      description: "matches a negated tag",
      filter: "tags:!third",
      nodes: tagNodes,
    },
    {
      description: "matches a negated tag with parens",
      filter: "tags:(!third)",
      nodes: tagNodes,
    },
    {
      description: "matches a negated tag with the parens negated",
      filter: "tags:!(third)",
      nodes: tagNodes,
    },
    {
      description: "matches a double negated tag",
      filter: "tags:!!first",
      nodes: tagNodes,
    },
    {
      description: "matches a double negated tag with parens",
      filter: "tags:(!!first)",
      nodes: tagNodes,
    },
    {
      description: "matches a tag with the parens double negated",
      filter: "tags:!!(first)",
      nodes: tagNodes,
    },
    {
      description: "matches a negated tag with the parens double negated",
      filter: "tags:!!(!first)",
      nodes: tagNodes,
      result: [1],
    },
    {
      description:
        "matches a double negated tag with the parens double negated",
      filter: "tags:!!(!!first)",
      nodes: tagNodes,
    },
    {
      description: "matches a double negated tag with in and outside negated",
      filter: "tags:!(!first)",
      nodes: tagNodes,
    },
    {
      description: "matches a direct and a negated tag",
      filter: "tags:(first,!third)",
      nodes: tagNodes,
    },
    {
      description: "matches an exact direct and a negated tag",
      filter: "tags:(=first,!third)",
      nodes: tagNodes,
    },
    {
      description: "matches two negated tags",
      filter: "tags:(!second,!third)",
      nodes: [
        machineFactory({ tags: ["first", "second"] }),
        machineFactory({ tags: ["second", "third"] }),
        machineFactory({ tags: ["fourth", "fifth"] }),
      ],
      result: [2],
    },
    {
      description: "matches tags and free search",
      filter: "fourth tags:(!second,!first)",
      nodes: [
        machineFactory({ tags: ["first", "second"] }),
        machineFactory({ tags: ["second", "third"] }),
        machineFactory({ tags: ["fourth", "fifth"] }),
      ],
      result: [2],
    },
    {
      description: "matches tags and attribute",
      filter: "status:New tags:(!second,!first)",
      nodes: [
        machineFactory({ status: NodeStatus.NEW, tags: ["first", "second"] }),
        machineFactory({
          status: NodeStatus.FAILED_DEPLOYMENT,
          tags: ["second", "third"],
        }),
        machineFactory({ status: NodeStatus.NEW, tags: ["fourth", "fifth"] }),
      ],
      result: [2],
    },
    {
      description: "matches tags and negated attribute",
      filter: "status:!New tags:(!fourth,!first)",
      nodes: [
        machineFactory({ status: NodeStatus.NEW, tags: ["first", "second"] }),
        machineFactory({ status: NodeStatus.NEW, tags: ["sixth", "second"] }),
        machineFactory({
          status: NodeStatus.FAILED_DEPLOYMENT,
          tags: ["second", "third"],
        }),
        machineFactory({ status: NodeStatus.NEW, tags: ["fourth", "fifth"] }),
      ],
      result: [2],
    },
    {
      description: "matches tags, negated attribute and free search",
      filter: "status:!New tags:(!fourth,!first) name",
      nodes: [
        machineFactory({
          hostname: "name1",
          status: NodeStatus.NEW,
          tags: ["first", "second"],
        }),
        machineFactory({
          hostname: "name2",
          status: NodeStatus.NEW,
          tags: ["sixth", "second"],
        }),
        machineFactory({
          hostname: "name3",
          status: NodeStatus.FAILED_DEPLOYMENT,
          tags: ["second", "third"],
        }),
        machineFactory({
          hostname: "name4",
          status: NodeStatus.NEW,
          tags: ["fourth", "fifth"],
        }),
      ],
      result: [2],
    },
    {
      description: "matches tags, negated attribute and negated free search",
      filter: "status:!New tags:(!fourth,!first) !name5",
      nodes: [
        machineFactory({
          hostname: "name1",
          status: NodeStatus.NEW,
          tags: ["first", "second"],
        }),
        machineFactory({
          hostname: "name2",
          status: NodeStatus.NEW,
          tags: ["sixth", "second"],
        }),
        machineFactory({
          hostname: "name3",
          status: NodeStatus.FAILED_DEPLOYMENT,
          tags: ["second", "third"],
        }),
        machineFactory({
          hostname: "name4",
          status: NodeStatus.NEW,
          tags: ["fourth", "fifth"],
        }),
        machineFactory({
          hostname: "name5",
          status: NodeStatus.NEW,
          tags: ["seventh", "eighth"],
        }),
      ],
      result: [2],
    },
    {
      description: "matches any values",
      filter: "status:Ne,Dep",
      nodes: [
        machineFactory({ status: NodeStatus.NEW }),
        machineFactory({ status: NodeStatus.FAILED_COMMISSIONING }),
        machineFactory({ status: NodeStatus.DEPLOYING }),
      ],
      result: [0, 2],
    },
    {
      description: "matches any exact values",
      filter: "status:(=Ne,=Failed commissioning,=Deploying)",
      nodes: [
        machineFactory({ status: NodeStatus.NEW }),
        machineFactory({ status: NodeStatus.FAILED_COMMISSIONING }),
        machineFactory({ status: NodeStatus.DEPLOYING }),
      ],
      result: [1, 2],
    },
    {
      description: "matches any values but only those that match other filters",
      filter: "status:New,Deploying owner:admin",
      nodes: [
        machineFactory({ owner: "user", status: NodeStatus.NEW }),
        machineFactory({
          owner: "admin",
          status: NodeStatus.FAILED_COMMISSIONING,
        }),
        machineFactory({ owner: "admin", status: NodeStatus.DEPLOYING }),
      ],
      result: [2],
    },
    {
      description: "matches using release mapping function",
      filter: "release:ubuntu/xenial",
      nodes: [
        machineFactory({
          status_code: 9,
          osystem: "ubuntu",
          distro_series: "xenial",
        }),
        machineFactory({
          status_code: 6,
          osystem: "ubuntu",
          distro_series: "xenial",
        }),
        machineFactory({
          status_code: 5,
          osystem: "ubuntu",
          distro_series: "xenial",
        }),
        machineFactory({
          status_code: 6,
          osystem: "ubuntu",
          distro_series: "trusty",
        }),
      ],
      result: [0, 1],
    },
  ];

  scenarios.forEach(
    ({
      result = DEFAULT_RESULT,
      filter,
      description,
      nodes = DEFAULT_NODES,
      selected = DEFAULT_SELECTED,
    }) => {
      it(`${description}: ${filter}`, () => {
        expect(filterNodes(nodes, filter, selected)).toEqual(
          result.map((index) => nodes[index])
        );
      });
    }
  );
});
