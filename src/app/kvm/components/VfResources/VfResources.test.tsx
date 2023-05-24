import VfResources from "./VfResources";

import { podNetworkInterface as interfaceFactory } from "testing/factories";
import { render, screen, within } from "testing/utils";

describe("VfResources", () => {
  it("can be made to have a dynamic layout", () => {
    render(<VfResources dynamicLayout interfaces={[]} />);

    expect(screen.getByLabelText("VF resources")).toHaveClass(
      "vf-resources--dynamic-layout"
    );
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

    const rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByTestId("has-vfs")).toBeInTheDocument();
    expect(within(rows[1]).queryByTestId("has-no-vfs")).not.toBeInTheDocument();
    expect(within(rows[2]).queryByTestId("has-vfs")).not.toBeInTheDocument();
    expect(within(rows[2]).getByTestId("has-no-vfs")).toBeInTheDocument();
  });

  it("can render as an aggregated meter", () => {
    render(<VfResources interfaces={[]} showAggregated />);

    expect(screen.getByTestId("iface-meter")).toBeInTheDocument();
    expect(screen.queryByTestId("iface-table")).not.toBeInTheDocument();
  });

  it("can render as a table", () => {
    render(<VfResources interfaces={[]} showAggregated={false} />);

    expect(screen.getByTestId("iface-table")).toBeInTheDocument();
    expect(screen.queryByTestId("iface-meter")).not.toBeInTheDocument();
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

    const rows = screen.getAllByRole("row");

    expect(within(rows[1]).getByTestId("interface-name")).toHaveTextContent(
      "aaa:"
    );
    expect(within(rows[2]).getByTestId("interface-name")).toHaveTextContent(
      "bbb:"
    );
    expect(within(rows[3]).getByTestId("interface-name")).toHaveTextContent(
      "ccc:"
    );
  });
});
