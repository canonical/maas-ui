import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CommissionForm from "../CommissionForm";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
  scriptState as scriptStateFactory,
  script as scriptFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore();

describe("CommissionForm", () => {
  let state: ReturnType<typeof rootStateFactory>;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      }),
      script: scriptStateFactory({
        loaded: true,
        items: [
          scriptFactory({
            name: "smartctl-validate",
            tags: ["commissioning", "storage"],
            parameters: {
              storage: {
                argument_format: "{path}",
                type: "storage",
              },
            },
            script_type: "testing",
          }),
          scriptFactory({
            name: "internet-connectivity",
            tags: ["internet", "network-validation", "network"],
            parameters: {
              url: {
                default: "https://connectivity-check.ubuntu.com",
                description:
                  "A comma seperated list of URLs, IPs, or domains to test if the specified interface has access to. Any protocol supported by curl is support. If no protocol or icmp is given the URL will be pinged.",
                required: true,
              },
            },
            script_type: "testing",
          }),
        ],
      }),
    });
  });

  it("displays a field for URL if a selected script has url parameter", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CommissionForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines/add", store }
    );
    expect(screen.queryByTestId("url-script-input")).not.toBeInTheDocument();
    await act(async () => {
      userEvent.click(
        screen.getByLabelText("Select testing script(s)", { exact: false })
      );
    });
    await act(async () => {
      userEvent.click(
        screen.getByText(/internet-connectivity/i, { exact: false })
      );
    });
    expect(screen.getByTestId("url-script-input")).toBeInTheDocument();
  });
});
