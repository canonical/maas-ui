import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricSummary from "./FabricSummary";

import {
  rootState as rootStateFactory,
  fabric as fabricFactory,
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
  waitFor(() =>
    expect(screen.getByRole("href", { name: "bolla.maas" })).toBeInTheDocument()
  );
});
