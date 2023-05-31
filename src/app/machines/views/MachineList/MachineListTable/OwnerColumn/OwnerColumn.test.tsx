import { OwnerColumn } from "./OwnerColumn";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineAction as machineActionFactory,
  machineActionsState as machineActionsStateFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
  tag as tagFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("OwnerColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        machineActions: machineActionsStateFactory({
          data: [
            machineActionFactory({
              name: NodeActions.ACQUIRE,
              title: "Allocate...",
            }),
            machineActionFactory({
              name: NodeActions.RELEASE,
              title: "Release...",
            }),
          ],
        }),
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            actions: [],
            system_id: "abc123",
            owner: "admin",
            tags: [],
          }),
        ],
      }),
      user: userStateFactory({
        items: [userFactory()],
      }),
    });
  });

  it("displays owner", () => {
    state.machine.items[0].owner = "user1";
    renderWithBrowserRouter(
      <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { state, route: "/machines" }
    );

    expect(screen.getByTestId("owner")).toHaveTextContent("user1");
  });

  it("displays owner's full name", () => {
    state.machine.items[0].owner = "user1";
    state.user.items = [
      userFactory({ username: "user1", last_name: "User Full Name" }),
    ];
    renderWithBrowserRouter(
      <OwnerColumn onToggleMenu={jest.fn()} showFullName systemId="abc123" />,
      { state, route: "/machines" }
    );

    expect(screen.getByTestId("owner")).toHaveTextContent("User Full Name");
  });

  it("displays tags", () => {
    state.machine.items[0].tags = [1, 2];
    state.tag.items = [
      tagFactory({ id: 1, name: "minty" }),
      tagFactory({ id: 2, name: "aloof" }),
    ];
    renderWithBrowserRouter(
      <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { state, route: "/machines" }
    );

    expect(screen.getByTestId("tags")).toHaveTextContent("aloof, minty");
  });

  it("can show a menu item to allocate a machine", async () => {
    state.machine.items[0].actions = [NodeActions.ACQUIRE];
    renderWithBrowserRouter(
      <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { state, route: "/machines" }
    );
    // Open the menu so the elements get rendered.
    await userEvent.click(screen.getByRole("button", { name: "Take action:" }));

    expect(
      screen.getByRole("button", { name: "Allocate..." })
    ).toBeInTheDocument();
  });

  it("can show a menu item to release a machine", async () => {
    state.machine.items[0].actions = [NodeActions.RELEASE];
    renderWithBrowserRouter(
      <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { state, route: "/machines" }
    );
    // Open the menu so the elements get rendered.
    await userEvent.click(screen.getByRole("button", { name: "Take action:" }));

    expect(
      screen.getByRole("button", { name: "Release..." })
    ).toBeInTheDocument();
  });

  it("can show a message when there are no menu items", async () => {
    renderWithBrowserRouter(
      <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { state, route: "/machines" }
    );
    // Open the menu so the elements get rendered.
    await userEvent.click(screen.getByRole("button", { name: "Take action:" }));

    expect(screen.getByText("No owner actions available")).toBeInTheDocument();
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    renderWithBrowserRouter(<OwnerColumn systemId="abc123" />, {
      state,
      route: "/machines",
    });
    expect(
      screen.queryByRole("button", { name: "Take action:" })
    ).not.toBeInTheDocument();
  });
});
