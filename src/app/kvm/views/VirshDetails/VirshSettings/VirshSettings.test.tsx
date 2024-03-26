import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VirshSettings from "./VirshSettings";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("VirshSettings", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        items: [factory.podDetails({ id: 1, name: "pod1" })],
        loaded: true,
      }),
      resourcepool: factory.resourcePoolState({
        loaded: true,
      }),
      tag: factory.tagState({
        loaded: true,
      }),
      zone: factory.zoneState({}),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    render(
      <MemoryRouter>
        <Provider store={store}>
          <VirshSettings id={1} />
        </Provider>
      </MemoryRouter>
    );
    const expectedActionTypes = [
      "resourcepool/fetch",
      "tag/fetch",
      "zone/fetch",
    ];
    const actualActions = store.getActions();
    expectedActionTypes.forEach((expectedActionType) => {
      expect(
        actualActions.some(
          (actualAction) => actualAction.type === expectedActionType
        )
      );
    });
  });

  it("displays a spinner if data has not loaded", () => {
    state.resourcepool.loaded = false;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <VirshSettings id={1} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });
});
