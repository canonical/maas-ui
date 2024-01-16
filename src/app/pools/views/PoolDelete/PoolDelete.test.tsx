import configureStore from "redux-mock-store";

import PoolDelete from "./PoolDelete";

import { actions } from "@/app/store/resourcepool";
import type { RootState } from "@/app/store/root/types";
import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();
let state: RootState;
beforeEach(() => {
  state = rootStateFactory({
    resourcepool: resourcePoolStateFactory({
      loaded: true,
      items: [
        resourcePoolFactory({ id: 1 }),
        resourcePoolFactory({ name: "default", is_default: true }),
        resourcePoolFactory({ name: "backup", is_default: false }),
      ],
    }),
  });
});

it("can delete a resource pool", async () => {
  const store = mockStore(state);

  renderWithBrowserRouter(<PoolDelete />, {
    store,
    route: "/pools/1/delete",
    routePattern: "/pools/:id/delete",
  });

  expect(
    screen.getByRole("form", { name: /Confirm pool deletion/i })
  ).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  const action = store
    .getActions()
    .find((action) => action.type === "resourcepool/delete");
  expect(action).toEqual(actions.delete(1));
});
