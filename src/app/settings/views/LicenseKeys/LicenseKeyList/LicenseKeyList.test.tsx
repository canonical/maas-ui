import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LicenseKeyList from ".";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { render, renderWithBrowserRouter, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("LicenseKeyList", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = factory.rootState({
      general: factory.generalState({
        osInfo: factory.osInfoState({
          loaded: true,
          data: factory.osInfo({
            osystems: [
              ["ubuntu", "Ubuntu"],
              ["windows", "Windows"],
            ],
            releases: [
              ["ubuntu/bionic", "Ubuntu 18.04 LTS 'Bionic Beaver'"],
              ["windows/win2012*", "Windows Server 2012"],
            ],
          }),
        }),
      }),
      licensekeys: factory.licenseKeysState({
        loaded: true,
        items: [factory.licenseKeys()],
      }),
    });
  });

  it("dispatches action to fetch license keys on load", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <LicenseKeyList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some((action) => action.type === "licensekeys/fetch")
    ).toBe(true);
  });

  it("displays a message when there are no licennse keys", () => {
    const state = { ...initialState };
    state.licensekeys.items = [];

    renderWithBrowserRouter(<LicenseKeyList />, { state, route: "/" });
    expect(screen.getByText("No license keys available.")).toBeInTheDocument();
  });
});
