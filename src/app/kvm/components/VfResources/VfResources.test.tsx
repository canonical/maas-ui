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
      wrapper.find("tbody tr").at(0).find("[data-testid='has-vfs']").exists()
    ).toBe(true);
    expect(
      wrapper.find("tbody tr").at(0).find("[data-testid='has-no-vfs']").exists()
    ).toBe(false);
    expect(
      wrapper.find("tbody tr").at(1).find("[data-testid='has-vfs']").exists()
    ).toBe(false);
    expect(
      wrapper.find("tbody tr").at(1).find("[data-testid='has-no-vfs']").exists()
    ).toBe(true);
  });

  it("can render as an aggregated meter", () => {
    const wrapper = shallow(<VfResources interfaces={[]} showAggregated />);
    expect(wrapper.find("[data-testid='iface-meter']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='iface-table']").exists()).toBe(false);
  });

  it("can render as a table", () => {
    const wrapper = shallow(
      <VfResources interfaces={[]} showAggregated={false} />
    );
    expect(wrapper.find("[data-testid='iface-table']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='iface-meter']").exists()).toBe(false);
  });

  it("shows whether an interface has virtual functions or not", () => {
    const wrapper = shallow(
      <VfResources
        interfaces={[
          interfaceFactory({
            name: "bbb",
            virtual_functions: {
              allocated_tracked: 1,
              allocated_other: 2,
              free: 3,
            },
          }),
          interfaceFactory({
            name: "aaa",
            virtual_functions: {
              allocated_tracked: 1,
              allocated_other: 2,
              free: 3,
            },
          }),
          interfaceFactory({
            name: "ccc",
            virtual_functions: {
              allocated_tracked: 1,
              allocated_other: 2,
              free: 3,
            },
          }),
        ]}
      />
    );
    expect(
      wrapper
        .find("tbody tr")
        .at(0)
        .find("[data-testid='interface-name']")
        .text()
    ).toBe("aaa:");
    expect(
      wrapper
        .find("tbody tr")
        .at(1)
        .find("[data-testid='interface-name']")
        .text()
    ).toBe("bbb:");
    expect(
      wrapper
        .find("tbody tr")
        .at(2)
        .find("[data-testid='interface-name']")
        .text()
    ).toBe("ccc:");
  });
});
