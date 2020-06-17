import { nodeStatus } from "app/base/enum";

import { getStatusText } from "./getStatusText";

describe("getStatusText", () => {
  it("displays the machine's status if not deploying or deployed", () => {
    const machine = { status: "New", status_code: nodeStatus.NEW };
    expect(getStatusText(machine, [])).toEqual("New");
  });

  it("displays the short-form of Ubuntu release if deployed", () => {
    const machine = {
      distro_series: "bionic",
      osystem: "ubuntu",
      status: "Deployed",
      status_code: nodeStatus.DEPLOYED,
    };
    const osReleases = [
      { label: 'Ubuntu 18.04 LTS "Bionic Beaver"', value: "bionic" },
    ];

    expect(getStatusText(machine, osReleases)).toEqual("Ubuntu 18.04 LTS");
  });

  it("displays the full OS and release if non-Ubuntu deployed", () => {
    const machine = {
      distro_series: "centos70",
      osystem: "centos",
      status: "Deployed",
      status_code: nodeStatus.DEPLOYED,
    };
    const osReleases = [{ label: "CentOS 7", value: "centos70" }];

    expect(getStatusText(machine, osReleases)).toEqual("CentOS 7");
  });

  it("displays 'Deploying OS release' if machine is deploying", () => {
    const machine = {
      distro_series: "bionic",
      osystem: "ubuntu",
      status: "Deploying",
      status_code: nodeStatus.DEPLOYING,
    };
    const osReleases = [
      { label: 'Ubuntu 18.04 LTS "Bionic Beaver"', value: "bionic" },
    ];

    expect(getStatusText(machine, osReleases)).toEqual(
      "Deploying Ubuntu 18.04 LTS"
    );
  });
});
