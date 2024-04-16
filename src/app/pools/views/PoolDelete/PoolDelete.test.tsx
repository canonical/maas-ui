import configureStore from "redux-mock-store";

import PoolDelete from "./PoolDelete";

import { resourcePoolActions } from "@/app/store/resourcepool";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();
let state: RootState;
beforeEach(() => {
  state = factory.rootState({
    resourcepool: factory.resourcePoolState({
      loaded: true,
      items: [
        factory.resourcePool({ id: 1 }),
        factory.resourcePool({ name: "default", is_default: true }),
        factory.resourcePool({ name: "backup", is_default: false }),
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
  expect(action).toEqual(resourcePoolActions.delete(1));
});
