import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NodeNetworkTab, { ExpandedState } from "./NodeNetworkTab";

import { renderWithProviders } from "@/testing/utils";

describe("NodeNetworkTab", () => {
  it("displays the actions and interface table", () => {
    renderWithProviders(
      <NodeNetworkTab
        actions={() => <div data-testid="actions"></div>}
        addInterface={() => <div data-testid="add-interface"></div>}
        expandedForm={() => <div data-testid="expanded-form"></div>}
        interfaceTable={() => <div data-testid="interface-table"></div>}
      />
    );
    expect(screen.getByTestId("interface-table")).toBeInTheDocument();
    expect(screen.getByTestId("actions")).toBeInTheDocument();
    expect(screen.queryByTestId("expanded-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("add-interface")).not.toBeInTheDocument();
  });

  it("displays the add interface form when expanded", async () => {
    renderWithProviders(
      <NodeNetworkTab
        actions={(_, setExpanded) => (
          <button
            data-testid="add-button"
            onClick={() => {
              setExpanded({ content: ExpandedState.ADD_PHYSICAL });
            }}
          ></button>
        )}
        addInterface={() => <div data-testid="add-interface"></div>}
        expandedForm={vi.fn()}
        interfaceTable={vi.fn()}
      />
    );
    expect(screen.queryByTestId("add-interface")).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("add-interface")).toBeInTheDocument();
  });

  it("displays a form when expanded", async () => {
    renderWithProviders(
      <NodeNetworkTab
        actions={(_, setExpanded) => (
          <button
            data-testid="edit-button"
            onClick={() => {
              setExpanded({ content: ExpandedState.EDIT });
            }}
          ></button>
        )}
        addInterface={vi.fn()}
        expandedForm={(expanded) =>
          expanded?.content === ExpandedState.EDIT ? (
            <div data-testid="edit-interface"></div>
          ) : null
        }
        interfaceTable={vi.fn()}
      />
    );
    expect(screen.queryByTestId("edit-interface")).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId("edit-button"));
    expect(screen.getByTestId("edit-interface")).toBeInTheDocument();
  });
});
