import configureStore from "redux-mock-store";

import { StatusColumn } from "./StatusColumn";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  NodeActions,
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  generalState as generalStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  userEvent,
  screen,
  within,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("StatusColumn", () => {
  let state: RootState;
  let machine: Machine;

  beforeEach(() => {
    machine = machineFactory({
      actions: [],
      distro_series: "bionic",
      osystem: "ubuntu",
      status: NodeStatus.NEW,
      status_code: 0,
      status_message: "",
      system_id: "abc123",
    });
    state = rootStateFactory({
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          data: osInfoFactory({
            osystems: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
            releases: [
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
              ["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
            ],
          }),
          errors: {},
          loaded: true,
          loading: false,
        }),
      }),
      machine: machineStateFactory({
        items: [machine],
        errors: {},
        loaded: true,
        loading: false,
      }),
    });
  });

  describe("status text", () => {
    it("displays the machine's status if not deploying or deployed", () => {
      machine.status = NodeStatus.NEW;
      machine.status_code = NodeStatusCode.NEW;
      const store = mockStore(state);
      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { route: "/machines", store }
      );

      expect(screen.getByTestId("status-text")).toHaveTextContent("New");
    });

    it("displays the short-form of Ubuntu release if deployed", () => {
      machine.status = NodeStatus.DEPLOYED;
      machine.status_code = NodeStatusCode.DEPLOYED;
      machine.osystem = "ubuntu";
      machine.distro_series = "bionic";
      const store = mockStore(state);

      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { route: "/machines", store }
      );

      expect(screen.getByTestId("status-text")).toHaveTextContent(
        "Ubuntu 18.04 LTS"
      );
    });

    it("displays the full OS and release if non-Ubuntu deployed", () => {
      machine.status = NodeStatus.DEPLOYED;
      machine.status_code = NodeStatusCode.DEPLOYED;
      machine.osystem = "centos";
      machine.distro_series = "centos70";
      const store = mockStore(state);

      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { route: "/machines", store }
      );
      expect(screen.getByTestId("status-text")).toHaveTextContent("CentOS 7");
    });

    it("displays 'Deploying OS release' if machine is deploying", () => {
      machine.status = NodeStatus.DEPLOYING;
      machine.status_code = NodeStatusCode.DEPLOYING;
      machine.osystem = "ubuntu";
      machine.distro_series = "bionic";
      const store = mockStore(state);

      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { route: "/machines", store }
      );
      expect(screen.getByTestId("status-text")).toHaveTextContent(
        "Deploying Ubuntu 18.04 LTS"
      );
    });

    it("displays an error message for broken machines", () => {
      machine.error_description = "machine is on fire";
      machine.status = NodeStatus.BROKEN;
      machine.status_code = NodeStatusCode.BROKEN;
      const store = mockStore(state);

      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { route: "/machines", store }
      );

      expect(screen.getByTestId("error-text")).toHaveTextContent(
        "machine is on fire"
      );
    });
  });

  describe("progress text", () => {
    it("displays the machine's status_message if in a transient state", () => {
      machine.status = NodeStatus.TESTING;
      machine.status_code = NodeStatusCode.TESTING;
      machine.status_message = "2 of 6 tests complete";
      const store = mockStore(state);
      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { route: "/machines", store }
      );

      expect(screen.getByTestId("progress-text")).toHaveTextContent(
        "2 of 6 tests complete"
      );
    });

    it(`does not display the machine's status_message if
      not in a transient state`, () => {
      machine.status = NodeStatus.ALLOCATED;
      machine.status_code = NodeStatusCode.ALLOCATED;
      machine.status_message = "This machine is allocated";
      const store = mockStore(state);
      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { route: "/machines", store }
      );
      expect(screen.getByTestId("progress-text")).toHaveTextContent("");
    });
  });

  describe("status icon", () => {
    it("shows a spinner if machine is in a transient state", () => {
      machine.status = NodeStatus.COMMISSIONING;
      machine.status_code = NodeStatusCode.COMMISSIONING;
      const store = mockStore(state);
      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { route: "/machines", store }
      );
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it(`shows a warning and tooltip if machine has failed tests and is not in a
      state where the warning should be hidden`, () => {
      machine.status = NodeStatus.ALLOCATED;
      machine.status_code = NodeStatusCode.ALLOCATED;
      machine.testing_status.status = TestStatusStatus.FAILED;
      const store = mockStore(state);
      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { route: "/machines", store }
      );
      expect(screen.getByLabelText(/warning/i)).toBeInTheDocument();
    });

    it("can show a menu with all possible options", async () => {
      machine.actions = [
        NodeActions.ABORT,
        NodeActions.ACQUIRE,
        NodeActions.COMMISSION,
        NodeActions.DEPLOY,
        NodeActions.EXIT_RESCUE_MODE,
        NodeActions.LOCK,
        NodeActions.MARK_BROKEN,
        NodeActions.MARK_FIXED,
        NodeActions.OVERRIDE_FAILED_TESTING,
        NodeActions.RELEASE,
        NodeActions.RESCUE_MODE,
        NodeActions.TEST,
        NodeActions.UNLOCK,
      ];
      renderWithBrowserRouter(
        <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />,
        { state, route: "/machines" }
      );
      await userEvent.click(
        screen.getByRole("button", { name: /take action/i })
      );
      expect(
        within(screen.getByLabelText("submenu")).getAllByRole("button")
      ).toHaveLength(machine.actions.length);
      machine.actions.forEach((action) => {
        expect(
          within(screen.getByLabelText("submenu")).getByRole("button", {
            name: action,
          })
        ).toBeInTheDocument();
      });
    });

    it("does not render table menu if onToggleMenu not provided", () => {
      renderWithBrowserRouter(<StatusColumn systemId="abc123" />, {
        state,
        route: "/machines",
      });
      expect(
        screen.queryByRole("button", { name: /take action/i })
      ).not.toBeInTheDocument();
    });
  });
});
