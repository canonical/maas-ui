import filterNodes from "./filter-nodes";

describe("filterNodes", () => {
  // If a scenario is not provided `result`, `nodes` or `selected` then the
  // following defaults are used.
  const DEFAULT_RESULT = [0];
  const DEFAULT_NODES = [{ hostname: "name" }, { hostname: "other" }];
  const DEFAULT_SELECTED = null;
  // These are common nodes to prevent duplication:
  const tagNodes = [
    { tags: ["first", "second"] },
    { tags: ["second", "third"] },
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
        { hostname: "1name" },
        {
          hostname: "name2",
          // It shouldn't match this node by turning "1nam" in an integer of 1.
          vlan_id: 1,
        },
      ],
      result: [0],
    },
    {
      description: "doesn't return duplicates using free search",
      filter: "nam am",
      nodes: [
        { hostname: "name", pod: { name: "name" } },
        { hostname: "other" },
      ],
    },
    {
      description: "accumulates matches using free search",
      filter: "failed commissioning",
      nodes: [{ status: "Failed commissioning" }, { status: "Failed" }],
    },
    {
      description: "accumulates matches using free search including negatives",
      filter: "failed !commissioning",
      nodes: [{ status: "Failed commissioning" }, { status: "Failed" }],
      result: [1],
    },
    {
      description: "matches selected uppercase",
      filter: "in:Selected",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["1"],
    },
    {
      description: "matches selected uppercase in brackets",
      filter: "in:(Selected)",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["1"],
    },
    {
      description: "matches non-selected",
      filter: "in:!selected",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["2"],
    },
    {
      description: "matches non-selected uppercase",
      filter: "in:!Selected",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["2"],
    },
    {
      description: "matches non-selected uppercase in brackets",
      filter: "in:(!Selected)",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["2"],
    },
    {
      description: "accumulates selected matches",
      filter: "new in:selected",
      nodes: [
        { status: "New", system_id: "1" },
        { status: "New", system_id: "2" },
      ],
      selected: ["1"],
    },
    {
      description: "accumulates non-selected matches",
      filter: "new in:!selected",
      nodes: [
        { status: "New", system_id: "1" },
        { status: "New", system_id: "2" },
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
        { hostname: "1name" },
        {
          // It shouldn't match this node by turning "1nam" in an integer of 1.
          hostname: 1,
        },
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
      nodes: [{ hostname: "other" }, { hostname: "other2" }],
    },
    {
      description: "matches on array",
      filter: "hostnames:first",
      nodes: [
        { hostnames: ["name", "first"] },
        { hostnames: ["other", "second"] },
      ],
    },
    {
      description: "accumulates matches on attribute",
      filter: "hostname:name status:New",
      nodes: [
        { hostname: "name", status: "New" },
        { hostname: "name2", status: "Failed" },
      ],
    },
    {
      description: "accumulates matches on negated attribute",
      filter: "hostname:name status:!New",
      nodes: [
        { hostname: "name", status: "Failed" },
        { hostname: "name2", status: "New" },
      ],
    },
    {
      description: "matches integer values",
      filter: "count:3",
      nodes: [{ count: 4 }, { count: 2 }],
    },
    {
      description: "matches float values",
      filter: "count:1.5",
      nodes: [{ count: 2.2 }, { count: 1.1 }],
    },
    {
      description: "matches using cpu mapping function",
      filter: "cpu:3",
      nodes: [{ cpu_count: 4 }, { cpu_count: 2 }],
    },
    {
      description: "matches using cores mapping function",
      filter: "cores:3",
      nodes: [{ cpu_count: 4 }, { cpu_count: 2 }],
    },
    {
      description: "matches using ram mapping function",
      filter: "ram:2000",
      nodes: [{ memory: 2048 }, { memory: 1024 }],
    },
    {
      description: "matches using mac mapping function",
      filter: "mac:aa:bb:cc:dd:ee:ff",
      nodes: [
        { pxe_mac: "00:11:22:33:44:55", extra_macs: ["aa:bb:cc:dd:ee:ff"] },
        { pxe_mac: "66:11:22:33:44:55", extra_macs: ["00:bb:cc:dd:ee:ff"] },
      ],
    },
    {
      description: "matches using mac mapping function",
      filter: "zone:first",
      nodes: [{ zone: { name: "first" } }, { zone: { name: "second" } }],
    },
    {
      description: "matches using pool mapping function",
      filter: "pool:pool1",
      nodes: [{ pool: { name: "pool1" } }, { pool: { name: "pool2" } }],
    },
    {
      description: "matches using pod mapping function",
      filter: "pod:pod1",
      nodes: [{ pod: { name: "pod1" } }, { pod: { name: "pod2" } }],
    },
    {
      description: "matches using pod-id mapping function",
      filter: "pod-id:=1",
      nodes: [
        { pod: { name: "pod1", id: 1 } },
        { pod: { name: "pod2", id: 2 } },
      ],
    },
    {
      description: "matches using power mapping function",
      filter: "power:on",
      nodes: [{ power_state: "on" }, { power_state: "off" }],
    },
    {
      description: "matches accumulate",
      filter: "power:on zone:first",
      nodes: [
        {
          power_state: "on",
          zone: {
            name: "first",
          },
        },
        {
          power_state: "on",
          zone: {
            name: "second",
          },
        },
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
        { tags: ["first", "second"] },
        { tags: ["second", "third"] },
        { tags: ["fourth", "fifth"] },
      ],
      result: [2],
    },
    {
      description: "matches tags and free search",
      filter: "fourth tags:(!second,!first)",
      nodes: [
        { tags: ["first", "second"] },
        { tags: ["second", "third"] },
        { tags: ["fourth", "fifth"] },
      ],
      result: [2],
    },
    {
      description: "matches tags and attribute",
      filter: "status:New tags:(!second,!first)",
      nodes: [
        { status: "New", tags: ["first", "second"] },
        { status: "Failed", tags: ["second", "third"] },
        { status: "New", tags: ["fourth", "fifth"] },
      ],
      result: [2],
    },
    {
      description: "matches tags and negated attribute",
      filter: "status:!New tags:(!fourth,!first)",
      nodes: [
        { status: "New", tags: ["first", "second"] },
        { status: "New", tags: ["sixth", "second"] },
        { status: "Failed", tags: ["second", "third"] },
        { status: "New", tags: ["fourth", "fifth"] },
      ],
      result: [2],
    },
    {
      description: "matches tags, negated attribute and free search",
      filter: "status:!New tags:(!fourth,!first) name",
      nodes: [
        { hostname: "name1", status: "New", tags: ["first", "second"] },
        { hostname: "name2", status: "New", tags: ["sixth", "second"] },
        { hostname: "name3", status: "Failed", tags: ["second", "third"] },
        { hostname: "name4", status: "New", tags: ["fourth", "fifth"] },
      ],
      result: [2],
    },
    {
      description: "matches tags, negated attribute and negated free search",
      filter: "status:!New tags:(!fourth,!first) !name5",
      nodes: [
        { hostname: "name1", status: "New", tags: ["first", "second"] },
        { hostname: "name2", status: "New", tags: ["sixth", "second"] },
        { hostname: "name3", status: "Failed", tags: ["second", "third"] },
        { hostname: "name4", status: "New", tags: ["fourth", "fifth"] },
        { hostname: "name5", status: "New", tags: ["seventh", "eighth"] },
      ],
      result: [2],
    },
    {
      description: "matches any values",
      filter: "status:Ne,Dep",
      nodes: [
        { status: "New" },
        { status: "Failed commissioning" },
        { status: "Deploying" },
      ],
      result: [0, 2],
    },
    {
      description: "matches any exact values",
      filter: "status:(=Ne,=Failed commissioning,=Deploying)",
      nodes: [
        { status: "New" },
        { status: "Failed commissioning" },
        { status: "Deploying" },
      ],
      result: [1, 2],
    },
    {
      description: "matches any values but only those that match other filters",
      filter: "status:New,Deploying owner:admin",
      nodes: [
        { owner: "user", status: "New" },
        { owner: "admin", status: "Failed commissioning" },
        { owner: "admin", status: "Deploying" },
      ],
      result: [2],
    },
    {
      description: "matches using release mapping function",
      filter: "release:ubuntu/xenial",
      nodes: [
        { status_code: 9, osystem: "ubuntu", distro_series: "xenial" },
        { status_code: 6, osystem: "ubuntu", distro_series: "xenial" },
        { status_code: 5, osystem: "ubuntu", distro_series: "xenial" },
        { status_code: 6, osystem: "ubuntu", distro_series: "trusty" },
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
