import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import configureStore from "redux-mock-store";

import DHCPSnippets from "./DHCPSnippets";

import type { Props as DHCPTableProps } from "@/app/base/components/DHCPTable/DHCPTable";
import urls from "@/app/base/urls";
import { subnetActions } from "@/app/store/subnet";
import * as factory from "@/testing/factories";
import { render } from "@/testing/utils";

const mockStore = configureStore();
const mockDHCPTable = vi.fn();
vi.mock("@/app/base/components/DHCPTable", () => ({
  default: (props: DHCPTableProps) => mockDHCPTable(props),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

it("dispatches an action to fetch the subnets on mount", () => {
  const state = factory.rootState();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <DHCPSnippets modelName="subnet" subnetIds={[1, 2]} />
      </MemoryRouter>
    </Provider>
  );

  const expectedActions = [subnetActions.fetch()];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("selects the correct subnets to display in the table", () => {
  const subnets = [factory.subnet(), factory.subnet(), factory.subnet()];
  const state = factory.rootState({
    subnet: factory.subnetState({
      items: subnets,
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <Routes>
          <Route
            element={
              <DHCPSnippets
                modelName="subnet"
                subnetIds={[subnets[0].id, subnets[2].id]}
              />
            }
            path={urls.subnets.subnet.index(null)}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  expect(mockDHCPTable).toHaveBeenCalledWith(
    expect.objectContaining({
      subnets: [subnets[0], subnets[2]],
      modelName: "subnet",
    })
  );
});
