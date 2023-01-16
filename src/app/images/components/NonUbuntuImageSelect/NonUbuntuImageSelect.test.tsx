import { Formik } from "formik";

import NonUbuntuImageSelect from "./NonUbuntuImageSelect";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceOtherImage as otherImageFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithMockStore } from "testing/utils";

describe("NonUbuntuImageSelect", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages: [],
        resources: [],
      }),
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "focal",
          }),
        ],
      }),
    });
  });

  it("correctly shows when an image checkbox is checked", () => {
    const otherImages = [
      otherImageFactory({
        name: "centos/amd64/generic/centos7",
        title: "CentOS 7",
      }),
      otherImageFactory({ name: "centos/amd64/generic/8", title: "CentOS 8" }),
    ];
    const resources = [bootResourceFactory()];
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
        onSubmit={jest.fn()}
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
