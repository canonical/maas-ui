import VfResources from "./VfResources";

import { podNetworkInterface as interfaceFactory } from "testing/factories";
import { render, screen } from "testing/utils";

describe("VfResources", () => {
  it("renders", () => {
    render(
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

    expect(screen).toMatchSnapshot();
  });

  it("can be made to have a dynamic layout", () => {
    render(<VfResources dynamicLayout interfaces={[]} />);

    expect(
      screen
        .getByTestId("vf-resources")
        .className.includes("vf-resources--dynamic-layout")
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
    render(<VfResources dynamicLayout interfaces={[hasVfs, noVfs]} />);

    expect(screen.getByTestId("has-vfs")).toBeTruthy();
    expect(screen.queryByTestId("has-no-vfs")).toBeFalsy();
    expect(screen.queryByTestId("has-vfs")).toBeFalsy();
    expect(screen.getByTestId("has-no-vfs")).toBeTruthy();
  });

  it("can render as an aggregated meter", () => {
    render(<VfResources interfaces={[]} showAggregated />);

    expect(screen.getByTestId("iface-meter")).toBeTruthy();
    expect(screen.queryByTestId("iface-table")).toBeFalsy();
  });

  it("can render as a table", () => {
    render(<VfResources interfaces={[]} showAggregated={false} />);

    expect(screen.getByTestId("iface-table")).toBeTruthy();
    expect(screen.queryByTestId("iface-meter")).toBeFalsy();
  });

  it("shows whether an interface has virtual functions or not", () => {
    render(
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
    expect(screen.getByTestId("interface-name-aaa").textContent).toBe("aaa:");
    expect(screen.getByTestId("interface-name-bbb").textContent).toBe("bbb:");
    expect(screen.getByTestId("interface-name-ccc").textContent).toBe("ccc:");
  });
});
