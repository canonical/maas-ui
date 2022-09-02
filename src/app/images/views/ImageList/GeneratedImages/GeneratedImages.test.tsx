import { screen, within } from "@testing-library/react";

import GeneratedImages from "./GeneratedImages";

import { Labels as ImagesTableLabels } from "app/images/components/ImagesTable/ImagesTable";
import { BootResourceType } from "app/store/bootresource/types";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("GeneratedImages", () => {
  it("does not render if there are no generated resources", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [
          bootResourceFactory({ rtype: BootResourceType.SYNCED }),
          bootResourceFactory({ rtype: BootResourceType.UPLOADED }),
        ],
      }),
    });
    renderWithMockStore(<GeneratedImages />, { state });

    expect(
      screen.queryByRole("grid", { name: ImagesTableLabels.Table })
    ).not.toBeInTheDocument();
  });

  it("correctly sets images values based on generated resources", () => {
    const resources = [
      bootResourceFactory({
        arch: "amd64",
        name: "esxi/7.0",
        rtype: BootResourceType.UPLOADED,
        title: "VMWare ESXi 7.0",
      }),
      bootResourceFactory({
        arch: "arm64",
        name: "windows/win2012hvr2",
        rtype: BootResourceType.GENERATED,
        title: "Windows 2012",
      }),
      bootResourceFactory({
        arch: "i386",
        name: "centos/centos70",
        rtype: BootResourceType.GENERATED,
        title: "CentOS 7",
      }),
      bootResourceFactory({
        arch: "ppc64el",
        name: "ubuntu/focal",
        rtype: BootResourceType.SYNCED,
        title: "20.04 LTS",
      }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources,
      }),
    });
    renderWithMockStore(<GeneratedImages />, { state });

    const rows = screen.getAllByRole("row");

    const row1cells = within(rows[1]).getAllByRole("gridcell");
    const row2cells = within(rows[2]).getAllByRole("gridcell");

    expect(row1cells[0]).toHaveTextContent("Windows 2012");
    expect(row1cells[1]).toHaveTextContent("arm64");
    expect(row1cells[2]).toHaveTextContent("650.4 MB");

    expect(row2cells[0]).toHaveTextContent("CentOS 7");
    expect(row2cells[1]).toHaveTextContent("i386");
    expect(row2cells[2]).toHaveTextContent("650.4 MB");
  });
});
