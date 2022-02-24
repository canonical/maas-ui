import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricSummary from "./FabricSummary";

import {
  rootState as rootStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  vlanState as vlanStateFactory,
  vlan as vlanFactory,
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  modelRef as modelRefFactory,
} from "testing/factories";

const mockStore = configureStore();

it("renders correct details", () => {
  const controller = controllerFactory({
    hostname: "bolla",
    system_id: "1234",
    domain: modelRefFactory({ name: "maas" }),
  });
  const state = rootStateFactory({
    vlan: vlanStateFactory({
      loaded: true,
      items: [vlanFactory({ fabric: 2, rack_sids: ["system-id"] })],
    }),
    controller: controllerStateFactory({
      loaded: true,
      items: [controller],
    }),
  });
  const store = mockStore(state);
  const fabric = fabricFactory({ id: 1 });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <FabricSummary fabric={fabric} />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("heading", { name: "Fabric summary" })
  ).toBeInTheDocument();
  expect(screen.getByText("test-fabric")).toBeInTheDocument();
});

it("can open and close the Edit fabric summary form", async () => {
  const fabric = fabricFactory({
    name: "fabric-1",
    description: "fabric-1 description",
  });
  const state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [fabric],
      loading: false,
    }),
  });
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <FabricSummary fabric={fabric} />
    </Provider>
  );
  const fabricSummary = screen.getByRole("region", { name: "Fabric summary" });
  userEvent.click(within(fabricSummary).getByRole("button", { name: "Edit" }));
  await screen.findByRole("form", { name: "Edit fabric summary" });

  userEvent.click(
    within(fabricSummary).getByRole("button", { name: "Cancel" })
  );
  await waitFor(() =>
    expect(
      screen.queryByRole("form", { name: "Edit fabric summary" })
    ).not.toBeInTheDocument()
  );
});
