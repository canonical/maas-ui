import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import VLANControllers from "./VLANControllers";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import type { VLAN } from "app/store/vlan/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  modelRef as modelRefFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

let state: RootState;
let vlan: VLAN;

beforeEach(() => {
  const primaryController = controllerFactory({
    domain: modelRefFactory({ name: "domain" }),
    hostname: "controller-abc",
    system_id: "abc123",
  });
  const secondaryController = controllerFactory({
    domain: modelRefFactory({ name: "domain" }),
    hostname: "controller-def",
    system_id: "def456",
  });
  vlan = vlanFactory({
    primary_rack: primaryController.system_id,
    secondary_rack: secondaryController.system_id,
  });
  state = rootStateFactory({
    controller: controllerStateFactory({
      items: [primaryController, secondaryController],
    }),
    vlan: vlanStateFactory({
      items: [vlan],
    }),
  });
});

it("displays a spinner when loading controllers", () => {
  state.controller.loading = true;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <VLANControllers id={vlan.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});

it("renders correct details", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <VLANControllers id={vlan.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByRole("link", { name: /controller-abc/i })).toHaveAttribute(
    "href",
    urls.controllers.controller.index({ id: "abc123" })
  );
  expect(screen.getByRole("link", { name: /controller-def/i })).toHaveAttribute(
    "href",
    urls.controllers.controller.index({ id: "def456" })
  );
});
