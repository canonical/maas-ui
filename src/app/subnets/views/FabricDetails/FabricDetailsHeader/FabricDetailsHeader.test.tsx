import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricDetailsHeader from "./FabricDetailsHeader";

import type { Fabric } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();
let state: RootState;
let fabric: Fabric;
beforeEach(() => {
  fabric = fabricFactory({ id: 1, name: "fabric1" });
  state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [fabric],
    }),
  });
});

it("shows the delete button when the user is an admin", () => {
  state.user = userStateFactory({
    auth: authStateFactory({
      user: userFactory({ is_superuser: true }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/fabric/1" }]}>
        <FabricDetailsHeader fabric={fabric} />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("button", { name: "Delete fabric" })
  ).toBeInTheDocument();
});

it("does not show the delete button if the user is not an admin", () => {
  state.user = userStateFactory({
    auth: authStateFactory({
      user: userFactory({ is_superuser: false }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/fabric/1" }]}>
        <FabricDetailsHeader fabric={fabric} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByRole("button", { name: "Delete fabric" })).toBeNull();
});
