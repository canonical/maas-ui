import { Formik } from "formik";

import NonUbuntuImageSelect from "./NonUbuntuImageSelect";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

describe("NonUbuntuImageSelect", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      bootresource: factory.bootResourceState({
        otherImages: [],
        resources: [],
      }),
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "focal",
          }),
        ],
      }),
    });
  });

  it("correctly shows when an image checkbox is checked", () => {
    const otherImages = [
      factory.bootResourceOtherImage({
        name: "centos/amd64/generic/centos7",
        title: "CentOS 7",
      }),
      factory.bootResourceOtherImage({
        name: "centos/amd64/generic/8",
        title: "CentOS 8",
      }),
    ];
    const resources = [factory.bootResource()];
    state.bootresource.otherImages = otherImages;
    state.bootresource.resources = resources;
    renderWithMockStore(
      <Formik
        initialValues={{
          images: [
            {
              arch: "amd64",
              os: "centos",
              release: "centos7",
              subArch: "generic",
              title: "CentOS 7",
            },
          ],
        }}
        onSubmit={vi.fn()}
      >
        <NonUbuntuImageSelect images={otherImages} resources={resources} />
      </Formik>,
      { state }
    );

    expect(screen.getByRole("checkbox", { name: "CentOS 7" })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "CentOS 8" })
    ).not.toBeChecked();
  });
});
