import configureStore from "redux-mock-store";

import DeviceName from "./DeviceName";

import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceName", () => {
  let state: RootState;
  const domain = domainFactory({ id: 99 });
  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [domain],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      device: deviceStateFactory({
        loaded: true,
        items: [
          deviceDetailsFactory({
            domain,
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("can update a device with the new name and domain", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceName editingName={true} id="abc123" setEditingName={jest.fn()} />,
      { route: "/device/abc123", store }
    );

    await userEvent.clear(screen.getByRole("textbox", { name: "Hostname" }));

    await userEvent.type(
      screen.getByRole("textbox", { name: "Hostname" }),
      "new-lease"
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Domain" }),
      "99"
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      store.getActions().find((action) => action.type === "device/update")
    ).toStrictEqual({
      type: "device/update",
      payload: {
        params: {
          domain: domain,
          hostname: "new-lease",
          system_id: "abc123",
        },
      },
      meta: {
        model: "device",
        method: "update",
      },
    });
  });
});
