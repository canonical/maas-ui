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
    { tags: ["second", "third"] }
  ];

  const scenarios = [
    {
      description: "handles no filters",
      filter: "hostname:(=",
      result: [0, 1]
    },
    {
      description: "matches using standard filter",
      filter: "nam"
    },
    {
      description: "doesn't return duplicates using standard filter",
      filter: "nam am",
      nodes: [
        { hostname: "name", pod: { name: "name" } },
        { hostname: "other" }
      ]
    },
    {
      description: "matches selected uppercase",
      filter: "in:Selected",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["1"]
    },
    {
      description: "matches selected uppercase",
      filter: "in:(Selected)",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["1"]
    },
    {
      description: "matches non-selected",
      filter: "in:!selected",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["2"]
    },
    {
      description: "matches non-selected uppercase",
      filter: "in:!Selected",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["2"]
    },
    {
      description: "matches non-selected uppercase in brackets",
      filter: "in:(!Selected)",
      nodes: [{ system_id: "1" }, { system_id: "2" }],
      selected: ["2"]
    },
    {
      description: "matches on attribute",
      filter: "hostname:name"
    },
    {
      description: "matches with contains on attribute",
      filter: "hostname:na"
    },
    {
      description: "matches on negating attribute",
      filter: "hostname:!other"
    },
    {
      description: "matches on exact attribute",
      filter: "hostname:=other",
      nodes: [{ hostname: "other" }, { hostname: "other2" }]
    },
    {
      description: "matches on array",
      filter: "hostnames:first",
      nodes: [
        { hostnames: ["name", "first"] },
        { hostnames: ["other", "second"] }
      ]
    },
    {
      description: "matches integer values",
      filter: "count:3",
      nodes: [{ count: 4 }, { count: 2 }]
    },
    {
      description: "matches float values",
      filter: "count:1.5",
      nodes: [{ count: 2.2 }, { count: 1.1 }]
    },
    {
      description: "matches using cpu mapping function",
      filter: "cpu:3",
      nodes: [{ cpu_count: 4 }, { cpu_count: 2 }]
    },
    {
      description: "matches using cores mapping function",
      filter: "cores:3",
      nodes: [{ cpu_count: 4 }, { cpu_count: 2 }]
    },
    {
      description: "matches using ram mapping function",
      filter: "ram:2000",
      nodes: [{ memory: 2048 }, { memory: 1024 }]
    },
    {
      description: "matches using mac mapping function",
      filter: "mac:aa:bb:cc:dd:ee:ff",
      nodes: [
        { pxe_mac: "00:11:22:33:44:55", extra_macs: ["aa:bb:cc:dd:ee:ff"] },
        { pxe_mac: "66:11:22:33:44:55", extra_macs: ["00:bb:cc:dd:ee:ff"] }
      ]
    },
    {
      description: "matches using mac mapping function",
      filter: "zone:first",
      nodes: [{ zone: { name: "first" } }, { zone: { name: "second" } }]
    },
    {
      description: "matches using pool mapping function",
      filter: "pool:pool1",
      nodes: [{ pool: { name: "pool1" } }, { pool: { name: "pool2" } }]
    },
    {
      description: "matches using pod mapping function",
      filter: "pod:pod1",
      nodes: [{ pod: { name: "pod1" } }, { pod: { name: "pod2" } }]
    },
    {
      description: "matches using pod-id mapping function",
      filter: "pod-id:=1",
      nodes: [
        { pod: { name: "pod1", id: 1 } },
        { pod: { name: "pod2", id: 2 } }
      ]
    },
    {
      description: "matches using power mapping function",
      filter: "power:on",
      nodes: [{ power_state: "on" }, { power_state: "off" }]
    },
    {
      description: "matches accumulate",
      filter: "power:on zone:first",
      nodes: [
        {
          power_state: "on",
          zone: {
            name: "first"
          }
        },
        {
          power_state: "on",
          zone: {
            name: "second"
          }
        }
      ]
    },
    {
      description: "matches a tag",
      filter: "tags:first",
      nodes: tagNodes
    },
    {
      description: "matches a negated tag",
      filter: "tags:!third",
      nodes: tagNodes
    },
    {
      description: "matches a negated tag with parens",
      filter: "tags:(!third)",
      nodes: tagNodes
    },
    {
      description: "matches a negated tag with the parens negated",
      filter: "tags:!(third)",
      nodes: tagNodes
    },
    {
      description: "matches a double negated tag",
      filter: "tags:!!first",
      nodes: tagNodes
    },
    {
      description: "matches a double negated tag with parens",
      filter: "tags:(!!first)",
      nodes: tagNodes
    },
    {
      description: "matches a double negated tag with in and outside negated",
      filter: "tags:!(!first)",
      nodes: tagNodes
    },
    {
      description: "matches a direct and a negated tag",
      filter: "tags:(first,!third)",
      nodes: tagNodes
    },
    {
      description: "matches an exact direct and a negated tag",
      filter: "tags:(=first,!third)",
      nodes: tagNodes
    },
    {
      description: "matches two negated tags",
      filter: "tags:(!second,!third)",
      nodes: tagNodes
    },
    {
      description: "matches any values",
      filter: "status:Ne,Dep",
      nodes: [
        { status: "New" },
        { status: "Failed commissioning" },
        { status: "Deploying" }
      ],
      result: [0, 2]
    },
    {
      description: "matches any exact values",
      filter: "status:(=Ne,=Failed commissioning,=Deploying)",
      nodes: [
        { status: "New" },
        { status: "Failed commissioning" },
        { status: "Deploying" }
      ],
      result: [1, 2]
    },
    {
      description: "matches any values but only those that match other filters",
      filter: "status:New,Deploying owner:admin",
      nodes: [
        { owner: "user", status: "New" },
        { owner: "admin", status: "Failed commissioning" },
        { owner: "admin", status: "Deploying" }
      ],
      result: [2]
    },
    {
      description: "matches using release mapping function",
      filter: "release:ubuntu/xenial",
      nodes: [
        { status_code: 9, osystem: "ubuntu", distro_series: "xenial" },
        { status_code: 6, osystem: "ubuntu", distro_series: "xenial" },
        { status_code: 5, osystem: "ubuntu", distro_series: "xenial" },
        { status_code: 6, osystem: "ubuntu", distro_series: "trusty" }
      ],
      result: [0, 1]
    }
  ];

  scenarios.forEach(
    ({
      result = DEFAULT_RESULT,
      filter,
      description,
      nodes = DEFAULT_NODES,
      selected = DEFAULT_SELECTED
    }) => {
      it(`${description}: ${filter}`, () => {
        expect(filterNodes(nodes, filter, selected)).toEqual(
          result.map(index => nodes[index])
        );
      });
    }
  );
});
