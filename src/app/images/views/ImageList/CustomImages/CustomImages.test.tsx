import CustomImages from "./CustomImages";

import { Labels as ImagesTableLabels } from "@/app/images/components/ImagesTable/ImagesTable";
import { BootResourceType } from "@/app/store/bootresource/types";
import * as factory from "@/testing/factories";
import { screen, within, renderWithMockStore } from "@/testing/utils";

describe("CustomImages", () => {
  it("does not render if there are no uploaded resources", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ rtype: BootResourceType.SYNCED }),
          factory.bootResource({ rtype: BootResourceType.GENERATED }),
        ],
      }),
    });
    renderWithMockStore(<CustomImages />, { state });
    expect(
      screen.queryByRole("grid", { name: ImagesTableLabels.Table })
    ).not.toBeInTheDocument();
  });

  it("correctly sets images values based on uploaded resources", () => {
    const resources = [
      factory.bootResource({
        arch: "amd64",
        name: "esxi/7.0",
        rtype: BootResourceType.UPLOADED,
        title: "VMWare ESXi 7.0",
      }),
      factory.bootResource({
        arch: "arm64",
        name: "windows/win2012hvr2",
        rtype: BootResourceType.UPLOADED,
        title: "Windows 2012",
      }),
      factory.bootResource({
        arch: "i386",
        name: "centos/centos70",
        rtype: BootResourceType.GENERATED,
        title: "CentOS 7",
      }),
      factory.bootResource({
        arch: "ppc64el",
        name: "ubuntu/focal",
        rtype: BootResourceType.SYNCED,
        title: "20.04 LTS",
      }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources,
      }),
    });
    renderWithMockStore(<CustomImages />, { state });
    expect(
      screen.getByRole("grid", { name: ImagesTableLabels.Table })
    ).toBeInTheDocument();

    const rows = screen.getAllByRole("row");

    const row1cells = within(rows[1]).getAllByRole("gridcell");
    const row2cells = within(rows[2]).getAllByRole("gridcell");

    expect(row1cells[0]).toHaveTextContent("Windows 2012");
    expect(row1cells[1]).toHaveTextContent("arm64");
    expect(row1cells[2]).toHaveTextContent("650.4 MB");

    expect(row2cells[0]).toHaveTextContent("VMWare ESXi 7.0");
    expect(row2cells[1]).toHaveTextContent("amd64");
    expect(row2cells[2]).toHaveTextContent("650.4 MB");
  });
});
