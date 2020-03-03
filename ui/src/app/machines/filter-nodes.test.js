import filterNodes from "./filter-nodes";

describe("filterNodes", () => {
  it("matches using standard filter", () => {
    const matchingNode = {
      hostname: "name"
    };
    const otherNode = {
      hostname: "other"
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "nam")).toEqual([matchingNode]);
  });

  it("doesn't return duplicates using standard filter", () => {
    const matchingNode = {
      hostname: "name",
      pod: {
        name: "name"
      }
    };
    const otherNode = {
      hostname: "other"
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "nam am")).toEqual([matchingNode]);
  });

  it("matches selected", () => {
    const matchingNode = {
      $selected: true
    };
    const otherNode = {
      $selected: false
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "in:selected")).toEqual([matchingNode]);
  });

  it("matches selected uppercase", () => {
    const matchingNode = {
      $selected: true
    };
    const otherNode = {
      $selected: false
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "in:Selected")).toEqual([matchingNode]);
  });

  it("matches selected uppercase in brackets", () => {
    const matchingNode = {
      $selected: true
    };
    const otherNode = {
      $selected: false
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "in:(Selected)")).toEqual([matchingNode]);
  });

  it("matches non-selected", () => {
    const matchingNode = {
      $selected: false
    };
    const otherNode = {
      $selected: true
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "in:!selected")).toEqual([matchingNode]);
  });

  it("matches non-selected uppercase", () => {
    const matchingNode = {
      $selected: false
    };
    const otherNode = {
      $selected: true
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "in:!Selected")).toEqual([matchingNode]);
  });

  it("matches non-selected uppercase in brackets", () => {
    const matchingNode = {
      $selected: false
    };
    const otherNode = {
      $selected: true
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "in:(!Selected)")).toEqual([matchingNode]);
  });

  it("matches on attribute", () => {
    const matchingNode = {
      hostname: "name"
    };
    const otherNode = {
      hostname: "other"
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "hostname:name")).toEqual([matchingNode]);
  });

  it("matches with contains on attribute", () => {
    const matchingNode = {
      hostname: "name"
    };
    const otherNode = {
      hostname: "other"
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "hostname:na")).toEqual([matchingNode]);
  });

  it("matches on negating attribute", () => {
    const matchingNode = {
      hostname: "name"
    };
    const otherNode = {
      hostname: "other"
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "hostname:!other")).toEqual([matchingNode]);
  });

  it("matches on exact attribute", () => {
    const matchingNode = {
      hostname: "other"
    };
    const otherNode = {
      hostname: "other2"
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "hostname:=other")).toEqual([matchingNode]);
  });

  it("matches on array", () => {
    const matchingNode = {
      hostnames: ["name", "first"]
    };
    const otherNode = {
      hostnames: ["other", "second"]
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "hostnames:first")).toEqual([matchingNode]);
  });

  it("matches integer values", () => {
    const matchingNode = {
      count: 4
    };
    const otherNode = {
      count: 2
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "count:3")).toEqual([matchingNode]);
  });

  it("matches float values", () => {
    const matchingNode = {
      count: 2.2
    };
    const otherNode = {
      count: 1.1
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "count:1.5")).toEqual([matchingNode]);
  });

  it("matches using cpu mapping function", () => {
    const matchingNode = {
      cpu_count: 4
    };
    const otherNode = {
      cpu_count: 2
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "cpu:3")).toEqual([matchingNode]);
  });

  it("matches using cores mapping function", () => {
    const matchingNode = {
      cpu_count: 4
    };
    const otherNode = {
      cpu_count: 2
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "cores:3")).toEqual([matchingNode]);
  });

  it("matches using ram mapping function", () => {
    const matchingNode = {
      memory: 2048
    };
    const otherNode = {
      memory: 1024
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "ram:2000")).toEqual([matchingNode]);
  });

  it("matches using mac mapping function", () => {
    const matchingNode = {
      pxe_mac: "00:11:22:33:44:55",
      extra_macs: ["aa:bb:cc:dd:ee:ff"]
    };
    const otherNode = {
      pxe_mac: "66:11:22:33:44:55",
      extra_macs: ["00:bb:cc:dd:ee:ff"]
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "mac:aa:bb:cc:dd:ee:ff")).toEqual([matchingNode]);
  });

  it("matches using zone mapping function", () => {
    const matchingNode = {
      zone: {
        name: "first"
      }
    };
    const otherNode = {
      zone: {
        name: "second"
      }
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "zone:first")).toEqual([matchingNode]);
  });

  it("matches using pool mapping function", () => {
    const matchingNode = {
      pool: {
        name: "pool1"
      }
    };
    const otherNode = {
      pool: {
        name: "pool2"
      }
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "pool:pool1")).toEqual([matchingNode]);
  });

  it("matches using pod mapping function", () => {
    const matchingNode = {
      pod: {
        name: "pod1"
      }
    };
    const otherNode = {
      pod: {
        name: "pod2"
      }
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "pod:pod1")).toEqual([matchingNode]);
  });

  it("matches using pod-id mapping function", () => {
    const matchingNode = {
      pod: {
        name: "pod1",
        id: 1
      }
    };
    const otherNode = {
      pod: {
        name: "pod2",
        id: 2
      }
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "pod-id:=1")).toEqual([matchingNode]);
  });

  it("matches using power mapping function", () => {
    const matchingNode = {
      power_state: "on"
    };
    const otherNode = {
      power_state: "off"
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "power:on")).toEqual([matchingNode]);
  });

  it("matches accumulate", () => {
    const matchingNode = {
      power_state: "on",
      zone: {
        name: "first"
      }
    };
    const otherNode = {
      power_state: "on",
      zone: {
        name: "second"
      }
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "power:on zone:first")).toEqual([matchingNode]);
  });

  it("matches a tag", () => {
    const matchingNode = {
      tags: ["first", "second"]
    };
    const otherNode = {
      tags: ["second", "third"]
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "tags:first")).toEqual([matchingNode]);
  });

  it("matches a negated tag", () => {
    const matchingNode = {
      tags: ["first", "second"]
    };
    const otherNode = {
      tags: ["second", "third"]
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "tags:!third")).toEqual([matchingNode]);
    expect(filterNodes(nodes, "tags:!(third)")).toEqual([matchingNode]);
    expect(filterNodes(nodes, "tags:(!third)")).toEqual([matchingNode]);
  });

  it("matches a double negated tag", () => {
    const matchingNode = {
      tags: ["first", "second"]
    };
    const otherNode = {
      tags: ["second", "third"]
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "tags:!!first")).toEqual([matchingNode]);
    expect(filterNodes(nodes, "tags:!(!first)")).toEqual([matchingNode]);
    expect(filterNodes(nodes, "tags:(!!first)")).toEqual([matchingNode]);
  });

  it("matches a direct and a negated tag", () => {
    const matchingNode = {
      tags: ["first", "second"]
    };
    const otherNode = {
      tags: ["second", "third"]
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "tags:(first,!third)")).toEqual([matchingNode]);
  });

  it("matches an exact direct and a negated tag", () => {
    const matchingNode = {
      tags: ["first", "second"]
    };
    const otherNode = {
      tags: ["first1", "third"]
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "tags:(=first,!third)")).toEqual([matchingNode]);
  });

  it("matches two negated tags", () => {
    const matchingNode = {
      tags: ["first", "second"]
    };
    const otherNode = {
      tags: ["second", "third"]
    };
    const nodes = [matchingNode, otherNode];
    expect(filterNodes(nodes, "tags:(!second,!third)")).toEqual([matchingNode]);
  });

  it("matches using release mapping function", () => {
    const deployingNode = {
      status_code: 9,
      osystem: "ubuntu",
      distro_series: "xenial"
    };
    const deployedNode = {
      status_code: 6,
      osystem: "ubuntu",
      distro_series: "xenial"
    };
    const allocatedNode = {
      status_code: 5,
      osystem: "ubuntu",
      distro_series: "xenial"
    };
    const deployedOtherNode = {
      status_code: 6,
      osystem: "ubuntu",
      distro_series: "trusty"
    };
    const nodes = [
      deployingNode,
      deployedNode,
      allocatedNode,
      deployedOtherNode
    ];
    expect(filterNodes(nodes, "release:ubuntu/xenial")).toEqual([
      deployingNode,
      deployedNode
    ]);
  });
});
