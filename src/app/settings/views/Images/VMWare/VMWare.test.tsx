import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Labels as VMWareFormLabels } from "../VMWareForm/VMWareForm";

import VMWare, { Labels as VMWareLabels } from "./VMWare";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, render } from "@/testing/utils";

const mockStore = configureStore();

describe("VMWare", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({ name: ConfigNames.VCENTER_SERVER, value: "" }),
          factory.config({ name: ConfigNames.VCENTER_USERNAME, value: "" }),
          factory.config({ name: ConfigNames.VCENTER_PASSWORD, value: "" }),
          factory.config({ name: ConfigNames.VCENTER_DATACENTER, value: "" }),
        ],
      }),
    });
  });

  it("displays a spinner if config is loading", () => {
    state.config.loading = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWare />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(VMWareLabels.Loading)).toBeInTheDocument();
  });

  it("displays the VMWare form if config is loaded", () => {
    state.config.loaded = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWare />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("form", { name: VMWareFormLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it("dispatches action to fetch config if not already loaded", () => {
    state.config.loaded = false;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWare />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter((action) => action.type.endsWith("fetch"));

    expect(fetchActions).toEqual([
      {
        type: "config/fetch",
        meta: {
          model: "config",
          method: "list",
        },
        payload: null,
      },
    ]);
  });
});
