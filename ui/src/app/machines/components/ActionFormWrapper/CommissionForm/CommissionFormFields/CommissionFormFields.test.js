import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CommissionForm from "../CommissionForm";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  scriptState as scriptStateFactory,
  script as scriptFactory,
} from "testing/factories";
import { ScriptType } from "app/store/script/types";

const mockStore = configureStore();

describe("CommissionForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: {},
          def456: {},
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
            script_type: ScriptType.TESTING,
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
            script_type: ScriptType.TESTING,
          }),
        ],
      }),
    });
  });

  it("displays a field for URL if a selected script has url parameter", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CommissionForm
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='url-script-input']").exists()).toBe(false);
    await act(async () => {
      wrapper
        .find(
          "[data-test='testing-scripts-selector'] Input .tag-selector__input"
        )
        .simulate("focus");
    });
    wrapper.update();
    await act(async () => {
      wrapper.find('[data-test="existing-tag"]').at(0).simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-test='url-script-input']").exists()).toBe(true);
  });
});
