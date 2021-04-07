import { shallow } from "enzyme";

import VfResources from "./VfResources";

import { podNetworkInterface as interfaceFactory } from "testing/factories";

describe("VfResources", () => {
  it("renders", () => {
    const wrapper = shallow(
      <VfResources
        interfaces={[
          interfaceFactory({
            name: "eth0",
            virtual_functions: {
              allocated_tracked: 1,
              allocated_other: 2,
              free: 3,
            },
          }),
        ]}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("can be made to have a dynamic layout", () => {
    const wrapper = shallow(<VfResources dynamicLayout interfaces={[]} />);

    expect(
      wrapper
        .find(".vf-resources")
        .prop("className")
        ?.includes("vf-resources--dynamic-layout")
    ).toBe(true);
  });

  it("shows whether an interface has virtual functions or not", () => {
    const [hasVfs, noVfs] = [
      interfaceFactory({
        virtual_functions: {
          allocated_tracked: 1,
          allocated_other: 2,
          free: 3,
        },
      }),
      interfaceFactory({
        virtual_functions: {
          allocated_tracked: 0,
          allocated_other: 0,
          free: 0,
        },
      }),
    ];
    const wrapper = shallow(
      <VfResources dynamicLayout interfaces={[hasVfs, noVfs]} />
    );

    expect(
      wrapper.find("tbody tr").at(0).find("[data-test='has-vfs']").exists()
    ).toBe(true);
    expect(
      wrapper.find("tbody tr").at(0).find("[data-test='has-no-vfs']").exists()
    ).toBe(false);
    expect(
      wrapper.find("tbody tr").at(1).find("[data-test='has-vfs']").exists()
    ).toBe(false);
    expect(
      wrapper.find("tbody tr").at(1).find("[data-test='has-no-vfs']").exists()
    ).toBe(true);
  });
});
