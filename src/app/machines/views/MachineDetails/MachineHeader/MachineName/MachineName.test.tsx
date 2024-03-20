import configureStore from "redux-mock-store";

import MachineName from "./MachineName";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("MachineName", () => {
  let state: RootState;
  const domain = factory.domain({ id: 99 });
  beforeEach(() => {
    state = factory.rootState({
      domain: factory.domainState({
        items: [domain],
      }),
      general: factory.generalState({
        powerTypes: factory.powerTypesState({
          data: [factory.powerType()],
        }),
      }),
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machineDetails({
            domain,
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("can update a machine with the new name and domain", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineName editingName={true} id="abc123" setEditingName={vi.fn()} />,
      { route: "/machine/abc123", store }
    );

    await userEvent.clear(screen.getByRole("textbox", { name: "Hostname" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Hostname" }),
      "new-lease"
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      store.getActions().find((action) => action.type === "machine/update")
    ).toStrictEqual({
      type: "machine/update",
      payload: {
        params: {
          domain: domain,
          extra_macs: [],
          hostname: "new-lease",
          pxe_mac: "de:ad:be:ef:aa:b1",
          system_id: "abc123",
        },
      },
      meta: {
        model: "machine",
        method: "update",
      },
    });
  });
});
